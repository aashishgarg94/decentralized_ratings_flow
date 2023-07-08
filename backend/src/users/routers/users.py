from typing import Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status, Security
from ..utils.authentication_user import get_current_active_user
from ..crud.users import MongoDBUserDatabase
from master.models.master import BaseIsDisabled, BaseIsDeleted
from ..models.users import (
    UserInModel,
    UserModel,
    UserUpdateCls,
    UserUpdateModel,
    UserUpdateOutModel,
)


router = APIRouter()

@router.get(
    "/v1/user/me",
    response_model=UserModel,
    dependencies=[Security(get_current_active_user, scopes=["guest:read"])],
)
async def read_user_me(
    current_user: UserModel = Security(
        get_current_active_user,
        scopes=["guest:read"],
    )
):
    try:
        return current_user
    except Exception as e:
        raise e

@router.get(
    "/v1/user/get_user",
    response_model=UserModel,
    dependencies=[Security(get_current_active_user, scopes=["admin:read"])],
)
async def get_user(
    username: str
):
    try:
        user_db = MongoDBUserDatabase(UserInModel)
        user = await user_db.find_by_username(username=username)
        return user
    except Exception as e:
        raise e


@router.get(
    "/v1/user/delete/me",
    response_model=BaseIsDeleted,
    dependencies=[Security(get_current_active_user, scopes=["loggedin:write"])],
)
async def disable_user_me(
    current_user: UserModel = Security(
        get_current_active_user,
        scopes=["loggedin:write"],
    )
):
    try:
        user_db = MongoDBUserDatabase(UserInModel)
        response = await user_db.delete_one(current_user.username)
        return response
    except Exception as e:
        raise e


@router.get(
    "/v1/user/disable_user_by_id",
    response_model=BaseIsDisabled,
    dependencies=[Security(get_current_active_user, scopes=["admin:write"])],
)
async def disable_user_by_id(
    user_id: str
):
    try:
        user_db = MongoDBUserDatabase(UserInModel)
        response = await user_db.disable_user_by_id(user_id)
        return response
    except Exception as e:
        raise e


@router.get(
    "/v1/user/enable_user_by_id",
    response_model=BaseIsDisabled,
    dependencies=[Security(get_current_active_user, scopes=["admin:write"])],
)
async def enable_user_by_id(
    user_id: str
):
    try:
        user_db = MongoDBUserDatabase(UserInModel)
        response = await user_db.enable_user_by_id(user_id)
        return response
    except Exception as e:
        raise e


@router.post(
    "/v1/user/update_fcm_token_and_device_id",
    dependencies=[Security(get_current_active_user, scopes=["guest:read"])],
)
async def update_fcm_token_and_device_id(
    fcm_token: Optional[str]= None,
    device_id: Optional[str]= None,
    current_user: UserModel = Security(
        get_current_active_user,
        scopes=["guest:read"],
    )
):
    try:
        user_db = MongoDBUserDatabase(UserInModel)
        return await user_db.update_fcm_token_and_device_id(username=current_user.username, fcm_token=fcm_token, device_id=device_id)
    except Exception as e:
        raise e


@router.get(
    "/v1/user/remove_user",
    dependencies=[Security(get_current_active_user, scopes=["admin:write"])],
)
async def remove_user_by_id(
    user_id: str
):
    try:
        user_db = MongoDBUserDatabase(UserInModel)
        response = await user_db.remove_user_by_id(user_id)
        return response
    except Exception as e:
        raise e
