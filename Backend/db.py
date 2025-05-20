from pymongo import MongoClient
from flask import jsonify
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
mongo_url = os.environ.get('MONGO_url')


client       = MongoClient(mongo_url)
freelance_db = client.get_database("Freelance")
freelancers  = freelance_db.get_collection("freelancers")
jobs         = freelance_db.get_collection("jobs")
clients      = freelance_db.get_collection("clients")

print(client.list_database_names())
def set_matamask_wallet(wallet_address, role) :
    if(role == "freelancer") :
        freelancer = {
            "wallet_address" :  wallet_address,
            "role" : role,
            "created_at" : datetime.now()
        }
        freelancers.insert_one(freelancer)
        return freelancer
    else :
        client = {
            "wallet_address" :  wallet_address,
            "role" : role,
            "created_at" : datetime.now()
        }
        clients.insert_one(client)
        return client
    
    
def get_user_by_wallet(wallet_address, role) :
    if role == "freelancer" :
        freelancers.find_one({"wallet_address" : wallet_address})
    else :
        clients.find_one({"wallet_address" : wallet_address})
        





