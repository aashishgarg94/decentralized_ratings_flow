import logging
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Security
from users.utils.authentication_user import get_current_active_user
from users.models.users import UserModel
from ..crud.stake import StakeCollection
from ..models.stake import (
    StakeCreateBaseModel,
    StakeUpdateBaseModel
)
router = APIRouter()


@router.post(
    "/v1/stake/add_user_stake",
    dependencies=[Security(get_current_active_user, scopes=["loggedin:write"])],
)
async def add_user_stake(
    stake_details: StakeCreateBaseModel,
    current_user: UserModel = Security(
        get_current_active_user,
        scopes=["loggedin:write"],
    ),
):
    try:
        stake_collection = StakeCollection()
        insert_id = await stake_collection.create_stake(staker_id = current_user.username, stake_details=stake_details)

        return { "InternalResponseCode": 0, "Message": "Stake successfully created", "data": str(insert_id) } if insert_id else { "InternalResponseCode": 1, "Message": "Stake not created", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.post(
    "/v1/stake/add_user_stake_by_admin",
    dependencies=[Security(get_current_active_user, scopes=["admin:write"])],
)
async def add_user_stake(
    stake_details: StakeCreateBaseModel,
    staker_id: str
):
    try:
        stake_collection = StakeCollection()
        insert_id = await stake_collection.create_stake(staker_id = staker_id, stake_details=stake_details)

        return { "InternalResponseCode": 0, "Message": "Stake successfully created", "data": str(insert_id) } if insert_id else { "InternalResponseCode": 1, "Message": "Stake not created", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.post(
    "/v1/stake/update_user_stake",
    dependencies=[Security(get_current_active_user, scopes=["loggedin:write"])],
)
async def update_user_stake(
    stake_update_details: StakeUpdateBaseModel,
    current_user: UserModel = Security(
        get_current_active_user,
        scopes=["loggedin:write"],
    ),
):
    try:
        stake_collection = StakeCollection()
        updated_stake = await stake_collection.update_poll(staker_id=current_user.username, stake_update_details=stake_update_details)

        return { "InternalResponseCode": 0, "Message": "Stake successfully updated", "data": stake_update_details.poll_id } if updated_stake else { "InternalResponseCode": 1, "Message": "Stake not updated", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.post(
    "/v1/stake/get_user_stake",
    dependencies=[Security(get_current_active_user, scopes=["loggedin:write"])],
)
async def get_user_stake(
    poll_id: str,
    current_user: UserModel = Security(
        get_current_active_user,
        scopes=["loggedin:write"],
    ),
):
    try:
        stake_collection = StakeCollection()
        stake = await stake_collection.get_user_stake(poll_id=poll_id, staker_id=current_user.username)

        return { "InternalResponseCode": 0, "Message": "Stake fetched", "data": stake } if stake else { "InternalResponseCode": 1, "Message": "Stake not fetched", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.post(
    "/v1/stake/get_all_stakes_for_user",
    dependencies=[Security(get_current_active_user, scopes=["loggedin:write"])],
)
async def get_all_stakes_for_user(
    current_user: UserModel = Security(
        get_current_active_user,
        scopes=["loggedin:write"],
    ),
):
    try:
        stake_collection = StakeCollection()
        stake = await stake_collection.get_all_stakes_for_user(staker_id=current_user.username)

        return { "InternalResponseCode": 0, "Message": "Stakes fetched", "data": stake } if stake else { "InternalResponseCode": 1, "Message": "Stakes not fetched", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.post(
    "/v1/stake/get_all_stakes_for_poll",
    dependencies=[Security(get_current_active_user, scopes=["loggedin:write"])],
)
async def get_all_stakes_for_poll(
    poll_id: str,
    current_user: UserModel = Security(
        get_current_active_user,
        scopes=["loggedin:write"],
    ),
):
    try:
        stake_collection = StakeCollection()
        stake = await stake_collection.get_all_stakes_for_poll(poll_id=poll_id)

        return { "InternalResponseCode": 0, "Message": "Stakes fetched", "data": stake } if stake else { "InternalResponseCode": 1, "Message": "Stakes not fetched", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")