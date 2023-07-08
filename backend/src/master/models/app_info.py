from datetime import datetime
from typing import List, Optional

from db.mongo.mongo_model import OID, MongoModel
from pydantic import BaseModel, Field

class InfoModel(MongoModel):
    title: str
    value: str

class InfoModelIn(InfoModel):
    is_modified: bool
    modified_on: datetime