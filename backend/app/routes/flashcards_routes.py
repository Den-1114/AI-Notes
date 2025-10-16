from flask import Blueprint, jsonify, current_app
import os
import json
from app.utils.helpers import debug_print, error_print
from app.utils.file_ops import extract_text_from_pdf, extract_text_from_docx
from app.ai.flashcards import generate_flashcards  # <- import your flashcard generator

flashcards_bp = Blueprint("flashcards_bp", __name__)


@flashcards_bp.route("/generate_flashcards/<filename>", methods=["GET"])
def generate_flashcards_route(filename: str):
    uid = os.path.splitext(filename)[0]
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    flashcards_folder = current_app.config.get("FLASHCARDS_FOLDER", "flashcards")

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

        flashcards = generate_flashcards(file_content)

        # Ensure JSON serializable
        if isinstance(flashcards, str):
            try:
                flashcards = json.loads(flashcards)
            except json.JSONDecodeError:
                error_print(["Invalid flashcard JSON output"])
                return jsonify({"error": "Invalid flashcard JSON output"})

        # Save flashcards as JSON file
        os.makedirs(flashcards_folder, exist_ok=True)
        output_path = os.path.join(flashcards_folder, f"{uid}_flashcards.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(flashcards, f, indent=2, ensure_ascii=False)

        debug_print([f"Flashcards generated for {filename}"])
        return jsonify({"flashcards": flashcards})

    except Exception as e:
        error_print([f"Error generating flashcards: {str(e)}"])
        return jsonify({"error": "Error generating flashcards"})
