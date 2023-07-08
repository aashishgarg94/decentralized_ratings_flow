import logging

from fastapi import APIRouter

router = APIRouter()


@router.post(
    "/ui_text",
)
async def ui_text(text_field: str):
    text = []
    
    if text_field == "login_skip_confirmation":
        text = ["Are you sure you want to skip this step, we can tailor the feed to your preference if you login."]

    return text