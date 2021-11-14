import redis from 'redis'
import { promisify } from 'util'

const { REDIS_URI, REDIS_PORT } = process.env

class Redis {
  private static client: redis.RedisClient

  public static connect(): redis.RedisClient {
    try {
      if (!Redis.client?.connected) {
        const options: redis.ClientOpts = {
          host: "redis",
          port: 6379,
        }
        Redis.client = redis.createClient(options)
      }

      return Redis.client
    } catch (error) {
      throw new Error((error as Error).message)
    }
  }

  public static async set<T>(key: string, value: T, maxAge?: number): Promise<void> {
    const parsedValue = JSON.stringify(value)
    const set = promisify(Redis.client.set).bind(Redis.client)
    await set(key, parsedValue)
    if (maxAge) {
      Redis.client.expire(key, maxAge)
    }
  }

  public static async get(key: string): Promise<unknown> {
    const get = promisify(Redis.client.get).bind(Redis.client)
    const cachedData = await get(key)
    return cachedData ? JSON.parse(cachedData) : null
  }
}

export { Redis }
