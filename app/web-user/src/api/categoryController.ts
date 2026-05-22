// @ts-ignore
/* eslint-disable */
import { request } from "@/request";

/** 此处后端没有提供注释 POST /category/add */
export async function addCategory(
  body: API.AddCategoryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/category/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /category/delete */
export async function deleteCategory(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/category/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /category/get */
export async function getCategoryById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCategoryByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseCategory>("/category/get", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /category/list */
export async function listCategory(options?: { [key: string]: any }) {
  return request<API.BaseResponseListCategory>("/category/list", {
    method: "GET",
    ...(options || {}),
  });
}

export async function pageCategory(
  params: API.pageCategoryParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageCategory>("/category/page", {
    method: "GET",
    params: {
      current: "1",
      pageSize: "10",
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /category/list/page */
export async function listCategoryByPage(
  body: API.CategoryQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageCategory>("/category/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /category/products */
export async function listCategoryProducts(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listCategoryProductsParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageProductVO>("/category/products", {
    method: "GET",
    params: {
      // current has a default value: 1
      current: "1",
      // pageSize has a default value: 12
      pageSize: "12",
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /category/update */
export async function updateCategory(
  body: API.Category,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/category/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
