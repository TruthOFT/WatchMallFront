import { request } from "@/request";

export async function addProduct(body: API.AddProductRequest, options?: Record<string, any>) {
  return request<API.BaseResponse<boolean>>("/product/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function updateProduct(body: API.UpdateProductRequest, options?: Record<string, any>) {
  return request<API.BaseResponse<boolean>>("/product/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteProduct(body: API.DeleteRequest, options?: Record<string, any>) {
  return request<API.BaseResponse<boolean>>("/product/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function pageAdminProducts(body: API.ProductAdminQueryRequest, options?: Record<string, any>) {
  return request<API.BaseResponse<API.PageResult<API.ProductAdminPageVO>>>("/product/admin/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function getAdminProductDetail(params: { id: string }, options?: Record<string, any>) {
  return request<API.BaseResponse<API.ProductAdminDetailVO>>("/product/admin/detail", {
    method: "GET",
    params,
    ...(options || {}),
  });
}
