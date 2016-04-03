from google.appengine.ext import ndb
from basemodel import BaseModel

class Song(BaseModel):
    title = ndb.StringProperty()
    album = ndb.StringProperty()
    year = ndb.IntegerProperty()
    version = ndb.IntegerProperty(indexed=False)

    track = ndb.StringProperty(indexed=False)
    lyrics = ndb.StringProperty(indexed=False)
    thumbnail = ndb.StringProperty(indexed=False)

    # popularity vs recent
    views = ndb.IntegerProperty()
    likes = ndb.IntegerProperty()
    update_at = ndb.DateTimeProperty(auto_now_add=True)

    @classmethod
    def queryRecentSongs(cls):
        return cls.query().order(-cls.update_at)
