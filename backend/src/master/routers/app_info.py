import logging
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Security
from users.utils.authentication_user import get_current_active_user
from ..crud.app_info import ( AppInfoCollection)
from ..models.app_info import (
    InfoModel
 )

router = APIRouter()


@router.post(
    "/v1/update_app_info",
    dependencies=[Security(get_current_active_user, scopes=["admin:write"])],
)
async def update_app_info(
    app_info: InfoModel
):
    try:
        app_info_collection = AppInfoCollection()

        return await app_info_collection.update_info(info_title=app_info.title, info_value=app_info.value)
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.get(
    "/v1/get_app_info",
    response_model=InfoModel
)
async def get_app_info(
    info_title: str
):
    try:
        app_info_collection = AppInfoCollection()

        app_info = await app_info_collection.get_app_info(info_title=info_title)

        return app_info
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")