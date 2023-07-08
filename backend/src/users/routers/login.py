import os
from typing import Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Security
from ..utils.authentication_user import get_current_active_user
from ..crud.login import (
    login_user_crud,
    login_or_create_crud,
    refresh_token_crud
)
from ..models.users import (
    UserModel
)
import jwt
from fastapi.security import OAuth2PasswordRequestForm
from ..utils.jwt_handler import Token

router = APIRouter()


@router.post("/v1/login")
async def login(
    credentials: OAuth2PasswordRequestForm = Depends(),
    enable_user: Optional[bool] = False
):
    try:
        return await login_user_crud(credentials.username, credentials.password, enable_user)

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong while login ")


@router.post("/v1/login_or_create")
async def login_or_create(
    wallet_id: str,
    credentials: OAuth2PasswordRequestForm = Depends()
):
    try:
        return await login_or_create_crud(username = credentials.username, password = os.environ.get('PASSWORD'), wallet_id = wallet_id)

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong while login ")


@router.post(
    "/v1/refresh_token", 
    response_model=Token,
    dependencies=[Security(get_current_active_user, scopes=["loggedin:write"])],
)
async def refresh_token(
    current_user: UserModel = Security(
        get_current_active_user,
        scopes=["loggedin:write"],
    ),
):
    try:
        return await refresh_token_crud(current_user)
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong while fetching refresh token")