export type AuthUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "job_seeker" | "recruiter";
};

export type DecodedAccessToken = {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};
