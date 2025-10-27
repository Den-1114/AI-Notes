from pydantic import BaseModel
from typing import Optional


class User(BaseModel):
    id: Optional[int] = None
    username: str
    password: str
    full_name: Optional[str] = None
    created_at: Optional[str] = None


class Document(BaseModel):
    uid: str
    user_id: int
    original_name: str
    file_type: str
    created_at: Optional[str] = None


class Summary(BaseModel):
    id: Optional[int] = None
    document_uid: str
    created_at: Optional[str] = None


class Flashcard(BaseModel):
    id: Optional[int] = None
    document_uid: str
    created_at: Optional[str] = None


class Quiz(BaseModel):
    id: Optional[int] = None
    document_uid: str
    created_at: Optional[str] = None
