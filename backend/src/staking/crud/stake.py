import logging
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException
from db.mongo.collections import STAKE
from db.mongo.mongo_base import MongoBase
from master.models.master import BaseIsCreated
from db.mongo.mongo_model import OID
from ..models.stake import (
    StakeCreateBaseModel,
    StakeCreateModelIn,
    StakeCreateModel,
    StakeUpdateBaseModel,
    StakeUpdateModel,
    StakeModelOut
)
from .poll import PollCollection

class StakeCollection:
    def __init__(self):
        self.collection = MongoBase()
        self.collection(STAKE)


    async def create_stake(
        self,
        staker_id: str,
        stake_details: StakeCreateBaseModel
    ) -> any:
        try:
            existing_stake = await self.get_user_stake(poll_id=stake_details.poll_id, staker_id=staker_id)
            if existing_stake is not None:
                return None

            stake_details_full = StakeCreateModelIn(
                **stake_details.dict(),
                staker_id=staker_id
            )

            insert_id = await self.collection.insert_one(
                stake_details_full.dict(),
                return_doc_id=True,
                extended_class_model=BaseIsCreated,
            )

            return insert_id if insert_id else None
        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def update_stake(
        self,
        staker_id: str,
        stake_update_details: StakeUpdateBaseModel
    ) -> any:
        try:
            stake = await self.get_user_stake(poll_id=stake_update_details.poll_id, staker_id=staker_id)
            if stake == None:
                return None

            update_details = StakeUpdateModel(**stake_update_details.dict(exclude_unset=True))
            update_details.is_updated = True
            update_details.updated_at = datetime.now()

            finder = {"poll_id": stake_update_details.poll_id, "staker_id": staker_id}
            updater = {"$set": update_details.dict(exclude_unset=True)}
            updated_stake = await self.collection.find_one_and_modify(
                find=finder,
                update=updater
            )

            return updated_stake if updated_stake else None
            
        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def get_user_stake(
        self,
        poll_id: str,
        staker_id: str
    ) -> any:
        try:
            finder = {"poll_id": poll_id, "staker_id": staker_id}

            stake = await self.collection.find_one(
                finder=finder,
                return_doc_id=True,
                extended_class_model=StakeModelOut
            )

            return stake if stake else None

        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def get_all_stakes_for_user(
        self,
        staker_id: str
    ) -> any:
        try:
            finder = {"staker_id": staker_id}

            stake = await self.collection.find(
                finder=finder,
                return_doc_id=True,
                extended_class_model=StakeModelOut
            )

            return stake if stake else None

        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def get_all_stakes_for_poll(
        self,
        poll_id: str
    ) -> any:
        try:
            finder = {"poll_id": poll_id}

            stake = await self.collection.find(
                finder=finder,
                return_doc_id=True,
                extended_class_model=StakeModelOut
            )

            return stake if stake else None

        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")