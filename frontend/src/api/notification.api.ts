import api from "./axios";
import type { ApiResponse, NotificationsResponse } from "../types";

export const getNotifications = async () => {
  const res = await api.get<ApiResponse<NotificationsResponse>>("/notifications");
  return res.data.data;
};

export const markAllNotificationsRead = async () => {
  await api.patch<ApiResponse<undefined>>("/notifications/read-all");
};

export const markNotificationRead = async (id: string) => {
  await api.patch<ApiResponse<unknown>>(`/notifications/${id}/read`);
};
