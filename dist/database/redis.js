"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const redis_1 = require("redis");
const _config_1 = require("../config");
class RedisClient {
    constructor() {
        this.client = (0, redis_1.createClient)({
            url: 'redis://default:871bcbfae7524f79b0c553b102ecfd36@first-kid-32082.kv.vercel-storage.com:32082',
            socket: {
                tls: _config_1.REDIS_TLS === 'true',
            },
        });
        this.client.on('error', err => console.error(err));
        this.client.connect();
    }
    execute(promise, cb = () => { }) {
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
    hSet(key, field, value, cb = () => { }) {
        return this.execute(this.client.hSet(key, field, value), cb);
    }
    hGet(key, field, cb = () => { }) {
        return this.execute(this.client.hGet(key, field), cb);
    }
    hDel(key, field, cb = () => { }) {
        return this.execute(this.client.hDel(key, field), cb);
    }
    disconnect() {
        this.client.quit();
    }
}
exports.RedisClient = RedisClient;
exports.default = RedisClient;
//# sourceMappingURL=redis.js.map