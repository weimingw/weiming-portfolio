import redis from 'redis';
import {
    REDIS_URL,
    REDIS_PASS,
    REDIS_PORT
} from '../secret';

class Cache {
    constructor() {
        this.client = redis.createClient({
            host: REDIS_URL,
            port: REDIS_PORT,
            password: REDIS_PASS,
        })
    }

    get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, function(err, reply) {
                err ? reject(err) : resolve(reply);
            });
        });
    }

    set(key, value) {
        return this.client.set(key, value);
    }

    getHash(key) {
        return new Promise((resolve, reject) => {
            this.client.hgetall(key, function(err, reply) {
                err ? reject(err) : resolve(reply);
            });
        });
    }

    setHash(key, value) {
        if (value instanceof Object) {
            return this.client.hmset(key, value);
        }
    }
}

export default new Cache();