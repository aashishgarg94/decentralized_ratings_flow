import logging
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException
from db.mongo.mongo_base import MongoBase
from master.models.master import BaseIsCreated
from db.mongo.mongo_model import OID
from ..crud.vote import VoteCollection
from ..crud.stake import StakeCollection
from ..crud.poll import PollCollection
from ..models.poll import (
    PollModelOut
)

class VoterCollection:
    def __init__(self):
        self.collection = MongoBase()

    async def get_all_voter_txns(
        self,
        voter_id: str
    ) -> any:
        try:
            vote_collection = VoteCollection()
            votes = await vote_collection.get_all_votes_for_user(voter_id=voter_id)
            vote_poll_ids = [vote.poll_id for vote in votes] if votes else []

            stake_collection = StakeCollection()
            stakes = await stake_collection.get_all_stakes_for_user(staker_id=voter_id)
            stakes_poll_ids = [stake.poll_id for stake in stakes] if stakes else []

            poll_ids = list(set(vote_poll_ids + stakes_poll_ids))

            poll_collection = PollCollection()
            polls = await poll_collection.get_all_polls_by_ids(poll_ids=poll_ids)

            data = []
            for poll in polls:
                poll_final = poll.dict()

                del poll_final["id"]
                poll_final["voter_vote"] = None
                poll_final["voter_vote_tokens_staked"] = None
                poll_final["staker_range_begin"] = None
                poll_final["staker_range_end"] = None
                poll_final["staker_tokens_staked"] = None
                poll_final["staker_reward"] = None

                if votes is not None:
                    poll_final["voter_vote"] = next((dictionary.dict().get("encrypted_vote") for dictionary in votes if dictionary.dict().get("poll_id") == poll_final["poll_id"]), None)
                    poll_final["voter_vote_tokens_staked"] = next((dictionary.dict().get("tokens_staked") for dictionary in votes if dictionary.dict().get("poll_id") == poll_final["poll_id"]), None)

                if stakes is not None:
                    poll_final["staker_range_begin"] = next((dictionary.dict().get("range_begin") for dictionary in stakes if dictionary.dict().get("poll_id") == poll_final["poll_id"]), None)
                    poll_final["staker_range_end"] = next((dictionary.dict().get("range_end") for dictionary in stakes if dictionary.dict().get("poll_id") == poll_final["poll_id"]), None)
                    poll_final["staker_tokens_staked"] = next((dictionary.dict().get("tokens_staked") for dictionary in stakes if dictionary.dict().get("poll_id") == poll_final["poll_id"]), None)
                    poll_final["staker_reward"] = next((dictionary.dict().get("reward") for dictionary in stakes if dictionary.dict().get("poll_id") == poll_final["poll_id"]), None)

                data.append(poll_final)

            return data if data else None

        except Exception:
            raise HTTPException(status_code=500, detail="Something went wrong")