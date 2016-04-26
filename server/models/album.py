from google.appengine.ext import ndb
from basemodel import BaseModel

class Album(BaseModel):
    name = ndb.StringProperty()
    title = ndb.StringProperty()
    year = ndb.IntegerProperty()
    thumbnail = ndb.StringProperty(indexed=False)

    # popularity vs recent
    views = ndb.IntegerProperty()
    update_at = ndb.DateTimeProperty(auto_now_add=True)
    is_active = ndb.BooleanProperty()

    @classmethod
    def queryRecentAlbums(cls):
        return cls.query(cls.is_active==True).order(-cls.update_at).fetch(30)

    @classmethod
    def queryAdminAlbums(cls):
        return cls.query().order(-cls.update_at).fetch(30)
