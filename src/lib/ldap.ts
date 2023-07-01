import ldap, {
  createClient,
  Change,
  type Change as ChangeOptions,
  Client as LdapClient,
} from "ldapjs";

import { env } from "./env";
import { exec } from "child_process";
import { SSHA } from "./crypto";

const { ldapOption, domain, adminCN, password: adminPassword } = env;

const ATTRIBUTE_PUBKEY = "sshPublicKey";
const ATTRIBUTE_SHELL = "loginShell";
const ATTRIBUTE_PASSWORD = "unicodePwd";

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
  const base = `uid=${userID},ou=People,${domain}`;

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
  const base = `uid=${userID},ou=People,${domain}`;
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
  const base = `uid=${userID},ou=People,${domain}`;
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
  const base = `uid=${userID},ou=People,${domain}`;

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
  const base = `uid=${userID},ou=People,${domain}`;

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

async function changePassword(
  client: LdapClient,
  userID: string,
  oldPassword: string,
  newPassword: string
) {
  const base = `uid=${userID},ou=People,${domain}`;

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
    const passwd = SSHA.withRandomSalt(newPassword);
    await replaceAttribute(client, base, ATTRIBUTE_PASSWORD, passwd);

    return true;
  } catch (err) {
    throw err;
  } finally {
    unbind(client);
  }
}

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
  return new Promise((resolve, reject) => {
    ldapClient.bind(`uid=${userID},ou=People,${domain}`, password, (err) => {
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
          } else {
            values.concat(vals);
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
  const options = {
    operation: OPERATION_REPLACE,
    modification: {
      [attributeName]: value,
    },
  };

  return modifyAttribute(client, base, options);
}

export async function addAttribute(
  client: LdapClient,
  base: string,
  attributeName: string,
  value: string
) {
  const options = {
    operation: OPERATION_ADD,
    modification: {
      [attributeName]: value,
    },
  };

  return modifyAttribute(client, base, options);
}

export async function deleteAttribute(
  client: LdapClient,
  base: string,
  attributeName: string,
  value: string
) {
  const options = {
    operation: OPERATION_DELETE,
    modification: {
      [attributeName]: value,
    },
  };

  return modifyAttribute(client, base, options);
}
