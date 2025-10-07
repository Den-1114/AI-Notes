from flask import Flask
from flask_cors import CORS
import os


def create_app():
    app = Flask(__name__)
    CORS(app)

    base_dir = os.path.abspath(os.path.join(os.getcwd(), ".."))
    app.config["UPLOAD_FOLDER"] = os.path.join(base_dir, "data/uploads")
    app.config["SUMMARY_FOLDER"] = os.path.join(base_dir, "data/summaries")
    app.config["ALLOWED_EXTENSIONS"] = {"pdf", "docx", "doc", "txt"}

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    os.makedirs(app.config["SUMMARY_FOLDER"], exist_ok=True)

    # Import and register blueprints
    from app.routes.upload_routes import upload_bp
    from app.routes.summary_routes import summary_bp

    app.register_blueprint(upload_bp)
    app.register_blueprint(summary_bp)

    return app
