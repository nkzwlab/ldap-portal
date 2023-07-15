import { ApplicationRepository } from "./interface";
import { RedisRepository } from "./redis";

export * from "./interface";
export * from "./memory";
export * from "./redis";

let redisRepository: ApplicationRepository | null = null;

export const getRedisRepository = async (): Promise<ApplicationRepository> => {
  if (redisRepository === null) {
    redisRepository = await RedisRepository.withDefaultConfiguration();
  }

  return redisRepository;
};
