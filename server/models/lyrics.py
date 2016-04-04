from google.appengine.ext import ndb
from basemodel import BaseModel

class Lyrics(BaseModel):
    locale = ndb.StringProperty()
    content = ndb.TextProperty(indexed=False)
