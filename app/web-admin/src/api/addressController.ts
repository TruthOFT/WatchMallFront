import { request } from "@/request";

export async function listAdminAddress(params: { userId: string }, options?: Record<string, any>) {
  return request<API.BaseResponse<API.UserAddressAdminVO[]>>("/address/admin/list", {
    method: "GET",
    params,
    ...options,
  });
}
