import { IResolvers } from "graphql-tools";
import { register, verifyEmail } from "./utils/auth";

const resolvers: IResolvers = {
  Query: {
    hello: (_: any, { name }) => `Hello ${name || "World"}`,
  },
  Mutation: {
    register,
    verifyEmail,
  },
};

export { resolvers };
