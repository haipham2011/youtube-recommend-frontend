import { v4 } from "uuid";
import { Redis } from "ioredis";

export const generateConfirmationLink = async (
  userId: string,
  redis: Redis
) => {
  const uid = v4();
  // expire in 30 mins
  await redis.set(uid, userId, "ex", 1800);
  return uid;
};
