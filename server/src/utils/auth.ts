import * as bcrypt from "bcryptjs";
import { User } from "../entity/User";
import { getManager } from "typeorm";
import { validate } from "class-validator";
import {
  generateConfirmationUid,
  SendEmail,
  EmailOptions,
  EmailPerson,
} from "./utils";
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

    const confirmationUid = await generateConfirmationUid(result.id, redis);

    /*
    In SendInBlue template, use {{ params.URL }} and {{ params.NAME }}
    to get the URL and NAME value in the emailOptions.params
    */

    const emailOptions: EmailOptions = {
      templateId: 1,
      to: [
        { name: `${result.firstName} ${result.lastName}`, email: result.email },
      ],
      params: {
        URL: confirmationUid,
        NAME: `${result.firstName} ${result.lastName}`,
      },
    };
    const sendEmail = new SendEmail(emailOptions);
    const res = await sendEmail.send();
    let message = [];
    if (res.data && res.data.messageId) {
      console.log("SENT!");
      message.push("Confirmation email has been sent!");
      message.push(res.data.messageId);
    }

    if (res.data && res.data.message) {
      console.log(res.data.message);
      message.push(res.data.message);
    }
    return {
      ...result,
      message,
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
