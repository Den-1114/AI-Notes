import app.db.schemas as schemas
import app.db.db as db
from pathlib import Path
import sqlite3
from app.utils.helpers import generate_hash

DB_PATH = Path("data.db")
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
cursor = conn.cursor()


def do(sql: str, params: tuple | None = None):
    cursor.execute(sql, params or ())
    conn.commit()


def add_user(user: schemas.User) -> schemas.User:
    do(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (
            user.username,
            user.password,
        ),
    )
    user_id = cursor.lastrowid
    return schemas.User(id=user_id, username=user.username, password=user.password)


def list_users() -> list[schemas.User]:
    cursor.execute("SELECT id, username, password, full_name, created_at FROM users")
    rows = cursor.fetchall()
    users = [
        schemas.User(
            id=row[0],
            username=row[1],
            password=row[2],
            full_name=row[3],
            created_at=row[4],
        )
        for row in rows
    ]
    return users


def get_user_by_username(username: str) -> schemas.User | None:
    cursor.execute(
        "SELECT id, username, password, full_name, created_at FROM users WHERE username = ?",
        (username,),
    )
    row = cursor.fetchone()
    if row:
        return schemas.User(
            id=row[0],
            username=row[1],
            password=row[2],
            full_name=row[3],
            created_at=row[4],
        )
    return None


def upload_document(document: schemas.Document) -> schemas.Document:
    do(
        "INSERT INTO documents (uid, user_id, original_name, file_type) VALUES (?, ?, ?, ?)",
        (document.uid, document.user_id, document.original_name, document.file_type),
    )
    return document


def add_summary(summary: schemas.Summary) -> schemas.Summary:
    do(
        "INSERT INTO summaries (document_uid) VALUES (?)",
        (summary.document_uid,),
    )
    summary_id = cursor.lastrowid
    return schemas.Summary(id=summary_id, document_uid=summary.document_uid)


def add_flashcards(flashcard: schemas.Flashcard) -> schemas.Flashcard:
    do(
        "INSERT INTO flashcards (document_uid) VALUES (?)",
        (flashcard.document_uid,),
    )
    flashcard_id = cursor.lastrowid
    return schemas.Flashcard(id=flashcard_id, document_uid=flashcard.document_uid)


def add_quiz(quiz: schemas.Quiz) -> schemas.Quiz:
    do(
        "INSERT INTO quizzes (document_uid) VALUES (?)",
        (quiz.document_uid,),
    )
    quiz_id = cursor.lastrowid
    return schemas.Quiz(id=quiz_id, document_uid=quiz.document_uid)
