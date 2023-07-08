import logging
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Security
from users.utils.authentication_user import get_current_active_user
from users.models.users import UserModel
from ..crud.voter import VoterCollection

router = APIRouter()


@router.post(
    "/v1/voter/get_all_voter_txns",
    dependencies=[Security(get_current_active_user, scopes=["loggedin:write"])],
)
async def get_all_voter_txns(
    current_user: UserModel = Security(
        get_current_active_user,
        scopes=["loggedin:write"],
    ),
):
    try:

        voter_collection = VoterCollection()
        data = await voter_collection.get_all_voter_txns(voter_id=current_user.username)

        return { "InternalResponseCode": 0, "Message": "Txns fetched", "data": data } if data else { "InternalResponseCode": 1, "Message": "Txns not fetched", "data": data }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")