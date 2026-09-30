import api from "./axios";
import type { AdminReport, AdminStats, AdminUser, ApiResponse, UserStatus } from "../types";

export const getAdminStats = async () => {
  const res = await api.get<ApiResponse<AdminStats>>("/admin/stats");
  return res.data.data;
};

export const getAdminUsers = async () => {
  const res = await api.get<ApiResponse<AdminUser[]>>("/admin/users");
  return res.data.data;
};

export const toggleBlockUser = async (id: string) => {
  const res = await api.patch<ApiResponse<{ status: UserStatus }>>(`/admin/users/${id}/block`);
  return res.data.data;
};

export const getAdminReports = async () => {
  const res = await api.get<ApiResponse<AdminReport[]>>("/admin/reports");
  return res.data.data;
};

export const resolveReport = async (id: string) => {
  await api.patch<ApiResponse<unknown>>(`/admin/reports/${id}/resolve`);
};
