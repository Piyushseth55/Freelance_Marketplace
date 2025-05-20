from bson import ObjectId


def convert_objectid(doc) :
   doc['_id'] = str(doc['_id'])
   return doc 