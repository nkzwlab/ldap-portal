import { env } from "../../env";
import { AbstractRepository } from "./interface";
import { RediSearchSchema, SchemaFieldTypes, createClient } from "redis";
import { RedisJSON } from "@redis/json/dist/commands";
import { StringKeysOf, StringPropertiesOf } from "../../types";

const toIndexPrefix = (indexName: string): string => `idx:${indexName}`;

type RedisJSONObject = RedisJSON & object;

export type RedisConfiguration<T extends RedisJSONObject> = {
  url: string;
  schema: RediSearchSchema;
  indexKey: keyof T;
  indexName: string;
};

export class RedisRepository<
  T extends RedisJSONObject,
  S extends RediSearchSchema = RediSearchSchema
> implements AbstractRepository<T>
{
  client: ReturnType<typeof createClient>;
  schema: S;
  indexKey: keyof T;
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

  static async withConfiguration<
    U extends RedisJSONObject & object,
    R extends RedisRepository<U> = RedisRepository<U>
  >({ url, schema, indexKey, indexName }: RedisConfiguration<U>): Promise<R> {
    const client = createClient({
      url,
    });
    await client.connect();

    const repository = new this(client, schema, indexKey, indexName) as R;
    console.log("making index...");
    await repository.makeIndex();
    console.log("making index.: done.");

    return repository;
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

  async addEntry(key: string, entry: T): Promise<void> {
    const index = this.recordName(key);
    await this.client.json.set(index, "$", entry);
  }

  // Get entry from Redis server.
  // WARNING: This *unsafely* convert raw JSON data into destination type.
  async getEntry(keyValue: string): Promise<T | null> {
    const key = this.recordName(keyValue);
    const value = await this.client.json.get(key);
    const application = value as any as T;

    return application;
  }

  async deleteEntry(loginName: string): Promise<void> {
    const key = this.recordName(loginName);
    await this.client.json.del(key);
  }

  recordName(key: string): string {
    return `${this.indexPrefix}:${key}`;
  }
}
