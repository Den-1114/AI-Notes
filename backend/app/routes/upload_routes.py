from flask import Blueprint, request, jsonify, current_app
import os
from app.utils.helpers import allowed_file, generate_uid, debug_print, error_print

upload_bp = Blueprint("upload_bp", __name__)


@upload_bp.route("/upload", methods=["POST"])
def upload():
    debug_print(["Reached file upload"])

    if "file" not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"})

    if file and allowed_file(file.filename, current_app.config["ALLOWED_EXTENSIONS"]):
        original_filename = file.filename
        debug_print([f"File is {original_filename}"])

        file_uid = generate_uid()
        file_extension = original_filename.rsplit(".", 1)[1].lower()
        unique_filename = f"{file_uid}.{file_extension}"

        upload_folder = current_app.config["UPLOAD_FOLDER"]
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)

        debug_print([f"File saved to {file_path}"])
        return jsonify(
            {
                "success": "File Uploaded",
                "file_id": file_uid,
                "filename": original_filename,
                "saved_as": unique_filename,
            }
        )
    else:
        error_print(["Invalid file format"])
        return jsonify({"error": "Invalid file format"})
