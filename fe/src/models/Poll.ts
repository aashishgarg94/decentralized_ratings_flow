export interface Poll {
  id: string;
  title: string;
  description: string;
  option1: string;
  option2: string;
  start_time: string;
  end_time: string;
  img_src: string;
  num_votes: Number;
  usd_stake: Number;
}
