# app/routes/auth_bp.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    jwt_required,
    get_jwt_identity,
)
from app.utils.helpers import debug_print, error_print, generate_hash
from app.db.db_funcs import get_user_by_username

login_bp = Blueprint("auth_bp", __name__)


@login_bp.route("/login", methods=["POST"])
def login():
    raw = request.get_data(as_text=True)
    debug_print([f"Raw login payload: {raw}"])

    data = request.get_json(silent=True)
    if not data:
        error_print(["Invalid or missing JSON in /login"])
        return jsonify({"error": "Invalid or missing JSON body"}), 422

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    user = get_user_by_username(username)
    if not user:
        error_print(["User not found"])
        return jsonify({"error": "Invalid credentials"}), 401

    if generate_hash(password) != user.password:
        error_print(["Invalid credentials"])
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(
        identity=str(user.id), additional_claims={"username": user.username}
    )

    response = jsonify(
        {
            "message": "Login successful",
            "access_token": access_token,  # Include token in response
        }
    )

    set_access_cookies(response, access_token)

    debug_print([f"User {username} logged in successfully"])
    return response, 200


@login_bp.route("/verify", methods=["GET"])
@jwt_required()
def verify():
    uid = get_jwt_identity()
    return jsonify({"logged_in_as": uid}), 200
