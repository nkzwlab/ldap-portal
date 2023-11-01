import ldap, {
  createClient,
  Change,
  type Change as ChangeOptions,
  Client as LdapClient,
  SearchEntry,
  SearchEntryObject,
} from "ldapjs";

import { env } from "./env";
import { exec } from "child_process";
import { SSHA } from "./crypto";
import { NonNullableRecord, OptionalPropertiesOf } from "./types";
import { toUidNumber } from "./ldap/utils";
import { emailFromLoginName } from "./email";

const {
  ldapOption,
  domain,
  adminCN,
  defaultEmailDomain,
  password: adminPassword,
} = env;

const ATTRIBUTE_PUBKEY = "sshPublicKey";
const ATTRIBUTE_SHELL = "loginShell";
const ATTRIBUTE_PASSWORD = "userPassword";
const DEFAULT_OBJECT_CLASSES = [
  "ldapPublicKey",
  "posixAccount",
  "inetOrgPerson",
  "organizationalPerson",
  "person",
];

const SEARCH_BASE_DN = `ou=People,${domain}`;

const OPERATION_REPLACE = "replace";
const OPERATION_ADD = "add";
const OPERATION_DELETE = "delete";

export async function auth(userID: string, password: string) {
  const ldapClient = createClient(ldapOption);
  try {
    await bindAsUser(ldapClient, userID, password);
  } catch (err) {
    return false;
  }
  await unbind(ldapClient);
  return true;
}

export async function getShell(userID: string) {
  const client = createClient(ldapOption);
  const base = userDN(userID);

  try {
    await bindAsAdmin(client);
    return await getAttribute(client, base, ATTRIBUTE_SHELL);
  } catch (err) {
    throw err;
  } finally {
    await unbind(client);
  }
}

export async function setShell(
  userID: string,
  shell: string
): Promise<boolean> {
  const client = createClient(ldapOption);
  const base = userDN(userID);
  try {
    await bindAsAdmin(client);
    await replaceAttribute(client, base, ATTRIBUTE_SHELL, shell);

    return true;
  } catch (err) {
    throw err;
  } finally {
    await unbind(client);
  }
}

export async function getPubkey(userID: string) {
  const client = createClient(ldapOption);
  const base = userDN(userID);
  try {
    await bindAsAdmin(client);
    return await getAttribute(client, base, ATTRIBUTE_PUBKEY);
  } catch (err) {
    throw err;
  } finally {
    await unbind(client);
  }
}

export async function addPubkey(
  userID: string,
  pubkey: string
): Promise<boolean> {
  const client = createClient(ldapOption);
  const base = userDN(userID);

  try {
    await bindAsAdmin(client);
    await addAttribute(client, base, ATTRIBUTE_PUBKEY, pubkey);

    return true;
  } catch (err) {
    throw err;
  } finally {
    await unbind(client);
  }
}

export async function delPubkey(
  userID: string,
  pubkey: string
): Promise<boolean> {
  const client = createClient(ldapOption);
  const base = userDN(userID);

  try {
    await bindAsAdmin(client);
    await deleteAttribute(client, base, ATTRIBUTE_PUBKEY, pubkey);

    return true;
  } catch (err) {
    throw err;
  } finally {
    await unbind(client);
  }
}

export async function changePassword(
  userID: string,
  oldPassword: string,
  newPassword: string
) {
  const client = createClient(ldapOption);
  const base = userDN(userID);

  try {
    await bindAsUser(client, userID, oldPassword);
  } catch (_) {
    const err = new Error("invalid old password");
    (err as any).status = 401;
    throw err;
  } finally {
    await unbind(client);
  }

  try {
    await bindAsAdmin(client);
    const { passwd } = await SSHA.withRandomSalt(newPassword);
    await replaceAttribute(client, base, ATTRIBUTE_PASSWORD, passwd);

    return true;
  } catch (err) {
    throw err;
  } finally {
    unbind(client);
  }
}

export const fetchGreatestUidNumber = async (
  client: LdapClient
): Promise<number> => {
  const entries = await searchEntries(client, SEARCH_BASE_DN, "uid=*");

  const largestUid = entries
    .map((entry) => toUidNumber(entry))
    .filter((uidNumber) => !Number.isNaN(uidNumber))
    .sort()
    .pop();

  if (typeof largestUid === "undefined") {
    console.warn(
      "fetchGreatestUidNumber: No uid number found on the server. Returninng default value."
    );
    return env.uidNumberStart;
  }

  return largestUid;
};

/**
 * Parameters to add an user to the server.
 * Required parameters are needed to identify the user (e.g., `loginName`).
 * Optional parameters either have default values (e.g., `uidNumber`) or can be omitted (e.g., `surName`, `givenName`).
 *
 * @export
 * @interface AddUserParams
 */
export type AddUserParams = {
  uidNumber?: number;
  loginName: string;
  passwd: string;
  surName?: string;
  givenName?: string;
  email?: string;
  objectClass?: string[];
  extraParams?: object;
};

type DefaultUserParamsType = NonNullableRecord<
  OptionalPropertiesOf<AddUserParams>
>;

export const setDefaultUserParams = async (
  client: LdapClient,
  params: AddUserParams
): Promise<AddUserParams> => {
  const uidNumber = (await fetchGreatestUidNumber(client)) + 1;
  const surName = params.loginName;
  const givenName = params.loginName;
  const email = emailFromLoginName(params.loginName);
  const objectClass = DEFAULT_OBJECT_CLASSES;
  const extraParams = {};

  return {
    uidNumber,
    surName,
    givenName,
    email,
    objectClass,
    extraParams,
    ...params,
  };
};

export async function addUser(params: AddUserParams): Promise<boolean> {
  const client = createClient(ldapOption);
  try {
    await bindAsAdmin(client);

    params = await setDefaultUserParams(client, params);
    const dn = userDN(params.loginName);
    const entry = {
      uidNumber: params.uidNumber,
      uid: params.loginName,
      cn: params.loginName,
      sn: params.surName,
      givenName: params.givenName,
      objectClass: params.objectClass,
      ou: "People",
      mail: params.email,
      [ATTRIBUTE_PASSWORD]: params.passwd,
    };

    return await addEntry(client, dn, entry);
  } catch (err) {
    throw err;
  } finally {
    await unbind(client);
  }
}

const userDN = (userID: string): string => {
  return `uid=${userID},ou=People,${domain}`;
};

function bindAsAdmin(ldapClient: LdapClient): Promise<boolean> {
  return new Promise((resolve, reject) => {
    ldapClient.bind(`cn=${adminCN},${domain}`, adminPassword, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function bindAsUser(
  ldapClient: LdapClient,
  userID: string,
  password: string
): Promise<boolean> {
  const dn = userDN(userID);
  return new Promise((resolve, reject) => {
    ldapClient.bind(dn, password, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function unbind(ldapClient: LdapClient): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // ldapClient.unbind((err)=>{
    //   if (err) {
    //     reject(err);
    //   } else {
    //     resolve();
    //   }
    // });
    resolve(true);
  });
}

async function addEntry(
  client: LdapClient,
  dn: string,
  entry: any
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    client.add(dn, entry, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

async function searchEntries(
  client: LdapClient,
  base: string,
  filter: string
): Promise<SearchEntryObject[]> {
  const options = {
    filter,
  };
  return new Promise((resolve, reject) => {
    client.search(base, options, (err, res) => {
      if (err) {
        reject(err);
        return;
      }

      let entries: SearchEntryObject[] = [];

      res.on("searchEntry", (entry) => {
        entries.push(entry.pojo);
      });

      res.on("error", (err) => {
        console.error(
          `searchEntries: An error occured while searching: ${err}`
        );
        reject(err);
      });

      res.on("end", () => {
        resolve(entries);
      });
    });
  });
}

// Promisify the get ldap attribtue
async function getAttribute(
  client: LdapClient,
  base: string,
  attributeName: string
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    client.search(base, { attributes: attributeName }, (err, res) => {
      if (err) {
        reject(err);
        return;
      }

      let values: string[] = [];

      res.on("searchEntry", (entry) => {
        for (const { vals } of entry.attributes) {
          // vals is type of `string | string[]`
          if (typeof vals === "string") {
            values.push(vals);
          } else if (typeof vals === "object" && Array.isArray(vals)) {
            values.push(...vals);
          } else {
            console.warn("getAttributes: ignoring invalid value:", vals);
          }
        }
      });

      res.on("error", (err) => {
        reject(err);
      });

      res.on("end", () => {
        resolve(values);
      });
    });
  });
}

// Promisify modifying ldap
export async function modifyAttribute(
  client: LdapClient,
  base: string,
  options: ChangeOptions
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const change = new Change(options);
    client.modify(base, change, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

export async function replaceAttribute(
  client: LdapClient,
  base: string,
  attributeName: string,
  value: string
) {
  const attribute = new ldap.Attribute({ type: attributeName, vals: value });
  const options = {
    operation: OPERATION_REPLACE,
    modification: attribute,
  };

  return modifyAttribute(client, base, options);
}

export async function addAttribute(
  client: LdapClient,
  base: string,
  attributeName: string,
  value: string
) {
  const attribute = new ldap.Attribute({ type: attributeName, vals: value });
  const options = {
    operation: OPERATION_ADD,
    modification: attribute,
  };

  return modifyAttribute(client, base, options);
}

export async function deleteAttribute(
  client: LdapClient,
  base: string,
  attributeName: string,
  value: string
) {
  const attribute = new ldap.Attribute({ type: attributeName, vals: value });
  const options = {
    operation: OPERATION_DELETE,
    modification: attribute,
  };

  return modifyAttribute(client, base, options);
}
