from datetime import datetime
from typing import List, Optional

from db.mongo.mongo_model import OID, MongoModel
from pydantic import BaseModel, Field


class StakeCreateBaseModel(MongoModel):
    poll_id: str
    range_begin: int
    range_end: int
    tokens_staked: int

class StakeCreateModelIn(StakeCreateBaseModel):
    staker_id: str
    reward: Optional[float] = None

class StakeCreateModel(StakeCreateModelIn):
    staker_id: str
    created_at : datetime = datetime.now()
    is_updated : Optional[bool] = False
    updated_at : Optional[datetime] = None
    is_deleted : Optional[bool] = False
    deleted_at : Optional[datetime] = None

class StakeUpdateBaseModel(BaseModel):
    poll_id: str
    range_begin: Optional[int] = None
    range_end: Optional[int] = None
    tokens_staked: Optional[int] = None
    reward: Optional[float] = None

class StakeUpdateModel(StakeUpdateBaseModel):
    is_updated : bool = False
    updated_at : Optional[datetime] = datetime.now()

class StakeModelOut(StakeCreateModelIn):
    id: OID = Field()