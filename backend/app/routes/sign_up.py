# app/routes/auth_bp.py
from flask import Blueprint, request, jsonify
from app.utils.helpers import debug_print, error_print, generate_hash
from app.db.db_funcs import get_user_by_username, add_user
import app.db.schemas as schemas

signup_bp = Blueprint("signup_bp", __name__)


@signup_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    # Validation
    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    # Check for existing user
    existing_user = get_user_by_username(username)
    if existing_user:
        error_print([f"Signup attempt failed — username '{username}' already exists"])
        return jsonify({"error": "Username already taken"}), 409

    # Create user with hashed password
    hashed_password = generate_hash(password)
    try:
        user = schemas.User(username=username, email="", password=hashed_password)
        new_user = add_user(user=user)
    except Exception as e:
        error_print([f"User creation failed: {str(e)}"])
        return jsonify({"error": "Internal server error"}), 500

    debug_print([f"User {username} signed up successfully"])
    return jsonify({"message": "User created successfully. Please log in."}), 201
