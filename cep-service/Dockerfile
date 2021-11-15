FROM node:14.16.0-alpine as BUILDER

RUN yarn global add --silent -D \
  typescript

WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

COPY tsconfig.json ./

EXPOSE 3000

CMD ["yarn", "start:dev"]
