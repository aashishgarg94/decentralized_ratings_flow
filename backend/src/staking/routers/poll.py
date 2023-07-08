import logging
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Security
from users.utils.authentication_user import get_current_active_user
from users.models.users import UserModel
from datetime import datetime
from ..crud.poll import PollCollection
from ..crud.stake import StakeCollection
from ..crud.vote import VoteCollection
from ..models.poll import (
    PollCreateBaseModel,
    PollUpdateBaseModel
)

router = APIRouter()


@router.post(
    "/v1/poll/create_poll",
    dependencies=[Security(get_current_active_user, scopes=["admin:write"])],
)
async def create_poll(
    poll_details: PollCreateBaseModel
):
    try:
        poll_collection = PollCollection()
        insert_id = await poll_collection.create_poll(poll_details=poll_details)

        return { "InternalResponseCode": 0, "Message": "Poll successfully created", "data": str(insert_id) } if insert_id else { "InternalResponseCode": 1, "Message": "Poll not created", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.post(
    "/v1/poll/create_new_poll_for_existing_group",
    dependencies=[Security(get_current_active_user, scopes=["admin:write"])],
)
async def create_new_poll_for_existing_group(
    poll_id: str,
    poll_group_id: str,
    begin_date: datetime,
    staking_deadline: datetime,
    end_date: datetime
):
    try:
        poll_collection = PollCollection()
        insert_id = await poll_collection.create_new_poll_for_existing_group(poll_id=poll_id, poll_group_id=poll_group_id, begin_date=begin_date, staking_deadline=staking_deadline, end_date=end_date)

        return { "InternalResponseCode": 0, "Message": "Poll successfully created", "data": str(insert_id) } if insert_id else { "InternalResponseCode": 1, "Message": "Poll not created", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.post(
    "/v1/poll/update_poll",
    dependencies=[Security(get_current_active_user, scopes=["admin:write"])],
)
async def update_poll(
    poll_update_details: PollUpdateBaseModel
):
    try:
        poll_collection = PollCollection()
        updated_poll = await poll_collection.update_poll(poll_update_details=poll_update_details)

        return { "InternalResponseCode": 0, "Message": "Poll successfully updated", "data": poll_update_details.poll_id } if updated_poll else { "InternalResponseCode": 1, "Message": "Poll not updated", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.get(
    "/v1/poll/get_all_polls",
    dependencies=[Security(get_current_active_user, scopes=["guest:read"])],
)
async def get_all_polls(
    poll_group_id: Optional[str] = None
):
    try:
        poll_collection = PollCollection()
        poll_list = await poll_collection.get_all_polls(poll_group_id=poll_group_id)

        return { "InternalResponseCode": 0, "Message": "Polls fetched", "data": poll_list } if poll_list else { "InternalResponseCode": 1, "Message": "Polls not fetched", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.get(
    "/v1/poll/get_all_active_polls",
    dependencies=[Security(get_current_active_user, scopes=["guest:read"])],
)
async def get_all_active_polls(
    poll_group_id: Optional[str] = None
):
    try:
        poll_collection = PollCollection()
        poll_list = await poll_collection.get_all_polls(poll_group_id=poll_group_id, end_date=datetime.now())
                                                        
        return { "InternalResponseCode": 0, "Message": "Polls fetched", "data": poll_list } if poll_list else { "InternalResponseCode": 1, "Message": "Polls not fetched", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")
    

@router.get(
    "/v1/poll/get_poll_by_id",
    dependencies=[Security(get_current_active_user, scopes=["guest:read"])],
)
async def get_poll_by_id(
    poll_id: str
):
    try:
        poll_collection = PollCollection()
        poll = await poll_collection.get_poll_by_id(poll_id=poll_id)

        return { "InternalResponseCode": 0, "Message": "Poll fetched", "data": poll } if poll else { "InternalResponseCode": 1, "Message": "Poll not fetched", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")