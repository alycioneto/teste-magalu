import redis from 'redis'
import { promisify } from 'util'
import { ICache } from '../../types'


//TODO: add envs
const { REDIS_URI, REDIS_PORT } = process.env

class Redis implements ICache {
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

  public async set(key: string, value: string, maxAge?: number): Promise<void> {
    const set = promisify(Redis.client.set).bind(Redis.client)
    await set(key, value)
    if (maxAge) {
      Redis.client.expire(key, maxAge)
    }
  }

  public async get(key: string): Promise<string | null> {
    const get = promisify(Redis.client.get).bind(Redis.client)
    const cachedData = await get(key)
    return cachedData
  }
}

export { Redis }
