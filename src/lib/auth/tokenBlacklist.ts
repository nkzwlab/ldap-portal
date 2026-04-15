import { createClient } from "redis";
import { cookies } from "next/headers";

import { env } from "@/lib/env";
import { COOKIE_NAME_TOKEN } from "./consts";

// TTL matches JWT expiry so blacklist entries auto-expire
const BLACKLIST_TTL_SECONDS = 24 * 60 * 60; // 24h

let client: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!client) {
    client = createClient({ url: env.redisUrl, password: env.redisPassword });
    await client.connect();
  }
  return client;
}

export async function addTokenToBlacklist(token: string): Promise<void> {
  const c = await getRedisClient();
  await c.set(`token_blacklist:${token}`, "1", {
    EX: BLACKLIST_TTL_SECONDS,
  });
}

export async function isCurrentSessionBlacklisted(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME_TOKEN)?.value;
  if (!token) return true;

  const c = await getRedisClient();
  const result = await c.get(`token_blacklist:${token}`);
  return result !== null;
}
