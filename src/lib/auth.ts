import { jwtDecode } from "jwt-decode";
import type { DecodedAccessToken } from "../types/auth.types";

const TOKEN_KEY = "access_token";

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getDecodedUser() {
  const token = getAccessToken();

  if (!token) return null;

  try {
    return jwtDecode<DecodedAccessToken>(token);
  } catch {
    return null;
  }
}

export  function userInfo() {
  const decodedUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;

  if (!decodedUser) return null;
  return {
    userId: decodedUser.id,
    email: decodedUser.email,
    firstName: decodedUser.firstName,
    lastName: decodedUser.lastName,
  };
}

export function isTokenExpired() {
  const user = getDecodedUser();

  if (!user?.exp) return true;

  return Date.now() >= user.exp * 1000;
}

export function logout() {
  removeAccessToken();
  localStorage.removeItem("user");
}
