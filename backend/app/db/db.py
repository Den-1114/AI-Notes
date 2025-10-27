import sqlite3
from pathlib import Path
import app.db.schemas as schemas

DB_PATH = Path("data.db")
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()


def do(sql: str, params: tuple | None = None):
    cursor.execute(sql, params or ())
    conn.commit()


do("PRAGMA foreign_keys = ON;")

do(
    """
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
);
"""
)

do(
    """
CREATE TABLE IF NOT EXISTS documents (
    uid TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    original_name TEXT NOT NULL,
    file_type TEXT NOT NULL DEFAULT 'pdf',
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
"""
)

do(
    """
CREATE TABLE IF NOT EXISTS summaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_uid TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (document_uid) REFERENCES documents(uid) ON DELETE CASCADE
);
"""
)

do(
    """
CREATE TABLE IF NOT EXISTS flashcards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_uid TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (document_uid) REFERENCES documents(uid) ON DELETE CASCADE
);
"""
)

do(
    """
CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_uid TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (document_uid) REFERENCES documents(uid) ON DELETE CASCADE
);
"""
)
