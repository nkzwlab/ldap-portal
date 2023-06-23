const config = require('config');
const ldap = require('ldapjs');
const assert = require('assert');
const shellescape = require('shell-escape');
const {exec} = require('child_process');
const {nthash} = require('smbhash');

async function auth(userID, password) {
  const ldapClient = ldap.createClient(config.ldapOption);
  try {
    await bindAsUser(ldapClient, userID, password);
  } catch (err) {
    return false;
  }
  await unbind(ldapClient);
  return true;
}

async function getShell(userID) {
  const ldapClient = ldap.createClient(config.ldapOption);
  try {
    await bindAsAdmin(ldapClient);
    const shell = await new Promise((resolve, reject)=>{
      ldapClient.search(`uid=${userID},ou=People,${config.domain}`, {attributes: 'loginShell'}, (err, res)=>{
        if (err) {
          reject(err);
        } else {
          let shells = [];
          res.on('searchEntry', (entry)=>{
            if (entry.attributes[0] != null) {
              shells = [...shells, ...entry.attributes[0].vals];
            }
          });
          res.on('end', ()=>{
            assert.equal(1, shells.length);
            resolve(shells[0]);
          });
        }
      });
    });
    return shell;
  } catch (err) {
    throw err;
  } finally {
    await unbind(ldapClient);
  }
}

async function setShell(userID, shell) {
  const ldapClient = ldap.createClient(config.ldapOption);
  try {
    await bindAsAdmin(ldapClient);
    await new Promise((resolve, reject)=>{
      ldapClient.modify(`uid=${userID},ou=People,${config.domain}`, new ldap.Change({
        operation: 'replace',
        modification: {
          loginShell: shell,
        },
      }), (err)=>{
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (err) {
    throw err;
  } finally {
    await unbind(ldapClient);
  }
}

async function getPubkey(userID) {
  const ldapClient = ldap.createClient(config.ldapOption);
  try {
    await bindAsAdmin(ldapClient);
    const pubkey = await new Promise((resolve, reject)=>{
      ldapClient.search(`uid=${userID},ou=People,${config.domain}`, {attributes: 'sshPublicKey'}, (err, res)=>{
        if (err) {
          reject(err);
        } else {
          let pubkeys = [];
          res.on('searchEntry', (entry)=>{
            if (entry.attributes[0] != null) {
              pubkeys = entry.attributes[0].vals
            }
          });
          res.on('end', ()=>{
            resolve(pubkeys);
          });
        }
      });
    });
    return pubkey;
  } catch (err) {
    throw err;
  } finally {
    await unbind(ldapClient);
  }
}

async function addPubkey(userID, pubkey) {
  const ldapClient = ldap.createClient(config.ldapOption);
  try {
    await bindAsAdmin(ldapClient);
    await new Promise((resolve, reject)=>{
      ldapClient.modify(`uid=${userID},ou=People,${config.domain}`, new ldap.Change({
        operation: 'add',
        modification: {
          sshPublicKey: pubkey,
        },
      }), (err)=>{
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (err) {
    throw err;
  } finally {
    await unbind(ldapClient);
  }
}

async function delPubkey(userID, pubkey) {
  const ldapClient = ldap.createClient(config.ldapOption);
  try {
    await bindAsAdmin(ldapClient);
    await new Promise((resolve, reject)=>{
      ldapClient.modify(`uid=${userID},ou=People,${config.domain}`, new ldap.Change({
        operation: 'delete',
        modification: {
          sshPublicKey: pubkey,
        },
      }), (err)=>{
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (err) {
    throw err;
  } finally {
    await unbind(ldapClient);
  }
}

async function updatePassword(userID, password, newPassword) {
  if (typeof newPassword != 'string' || newPassword.length < 8) {
    const err = new Error('invalid new password');
    err.status = 400;
    throw err;
  }

  const ldapClient = ldap.createClient(config.ldapOption);

  try {
    await bindAsUser(ldapClient, userID, password);
  } catch (_) {
    const err = new Error('invalid old password');
    err.status = 400;
    throw err;
  } finally {
    await unbind(ldapClient);
  }

  const userPassword = await new Promise((resolve, reject)=>{
    exec(shellescape(['/usr/sbin/slappasswd', '-c', '$6$%.8s', '-s', newPassword]), (err, stdout, stderr)=>{
      if (err) {
        reject(err);
      } else {
        resolve(stdout.trim());
      }
    });
  });
  // const sambaNTPassword = nthash(newPassword);

  try {
    await bindAsAdmin(ldapClient);
    await new Promise((resolve, reject)=>{
      ldapClient.modify(`uid=${userID},ou=People,${config.domain}`, [
        new ldap.Change({
          operation: 'replace',
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
      ], (err)=>{
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    return true;
  } catch (err) {
    throw err;
  } finally {
    await unbind(ldapClient);
  }
}

module.exports = {
  auth,
  getShell,
  setShell,
  getPubkey,
  addPubkey,
  delPubkey,
  updatePassword,
};

function bindAsAdmin(ldapClient) {
  return new Promise((resolve, reject)=>{
    ldapClient.bind(`cn=${config.adminCN},${config.domain}`, config.adminPassword, (err)=>{
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function bindAsUser(ldapClient, userID, password) {
  return new Promise((resolve, reject)=>{
    ldapClient.bind(`uid=${userID},ou=People,${config.domain}`, password, (err)=>{
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function unbind(ldapClient) {
  return new Promise((resolve, reject)=>{
    // ldapClient.unbind((err)=>{
    //   if (err) {
    //     reject(err);
    //   } else {
    //     resolve();
    //   }
    // });
    resolve();
  });
}
