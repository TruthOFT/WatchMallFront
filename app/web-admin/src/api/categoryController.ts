import { request } from "@/request";

export async function addCategory(body: API.AddCategoryRequest, options?: Record<string, any>) {
  return request<API.BaseResponse<boolean>>("/category/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function updateCategory(body: API.Category, options?: Record<string, any>) {
  return request<API.BaseResponse<boolean>>("/category/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteCategory(body: API.DeleteRequest, options?: Record<string, any>) {
  return request<API.BaseResponse<boolean>>("/category/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function listCategory(options?: Record<string, any>) {
  return request<API.BaseResponse<API.Category[]>>("/category/list", {
    method: "GET",
    ...(options || {}),
  });
}

export async function listCategoryByPage(body: API.CategoryQueryRequest, options?: Record<string, any>) {
  return request<API.BaseResponse<API.PageResult<API.Category>>>("/category/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
