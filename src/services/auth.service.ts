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
    role: payload.role,
  };

  const { data } = await apiClient.post("/auth/register", requestPayload);

  return data.data;
}

export async function getLoginQr() {
  const { data } = await apiClient.get("/auth/login-qr");
  return data.data;
}

// QR kodun telefondan okutulup onaylanmadığını sorgulayan yeni metot
export async function checkQrStatus(code: string) {
  const { data } = await apiClient.get(`/auth/qr-status?code=${code}`);
  return data; // { status: 'PENDING' | 'SUCCESS' | 'EXPIRED', accessToken?, user? }
}
