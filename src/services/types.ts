export type NotificationItem = {
  id: string;
  message: string;
  title?: string;
  actor_full_name?: string;
  post_id?: string;
  entity_id?: string;
  entity_type?: string;
  is_read: boolean;
  created_at: string;
  type: string;
};

export type IJob = {
  title: string,
  company_id: string | [],
  suitability_rate: string | number,
  advertiser_id?: string,
  description: string,

}
export type IJobPayload = {
  title: string,
  company_id: { id: string, name: string }[],
  suitability_rate: string | number,
  advertiser_id?: string,
  description: string,

}

