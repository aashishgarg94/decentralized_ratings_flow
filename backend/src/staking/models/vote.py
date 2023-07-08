from datetime import datetime
from typing import List, Optional

from db.mongo.mongo_model import OID, MongoModel
from pydantic import BaseModel, Field


class VoteCreateBaseModel(MongoModel):
    poll_id: str
    encrypted_vote: str
    tokens_staked: int
    revealed_vote: Optional[int] = None

class VoteCreateModelIn(VoteCreateBaseModel):
    voter_id: str

class VoteCreateModel(VoteCreateModelIn):
    voter_id: str
    created_at : datetime = datetime.now()
    is_updated : Optional[bool] = False
    updated_at : Optional[datetime] = None
    is_deleted : Optional[bool] = False
    deleted_at : Optional[datetime] = None

class VoteUpdateBaseModel(BaseModel):
    poll_id: str
    encrypted_vote: Optional[str] = None
    tokens_staked: Optional[int] = None
    revealed_vote: Optional[int] = None

class VoteUpdateModel(VoteUpdateBaseModel):
    is_updated : bool = False
    updated_at : Optional[datetime] = datetime.now()

class VoteModelOut(VoteCreateModelIn):
    id: OID = Field()