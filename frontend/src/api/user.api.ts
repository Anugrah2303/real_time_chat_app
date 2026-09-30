import api from "./axios";
import type { ApiResponse, ChatUser, ProfileUpdateResult, SearchUser } from "../types";

export interface UpdateProfilePayload {
  name?: string;
  profileImage?: string;
}

export const searchUsers = async (q: string) => {
  const res = await api.get<ApiResponse<SearchUser[]>>("/users", { params: { q } });
  return res.data.data;
};

export const getUserById = async (id: string) => {
  const res = await api.get<ApiResponse<ChatUser>>(`/users/${id}`);
  return res.data.data;
};

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const res = await api.put<ApiResponse<ProfileUpdateResult>>("/users/me", payload);
  return res.data.data;
};
