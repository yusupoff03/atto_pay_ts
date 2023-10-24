export declare class RedisClient {
    private client;
    constructor();
    private execute;
    hSet(key: string, field: string, value: string, cb?: (err: Error | null, result?: number) => void): Promise<number>;
    hGet(key: string, field: string, cb?: (err: Error | null, result?: string | null) => void): Promise<string | null>;
    hDel(key: string, field: string, cb?: (err: Error | null, result?: number) => void): Promise<number>;
    disconnect(): void;
}
export default RedisClient;
