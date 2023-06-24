# ldap-portal
A simple and lightweight LDAP portal application.
You can change passwords, login shells, and add or delete public keys.

![login page](docs/img/login.png)
![index page](docs/img/index.png)
![pubkey page](docs/img/pubkey.png)


## How to deploy

### 1. create .env file

You can cp sample.env

```
cp sample.env .env
```

```
LDAP_URI=ldap://ldap.example.com/
LDAP_DOMAIN=dc=example,dc=com
SECRET=SECRETKEY
PASSWORD=admincn_password
DEPLOY_DOMAIN=ldap-portal.example.com
ADMIN_CN=admin
NODE_ENV=development|test|production
```

### 2. docker run

```
docker-compose up -d
```

## LDAP Schema
Here is the LDAP schema that this application is based on.
[schema](docs/schema)
