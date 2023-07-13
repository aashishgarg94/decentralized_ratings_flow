export interface PollCreateBaseModel {
  poll_id: string;
  poll_address: string;
  poll_title: string;
  options: string[];
  begin_date: string;
  staking_deadline: string;
  end_date: string;
  public_key: string;
  secret: string;
  nonce: Number;
  category_code: string;
  category_name: string;
  sort_priority: Number | null;
  description: string | null;
  description_images: string[] | null;
  tags: string[] | null;
}
