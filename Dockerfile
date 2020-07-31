FROM node

RUN mkdir -p /usr/src/app

COPY ./package.json ./package-lock.json /usr/src/app/

WORKDIR /usr/src/app

RUN npm i

COPY . /usr/src/app