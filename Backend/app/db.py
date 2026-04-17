import os
from datetime import datetime
from typing import List

from dotenv import load_dotenv
from pymongo import MongoClient, DESCENDING
from pymongo.collection import Collection

load_dotenv()

_client: MongoClient | None = None


def _get_collection() -> Collection | None:
    global _client
    url = os.getenv("MONGODB_URL")
    if not url:
        return None
    if _client is None:
        _client = MongoClient(url, serverSelectionTimeoutMS=3000)
    db_name = os.getenv("MONGODB_DB", "resume_analyzer")
    return _client[db_name]["analyses"]


def save_analysis(data: dict) -> str | None:
    coll = _get_collection()
    if coll is None:
        return None
    try:
        record = {**data, "created_at": datetime.utcnow()}
        result = coll.insert_one(record)
        return str(result.inserted_id)
    except Exception:
        return None


def list_analyses(limit: int = 20) -> List[dict]:
    coll = _get_collection()
    if coll is None:
        return []
    try:
        docs = list(coll.find().sort("created_at", DESCENDING).limit(limit))
        for d in docs:
            d["_id"] = str(d["_id"])
            if isinstance(d.get("created_at"), datetime):
                d["created_at"] = d["created_at"].isoformat()
        return docs
    except Exception:
        return []