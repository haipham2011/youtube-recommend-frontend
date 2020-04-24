import "reflect-metadata";
import * as dotenv from "dotenv";

import { GraphQLServer } from "graphql-yoga";
import { createConnection, getConnectionOptions } from "typeorm";
import * as Redis from "ioredis";

import { resolvers } from "./resolvers";
import { redisdb, getPort } from "./config";

dotenv.config();
4;

const redisOption = redisdb();
const redis = new Redis({ ...redisOption });

const server = new GraphQLServer({
  typeDefs: "src/schema.graphql",
  resolvers,
  context: () => ({
    redis,
  }),
});
export const makeConnection = async () => {
  let connName = process.env.NODE_ENV;
  if (!process.env.DOCKER_SETTINGS) {
    connName = `local-${connName}`;
  }

  console.log(`Connection is made to ${connName}`);
  const connectionOptions = await getConnectionOptions(connName);
  const connection = await createConnection({
    ...connectionOptions,
    name: "default",
  });

  return connection;
};

export const startServer = async () => {
  try {
    const connection = await makeConnection();
    if (connection.isConnected) {
      const port = getPort();

      await server.start({ port });
      console.log(`Server is running on localhost:${port}`);
    } else {
      console.log("Fail to connect to database");
    }
  } catch (err) {
    console.log("Error when connecting to Database");
    throw err;
  }
};
