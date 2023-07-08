from datetime import datetime, timedelta
from typing import List, Optional

from db.mongo.mongo_model import OID, MongoModel
from pydantic import BaseModel, Field


class ContentCreateBaseModel(MongoModel):
    content_code: str
    content_title: str
    category: str
    description: str
    image_url: str
    rating: Optional[float] = 0
    ratings_count: Optional[int] = 0

class ContentCreateModel(ContentCreateBaseModel):
    created_at : datetime = datetime.now()
    is_updated : Optional[bool] = False
    updated_at : Optional[datetime] = None
    is_deleted : Optional[bool] = False
    deleted_at : Optional[datetime] = None

class ContentModelOut(ContentCreateModel):
    id: OID = Field()