import redis from 'redis';
import {
    REDIS_URL,
    REDIS_PASS,
    REDIS_PORT
} from '../secret';

/**
 * An adapter class to wrap around Redis
 * Makes it easier to migrate away from Redis in the future, if needed
 */
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
                err ? reject(err) : resolve(JSON.parse(reply));
            });
        });
    }

    set(key, value) {
        return this.client.set(key, JSON.stringify(value));
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

    getHashItem(hashKey, key) {
        return new Promise((resolve, reject) => {
            this.client.hget(hashKey, key, function(err, reply) {
                err ? reject(err) : resolve(JSON.parse(reply));
            });
        })
    }

    removeHashItem(hashKey, key) {
        return this.client.hdel(hashKey, key);
    }

    setHashItem(hashKey, key, value) {
        return this.client.hset(hashKey, key, JSON.stringify(value));
    }

    appendListItem(listKey, value) {
        return this.client.rpush(listKey, JSON.stringify(value));
    }

    getListItem(listKey, index) {
        return new Promise((resolve, reject) => {
            this.client.lindex(listKey, index, function(err, reply) {
                err ? reject(err) : resolve(JSON.parse(reply));
            });
        })
    }

    listShift(listKey) {
        return new Promise((resolve, reject) => {
            this.client.lpop(listKey, function(err, reply) {
                err ? reject(err) : resolve(JSON.parse(reply));
            });
        })
    }

    getListSize(listKey) {
        return new Promise((resolve, reject) => {
            this.client.llen(listKey, function(err, reply) {
                err ? reject(err) : resolve(JSON.parse(reply));
            });
        })
    }
}

const cache = new Cache()
export default cache;

/**
 * Easily wraps around a function that accepts a key as the first argument
 * The function will have its results stored in cache using the key
 * @param {Function} fn function to wrap with cache getting and setting
 * @param {String} hashKey if the data is stored in a hash, this is the key to the hash
 * @param {Object} opts contains:
 *      maxSize: starts removing if the hash has size bigger than this
 */
export function createCachedFunction(fn, hashKey, opts) {
    /**
     * @param {String} key to the value in the cache or in the hash 
     */
    return async function(key, ...args) {
        let result = hashKey ?
            await cache.getHashItem(hashKey, key) :
            await cache.get(key);
        if (result) { // retrieved from the cache
            return result;
        }
        result = await fn(key, ...args);
        
        hashKey ?
            cache.setHashItem(hashKey, key, result) :
            cache.set(key, result);
        
        reduceCacheSize(hashKey, key, opts);

        return result;
    }
}

/**
 * We use a list to track keys in the hash so that we can implement a LRU cache policy
 * This gets the name of the list when passing in the hash
 * @param {*} hashKey 
 */
const getCacheSizeTrackerListKey= (hashKey) => `${hashKey}_keys`

async function reduceCacheSize(hashKey, key, opts) {
    const { maxSize } = opts;
    if (maxSize) {
        // add the key to the end of list of keys
        const sizeTrackerKey = getCacheSizeTrackerListKey(hashKey);
        cache.appendListItem(sizeTrackerKey, key);

        if (await cache.getListSize(sizeTrackerKey) > maxSize) {
            // get and remove least recently used item, remove it from the hash
            const keyToRemove = await cache.listShift(sizeTrackerKey);
            cache.removeHashItem(hashKey, keyToRemove);
        }
    }
}