from google.appengine.ext import ndb
import urllib

def list_class_properties(cls):
    return [k for k,v in cls.__dict__.iteritems() if type(v) is property]

class BaseModel(ndb.Model):
    @classmethod
    def delete(cls, id):
        key = ndb.Key(cls._get_kind(), id)
        key.delete()

    def to_dict(self):
        result = super(BaseModel,self).to_dict()
        cls = self.__class__
        properties = list_class_properties(cls)
        for property in properties:
            result[property] = self.__getattribute__(property)
        result['id'] = self.key.urlsafe()
        return result
