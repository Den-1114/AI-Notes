from flask import Blueprint, jsonify, current_app
import os
from app.utils.helpers import debug_print, error_print
from app.utils.file_ops import extract_text_from_pdf, extract_text_from_docx
from app.ai.summarizer import generate_chapter_summary

summary_bp = Blueprint("summary_bp", __name__)


@summary_bp.route("/generate_summary/<filename>", methods=["GET"])
def generate_summary(filename: str):
    uid = os.path.splitext(filename)[0]
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    summary_folder = current_app.config["SUMMARY_FOLDER"]

    if not filename or "." not in filename:
        error_print(["Invalid filename"])
        return jsonify({"error": "Invalid filename"})

    file_path = os.path.join(upload_folder, filename)
    if not os.path.isfile(file_path):
        error_print([f"File {filename} not found"])
        return jsonify({"error": "File not found"})

    try:
        ext = filename.rsplit(".", 1)[1].lower()
        if ext == "txt":
            with open(file_path, "r", encoding="utf-8") as f:
                file_content = f.read()
        elif ext == "pdf":
            file_content = extract_text_from_pdf(file_path)
        elif ext == "docx":
            file_content = extract_text_from_docx(file_path)
        else:
            error_print(["Unsupported file format"])
            return jsonify({"error": "Unsupported file format"})

        summary = generate_chapter_summary(file_content)

        os.makedirs(summary_folder, exist_ok=True)
        with open(
            os.path.join(summary_folder, f"{uid}_summary.txt"), "w", encoding="utf-8"
        ) as f:
            f.write(summary)

        debug_print([f"Summary generated for {filename}"])
        return jsonify({"summary": summary})
    except Exception as e:
        error_print([f"Error generating summary: {str(e)}"])
        return jsonify({"error": "Error generating summary"})
