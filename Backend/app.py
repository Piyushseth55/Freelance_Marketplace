from flask import Flask, request, jsonify
from eth_account.messages import encode_defunct
from eth_account import Account
from db import get_user_by_wallet, set_matamask_wallet
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
        user = set_matamask_wallet(wallet, role)
        user = convert_objectid(user)
        return jsonify({"success" : True, "message" : "User Registered", "user" : user})
    
    
    user = convert_objectid(user)
    return jsonify({"success" : True, "message" : "User loged in", "user" : user})







if __name__  == "__main__" :
    app.run(port = 5000, debug = True)
    
    




