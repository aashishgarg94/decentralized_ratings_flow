from datetime import datetime
from typing import List, Optional

from db.mongo.mongo_model import OID, MongoModel
from pydantic import BaseModel, Field


class PollCreateBaseModel(MongoModel):
    poll_id: str
    poll_address: str
    poll_group_id: str
    group_poll_number: int
    poll_title: str
    options: List[str]
    begin_date: datetime
    staking_deadline: datetime
    end_date: datetime
    category_code: str
    category_name: str
    sort_priority: Optional[int] = None
    description: Optional[str] = None
    description_images: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    public_key: Optional[str] = ""
    secret: Optional[str] = None
    nonce: Optional[int] = None
    tokens_staked: Optional[int] = 0
    result: Optional[int] = None

class PollCreateModel(PollCreateBaseModel):
    created_at : datetime = datetime.now()
    is_updated : Optional[bool] = False
    updated_at : Optional[datetime] = None
    is_deleted : Optional[bool] = False
    deleted_at : Optional[datetime] = None

class PollUpdateBaseModel(BaseModel):
    poll_id: str
    poll_group_id: Optional[str] = None
    group_poll_number: Optional[int] = None
    poll_title: Optional[str] = None
    options: Optional[List[str]] = None
    begin_date: Optional[datetime] = None
    staking_deadline: Optional[datetime] = None
    end_date: Optional[datetime] = None
    public_key: Optional[str] = None
    secret: Optional[str] = None
    nonce: Optional[int] = None
    category_code: Optional[str] = None
    category_name: Optional[str] = None
    sort_priority: Optional[int] = None
    description: Optional[str] = None
    description_images: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    tokens_staked: Optional[int] = 0
    result: Optional[int] = None

class PollUpdateModel(PollUpdateBaseModel):
    is_updated : bool = False
    updated_at : Optional[datetime] = datetime.now()

class PollModelOut(PollCreateBaseModel):
    id: OID = Field()