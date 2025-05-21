from pymongo import MongoClient, errors
from flask import jsonify
import os
from dotenv import load_dotenv
from datetime import datetime
from bson import json_util
import json

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
        user = freelancers.find_one({"wallet_address" : wallet_address})
        return user
    else :
        user = clients.find_one({"wallet_address" : wallet_address})
        return user
   
   
def add_skills(wallet_address, role, skills) :
    
    # skills should be array
    result = freelancers.update_one(
        {"wallet_address" : wallet_address},
        {"$set" : {"skills" : skills}}
    )
    
    if result.matched_count == 1 :
        return True
    else :
        return False
    
    
def add_contact_freelnacer(wallet_address, name, email, contact, objective) :
    result = freelancers.update_one(
        {"wallet_address" : wallet_address},
        {"$set" : {"name" : name,
                   "email" : email,
                   "contact" : contact,
                   "objective" : objective}}
    )
    
    if result.matched_count == 1:
        return True
    else :
        return False
    
    
def add_contact_client(wallet_address,name, email, contact, company,post):
    result = clients.update_one(
        {"wallet_address" : wallet_address},
        {"$set" : {
            "name" : name,
            "email" : email,
            "contact" : contact,
            "company" : company,
            "post" : post
        }}
    )
    
    if result.matched_count == 1 : 
        return True
    else :
        return False
    

def add_job(job_description) :
    try:
        # here job_description is a dictionary
        jobs.insert_one(job_description)
        print("succesfuly inserted")
        return True
    except errors.PyMongoError as e:
        print("Failed to insert : ", e)
        return False
 
 
def get_all_job() :
    try:
        jobs = list(jobs.find())
        serialize_jobs = json.loads(json_util.dumps(jobs))
        return serialize_jobs
    except errors.PyMongoError as e:
        raise e
    except Exception as e:
        raise e
    


        

            
  
         





