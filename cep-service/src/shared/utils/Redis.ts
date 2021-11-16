import redis from 'redis'
import { promisify } from 'util'
import { ICache } from '../../types'
import { Logger } from '../../shared/utils'

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
      Logger.info("Redis Connected")
      return Redis.client
    } catch (error) {
      throw new Error((error as Error).message)
    }
  }

  public async set(key: string, value: string, maxAge?: number): Promise<void> {
    const set = promisify(Redis.client.set).bind(Redis.client)
    await set(key, value)
    Logger.info("Cache saved", {key})
    if (maxAge) {
      Redis.client.expire(key, maxAge)
    }
  }

  public async get(key: string): Promise<string | null> {
    const get = promisify(Redis.client.get).bind(Redis.client)
    const cachedData = await get(key)
    cachedData ? Logger.info("Cache finded", {key}) : Logger.info("Cache not found", {key})

    return cachedData
  }
}

export { Redis }
