from google.appengine.ext import ndb
from basemodel import BaseModel

class Album(BaseModel):
    title = ndb.StringProperty()
    year = ndb.IntegerProperty()
    thumbnail = ndb.StringProperty(indexed=False)

    # popularity vs recent
    views = ndb.IntegerProperty()
    update_at = ndb.DateTimeProperty(auto_now_add=True)

    @classmethod
    def queryRecentAlbums(cls):
        return cls.query().order(-cls.update_at)
