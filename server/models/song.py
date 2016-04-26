from google.appengine.ext import ndb
from basemodel import BaseModel
from album import Album

class Song(BaseModel):
    name = ndb.StringProperty()
    title = ndb.StringProperty()
    album_key = ndb.KeyProperty(kind=Album)
    version = ndb.IntegerProperty(indexed=False)
    
    audio = ndb.StringProperty(indexed=False)
    karaoke_audio = ndb.StringProperty(indexed=False)
    length = ndb.IntegerProperty(indexed=False)
    
    tags = ndb.StringProperty(repeated=True)
    lyrics_synced = ndb.JsonProperty()
    lyrics_unsynced = ndb.JsonProperty()
    
    # popularity vs recent
    views = ndb.IntegerProperty()
    likes = ndb.IntegerProperty()
    update_at = ndb.DateTimeProperty(auto_now_add=True)
    is_active = ndb.BooleanProperty()
    
    @classmethod
    def queryRecentSongs(cls):
        return cls.query(cls.is_active==True).order(cls.update_at).fetch(30)

    @classmethod
    def queryAdminSongs(cls):
        return cls.query().order(cls.update_at).fetch(30)
    
    @classmethod
    def queryAlbum(cls, album_key):
        return cls.query(cls.album_key==album_key).order(cls.update_at)

    def to_full_dict(self):
        album = self.album_key.get()
        return self.__to_full_dict(album)
        
    def to_full_dict2(self, album):
        return self.__to_full_dict(album)
    
    def to_full_dict_and_lyrics(self):
        result = super(BaseModel, self).to_dict()
        album = self.album_key.get()
        return self.__to_full_dict(album, True)

    def to_full_dict_and_lyrics2(self, album):
        result = super(BaseModel, self).to_dict()
        return self.__to_full_dict(album, True)

    def __to_full_dict(self, album, include_lyrics=False):
        result = super(BaseModel, self).to_dict()
        if album != None:
            result['year'] = album.year
            result['thumbnail'] = album.thumbnail
            result['album'] = album.title
            result['album_id'] = album.key.urlsafe()
        del result['album_key']
        result['id'] = self.key.urlsafe()
        if not include_lyrics:
            del result['lyrics_synced']
            del result['lyrics_unsynced']
        return result
        