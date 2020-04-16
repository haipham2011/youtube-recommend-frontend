import * as bcrypt from "bcryptjs";
import { User } from "../entity/User";
import { getManager } from "typeorm";
import { validate } from "class-validator";
import { generateConfirmationLink } from "./utils";
import { Redis } from "ioredis";

const register = async (
  _: unknown,
  { email, password }: { email: string; password: string },
  { redis }: { redis: Redis }
) => {
  try {
    // Check password match Regex
    const regEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,50}$/;
    if (!Boolean(password.match(regEx))) {
      return {
        email,
        errors: [
          "Password must be between 8 to 50 characters which contain at least one numeric digit, one uppercase and one lowercase letter",
        ],
      };
    }

    // Hash the password
    const salt: number = +process.env.SALT;
    const hashPassword = await bcrypt.hash(password, salt);

    const user = User.create({
      email,
      password: hashPassword,
      joinDate: new Date(),
    });

    // Validate input
    const errors = await validate(user);
    const errorMessages: string[] = [];

    if (errors.length > 0) {
      errors.map((err) => {
        // tslint:disable-next-line: forin
        for (const k in err.constraints) {
          errorMessages.push(err.constraints[k]);
        }
      });
      return {
        email: user.email,
        errors: errorMessages,
      };
    }
    const result = await getManager().save(user);

    const confirmationURL = await generateConfirmationLink(result.id, redis);

    console.log(confirmationURL);

    return {
      ...result,
    };
  } catch (err) {
    throw err;
  }
};

const verifyEmail = async (
  _: unknown,
  { uid }: { uid: string },
  { redis }: { redis: Redis }
) => {
  const userId = await redis.get(uid);
  if (userId) {
    const user = await User.findOne(userId);
    user.isVerified = true;
    const result = await getManager().save(user);
    return {
      ...result,
    };
  } else {
    return {
      errorMessages: ["Invalid uid string"],
    };
  }
};

export { register, verifyEmail };
