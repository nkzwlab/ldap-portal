import { env } from "../env";
import { AbstractRepository, applicationFromJson } from "./interface";
import { RediSearchSchema, SchemaFieldTypes, createClient } from "redis";
import { RedisJSON } from "@redis/json/dist/commands";
import { StringKeysOf, StringPropertiesOf } from "../types";

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

const toIndexPrefix = (indexName: string): string =>
  `idx:${APPLICATION_INDEX_PREFIX}`;

type RedisJSONObject = RedisJSON & object;

export type RedisConfiguration<T extends RedisJSONObject> = {
  url: string;
  schema: RediSearchSchema;
  indexKey: StringKeysOf<T>;
  indexName: string;
};

export class RedisRepository<
  T extends RedisJSONObject,
  S extends RediSearchSchema
> implements AbstractRepository<T>
{
  client: ReturnType<typeof createClient>;
  schema: S;
  indexKey: StringKeysOf<T>;
  indexName: string;
  indexPrefix: string;

  constructor(
    client: RedisRepository<T, S>["client"],
    schema: S,
    indexKey: RedisRepository<T, S>["indexKey"],
    indexName: string
  ) {
    this.client = client;
    this.schema = schema;
    this.indexKey = indexKey;
    this.indexName = indexName;
    this.indexPrefix = toIndexPrefix(this.indexName);
  }

  static async withConfiguration<U extends RedisJSONObject & object>({
    url,
    schema,
    indexKey,
    indexName,
  }: RedisConfiguration<U>): Promise<RedisRepository<U, RediSearchSchema>> {
    const client = createClient({
      url,
    });
    await client.connect();

    return new RedisRepository(client, schema, indexKey, indexName);
  }

  static async withDefaultConfiguration<U extends RedisJSONObject>({
    schema,
    indexKey,
    indexName,
  }: Omit<RedisConfiguration<U>, "url">): Promise<
    RedisRepository<U, RediSearchSchema>
  > {
    const url = env.redisUrl;
    // const username = env.redisUser;
    // const password = env.redisPassword;
    return RedisRepository.withConfiguration({
      url,
      schema,
      indexKey,
      indexName,
    });
  }

  async makeIndex(): Promise<void> {
    try {
      await this.client.ft.create(this.indexName, this.schema, {
        ON: "JSON",
        PREFIX: `${this.indexPrefix}:`,
      });
    } catch (e) {
      if (!(e instanceof Error)) {
        throw e;
      } else if (e.message === "Index already exists") {
        console.log("skipping creating index");
      }
    }
  }

  async addEntry(entry: T): Promise<void> {
    const stringProperties = entry as StringPropertiesOf<T>;
    const entryKeyValue: string = stringProperties[this.indexKey];
    const key = this.recordName(entryKeyValue);
    await this.client.json.set(key, "$", entry);
  }

  async getEntry(keyValue: string): Promise<T | null> {
    const key = this.recordName(keyValue);
    const value = await this.client.json.get(key);
    const application = applicationFromJson(value) as any as T;

    return application;
  }

  async getEntryByToken(token: string): Promise<T | null> {
    const result = await this.client.ft.search(this.indexName, token);
    if (result.total <= 0) {
      return null;
    }
    return applicationFromJson(result.documents[0]) as any as T;
  }

  async deleteEntry(loginName: string): Promise<void> {
    const key = this.recordName(loginName);
    await this.client.json.del(key);
  }

  recordName(key: string): string {
    return `${this.indexPrefix}:${key}`;
  }
}
