import {
  Application,
  ApplicationRepository,
  applicationFromJson,
} from "./interface";
import { RedisRepository } from "../core";
import { env } from "@/lib/env";
import { RediSearchSchema, SchemaFieldTypes, SearchOptions } from "redis";

export const SCHEMA: RediSearchSchema = {
  loginName: {
    type: SchemaFieldTypes.TEXT,
    SORTABLE: true,
    // Prevent Redis from tokenizing the text for efficient search
    NOSTEM: true,
  },
  email: {
    type: SchemaFieldTypes.TEXT,
  },
  passwordHash: {
    type: SchemaFieldTypes.TEXT,
  },
  token: {
    type: SchemaFieldTypes.TEXT,
    SORTABLE: true,
    NOSTEM: true,
  },
};

export class RedisApplicationRepository
  extends RedisRepository<Application>
  implements ApplicationRepository
{
  async getAllEntries(): Promise<Application[]> {
    const entries = await super.getAllEntries();
    entries.sort(({ loginName: a }, { loginName: b }) => a.localeCompare(b));
    return entries;
  }

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
    const password = env.redisPassword;

    const self = await RedisApplicationRepository.withConfiguration<
      Application,
      RedisApplicationRepository
    >({
      url,
      itemName: name,
      password,
    });

    try {
      await self.client.ft.create(self.index, SCHEMA, {
        ON: "HASH",
        PREFIX: self.prefix,

        // By default, Redis do not index so common words, called stop words (e.g., `a', `the').
        // To allow login name to be common words, Stop that behavior by passing empty stop words list.
        STOPWORDS: [],
      });
    } catch (e) {
      if (e instanceof Error && e?.message === "Index already exists") {
        console.log("Index exists already, skipped creation.");
      } else {
        throw e;
      }
    }

    return self;
  }

  async getApplicationByLoginName(
    loginName: string
  ): Promise<Application | null> {
    const options: SearchOptions = {
      LIMIT: {
        from: 0,
        size: 1,
      },
    };

    const res = await this.client.ft.search(
      this.index,
      `@loginName: ${loginName}`,
      options
    );

    console.log("getApplicationByLoginName: response =", res);

    if (res.total < 1 || res.documents.length < 1) {
      return null;
    }

    const app = applicationFromJson(res.documents[0].value);
    return app;
  }

  get index() {
    return `idx:${this.name}`;
  }
}
