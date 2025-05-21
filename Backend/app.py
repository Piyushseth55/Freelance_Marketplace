from flask import Flask, request, jsonify
from db import get_user_by_wallet, set_matamask_wallet, add_contact_freelnacer, add_contact_client
from src.verify_user import verify_signature
from flask_cors import CORS
from helper import convert_objectid


app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

@app.route("/login", methods = ["POST"])
def login() :
    data = request.json
    wallet = data.get("wallet_address")
    role = data.get("role")
    signature = data.get("signature")
    message = data.get("message")
    
    
    if not verify_signature(wallet, signature, message) :
        return jsonify({"success" : False, "error" : "Invalid Signature"}), 401
    
    user = get_user_by_wallet(wallet, role)
    
    if not user :
        print("user not present !")
        user = set_matamask_wallet(wallet, role)
        user = convert_objectid(user)
        return jsonify({"success" : True, "message" : "User Registered", "user" : user})
    
    
    user = convert_objectid(user)
    return jsonify({"success" : True, "message" : "User loged in", "user" : user})



@app.route("/profile/freelancer/update", methods =["PUT"])
def update_freelancer_profile() :
    print("successfuly entered  in end point")
    data = request.json
    wallet = data.get("wallet_address")
    role = data.get("role")
    name = data.get("name")
    email = data.get("email")
    contact= data.get("contact")
    objective = data.get("objective")
    
    if role == "freelancer" :
        if add_contact_freelnacer(wallet, name, email, contact, objective) :
            print("successfully updated")
            return jsonify({"success" : True, "message" : "information updated"}), 200
        else :
            print("updation failed")
            return jsonify({"success" : False, "error" : "error occured"}), 401
        
        
@app.route("/profile/<wallet_address>", methods = ["GET"])
def get_profile_by_wallet(wallet_address) :
    try :    
        role = request.args.get("role", "freelancer")
        if not wallet_address :
            return jsonify({"success" : False, "error" : "wallet_address is required"}), 400
        
        user = get_user_by_wallet(wallet_address, role)
        if user :
            user = convert_objectid(user)
            print("name", user["name"])
            profile = {
                "name"      : user["name"],
                "objective" : user["objective"],
                "email"     : user["email"],
                "contact"   : user["contact"]
            }
            return jsonify({"success" : True, "message" : "user fetched successfuly", "profile" : profile}), 200
        else :
            return jsonify({"success" : False, "error" : "user not found"}), 404
    except Exception as e :
        print("Error in fetching" , e)
        return jsonify({"seccess" : False, "error": str(e)}), 500
    


@app.route("/profile/client/update", methods = ["PUT"])
def update_client_profile() :
    try :
        data    = request.json
        wallet  = data.get("wallet_address")
        name    = data.get("name")
        email   = data.get("email")
        contact = data.get("contact")
        company = data.get("company")
        post    = data.get("post")

        if not wallet :
            return jsonify({"success" : False, "error" : "Wallet_address required"}), 400
        
        if add_contact_client(wallet, name, email, contact, company, post) :
            return jsonify({"success" : True, "message" : "successfully updated ! "}), 200
        else :
            return jsonify({"success" : False, "error" : "client not found ! "}), 404
    except Exception as e :
        print("some error occured ! ")
        return jsonify({"success" : False, "error" : str(e)}), 500
    
    
    
    

if __name__  == "__main__" :
    app.run(port = 5000, debug = True)
    
    




