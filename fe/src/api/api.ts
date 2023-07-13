import axios, { AxiosResponse } from 'axios';
import { PollCreateBaseModel } from '../models/PollCreateBaseModel';
import { LoginInput } from '../models/LoginInput'
import { LoginDetails } from '../models/LoginDetails'
import qs from 'qs';
import { StakeState } from '../models/StakeState';

const BASEURL = "https://suiratings.w3bber.com/v1"

export const login = async (loginInput: LoginInput) => {
    console.log(loginInput);
    const api_call: string = `${BASEURL}/login_or_create?wallet_id=${loginInput.username}`
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accept': 'application/json',
        },
    };
    return axios.post<LoginDetails>(api_call, qs.stringify(loginInput), config);
};

export const getPolls = async (bearerToken: string) => {
    const api_call: string = `${BASEURL}/poll/get_all_polls`
    const config = {
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'accept': 'application/json',
        },
    };
    return axios.get(api_call, config);
}

export const getActivePolls = async (bearerToken: string) => {
    if(bearerToken === ""){
        return;
    }
    const api_call: string = `${BASEURL}/poll/get_all_active_polls`
    const config = {
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'accept': 'application/json',
        },
    };
    console.log(api_call, config);
    return axios.get(api_call, config);
}

export const castVote = async (bearerToken: string, poll_id: string, encrypted_vote: string) => {
    const api_call: string = `${BASEURL}/vote/create_vote`
    const config = {
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };
    const body = {
        "poll_id": poll_id,
        "encrypted_vote": encrypted_vote,
        "tokens_staked": 1
    }
    return axios.post(api_call, body, config );
}

export const getVote = async (bearerToken: string, poll_id: string) => {
    const api_call: string = `${BASEURL}/vote/get_user_vote?poll_id=${poll_id}`
    const config = {
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };
    const body = {
    }
    return axios.post(api_call, body, config );
}

export const getAllVotesForUser = async (bearerToken: string) => {
    const api_call: string = `${BASEURL}/vote/get_all_votes_for_user`
    const config = {
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };
    const body = {
    }
    return axios.post(api_call, body, config );
}

export const castStake = async (bearerToken: string, stakeState: StakeState) => {
    const api_call: string = `${BASEURL}/stake/add_user_stake`
    const config = {
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };
    const body = {
        "poll_id": stakeState.poll_id,
        "range_begin": stakeState.range_begin,
        "range_end": stakeState.range_end,
        "tokens_staked": stakeState.tokens_staked
    }
    return axios.post(api_call, body, config );
}

export const getStake = async (bearerToken: string, poll_id: string) => {
    const api_call: string = `${BASEURL}/vote/get_user_stake?poll_id=${poll_id}`
    const config = {
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };
    const body = {
    }
    return axios.post(api_call, body, config );
}

export const getAllStakesForUser = async (bearerToken: string) => {
    const api_call: string = `${BASEURL}/stake/get_all_stakes_for_user`
    const config = {
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };
    const body = {
    }
    return axios.post(api_call, body, config );
}

export const getAllVoterTxns = async (bearerToken: string) => {
    const api_call: string = `${BASEURL}/voter/get_all_voter_txns`
    const config = {
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };
    const body = {
    }
    return axios.post(api_call, body, config );
}

export const getAllContent = async (bearerToken: string) => {
    const api_call: string = `${BASEURL}/content/get_all_content`
    const config = {
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };
    return axios.get(api_call, config );
}

export const getTopRatedContent = async (bearerToken: string) => {
    const api_call: string = `${BASEURL}/content/get_top_rated_content`
    const config = {
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'accept': 'application/json',
        },
    };
    return axios.get(api_call, config );
}

export const getAllCategoryContent = async (bearerToken: string, category: string) => {
    const api_call: string = `${BASEURL}/content/get_all_content?category=${category}`
    const config = {
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };
    return axios.get(api_call, config );
}

export const getTopRatedCategoryContent = async (bearerToken: string, category: string) => {
    const api_call: string = `${BASEURL}/content/get_top_rated_content?category=${category}`
    const config = {
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'accept': 'application/json',
        },
    };
    return axios.get(api_call, config );
}