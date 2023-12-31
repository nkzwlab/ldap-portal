import { env } from "../../env";
import { AbstractRepository } from "./interface";
import { commandOptions, createClient } from "redis";
import { RedisJSON } from "@redis/json/dist/commands";
import { StringKeysOf, StringPropertiesOf } from "../../types";
import { applicationFromJson } from "../application";

type RedisJSONObject = RedisJSON & object;

export type RedisConfiguration = {
  url: string;
  itemName: string;
  password: string;
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
  >({ url, itemName: name, password }: RedisConfiguration): Promise<R> {
    const client = createClient({
      url,
      password,
    });
    await client.connect();

    const repository = new this(client, name) as R;

    return repository;
  }

  async addEntry(key: string, entry: T): Promise<void> {
    const physicalKey = this.internalKey(key);
    console.log(`addEntry: adding "${physicalKey}" = ${JSON.stringify(entry)}`);
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

  // WARNING: This *unsafely* convert raw JSON data into destination type.
  async getAllEntries(): Promise<T[]> {
    const query = `${this.prefix}*`;
    const keys = await this.client.keys(query);
    console.log("getAllEntrries:", { keys });
    if (keys.length <= 0) {
      console.log("getAllEntrries: keys are 0 length. Retuning empty array.");
      return [];
    }

    const getAllPromises = keys.map((key) => this.client.hGetAll(key));
    const entries = await Promise.all(getAllPromises);

    console.log("getAllEntrries:", { entries });

    const nonEmptyEntries = entries.filter((v) => v !== null) as T[];
    return nonEmptyEntries;
  }

  async deleteEntry(loginName: string): Promise<void> {
    const physicalKey = this.internalKey(loginName);
    const removedCount = await this.client.del(physicalKey);
    console.log(
      `deleteEntry: deleted ${removedCount} entries for key "${loginName}"`
    );
  }

  get prefix(): string {
    return `${this.name}:`;
  }

  internalKey(key: string): string {
    return this.prefix + key;
  }
}
