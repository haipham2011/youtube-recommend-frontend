FROM node:alpine

RUN mkdir /client
WORKDIR /client

COPY ./package.json ./client/

ADD . /client/

RUN npm install

EXPOSE 3000

ENTRYPOINT ["tail", "-f", "/dev/null"]