from app import create_app
from app.utils.helpers import debug_print
import os

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
    debug_print(["Flask app stopped"])
    debug_print(["Removing uploaded files"])
    for f in os.listdir(app.config["UPLOAD_FOLDER"]):
        os.remove(os.path.join(app.config["UPLOAD_FOLDER"], f))
    debug_print(["Uploaded files removed"])
    debug_print(["Removing summary files"])
    for f in os.listdir(app.config["SUMMARY_FOLDER"]):
        os.remove(os.path.join(app.config["SUMMARY_FOLDER"], f))
    debug_print(["Summary files removed"])
    debug_print(["Removing flashcard files"])
    for f in os.listdir(app.config["FLASHCARDS_FOLDER"]):
        os.remove(os.path.join(app.config["FLASHCARDS_FOLDER"], f))
    debug_print(["Flashcard files removed"])
    debug_print(["Exiting program"])
    debug_print(["Goodbye!"])
    exit(0)
