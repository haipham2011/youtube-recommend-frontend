import "reflect-metadata";
import * as dotenv from "dotenv";

import { GraphQLServer } from "graphql-yoga";
import { resolvers } from "./resolvers";
import { createConnection, getConnectionOptions } from "typeorm";

dotenv.config();
const server = new GraphQLServer({ typeDefs: "src/schema.graphql", resolvers });

export const startServer = async () => {
  try {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    const connection = await createConnection({
      ...connectionOptions,
      name: "default",
    });
    if (connection.isConnected) {
      await server.start();
      console.log("Server is running on localhost:4000");
    } else {
      console.log("Fail to connect to database");
    }
  } catch (err) {
    console.log("Error when connecting to Database");
    throw err;
  }
};
