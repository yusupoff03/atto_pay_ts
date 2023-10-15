import { createClient, RedisClientType } from 'redis';

export class RedisClient {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: 'redis://localhost:6379',
      socket: {
        tls: process.env.REDIS_TLS === 'true',
      },
    });

    this.client.on('error', err => console.error(err));
    this.client.connect();
  }

  private execute<T>(promise: Promise<T>, cb: (err: Error | null, result?: T) => void = () => {}): Promise<T> {
    return promise
      .then(res => {
        cb(null, res);
        return res;
      })
      .catch(err => {
        cb(err);
        throw err;
      });
  }

  public hSet(key: string, field: string, value: string, cb: (err: Error | null, result?: number) => void = () => {}): Promise<number> {
    return this.execute(this.client.hSet(key, field, value), cb);
  }

  public hGet(key: string, field: string, cb: (err: Error | null, result?: string | null) => void = () => {}): Promise<string | null> {
    return this.execute(this.client.hGet(key, field), cb);
  }

  public hDel(key: string, field: string, cb: (err: Error | null, result?: number) => void = () => {}): Promise<number> {
    return this.execute(this.client.hDel(key, field), cb);
  }

  public disconnect(): void {
    this.client.quit();
  }
}

export default RedisClient;
