import {
  Application,
  ApplicationRepository,
  applicationFromJson,
} from "./interface";
import { RediSearchSchema, SchemaFieldTypes, createClient } from "redis";
import { RedisRepository } from "../core";
import { env } from "@/lib/env";

export const APPLICATION_INDEX_PREFIX_NAME = "application";

export const APPLICATION_INDEX_KEY = "loginName";

export const APPLICATION_SCHEMA: RediSearchSchema = {
  "$.loginName": {
    type: SchemaFieldTypes.TEXT,
    SORTABLE: true,
  },
  "$.email": {
    type: SchemaFieldTypes.TEXT,
  },
  "$.passwordHash": {
    type: SchemaFieldTypes.TEXT,
  },
  "$.token": {
    type: SchemaFieldTypes.TEXT,
    SORTABLE: true,
  },
};

export class RedisApplicationRepository
  extends RedisRepository<Application, typeof APPLICATION_SCHEMA>
  implements ApplicationRepository
{
  async getApplicationByToken(token: string): Promise<Application | null> {
    const result = await this.client.ft.search(this.indexName, token);
    if (result.total <= 0) {
      return null;
    }
    return applicationFromJson(result.documents[0]);
  }

  static async withDefaultConfiguration(): Promise<RedisApplicationRepository> {
    const url = env.redisUrl;
    const schema = APPLICATION_SCHEMA;
    const indexKey = APPLICATION_INDEX_KEY;
    const indexName = APPLICATION_INDEX_PREFIX_NAME;
    // const username = env.redisUser;
    // const password = env.redisPassword;
    return RedisApplicationRepository.withConfiguration<
      Application,
      RedisApplicationRepository
    >({
      url,
      schema,
      indexKey,
      indexName,
    });
  }
}