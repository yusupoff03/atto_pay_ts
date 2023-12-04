"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    RedisClient: function() {
        return RedisClient;
    },
    default: function() {
        return _default;
    }
});
const _redis = require("redis");
const _config = require("../config");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
let RedisClient = class RedisClient {
    execute(promise, cb = ()=>{}) {
        return promise.then((res)=>{
            cb(null, res);
            return res;
        }).catch((err)=>{
            cb(err);
            throw err;
        });
    }
    hSet(key, field, value, cb = ()=>{}) {
        return this.execute(this.client.hSet(key, field, value), cb);
    }
    hGet(key, field, cb = ()=>{}) {
        return this.execute(this.client.hGet(key, field), cb);
    }
    hDel(key, field, cb = ()=>{}) {
        return this.execute(this.client.hDel(key, field), cb);
    }
    hGetAll(key, cb = ()=>{}) {
        return this.execute(this.client.get(key), cb);
    }
    disconnect() {
        this.client.quit();
    }
    constructor(){
        _define_property(this, "client", void 0);
        this.client = (0, _redis.createClient)({
            url: 'redis://default:871bcbfae7524f79b0c553b102ecfd36@first-kid-32082.kv.vercel-storage.com:32082',
            socket: {
                tls: _config.REDIS_TLS === 'true'
            }
        });
        this.client.on('error', (err)=>console.error(err));
        this.client.connect();
    }
};
const _default = RedisClient;

//# sourceMappingURL=redis.js.map