from fastapi import APIRouter
from ..utils.jwt_handler import get_password_hash
from ..models.users import UserModel

from ..crud.login import ( register_user_crud )

router = APIRouter()


@router.post(
    "/v1/register",
)
async def register(user: UserModel):
    return await register_user_crud(user)