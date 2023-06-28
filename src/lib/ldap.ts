import ldap, {
  createClient,
  Change,
  type Change as ChangeOptions,
  Client as LdapClient,
} from "ldapjs";
import { equal } from "assert";

import { env } from "./env";
import { exec } from "child_process";

const { ldapOption, domain, adminCN, password: adminPassword } = env;

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
    return await getAttribute(client, base, "loginShell");
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
    const options = {
      operation: "replace",
      modification: {
        loginShell: shell,
      },
    };
    await modifyAttribute(client, base, options);

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
    return await getAttribute(client, base, "sshPublickey");
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
  const options = {
    operation: "add",
    modification: {
      sshPublicKey: pubkey,
    },
  };

  try {
    await bindAsAdmin(client);
    await modifyAttribute(client, base, options);

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
  const options = {
    operation: "delete",
    modification: {
      sshPublicKey: pubkey,
    },
  };

  try {
    await bindAsAdmin(client);
    await modifyAttribute(client, base, options);

    return true;
  } catch (err) {
    throw err;
  } finally {
    await unbind(client);
  }
}

export async function updatePassword(
  userID: string,
  password: string,
  newPassword: string
) {
  if (typeof newPassword != "string" || newPassword.length < 8) {
    const err = new Error("invalid new password");
    (err as any).status = 400;
    throw err;
  }

  const ldapClient = createClient(ldapOption);

  try {
    await bindAsUser(ldapClient, userID, password);
  } catch (_) {
    const err = new Error("invalid old password");
    (err as any).status = 400;
    throw err;
  } finally {
    await unbind(ldapClient);
  }

  const userPassword = await new Promise((resolve, reject) => {
    exec(
      shellescape(["/usr/sbin/slappasswd", "-c", "$6$%.8s", "-s", newPassword]),
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout.trim());
        }
      }
    );
  });

  try {
    await bindAsAdmin(ldapClient);
    await new Promise((resolve, reject) => {
      ldapClient.modify(
        `uid=${userID},ou=People,${domain}`,
        [
          new Change({
            operation: "replace",
            modification: {
              userPassword,
            },
          }),
          // new ldap.Change({
          //   operation: 'replace',
          //   modification: {
          //     sambaNTPassword,
          //   },
          // }),
        ],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
    return true;
  } catch (err) {
    throw err;
  } finally {
    await unbind(ldapClient);
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
) {
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

async function changePassword(
  client: LdapClient,
  userID: string,
  oldPassword: string,
  newPassword: string
) {
  const filter = `(uid=${userID})`;

  function encodePassword(password: string) {
    return Buffer.from('"' + password + '"', "utf16le").toString();
  }

  // not required?
  // ldap.Attribute.settings.guid_format = ldap.GUID_FORMAT_B;

  await bindAsAdmin(client);

  client.search(
    "dc=vis,dc=net",
    {
      filter: filter,
      attributes: "dn",
      scope: "sub",
    },
    function (err, res) {
      res.on("searchEntry", function (entry) {
        var userDN = entry.dn;
        client.modify(
          userDN,
          [
            new ldap.Change({
              operation: "delete",
              modification: {
                unicodePwd: encodePassword(oldPassword),
              },
            }),
            new ldap.Change({
              operation: "add",
              modification: {
                unicodePwd: encodePassword(newPassword),
              },
            }),
          ],
          function (err) {
            if (err) {
              console.log(err.code);
              console.log(err.name);
              console.log(err.message);
              client.unbind();
            } else {
              console.log("Password changed!");
            }
          }
        );
      });
      res.on("error", function (err) {
        console.error("error: " + err.message);
      });
      res.on("end", function (result) {
        console.log("status: " + result?.status);
      });
    }
  );

  unbind(client);
}
