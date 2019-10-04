import redis
from constants.secrets import REDIS_URI, REDIS_PORT, REDIS_PASSWORD

class Cache():
    def __init__(self):
        self.cache = redis.Redis(
                host=REDIS_URI,
                port=REDIS_PORT, 
                password=REDIS_PASSWORD,
                decode_responses=True)
        
    def get(self, key):
        return self.cache.get(key)

    def set(self, key, value, timeout=0):
        result = self.cache.set(key, value)
        if timeout > 0:
            self.cache.expire(key, timeout)
        return result

    def get_hash(self, hash_name):
        return self.cache.hgetall(hash_name)

    def set_hash(self, hash_name, hash, timeout=0):
        result = self.cache.hmset(hash_name, hash)
        if timeout > 0:
            self.cache.expire(hash_name, timeout)
        return result

    def set_expiration(self, key, timeout=0):
        if timeout > 0:
            self.cache.expire(key, timeout)
        else:
            self.cache.persist(key)

    def rename(self, old_name, new_name):
        if old_name != None and new_name != None:
            self.cache.rename(old_name, new_name)

    def delete(self, key):
        return self.cache.delete(key)

cache = Cache()