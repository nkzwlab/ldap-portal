import { env } from "../../env";
import { AbstractRepository } from "./interface";
import { RediSearchSchema, SchemaFieldTypes, createClient } from "redis";
import { RedisJSON } from "@redis/json/dist/commands";
import { StringKeysOf, StringPropertiesOf } from "../../types";
import { applicationFromJson } from "../application";

type RedisJSONObject = RedisJSON & object;

export type RedisConfiguration<T extends RedisJSONObject> = {
  url: string;
  itemName: string;
};

export class RedisRepository<T extends {}> implements AbstractRepository<T> {
  client: ReturnType<typeof createClient>;
  name: string;

  constructor(client: RedisRepository<T>["client"], name: string) {
    this.client = client;
    this.name = name;
  }

  static async withConfiguration<
    U extends RedisJSONObject & object,
    R extends RedisRepository<U> = RedisRepository<U>
  >({ url, itemName: name }: RedisConfiguration<U>): Promise<R> {
    const client = createClient({
      url,
    });
    await client.connect();

    const repository = new this(client, name) as R;

    return repository;
  }

  async addEntry(key: string, entry: T): Promise<void> {
    const physicalKey = this.internalKey(key);
    const fieldsAdded = await this.client.hSet(physicalKey, entry);
    console.log(`addEntry: added fields: ${fieldsAdded}`);
  }

  // Get entry from Redis server.
  // WARNING: This *unsafely* convert raw JSON data into destination type.
  async getEntry(key: string): Promise<T | null> {
    const physicalKey = this.internalKey(key);
    const entry = await this.client.hGetAll(physicalKey);
    return entry as any as T;
  }

  async deleteEntry(loginName: string): Promise<void> {
    const physicalKey = this.internalKey(loginName);
    const removedCount = await this.client.del(physicalKey);
    console.log(
      `deleteEntry: deleted ${removedCount} entries for key "${loginName}"`
    );
  }

  internalKey(key: string): string {
    return `${this.name}:${key}`;
  }
}
