import { v4 } from "uuid";
import { Redis } from "ioredis";
import axios, { AxiosInstance } from "axios";

export const generateConfirmationUid = async (userId: string, redis: Redis) => {
  const uid = v4();
  // expire in 30 mins
  await redis.set(uid, userId, "ex", 1800);
  const clientUrl = process.env.CLIENT_SERVER_URL;
  return `${clientUrl}/${uid}`;
};

export type EmailPerson = {
  name: string;
  email: string;
};

export type EmailOptions = {
  templateId: number;
  sender?: EmailPerson;
  to: EmailPerson[];
  params?: object;
  replyTo?: EmailPerson;
};

export class SendEmail {
  private api: AxiosInstance;
  options: EmailOptions;
  constructor(options: EmailOptions) {
    this.api = axios.create();
    this.api.defaults.timeout = 30000; // 30s
    this.options = options;
  }

  async send() {
    if (process.env.NODE_ENV === "test") {
      return {
        data: {
          messageId: "Test message Id",
        },
      };
    }

    const result = await this.api.post(
      process.env.SEND_IN_BLUE_SMTP_EMAIL_URL,
      this.options,
      {
        headers: {
          "api-key": process.env.SEND_IN_BLUE_APIKEY,
        },
      }
    );
    return result;
  }
}
