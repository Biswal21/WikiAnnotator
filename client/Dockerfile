FROM node:lts-alpine

RUN apk update \
    && apk upgrade \
    && apk add --no-cache --upgrade bash

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

EXPOSE 3000

