import logging
import random
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException
from db.mongo.collections import VOTE
from db.mongo.mongo_base import MongoBase
from master.models.master import BaseIsCreated
from db.mongo.mongo_model import OID
from ..models.vote import (
    VoteCreateBaseModel,
    VoteCreateModelIn,
    VoteCreateModel,
    VoteUpdateBaseModel,
    VoteUpdateModel,
    VoteModelOut
)

class VoteCollection:
    def __init__(self):
        self.collection = MongoBase()
        self.collection(VOTE)


    async def create_vote(
        self,
        voter_id: str,
        vote_details: VoteCreateBaseModel
    ) -> any:
        try:
            existing_vote = await self.get_user_vote(poll_id=vote_details.poll_id, voter_id=voter_id)
            if existing_vote is not None:
                return None

            vote_details_full = VoteCreateModelIn(
                **vote_details.dict(),
                voter_id=voter_id
            )

            insert_id = await self.collection.insert_one(
                vote_details_full.dict(),
                return_doc_id=True,
                extended_class_model=BaseIsCreated,
            )

            return insert_id if insert_id else None
        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def update_vote(
        self,
        voter_id: str,
        vote_update_details: VoteUpdateBaseModel
    ) -> any:
        try:
            vote = await self.get_user_vote(poll_id=vote_update_details.poll_id, voter_id=voter_id)
            if vote == None:
                return None

            update_details = VoteUpdateModel(**vote_update_details.dict(exclude_unset=True))
            update_details.is_updated = True
            update_details.updated_at = datetime.now()

            finder = {"poll_id": vote_update_details.poll_id, "voter_id": voter_id}
            updater = {"$set": update_details.dict(exclude_unset=True)}
            updated_vote = await self.collection.find_one_and_modify(
                find=finder,
                update=updater
            )

            return updated_vote if updated_vote else None
            
        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def get_user_vote(
        self,
        poll_id: str,
        voter_id: str
    ) -> any:
        try:
            finder = {"poll_id": poll_id, "voter_id": voter_id}

            vote = await self.collection.find_one(
                finder=finder,
                return_doc_id=True,
                extended_class_model=VoteModelOut
            )

            return vote if vote else None

        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")
        

    async def get_all_votes_for_user(
        self,
        voter_id: str
    ) -> any:
        try:
            finder = {"voter_id": voter_id}

            vote = await self.collection.find(
                finder=finder,
                return_doc_id=True,
                extended_class_model=VoteModelOut
            )

            return vote if vote else None

        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def get_all_votes_for_poll(
        self,
        poll_id: str
    ) -> any:
        try:
            finder = {"poll_id": poll_id}

            vote = await self.collection.find(
                finder=finder,
                return_doc_id=True,
                extended_class_model=VoteModelOut
            )

            return vote if vote else None

        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")