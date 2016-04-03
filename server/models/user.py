import logging


from webapp2_extras.appengine.auth.models import User as Webapp2User
from webapp2_extras import security
from google.appengine.ext import ndb
from basemodel import BaseModel
from google.appengine.api import memcache
from utils import Utils

class User(BaseModel, Webapp2User):
    created = ndb.DateTimeProperty(indexed=False,auto_now_add=True)
    updated = ndb.DateTimeProperty(indexed=False,auto_now=True)

    avatar_url = ndb.StringProperty(indexed=False);
    email = ndb.StringProperty(indexed=False);
    password = ndb.StringProperty(indexed=False);
    name = ndb.StringProperty(indexed=True);
    username = ndb.StringProperty(indexed=True);

    socialnetwork = ndb.StringProperty();
    access_token = ndb.StringProperty(indexed=False);
    is_new_user = ndb.BooleanProperty(indexed=False,default=True);

    @property
    def id(self):
        return str(self.key.id());

    @property
    def auth_id(self):
        ids = self.auth_ids;
        for id in ids:
            if id[:4] == 'own:':
                return id[4:]
        return ids[0];

    @property
    def url(self):
        return '#/user/'+self.auth_id;

    @property
    def displayName(self):
        if self.name is not None:
            return self.name;
        else:
            return self.username;

    @property
    def pic(self):
        return self.avatar_url;

    @classmethod
    def get_key(cls, id):
        return ndb.Key(cls, long(id));

    @classmethod
    def get_keys(cls, ids):
        return [ndb.Key(cls, long(id)) for id in ids];

    @classmethod
    def get_multi(cls, ids):
        keys = cls.get_keys(ids);
        users = ndb.get_multi(keys);

        map = {};
        index = 0;
        for key in keys:
            user = users[index];
            if user is not None:
                map[key.id()] = user;
            index = index + 1;
        return map;

    @classmethod
    def get_by_auth_ids(cls, auth_ids):
        return cls.query(cls.auth_ids.IN(auth_ids)).fetch()

    @classmethod
    def get_auth_id(cls, network, id):
        return '%s:%s' % (network, id)

    def to_activity_obj(self):
        return {'id': self.id, 'displayName': self.displayName, 'thumbnail': {'url': self.avatar_url}, 'url': '#/user/'+str(self.id), 'objectType': 'person'};


class UserUtils():
    @staticmethod
    def user_get_auto_complete(prefix):

        if len(prefix) <3:
            return [];
        three_letter_prefix = prefix[:3]
        key = 'user-auto3-'+three_letter_prefix
        data = memcache.get(key);
        if data is None:
            ## get all the tags which starts with the above prefix. and put in memcache.
            data = User.query().filter(User.name >= unicode(three_letter_prefix)).filter(User.name <= (unicode(prefix) + u"\ufffd")).fetch(10,projection=[User.name,User.username]);
            data = [[x.name,x.username] for x in data];
            memcache.set(key, data, 300);

        return filter(lambda x: x[0] >= unicode(prefix) and x[0] <= unicode(prefix) + u"\ufffd", data);

    @staticmethod
    def user_get_auto_complete_search(prefix):

        if len(prefix) <3:
            return [];
        three_letter_prefix = prefix[:3]
        key = 'user-auto-search-'+three_letter_prefix
        data = memcache.get(key);
        if data is None:
            ## get all the tags which starts with the above prefix. and put in memcache.
            data = User.query().filter(User.name >= unicode(three_letter_prefix)).filter(User.name <= (unicode(prefix) + u"\ufffd")).fetch(keys_only=True);
            data = [str(x.id()) for x in data];
            users = User.get_multi(data);
        return users;
