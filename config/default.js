module.exports = {
  ldapOption: {
    url: process.env.LDAP_URI,
  },
  domain: process.env.LDAP_DOMAIN,
  secret: process.env.SECRET,
  adminPassword: process.env.PASSWORD,
  adminCN: process.env.ADMINCN
};
