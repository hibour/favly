from google.appengine.ext import ndb
from basemodel import BaseModel
from album import Album

class Song(BaseModel):
    title = ndb.StringProperty()
    album_key = ndb.KeyProperty(kind=Album)
    version = ndb.IntegerProperty(indexed=False)

    track = ndb.StringProperty(indexed=False)
    lyrics = ndb.StringProperty(indexed=False)
    length = ndb.IntegerProperty(indexed=False)

    tags = ndb.StringProperty(repeated=True)

    # popularity vs recent
    views = ndb.IntegerProperty()
    likes = ndb.IntegerProperty()
    update_at = ndb.DateTimeProperty(auto_now_add=True)

    @classmethod
    def queryRecentSongs(cls):
        return cls.query().order(cls.update_at)
    
    def to_full_dict(self):
        album = self.album_key.get()
        return self.to_full_dict2(album)
        
    def to_full_dict2(self, album):
        result = super(BaseModel, self).to_dict()
        if album != None:
            result['year'] = album.year
            result['thumbnail'] = album.thumbnail
            result['album'] = album.title
            result['album_id'] = album.key.urlsafe()
        del result['album_key']
        result['id'] = self.key.urlsafe()
        print self, album, result
        return result        