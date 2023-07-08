import logging
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Security
from users.utils.authentication_user import get_current_active_user
from users.models.users import UserModel
from ..crud.vote import VoteCollection
from ..models.vote import (
    VoteCreateBaseModel,
    VoteUpdateBaseModel
)

router = APIRouter()


@router.post(
    "/v1/vote/create_vote",
    dependencies=[Security(get_current_active_user, scopes=["loggedin:write"])],
)
async def create_vote(
    vote_details: VoteCreateBaseModel,
    current_user: UserModel = Security(
        get_current_active_user,
        scopes=["loggedin:write"],
    )
):
    try:
        vote_collection = VoteCollection()
        insert_id = await vote_collection.create_vote(voter_id = current_user.username, vote_details=vote_details)

        return { "InternalResponseCode": 0, "Message": "Vote successfully created", "data": str(insert_id) } if insert_id else { "InternalResponseCode": 1, "Message": "Vote not created", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.post(
    "/v1/vote/update_vote",
    dependencies=[Security(get_current_active_user, scopes=["loggedin:write"])],
)
async def update_vote(
    vote_update_details: VoteUpdateBaseModel,
    current_user: UserModel = Security(
        get_current_active_user,
        scopes=["loggedin:write"],
    ),
):
    try:
        vote_collection = VoteCollection()
        updated_vote = await vote_collection.update_poll(voter_id=current_user.username, vote_update_details=vote_update_details)

        return { "InternalResponseCode": 0, "Message": "Vote successfully updated", "data": vote_update_details.poll_id } if updated_vote else { "InternalResponseCode": 1, "Message": "Vote not updated", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.post(
    "/v1/vote/get_user_vote",
    dependencies=[Security(get_current_active_user, scopes=["loggedin:write"])],
)
async def get_user_vote(
    poll_id: str,
    current_user: UserModel = Security(
        get_current_active_user,
        scopes=["loggedin:write"],
    ),
):
    try:
        vote_collection = VoteCollection()
        vote = await vote_collection.get_user_vote(poll_id=poll_id, voter_id=current_user.username)

        return { "InternalResponseCode": 0, "Message": "Vote fetched", "data": vote } if vote else { "InternalResponseCode": 1, "Message": "Vote not fetched", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")
    

@router.post(
    "/v1/vote/get_all_votes_for_user",
    dependencies=[Security(get_current_active_user, scopes=["loggedin:write"])],
)
async def get_all_votes_for_user(
    current_user: UserModel = Security(
        get_current_active_user,
        scopes=["loggedin:write"],
    ),
):
    try:
        vote_collection = VoteCollection()
        vote = await vote_collection.get_all_votes_for_user(voter_id=current_user.username)
        return { "InternalResponseCode": 0, "Message": "Votes fetched", "data": vote } if vote else { "InternalResponseCode": 1, "Message": "Votes not fetched", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")