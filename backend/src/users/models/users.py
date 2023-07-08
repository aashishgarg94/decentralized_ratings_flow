from datetime import datetime
from enum import Enum
from typing import List, Optional, TypeVar

from db.mongo.mongo_model import OID, MongoModel
from master.models.master import BaseFullNameModel
from pydantic import BaseModel, Field, EmailStr, typing


class UserProof(BaseModel):
    name: Optional[str] = None
    is_uploaded: Optional[bool] = False


class UserModel(BaseModel):
    username: str
    full_name: Optional[BaseFullNameModel] = None
    email: Optional[EmailStr] = None
    mobile_number: Optional[str] = None
    wallet_id: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    country: Optional[str] = None
    profile_image: Optional[str] = None
    guest_id: Optional[str] = None
    device_id: Optional[List[str]] = None
    fcm_token: Optional[List[str]] = None
    preferred_categories: Optional[List[str]] = None
    gender: Optional[str] = None
    dob: Optional[str] = None
    register_type: Optional[str] = None
    user_level: Optional[int] = None

class UserInModel(UserModel):
    hashed_password: str
    is_disabled: Optional[bool] = False
    is_deleted: Optional[bool] = False
    is_admin: Optional[bool] = False
    is_support: Optional[bool] = False
    is_guest: Optional[bool] = False
    created_on: Optional[datetime] = None
    disabled_on: Optional[datetime] = None
    deleted_on: Optional[datetime] = None
    

class Config:
    orm_mode = True


UD = TypeVar("UD", bound=UserInModel)


class UserOutModel(UserInModel, MongoModel):
    id: OID = Field()


class UserUpdateModel(MongoModel):
    full_name: Optional[BaseFullNameModel]
    mobile_number: Optional[str]
    email: Optional[EmailStr] = None
    wallet_id: Optional[str] = None
    gender: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    country: Optional[str] = None
    profile_image: Optional[str] = None
    preferred_categories: Optional[List[str]] = None
    dob: Optional[str] = None
    user_level: Optional[int] = None

class UserUpdateCls(UserUpdateModel):
    username: Optional[str]
    is_updated: Optional[bool] = True
    is_disabled: Optional[bool] = False
    is_deleted: Optional[bool] = False
    updated_on: Optional[datetime] = None
    disabled_on: Optional[datetime] = None
    deleted_on: Optional[datetime] = None


class UserUpdateOutModel(UserUpdateCls):
    id: OID = Field()
