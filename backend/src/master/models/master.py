from typing import List, Optional

from db.mongo.mongo_model import OID, MongoModel
from pydantic import BaseModel, Field


class BaseFullNameModel(BaseModel):
    first_name: str
    middle_name: Optional[str] = ""
    last_name: Optional[str] = ""


class BaseNameModel(MongoModel):
    id: OID = Field()
    name: str


class BaseRangeModel(BaseModel):
    start_range: int
    end_range: int
    range_type: Optional[str]


class BaseIsCreated(MongoModel):
    id: OID = Field()
    is_created: bool


class BaseIsDisabled(MongoModel):
    id: OID = Field()
    is_disabled: bool


class BaseIsDeleted(MongoModel):
    id: OID = Field()
    is_deleted: bool


class BaseIsUpdated(MongoModel):
    id: OID = Field()
    is_updated: bool


class BaseKeyValueModel(BaseModel):
    name: str
    value: str


class BaseNotFound(BaseModel):
    status_code: int = 404
    message: str = "Record not found"