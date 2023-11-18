FROM node:18-buster AS dev

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -qq -y slapd ldap-utils python make

COPY ./package.json ./yarn.lock /src/
WORKDIR /src

RUN yarn install

CMD yarn run dev

FROM node:18-alpine3.18

WORKDIR /src

RUN apk add --no-cache openldap python3 make

COPY ./package.json ./yarn.lock /src

RUN yarn install

COPY ./next-env.d.ts ./next.config.js ./tsconfig.json ./vitest.config.ts /src /public
RUN yarn run build

CMD ["yarn", "run", "start"]