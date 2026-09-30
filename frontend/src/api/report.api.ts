import api from "./axios";
import type { ApiResponse } from "../types";

export interface CreateReportPayload {
  reportedUserId: string;
  messageId?: string;
  reason: string;
}

export const createReport = async (payload: CreateReportPayload) => {
  await api.post<ApiResponse<undefined>>("/reports", payload);
};
