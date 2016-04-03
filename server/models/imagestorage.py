import logging;
from basemodel import BaseModel
from google.appengine.ext import ndb
from google.appengine.api import urlfetch

logger = logging.getLogger('ImageStorageModel');

class ImageStorage(BaseModel):
    image = ndb.BlobProperty(default=None,indexed=False);
    realurl = ndb.StringProperty(indexed=True);
    created_at = ndb.DateTimeProperty(auto_now_add=True);

    @property
    def id(self):
        return self.key.id();

    @classmethod
    def insert(cls, imagecontent,url):
        image = cls(image=imagecontent,realurl = url);
        key = image.put();
        return key;

    @classmethod
    def getimagecontent(cls,id):
        key = ndb.Key(cls._get_kind(), long(id));
        imageentry = key.get()
        return imageentry.image;

    @classmethod
    def checkurl(cls,url):
        entry = cls.query(cls.realurl == url).fetch()
        if len(entry) > 0:
            return "/getimage/"+str(entry[0].id);
        return None;

    @classmethod
    def getVirtualUrl(cls,url):
        if url is None:
            return None;
        virtualurl = cls.checkurl(url);
        if virtualurl is not None:
            return virtualurl;
        image = None;
        try:
            image = urlfetch.fetch(url)
        except Exception:
            pass
        if image is not None and image.status_code == 200:
            imagecontent = image.content;
            key = ImageStorage.insert(imagecontent,url);
            virtualurl = "/getimage/"+ str(key.id());
            return virtualurl;
        return url;