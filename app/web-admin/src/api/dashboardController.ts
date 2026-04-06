import { request } from "@/request";

export async function getAdminDashboardSummary(options?: Record<string, any>) {
  return request<API.BaseResponse<API.DashboardSummaryVO>>("/dashboard/admin/summary", {
    method: "GET",
    ...options,
  });
}
