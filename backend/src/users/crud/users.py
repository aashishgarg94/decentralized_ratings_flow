import logging
from datetime import datetime
from typing import List, Optional, Type
from db.mongo.mongo_model import OID
from bson import ObjectId
from fastapi import HTTPException
from db.mongo.collections import USERS
from master.models.master import BaseIsCreated, BaseIsDisabled, BaseIsDeleted, BaseIsUpdated
from ..models.users import (
    UD,
    UserInModel,
    UserModel,
    UserOutModel,
    UserUpdateCls,
    UserUpdateOutModel,
    BaseFullNameModel,
)
from hashlib import blake2b    
import base64
import os
from db.mongo.mongo_base import MongoBase, return_id_transformation


class MongoDBUserDatabase:
    def __init__(self, user_db_model: Type[UD]):
        self.user_db_model = user_db_model
        self.collection = MongoBase()
        self.collection(USERS)

    async def find_by_object_id(self, user_id: ObjectId) -> Optional[UD]:
        try:
            return await self.collection.find_one(
                {"_id": user_id},
                return_doc_id=True,
                extended_class_model=UserOutModel,
            )
        except Exception as e:
            raise e

    async def find_by_email(self, email: str) -> Optional[UD]:
        try:
            return await self.collection.find_one(
                {"email": email},
                return_doc_id=True,
                extended_class_model=UserOutModel,
            )
        except Exception as e:
            raise e

    async def find_by_username(self, username: str) -> Optional[UD]:
        try:
            return await self.collection.find_one(
                {"username": username},
                return_doc_id=True,
                extended_class_model=UserOutModel,
            )
        except Exception as e:
            raise e

    async def find_by_mobile_number(self, mobile_number: str) -> Optional[UD]:
        try:
            return await self.collection.find_one(
                {"mobile_number": mobile_number},
                return_doc_id=True,
                extended_class_model=UserOutModel,
            )
        except Exception as e:
            raise e

    async def find_by_wallet_id(self, wallet_id: str) -> Optional[UD]:
        try:
            return await self.collection.find_one(
                {"wallet_id": wallet_id},
                return_doc_id=True,
                extended_class_model=UserOutModel,
            )
        except Exception as e:
            raise e

    async def create_user(self, user: UserInModel) -> BaseIsCreated:
        try:
            user.created_on = datetime.now()
            result = await self.collection.insert_one(
                user.dict(), return_doc_id=True, extended_class_model=BaseIsCreated
            )
            return BaseIsCreated(id=result, is_created=True) if result else None
        except Exception as e:
            raise e

    async def disable_user_by_id(self, user_id: str) -> BaseIsDisabled:
        try:
            find = {"_id": ObjectId(user_id)}
            updater = {"$set": {"is_disabled": True, "disabled_on": datetime.now()}}
            result = await self.collection.find_one_and_modify(
                find,
                update=updater,
                return_doc_id=True,
                extended_class_model=BaseIsDisabled,
            )
            data = result if result else None
            return data
        except Exception as e:
            raise e

    async def enable_user_by_id(self, user_id: str) -> BaseIsDisabled:
        try:
            find = {"_id": ObjectId(user_id)}
            updater = {"$set": {"is_disabled": False}}
            result = await self.collection.find_one_and_modify(
                find,
                update=updater,
                return_doc_id=True,
                extended_class_model=BaseIsDisabled,
            )
            data = result if result else None
            return data
        except Exception as e:
            raise e

    async def delete_one(self, username: str) -> BaseIsDeleted:
        try:
            find = {"username": username}
            updater = {"$set": {"is_deleted": True, "deleted_on": datetime.now()}}
            result = await self.collection.find_one_and_modify(
                find,
                update=updater,
                return_doc_id=True,
                extended_class_model=BaseIsDeleted,
            )
            return {"internal_response_code": 0, "message": "success", "data": None} if result else {"internal_response_code": 0, "message": "success", "data": None}
        except Exception as e:
            raise e
    
    async def undelete_one(self, username: str) -> BaseIsDeleted:
        try:
            find = {"username": username}
            updater = {"$set": {"is_deleted": False}}
            result = await self.collection.find_one_and_modify(
                find,
                update=updater,
                return_doc_id=True,
                extended_class_model=BaseIsDeleted,
            )
            return {"internal_response_code": 0, "message": "success", "data": None} if result else {"internal_response_code": 0, "message": "success", "data": None}
        except Exception as e:
            raise e

    async def update_profile_image_path(self, user_id, s3_path):
        try:
            find = {"_id": ObjectId(user_id)}
            user = await self.collection.find_one_and_modify(
                find,
                {"$set": {"profile_image": s3_path}},
                return_doc_id=False,
                return_updated_document=True,
            )

            return (
                {"is_profile_image_updated": True}
                if user
                else {"is_profile_image_updated": False}
            )
        except Exception as e:
            raise e

    async def update_fcm_token_and_device_id(
        self, 
        username: str,
        fcm_token: Optional[str] = None,
        device_id: Optional[str] = None
    ) -> BaseIsUpdated:
        try:
            fields = {}
            if device_id != None:
                fields["device_id"] = [device_id]
            if fcm_token != None:
                fields["fcm_token"] = [fcm_token]
            updater = {
                "$set": fields
            }
            find = {"username": username}
            user = await self.collection.find_one_and_modify(
                find,
                update=updater,
                return_doc_id=False,
                return_updated_document=True,
            )
            data = BaseIsUpdated(username=username, is_updated=True) if user else None
            return data
        except Exception as e:
            raise e
    
    async def get_username_hash(
        self,
        username: str
    ) -> any:
        try:
            secret_key = base64.b64encode(bytes(os.environ.get("USERNAME_PRIVATE_KEY"), 'utf-8'))
            h = blake2b(key=secret_key, digest_size=5)
            username_bytes = base64.b64encode(bytes(username, 'utf-8'))
            h.update(username_bytes)
            return h.hexdigest()
        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")


    async def find_by_guest_id(self, guest_id: str) -> Optional[UD]:
        try:
            return await self.collection.find_one(
                {"guest_id": guest_id},
                return_doc_id=True,
                extended_class_model=UserOutModel,
            )
        except Exception as e:
            raise e

    
    async def remove_user_by_id(self, user_id=str) -> any:
        try:
            finder = {
                "_id":  ObjectId(user_id)
            }
            return await self.collection.delete_one(finder)
        except Exception as e:
            raise e