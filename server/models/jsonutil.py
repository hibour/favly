import datetime
import time
from google.appengine.ext import db

SIMPLE_TYPES = (int, long, float, bool, basestring, dict)
LIST_TYPES = (list)

def modelToDict(obj):
	if obj == None:
		return None
	properties = obj.properties().iteritems();

	output = {'key_name': str(obj.key().name()), 'id': str(obj.key().id() or obj.key().name()) }
	for field, prop in properties:
		value = getattr(obj, field)

		if isinstance(value, long) or isinstance(value, unicode):
			value = str(value)

		if isinstance(value, LIST_TYPES):
			newvalue = []
			for subvalue in value:
				newvalue.append(str(subvalue))
			output[field] = newvalue
		elif value is None or isinstance(value, SIMPLE_TYPES):
			output[field] = value
		elif isinstance(value, datetime.date):
			ms = time.mktime(value.utctimetuple()) * 1000
			ms += getattr(value, 'microseconds', 0) / 1000
			output[field] = str(long(ms))
		else:
			raise ValueError('cannot encode ' + field)
	return output
