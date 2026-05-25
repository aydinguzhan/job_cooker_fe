export type FollowUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  title: string | null;
  profile_image_path: string | null;
  is_following: boolean;
};

export type FollowTab = "suggestions" | "followers" | "followings";
