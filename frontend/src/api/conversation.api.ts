import api from "./axios";
import type { ApiResponse, Conversation, NewConversation } from "../types";

export const getConversations = async () => {
  const res = await api.get<ApiResponse<Conversation[]>>("/conversations");
  return res.data.data;
};

export const createConversation = async (userId: string) => {
  const res = await api.post<ApiResponse<NewConversation>>("/conversations", { userId });
  return res.data.data;
};
