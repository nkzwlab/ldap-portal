import { env } from "../env";
import {
  Application,
  ApplicationRepository,
  applicationFromJson,
} from "./interface";
import { RediSearchSchema, SchemaFieldTypes, createClient } from "redis";

const APPLICATION_INDEX_PREFIX = "application";
const APPLICATION_INDEX_NAME = `idx:${APPLICATION_INDEX_PREFIX}`;

const APPLICATION_SCHEMA: RediSearchSchema = {
  "$.loginName": {
    type: SchemaFieldTypes.TEXT,
  },
  "$.email": {
    type: SchemaFieldTypes.TEXT,
  },
  "$.token": {
    type: SchemaFieldTypes.TEXT,
    SORTABLE: true,
  },
};

export class RedisRepository implements ApplicationRepository {
  client: ReturnType<typeof createClient>;

  constructor(client: RedisRepository["client"]) {
    this.client = client;
  }

  static async withDefaultConfiguration(): Promise<RedisRepository> {
    const url = env.redisUrl;
    // const username = env.redisUser;
    // const password = env.redisPassword;
    const client = createClient({
      url,
      //   username,
      //   password,
    });
    await client.connect();

    return new RedisRepository(client);
  }

  async makeIndex(): Promise<void> {
    try {
      const index: string = APPLICATION_INDEX_NAME;
      await this.client.ft.create(index, APPLICATION_SCHEMA, {
        ON: "JSON",
        PREFIX: `${APPLICATION_INDEX_PREFIX}:`,
      });
    } catch (e) {
      if (!(e instanceof Error)) {
        throw e;
      } else if (e.message === "Index already exists") {
        console.log("skipping creating index");
      }
    }
  }

  async addApplication(application: Application): Promise<void> {
    const key = RedisRepository.recordName(application.loginName);
    await this.client.json.set(key, "$", application);
  }

  async getApplication(loginName: string): Promise<Application | null> {
    const key = RedisRepository.recordName(loginName);
    const value = await this.client.json.get(key);
    const application = applicationFromJson(value);

    return application;
  }

  async getApplicationByToken(token: string): Promise<Application | null> {
    const result = await this.client.ft.search(APPLICATION_INDEX_NAME, token);
    if (result.total <= 0) {
      return null;
    }
    return applicationFromJson(result.documents[0]);
  }

  async deleteApplication(loginName: string): Promise<void> {
    const key = RedisRepository.recordName(loginName);
    await this.client.json.del(key);
  }

  static recordName(loginName: string): string {
    return `${APPLICATION_INDEX_PREFIX}:${loginName}`;
  }
}
