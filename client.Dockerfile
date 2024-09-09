FROM node:22.8.0

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.base.json .
COPY turbo.json .
COPY packages packages
RUN rm packages/client/.env || true
RUN npm ci

CMD npm run start:client
