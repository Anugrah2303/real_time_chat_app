import api from "./axios";
import type { ApiResponse, MessagesPage, UploadResult } from "../types";

export interface GetMessagesParams {
  limit: number;
  before?: string;
}

export const uploadFile = async (file: File) => {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post<ApiResponse<UploadResult>>("/messages/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const getMessages = async (conversationId: string, params: GetMessagesParams) => {
  const res = await api.get<ApiResponse<MessagesPage>>(`/messages/${conversationId}`, { params });
  return res.data.data;
};

export const deleteMessageById = async (id: string) => {
  await api.delete<ApiResponse<undefined>>(`/messages/${id}`);
};
