import logging
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException
from db.mongo.collections import APP_INFO
from db.mongo.mongo_base import MongoBase
from ..models.app_info import (
    InfoModel
)

class AppInfoCollection:
    def __init__(self):
        self.collection = MongoBase()
        self.collection(APP_INFO)


    async def update_info(
        self,
        info_title: str,
        info_value: str
    ) -> any:
        try:
            finder = {"title": info_title}
            updater = {
                "$set": {
                    "value": info_value,
                    "is_updated": True,
                    "updated_on": datetime.now()
                }
            }

            return await self.collection.find_one_and_modify(
                find=finder,
                update=updater,
                return_doc_id=True,
                extended_class_model=InfoModel,
                insert_if_not_found=True,
                return_updated_document=True,
            )
        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def get_app_info(
        self,
        info_title: str
    ) -> any:
        try:
            filter_condition = {"title": info_title}
            data = await self.collection.find_one(
                finder=filter_condition,
                return_doc_id=True,
                extended_class_model=InfoModel
            )
            return data if data else None
        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")