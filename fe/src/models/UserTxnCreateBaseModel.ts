export interface UserTxnCreateBaseModel {
    poll_id: string;
    poll_title: string;
    end_date: string;
    vote: string,
    range_begin: string,
    range_end: string,
    tokens_staked: string,
    result: string,
    reward: string
  }