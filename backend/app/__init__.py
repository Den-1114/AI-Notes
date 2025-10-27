from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os

jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "super-secret-key"  # Change this in production
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_SECURE"] = False  # Set to True in production
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False  # Enable in production
    app.config["JWT_COOKIE_SAMESITE"] = "Lax"
    app.config["JWT_ACCESS_COOKIE_PATH"] = "/"
    app.config["JWT_COOKIE_DOMAIN"] = None
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=12)
    jwt.init_app(app)
    CORS(
        app,
        resources={
            r"/*": {
                "origins": [
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                ],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
                "expose_headers": ["Set-Cookie"],
                "supports_credentials": True,
            }
        },
    )

    base_dir = os.path.abspath(os.path.join(os.getcwd(), ".."))
    app.config["UPLOAD_FOLDER"] = os.path.join(base_dir, "data/uploads")
    app.config["SUMMARY_FOLDER"] = os.path.join(base_dir, "data/summaries")
    app.config["FLASHCARDS_FOLDER"] = os.path.join(base_dir, "data/flashcards")
    app.config["ALLOWED_EXTENSIONS"] = {"pdf", "docx", "doc", "txt"}

    # Ensure folders exist
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    os.makedirs(app.config["SUMMARY_FOLDER"], exist_ok=True)
    os.makedirs(app.config["FLASHCARDS_FOLDER"], exist_ok=True)

    # Import and register blueprints
    from app.routes.upload_routes import upload_bp
    from app.routes.summary_routes import summary_bp
    from app.routes.flashcards_routes import flashcards_bp
    from app.routes.auth import login_bp
    from app.routes.sign_up import signup_bp

    app.register_blueprint(upload_bp)
    app.register_blueprint(summary_bp)
    app.register_blueprint(flashcards_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(signup_bp)

    return app
