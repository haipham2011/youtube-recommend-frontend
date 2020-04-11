import * as bcrypt from "bcryptjs";
import { User } from "../entity/User";

const register = async (
  _: unknown,
  { email, password }: { email: string; password: string }
) => {
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
};

export { register };
