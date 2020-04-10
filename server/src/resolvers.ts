import { IResolvers } from "graphql-tools";
import * as bcrypt from "bcryptjs";
import { User } from "./entity/User";

const resolvers: IResolvers = {
  Query: {
    hello: (_: any, { name }) => `Hello ${name || "World"}`,
  },
  Mutation: {
    register: async (_, { email, password }) => {
      try {
        const salt: number = +process.env.SALT;
        const hashPassword = await bcrypt.hash(password, salt);
        const user = User.create({
          email,
          password: hashPassword,
        });

        if (!user.email) {
          return false;
        }
        user.save();
        return true;
      } catch (err) {
        console.log(err);
      }
    },
  },
};

export { resolvers };
