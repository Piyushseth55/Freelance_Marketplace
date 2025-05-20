from pymongo import MongoClient
from flask import jsonify

import os
from dotenv import load_dotenv

load_dotenv()
mongo_url = os.environ.get('MONGO_url')


client       = MongoClient(mongo_url)
freelance_db = client.get_database("Freelance")
freelancers  = freelance_db.get_collection("freelancers")
job          = freelance_db.get_collection("job")
client       = freelance_db.get_collection("client")






