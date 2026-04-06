import { request } from "@/request";

export async function pageAdminPayLogs(body: API.PayLogAdminQueryRequest, options?: Record<string, any>) {
  return request<API.BaseResponse<API.PageResult<API.PayLogAdminPageVO>>>("/pay/admin/page", {
    method: "POST",
    data: body,
    ...options,
  });
}

export async function getAdminPayLogDetail(params: { id: string }, options?: Record<string, any>) {
  return request<API.BaseResponse<API.PayLogAdminDetailVO>>("/pay/admin/detail", {
    method: "GET",
    params,
    ...options,
  });
}
