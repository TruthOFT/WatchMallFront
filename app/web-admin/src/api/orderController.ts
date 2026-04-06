import { request } from "@/request";

export async function pageAdminOrders(body: API.OrderAdminQueryRequest, options?: Record<string, any>) {
  return request<API.BaseResponse<API.PageResult<API.OrderAdminPageVO>>>("/order/admin/page", {
    method: "POST",
    data: body,
    ...options,
  });
}

export async function getAdminOrderDetail(params: { id: string }, options?: Record<string, any>) {
  return request<API.BaseResponse<API.OrderAdminDetailVO>>("/order/admin/detail", {
    method: "GET",
    params,
    ...options,
  });
}

export async function getAdminOrderStats(options?: Record<string, any>) {
  return request<API.BaseResponse<API.OrderAdminStatsVO>>("/order/admin/stats", {
    method: "GET",
    ...options,
  });
}
