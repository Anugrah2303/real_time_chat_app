import api from "./axios";
import type { ApiResponse, AuthResponse, User } from "../types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const loginUser = async (payload: LoginPayload) => {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", payload);
  return res.data.data;
};

export const registerUser = async (payload: RegisterPayload) => {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/register", payload);
  return res.data.data;
};

export const getCurrentUser = async () => {
  const res = await api.get<ApiResponse<{ user: User }>>("/auth/me");
  return res.data.data.user;
};
