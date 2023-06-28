import ldap, { createClient, Change, Client as LdapClient } from "ldapjs";
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
  const ldapClient = createClient(ldapOption);
  try {
    await bindAsAdmin(ldapClient);
    const shell = await new Promise((resolve, reject) => {
      ldapClient.search(
        `uid=${userID},ou=People,${domain}`,
        { attributes: "loginShell" },
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            let shells: string[] = [];
            res.on("searchEntry", (entry) => {
              if (entry.attributes[0] != null) {
                shells = [...shells, ...(entry.attributes[0].vals as string[])];
              }
            });
            res.on("end", () => {
              equal(1, shells.length);
              resolve(shells[0]);
            });
          }
        }
      );
    });
    return shell;
  } catch (err) {
    throw err;
  } finally {
    await unbind(ldapClient);
  }
}

export async function setShell(
  userID: string,
  shell: string
): Promise<boolean> {
  const ldapClient = createClient(ldapOption);
  try {
    await bindAsAdmin(ldapClient);
    await new Promise((resolve, reject) => {
      ldapClient.modify(
        `uid=${userID},ou=People,${domain}`,
        new Change({
          operation: "replace",
          modification: {
            loginShell: shell,
          },
        }),
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

export async function getPubkey(userID: string) {
  const ldapClient = createClient(ldapOption);
  try {
    await bindAsAdmin(ldapClient);
    const pubkey = await new Promise((resolve, reject) => {
      ldapClient.search(
        `uid=${userID},ou=People,${domain}`,
        { attributes: "sshPublicKey" },
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            let pubkeys: string[] = [];
            res.on("searchEntry", (entry) => {
              if (entry.attributes[0] != null) {
                pubkeys = entry.attributes[0].vals as string[];
              }
            });
            res.on("end", () => {
              resolve(pubkeys);
            });
          }
        }
      );
    });
    return pubkey;
  } catch (err) {
    throw err;
  } finally {
    await unbind(ldapClient);
  }
}

export async function addPubkey(
  userID: string,
  pubkey: string
): Promise<boolean> {
  const ldapClient = createClient(ldapOption);
  try {
    await bindAsAdmin(ldapClient);
    await new Promise((resolve, reject) => {
      ldapClient.modify(
        `uid=${userID},ou=People,${domain}`,
        new Change({
          operation: "add",
          modification: {
            sshPublicKey: pubkey,
          },
        }),
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

export async function delPubkey(
  userID: string,
  pubkey: string
): Promise<boolean> {
  const ldapClient = createClient(ldapOption);
  try {
    await bindAsAdmin(ldapClient);
    await new Promise((resolve, reject) => {
      ldapClient.modify(
        `uid=${userID},ou=People,${domain}`,
        new Change({
          operation: "delete",
          modification: {
            sshPublicKey: pubkey,
          },
        }),
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

/// Change password
async function changePassword(
  client: LdapClient,
  userID: string,
  oldPassword: string,
  newPassword: string
) {
  var filter = `(uid=${userID})`;

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
}
