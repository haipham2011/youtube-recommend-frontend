FROM node:alpine

RUN mkdir /server
WORKDIR /server

COPY ./package.json ./server/

ADD . /server/

RUN npm install

EXPOSE 4000

ENTRYPOINT ["tail", "-f", "/dev/null"]