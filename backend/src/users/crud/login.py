from fastapi import HTTPException, status
from ..utils import authentication_user
from ..utils.constants import USER_ALREADY_EXISTS
import os
from ..crud.users import MongoDBUserDatabase
from ..models.users import ( UserModel, UserInModel )
from users.utils.constants import REGISTER_TYPES
from ..utils.jwt_handler import get_password_hash

async def login_user_crud(
    username,
    password,
    enable_user
):
    try:
        user, scopes = await authentication_user.authenticate(username, password, enable_user)
        if user == False:
            return {
                "internalResponseCode": 1,
                "details": "Username or Password is wrong"
            }

        if user.is_disabled is True:
            return {
                "internalResponseCode": 2,
                "details": "User is disabled"
            }

        if user.is_deleted is True:
            return {
                "internalResponseCode": 3,
                "details": "User is deleted"
            }
        
        access_token = await authentication_user.get_token(user=user, scopes=scopes)
        return {
            "internalResponseCode": 0,
            "access_token": access_token, 
            "token_type": "bearer"
        }
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong while login ")


async def register_user_crud(
    user: UserModel
):
    user_db = MongoDBUserDatabase(UserInModel)

    if user.register_type not in REGISTER_TYPES:
        return {
            "internal_response_code": 1,
            "message": "Incorrect register type",
        }

    if user.wallet_id != user.username:
        return {
            "internal_response_code": 1,
            "message": "Wallet ID does not match the username"
        }

    username_hash = await user_db.get_username_hash(username=user.username.lower())

    user.username = username_hash
    user_db.username = username_hash
    user_db.password = os.environ.get("PASSWORD")
    existing_user = await user_db.find_by_username(username_hash)

    if existing_user is not None:
        return {
            "internal_response_code": 1,
            "message": "USER_ALREADY_REGISTERED",
        }

    hashed_password = get_password_hash(user_db.password, user_db.username)

    db_user = UserInModel(
        **user.dict(),
        hashed_password=hashed_password
    )

    result = await user_db.create_user(db_user)

    if result is False:
        raise HTTPException(status_code=400, detail="Not able to process")
    return {"internal_response_code": 0, "message": result}


async def login_or_create_crud(
        username: str,
        password: str,
        wallet_id: str
):
    try:
        login_response = await login_user_crud(wallet_id, password, False)
        if login_response['internalResponseCode'] == 0:
            return login_response
        else:
            user_data = UserModel(
                username=username,
                wallet_id=wallet_id,
                register_type="wallet"
            )
            register_response = await register_user_crud(user_data)
            if register_response["internal_response_code"] == 0:
                return await login_user_crud(wallet_id, password, False)
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong while login ")


async def refresh_token_crud(
    current_user
):
    try:
        scopes, user = await authentication_user.get_user_and_scope(current_user)

        if user.is_disabled is True:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=USER_ALREADY_EXISTS,
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = await  authentication_user.get_token(user=user, scopes=scopes)
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong while fetching refresh token")