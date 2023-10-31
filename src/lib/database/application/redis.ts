import {
  Application,
  ApplicationRepository,
  applicationFromJson,
} from "./interface";
import { RediSearchSchema, SchemaFieldTypes, createClient } from "redis";
import { RedisRepository } from "../core";
import { env } from "@/lib/env";

export class RedisApplicationRepository
  extends RedisRepository<Application>
  implements ApplicationRepository
{
  async getApplicationByToken(token: string): Promise<Application | null> {
    console.log(`searching entry for token: '${token}'`);
    const physicalKey = this.internalKey(token);
    const result = await this.client.hGetAll(physicalKey);
    console.log("got search result:", { result });

    return applicationFromJson(result);
  }

  static async withDefaultConfiguration(): Promise<RedisApplicationRepository> {
    const url = env.redisUrl;
    const name = "application";
    // const username = env.redisUser;
    // const password = env.redisPassword;
    return RedisApplicationRepository.withConfiguration<
      Application,
      RedisApplicationRepository
    >({
      url,
      itemName: name,
    });
  }
}
