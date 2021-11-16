import { promisify } from "util";

import redis from "redis";

import { ICache } from "../../types";
import { Logger } from "./Logger";

const { REDIS_URI, REDIS_PORT } = process.env;

class Redis implements ICache {
  private static client: redis.RedisClient;

  public static connect(): redis.RedisClient {
    try {
      if (!Redis.client?.connected) {
        const options: redis.ClientOpts = {
          host: REDIS_URI,
          port: parseInt(REDIS_PORT!, 10),
        };
        Redis.client = redis.createClient(options);
      }
      Logger.info("Redis Connected");
      return Redis.client;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  public async set(key: string, value: string, maxAge?: number): Promise<void> {
    const set = promisify(Redis.client.set).bind(Redis.client);
    await set(key, value);
    Logger.info("Cache saved", { key });
    if (maxAge) {
      Redis.client.expire(key, maxAge);
    }
  }

  public async get(key: string): Promise<string | null> {
    const get = promisify(Redis.client.get).bind(Redis.client);
    const cachedData = await get(key);

    if (cachedData) {
      Logger.info("Cache finded", { key });
    } else {
      Logger.info("Cache not found", { key });
    }

    return cachedData;
  }
}

export { Redis };
