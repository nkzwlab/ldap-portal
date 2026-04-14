FROM node:22-bookworm AS dev

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -qq -y slapd ldap-utils python3 make

COPY ./package.json ./yarn.lock /src/
WORKDIR /src

RUN yarn install

CMD yarn run dev

FROM node:22-alpine

WORKDIR /src

RUN apk add --no-cache openldap python3 make

COPY ./package.json ./yarn.lock /src

RUN yarn install

COPY ./.env ./next-env.d.ts ./next.config.js ./tsconfig.json ./vitest.config.ts /src/
COPY  /public /src/public
COPY  /src /src/src
RUN yarn run build

CMD ["yarn", "run", "start"]