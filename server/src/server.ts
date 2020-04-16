import "reflect-metadata";
import * as dotenv from "dotenv";

import { GraphQLServer } from "graphql-yoga";
import { resolvers } from "./resolvers";
import { createConnection, getConnectionOptions } from "typeorm";
import * as Redis from "ioredis";

dotenv.config();
const redis = new Redis({
  host: "redisdb",
});

const server = new GraphQLServer({
  typeDefs: "src/schema.graphql",
  resolvers,
  context: () => ({
    redis,
  }),
});

export const startServer = async () => {
  try {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    const connection = await createConnection({
      ...connectionOptions,
      name: "default",
    });
    if (connection.isConnected) {
      const port =
        process.env.NODE_ENV === "test"
          ? process.env.TEST_PORT
          : process.env.PORT;

      await server.start({ port });
      console.log("Server is running on localhost:4000");
    } else {
      console.log("Fail to connect to database");
    }
  } catch (err) {
    console.log("Error when connecting to Database");
    throw err;
  }
};
