FROM node:16-alpine3.11

COPY . /src
WORKDIR /src
RUN apk add --no-cache openldap python make &&\
    npm install &&\
    npm run build
CMD ["npm", "start"]