from flask import Blueprint, request, jsonify
from database.models import db, User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"success": False, "error": "Email and password required"}), 400
        
    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "error": "User already exists"}), 400
        
    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password_hash=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    
    token = create_access_token(identity=str(new_user.id))
    return jsonify({"success": True, "data": {"message": "User created successfully", "token": token, "email": email}}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    
    if user and bcrypt.check_password_hash(user.password_hash, password):
        token = create_access_token(identity=str(user.id))
        return jsonify({"success": True, "data": {"message": "Login successful", "token": token, "email": email}}), 200
        
    return jsonify({"success": False, "error": "Invalid email or password"}), 401
