import app.db.schemas as schemas
from pathlib import Path
import sqlite3

DB_PATH = Path("data.db")
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()


def do(sql: str, params: tuple | None = None):
    cursor.execute(sql, params or ())
    conn.commit()


def add_user(user: schemas.User) -> schemas.User:
    do("INSERT INTO users (username, email) VALUES (?, ?)", (user.username, user.email))
    user_id = cursor.lastrowid
    return schemas.User(id=user_id, name=user.username, email=user.email)


def upload_document(document: schemas.Document) -> schemas.Document:
    do(
        "INSERT INTO documents (uid, user_id, original_name, file_type) VALUES (?, ?, ?, ?)",
        (document.uid, document.user_id, document.original_name, document.file_type),
    )
    return document


def create_summary(summary: schemas.Summary) -> schemas.Summary:
    do(
        "INSERT INTO summaries (document_uid) VALUES (?)",
        (summary.document_uid,),
    )
    summary_id = cursor.lastrowid
    return schemas.Summary(id=summary_id, document_uid=summary.document_uid)


def create_flashcard(flashcard: schemas.Flashcard) -> schemas.Flashcard:
    do(
        "INSERT INTO flashcards (document_uid) VALUES (?)",
        (flashcard.document_uid,),
    )
    flashcard_id = cursor.lastrowid
    return schemas.Flashcard(id=flashcard_id, document_uid=flashcard.document_uid)


def create_quiz(quiz: schemas.Quiz) -> schemas.Quiz:
    do(
        "INSERT INTO quizzes (document_uid) VALUES (?)",
        (quiz.document_uid,),
    )
    quiz_id = cursor.lastrowid
    return schemas.Quiz(id=quiz_id, document_uid=quiz.document_uid)
