import redis from 'redis'

const { REDIS_URI, REDIS_PORT } = process.env

class Redis {
  private static client: redis.RedisClient

  public static connect(): redis.RedisClient {
    try {
      if (!Redis.client?.connected) {
        const options: redis.ClientOpts = {
          host: REDIS_URI!,
          port: parseInt(REDIS_PORT!, 10),
        }
        Redis.client = redis.createClient(options)
      }

      return Redis.client
    } catch (error) {
      throw new Error(error)
    }
  }

  public static getClient(): redis.RedisClient {
    return Redis.client
  }
}

export { Redis }
