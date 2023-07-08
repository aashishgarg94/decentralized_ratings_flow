import logging
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException
from db.mongo.collections import POLL
from db.mongo.mongo_base import MongoBase
from master.models.master import BaseIsCreated
from db.mongo.mongo_model import OID
from ..models.poll import (
    PollCreateBaseModel,
    PollCreateModel,
    PollUpdateBaseModel,
    PollUpdateModel,
    PollModelOut
)

class PollCollection:
    def __init__(self):
        self.collection = MongoBase()
        self.collection(POLL)


    async def create_poll(
        self,
        poll_details: PollCreateBaseModel
    ) -> any:
        try:
            existing_poll = await self.get_poll_by_id(poll_id=poll_details.poll_id)
            if existing_poll is not None:
                return None

            poll_details_full = PollCreateModel(
                **poll_details.dict()
            )

            insert_id = await self.collection.insert_one(
                poll_details_full.dict(),
                return_doc_id=True,
                extended_class_model=BaseIsCreated,
            )

            return insert_id if insert_id else None
        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def create_new_poll_for_existing_group(
        self,
        poll_id: str,
        poll_group_id: str,
        begin_date: datetime,
        staking_deadline: datetime,
        end_date: datetime
    ) -> any:
        try:
            existing_poll = await self.get_poll_by_id(poll_id=poll_id)
            if existing_poll is not None:
                return None

            latest_group_poll = await self.get_latest_poll_by_group_id(poll_group_id=poll_group_id)
            if latest_group_poll is None:
                return None

            poll_details_full = PollCreateModel(
                poll_id = poll_id,
                poll_group_id = poll_group_id,
                group_poll_number = latest_group_poll.group_poll_number + 1,
                poll_title = latest_group_poll.poll_title,
                options = latest_group_poll.options,
                begin_date = begin_date,
                staking_deadline = staking_deadline,
                end_date = end_date,
                public_key = latest_group_poll.public_key,
                secret = latest_group_poll.secret,
                nonce = latest_group_poll.nonce,
                category_code = latest_group_poll.category_code,
                category_name = latest_group_poll.category_name,
                sort_priority = latest_group_poll.sort_priority,
                description = latest_group_poll.description,
                description_images = latest_group_poll.description_images,
                tags = latest_group_poll.tags
            )
            
            insert_id = await self.collection.insert_one(
                poll_details_full.dict(),
                return_doc_id=True,
                extended_class_model=BaseIsCreated,
            )

            return insert_id if insert_id else None
        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def update_poll(
        self,
        poll_update_details: PollUpdateBaseModel
    ) -> any:
        try:
            poll = await self.get_poll_by_id(poll_id=poll_update_details.poll_id)
            if poll == None:
                return None

            update_details = PollUpdateModel(**poll_update_details.dict(exclude_unset=True))
            update_details.is_updated = True
            update_details.updated_at = datetime.now()

            finder = {"poll_id": poll_update_details.poll_id}
            updater = {"$set": update_details.dict(exclude_unset=True)}
            updated_poll = await self.collection.find_one_and_modify(
                find=finder,
                update=updater
            )

            return updated_poll if updated_poll else None

        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def get_all_polls(
            self,
            poll_group_id: Optional[str] = None,
            end_date: Optional[datetime] = None
        ) -> any:
        try:
            filter_condition = {"is_deleted": False}

            if poll_group_id is not None:
                filter_condition["poll_group_id"] = poll_group_id

            if end_date is not None:
                filter_condition["end_date"] = {"$gte": end_date}

            sort = [("created_at", -1)]
            data = await self.collection.find(
                finder=filter_condition,
                return_doc_id=True,
                sort=sort,
                extended_class_model=PollModelOut,
            )

            return data if data else None

        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def get_poll_by_id(
        self,
        poll_id: str
    ) -> any:
        try:
            finder = {"poll_id": poll_id}

            poll = await self.collection.find_one(
                finder=finder,
                return_doc_id=True,
                extended_class_model=PollModelOut
            )

            return poll if poll else None

        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def get_latest_poll_by_group_id(
        self,
        poll_group_id: str
    ) -> any:
        try:
            finder = {"poll_group_id": poll_group_id}
            sort = [("group_poll_number", -1)]

            polls = await self.collection.find(
                finder=finder,
                sort=sort,
                return_doc_id=True,
                extended_class_model=PollModelOut
            )

            return polls[-1] if polls and len(polls) > 0 else None

        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def get_all_polls_by_ids(
            self,
            poll_ids: list
        ) -> any:
        try:
            if len(poll_ids) > 0:
                poll_ids_filter_array = [{"poll_id": poll_id} for poll_id in poll_ids]

                filter_condition = {"$or": poll_ids_filter_array}
                sort = [("sort_priority", -1)]
                data = await self.collection.find(
                    finder=filter_condition,
                    return_doc_id=True,
                    sort=sort,
                    extended_class_model=PollModelOut,
                )

                return data if data else []
            else:
                return []

        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")