import { env } from "../../env";
import { ApplicationRepository } from "./interface";
import { InMemmoryApplicationRepository } from "./memory";
import { RedisApplicationRepository } from "./redis";

export * from "./interface";
export * from "./memory";
export * from "./redis";

export const inMemoryRepository = new InMemmoryApplicationRepository();
export let redisRepository: null | RedisApplicationRepository = null;

export const getRepository = async (): Promise<ApplicationRepository> => {
  if (env.isTest) {
    return inMemoryRepository;
  }

  if (redisRepository === null) {
    redisRepository =
      await RedisApplicationRepository.withDefaultConfiguration();
  }

  return redisRepository;
};
