from flask import Flask, request, jsonify
from eth_account.messages import encode_defunct
from eth_account import Account


def verify_signature(wallet_address, signature, message) :
    try:
       encoded_msg = encode_defunct(text = message)
       recovered = Account.recover_message(encoded_msg, signature = signature)
       print("user verified !")
       return recovered.lower() == wallet_address.lower()
    except:
        return False
    
    
    
         
     
    