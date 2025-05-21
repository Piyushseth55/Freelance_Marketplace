from flask import Flask, request, jsonify
from db import get_user_by_wallet, set_matamask_wallet, add_contact_freelnacer, add_contact_client
from src.verify_user import verify_signature
from flask_cors import CORS
from helper import convert_objectid


app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

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



@app.route("/profile/freelance/update", methods =["PUT", "OPTIONS"])
def update_freelancer_profile() :
    data = request.json
    wallet = data.get("wallet_address")
    role = data.get("role")
    name = data.get("name")
    email = data.get("email")
    contact= data.get("contact")
    objective = data.get("objective")
    print("successfuly entered  in end point")
    
    if role == "freelancer" :
        if add_contact_freelnacer(wallet, name, email, contact, objective) :
            print("successfully updated")
            return jsonify({"success" : True, "message" : "information updated"}), 200
        else :
            print("updation failed")
            return jsonify({"success" : False, "error" : "error occured"}), 401
        


if __name__  == "__main__" :
    app.run(port = 5000, debug = True)
    
    




