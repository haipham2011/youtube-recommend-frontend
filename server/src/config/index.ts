import { RedisOptions } from "ioredis";

export const redisdb = (): RedisOptions => {
  if (process.env.DOCKER_SETTINGS) {
    return {
      host: "redisdb",
    };
  } else {
    return {
      host: "localhost",
    };
  }
};

export const getPort = (): string => {
  if (process.env.DOCKER_SETTINGS) {
    return process.env.NODE_ENV === "test"
      ? process.env.TEST_PORT
      : process.env.PORT;
  } else {
    return process.env.NODE_ENV === "test"
      ? process.env.LOCAL_TEST_PORT
      : process.env.LOCAL_PORT;
  }
};
