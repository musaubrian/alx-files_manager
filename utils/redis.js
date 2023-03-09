import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (error) => {
      console.log(`Connection error: ${error}`);
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  // Checks if the connection is successfull
  isAlive() {
    return this.isClientConnected;
  }

  // Gets value of a key
  async get(key) {
    const getKeyValue = promisify(this.client.get).bind(this.client);
    const val = await getKeyValue(key);
    return val;
  }

  // Stores a key value in redis and expires it after given duration(seconds)
  async set(key, value, duration) {
    const setKeyValue = promisify(this.client.set).bind(this.client);
    await setKeyValue(key, value);
    this.client.expire(key, duration);
  }

  // Deletes a key's value
  async del(key) {
    const delKey = promisify(this.client.del).bind(this.client);
    await delKey(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
