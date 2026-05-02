import apiClient from "../lib/axios";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "../types/auth.types";

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function registerUser(payload: RegisterPayload) {
  const requestPayload = {
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
    password: payload.password,
  };

  const { data } = await apiClient.post<AuthResponse>(
    "/auth/register",
    requestPayload
  );

  return data;
}