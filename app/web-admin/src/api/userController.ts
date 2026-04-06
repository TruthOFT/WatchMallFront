import { request } from "@/request";

export async function userLogin(body: API.UserLoginRequest, options?: Record<string, any>) {
  return request<API.BaseResponse<API.LoginUserVO>>("/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function getLoginUser(options?: Record<string, any>) {
  return request<API.BaseResponse<API.LoginUserVO>>("/user/get/login", {
    method: "GET",
    ...(options || {}),
  });
}

export async function userLogout(options?: Record<string, any>) {
  return request<API.BaseResponse<boolean>>("/user/logout", {
    method: "POST",
    ...(options || {}),
  });
}

export async function pageAdminUsers(body: API.UserAdminQueryRequest, options?: Record<string, any>) {
  return request<API.BaseResponse<API.PageResult<API.UserAdminPageVO>>>("/user/admin/page", {
    method: "POST",
    data: body,
    ...(options || {}),
  });
}

export async function getAdminUserDetail(params: { id: string }, options?: Record<string, any>) {
  return request<API.BaseResponse<API.UserAdminDetailVO>>("/user/admin/detail", {
    method: "GET",
    params,
    ...(options || {}),
  });
}
