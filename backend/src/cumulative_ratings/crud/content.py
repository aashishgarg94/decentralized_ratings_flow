import logging
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException
from db.mongo.collections import CONTENT
from db.mongo.mongo_base import MongoBase
from master.models.master import BaseIsCreated
from db.mongo.mongo_model import OID
from ..models.content import (
    ContentCreateBaseModel,
    ContentCreateModel,
    ContentModelOut
)

class ContentCollection:
    def __init__(self):
        self.collection = MongoBase()
        self.collection(CONTENT)


    async def create_content(
        self,
        content_details: ContentCreateBaseModel
    ) -> any:
        try:
            existing_content = await self.get_content_by_code(content_code=content_details.content_code)
            if existing_content is not None:
                return None

            content_details_full = ContentCreateModel(
                **content_details.dict()
            )

            insert_id = await self.collection.insert_one(
                content_details_full.dict(),
                return_doc_id=True,
                extended_class_model=BaseIsCreated,
            )

            return insert_id if insert_id else None
        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def get_all_content(
            self,
            category: Optional[str] = None,
            sorting_type: Optional[str] = None
        ) -> any:
        try:
            filter_condition = {"is_deleted": False}

            if category is not None:
                filter_condition["category"] = category

            sort = [("created_at", -1)]

            if sorting_type == "top_rated":
                sort = [("rating", -1)]

            data = await self.collection.find(
                finder=filter_condition,
                return_doc_id=True,
                sort=sort,
                extended_class_model=ContentModelOut,
            )

            return data if data else None

        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def get_content_by_code(
        self,
        content_code: str
    ) -> any:
        try:
            finder = {"content_code": content_code}

            content = await self.collection.find_one(
                finder=finder,
                return_doc_id=True,
                extended_class_model=ContentModelOut
            )

            return content if content else None

        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def update_cumulative_rating(
        self,
        content_code: str,
        epoch_avg_rating: float,
        ratings_added: int
    ) -> any:
        try:
            if ratings_added <= 0:
                return None

            content = await self.get_content_by_code(content_code=content_code)
            if content is None:
                return None

            new_ratings_count = content.ratings_count + ratings_added if ( content.ratings_count + ratings_added ) > 0 else 0
            new_rating = (content.rating * content.ratings_count + epoch_avg_rating * ratings_added) / new_ratings_count if new_ratings_count > 0 else 0

            content.is_updated = True
            content.updated_at = datetime.now()
            content.rating = new_rating
            content.ratings_count = new_ratings_count

            finder = {"content_code": content_code}
            updater = {"$set": content.dict()}

            updated_content = await self.collection.find_one_and_modify(
                find=finder,
                update=updater
            )

            return updated_content if updated_content else None
        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")