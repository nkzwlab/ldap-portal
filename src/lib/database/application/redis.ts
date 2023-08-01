import { env } from "../../env";
import {
  Application,
  ApplicationRepository,
  applicationFromJson,
} from "./interface";
import { RediSearchSchema, SchemaFieldTypes, createClient } from "redis";
import { StringKeysOf, StringPropertiesOf } from "../../types";
import { RedisRepository } from "../core";

const APPLICATION_INDEX_PREFIX = "application";

const APPLICATION_SCHEMA: RediSearchSchema = {
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

export class RedisApplicationRepository<S extends RediSearchSchema>
  extends RedisRepository<Application, S>
  implements ApplicationRepository
{
  async getApplicationByToken(token: string): Promise<Application | null> {
    const result = await this.client.ft.search(this.indexName, token);
    if (result.total <= 0) {
      return null;
    }
    return applicationFromJson(result.documents[0]);
  }
}
