import { IResolvers } from "graphql-tools";
import { register } from "./utils/auth";

const resolvers: IResolvers = {
  Query: {
    hello: (_: any, { name }) => `Hello ${name || "World"}`,
  },
  Mutation: {
    register,
  },
};

export { resolvers };
