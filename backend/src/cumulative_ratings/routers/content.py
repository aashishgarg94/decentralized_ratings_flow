import logging
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Security
from users.utils.authentication_user import get_current_active_user
from users.models.users import UserModel
from datetime import datetime
from ..crud.content import ContentCollection
from ..models.content import (
    ContentCreateBaseModel,
)

router = APIRouter()


@router.post(
    "/v1/content/create_content",
    dependencies=[Security(get_current_active_user, scopes=["admin:write"])],
)
async def create_content(
    content_details: ContentCreateBaseModel
):
    try:
        content_collection = ContentCollection()
        insert_id = await content_collection.create_content(content_details=content_details)

        return { "InternalResponseCode": 0, "Message": "Content successfully created", "data": str(insert_id) } if insert_id else { "InternalResponseCode": 1, "Message": "Content not created", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.get(
    "/v1/content/get_all_content",
    dependencies=[Security(get_current_active_user, scopes=["guest:read"])],
)
async def get_all_content(
    category: Optional[str] = None
):
    try:
        content_collection = ContentCollection()
        data = await content_collection.get_all_content(category=category)

        return { "InternalResponseCode": 0, "Message": "Content successfully fetched", "data": data } if data else { "InternalResponseCode": 1, "Message": "Content not fetched", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.get(
    "/v1/content/get_content_by_code",
    dependencies=[Security(get_current_active_user, scopes=["guest:read"])],
)
async def get_content_by_code(
    content_code: str
):
    try:
        content_collection = ContentCollection()
        data = await content_collection.get_content_by_code(content_code=content_code)

        return { "InternalResponseCode": 0, "Message": "Content successfully fetched", "data": data } if data else { "InternalResponseCode": 1, "Message": "Content not fetched", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.get(
    "/v1/content/get_top_rated_content",
    dependencies=[Security(get_current_active_user, scopes=["guest:read"])],
)
async def get_top_rated_content(
    category: Optional[str] = None
):
    try:
        content_collection = ContentCollection()
        data = await content_collection.get_all_content(category=category, sorting_type="top_rated")

        return { "InternalResponseCode": 0, "Message": "Content successfully fetched", "data": data } if data else { "InternalResponseCode": 1, "Message": "Content not fetched", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.post(
    "/v1/content/update_cumulative_rating",
    dependencies=[Security(get_current_active_user, scopes=["admin:write"])],
)
async def update_cumulative_rating(
    content_code: str,
    epoch_avg_rating: float,
    ratings_added: int
):
    try:
        content_collection = ContentCollection()
        data = await content_collection.update_cumulative_rating(content_code=content_code, epoch_avg_rating=epoch_avg_rating, ratings_added=ratings_added)

        return { "InternalResponseCode": 0, "Message": "Rating successfully updated", "data": data } if data else { "InternalResponseCode": 1, "Message": "Rating not updated", "data": None }

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")