import { env } from "../../env";
import { ApplicationRepository } from "./interface";
import { InMemmoryRepository } from "./memory";
import { RedisRepository } from "./redis";

export * from "./interface";
export * from "./memory";
export * from "./redis";

let memoryRepository = new InMemmoryRepository();
let redisRepository: ApplicationRepository | null = null;

export const getRepository = async (): Promise<ApplicationRepository> => {
  if (env.isTest) {
    return memoryRepository;
  }

  if (redisRepository === null) {
    redisRepository = await RedisRepository.withDefaultConfiguration();
  }

  return redisRepository;
};
