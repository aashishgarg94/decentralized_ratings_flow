import os
import urllib.parse
from motor.motor_asyncio import AsyncIOMotorClient

from .mongodb import db


async def connect_to_mongo():
    prod_db = "mongodb+srv://" + os.environ.get("MONGODBUSER") + ":" + urllib.parse.quote(os.environ.get("MONGODBPASSWORD")) + "@" + os.environ.get("MONGODBURL") + "?retryWrites=true&w=majority"

    db.client = AsyncIOMotorClient(
        str(
            prod_db
        ),
        maxPoolSize=10,
        minPoolSize=10,
    )

async def close_mongo_connection():
    db.client.close()