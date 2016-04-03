from google.appengine.api import memcache
from google.appengine.ext import ndb

APPEND_DELIMETER = "~"
PREPEND_DELIMETER = "|"

class BaseMemcacheList():
    @classmethod
    def get_key(cls, to):
        return "memlist:"+str(to);

    @classmethod
    def get_max_size(cls):
        return 100;

    @classmethod
    def add(cls, to_id, key):
        cls.add_multi(to_id, [key]);

    @classmethod
    def add_multi(cls, to_id, keys):
        key = cls.get_key(to_id);
        memcache_client = memcache.Client();
        try:
            while True:
                data = memcache_client.gets(key);
                cas = True;
                if data is None:
                    data = keys;
                    cas = False;
                else:
                    data = keys + data;

                max_size = cls.get_max_size();
                if len(data) > max_size:
                    data = data[:max_size];

                if cas:
                    if memcache_client.cas(key, data):
                        break;
                else:
                    memcache_client.set(key, data);
                    break;

        except Exception:
            memcache_client.delete(key);

    @classmethod
    def delete(cls, from_id, key):
        cls.delete_multi(from_id, [key]);

    @classmethod
    def delete_multi(cls, from_id, keys):
        memcache_client = memcache.Client();
        key = cls.get_key(from_id);
        try:
            while True:
                data = memcache_client.gets(key);
                if data is None:
                    return;
                else:
                    data = [i for i in data if i not in keys];

                if memcache_client.cas(key, data):
                    break;
        except Exception:
            memcache_client.delete(key);


    @classmethod
    def get_list(cls, id):
        key = cls.get_key(id);
        data = memcache.get(key);
        if data is not None:
            return data;
        return None;

    @classmethod
    def put_entities(cls, id, entities):
        memcache_key = cls.get_key(id);
        keys = []
        for entity in entities:
            keys.append(entity.key);
        memcache.set(memcache_key, keys);

    @classmethod
    def add_entities(cls, id, entities):
        keys = []
        for entity in entities:
            keys.append(entity.key);
        cls.add_multi(id, keys);

    @classmethod
    def delete_entities(cls, id, entities):
        keys = []
        for entity in entities:
            keys.append(entity.key);
        cls.delete_multi(id, keys);

    @classmethod
    def get_entities(cls, id):
        key = cls.get_key(id);
        data = memcache.get(key);
        if data is not None:
            return ndb.get_multi(data);
        return None;