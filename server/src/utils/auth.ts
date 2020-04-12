import * as bcrypt from "bcryptjs";
import { User } from "../entity/User";
import { getManager } from "typeorm";
import { validate } from "class-validator";

const register = async (
  _: unknown,
  { email, password }: { email: string; password: string }
) => {
  try {
    const regEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,50}$/;
    if (!Boolean(password.match(regEx))) {
      return {
        email,
        errors: [
          "Password must be between 8 to 50 characters which contain at least one numeric digit, one uppercase and one lowercase letter",
        ],
      };
    }
    const salt: number = +process.env.SALT;
    const hashPassword = await bcrypt.hash(password, salt);
    const user = User.create({
      email,
      password: hashPassword,
      joinDate: new Date(),
    });
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
    return {
      ...result,
    };
  } catch (err) {
    throw err;
  }
};

export { register };
