// @ts-ignore
/* eslint-disable */
import { request } from "@/request";

/** 此处后端没有提供注释 POST /product/add */
export async function addProduct(
  body: API.AddProductRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/product/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /product/delete */
export async function deleteProduct(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/product/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/detail */
export async function getProductDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseProductDetailVO>("/product/detail", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function trackProductView(
  body: API.ProductViewTrackRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/product/view/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/home */
export async function home(options?: { [key: string]: any }) {
  return request<API.BaseResponseHomeProductVO>("/product/home", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/list */
export async function listProduct(options?: { [key: string]: any }) {
  return request<API.BaseResponseListProduct>("/product/list", {
    method: "GET",
    ...(options || {}),
  });
}

export async function listRelatedProducts(
  params: API.listRelatedProductsParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListProductVO>("/product/recommend/related", {
    method: "GET",
    params: {
      size: "5",
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /product/list/by-category */
export async function listProductByCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listProductByCategoryParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageProductVO>("/product/list/by-category", {
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

/** 此处后端没有提供注释 POST /product/update */
export async function updateProduct(
  body: API.Product,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/product/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function searchProducts(
  params: API.searchProductsParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageProductVO>("/product/search", {
    method: "GET",
    params: {
      current: "1",
      pageSize: "12",
      ...params,
    },
    ...(options || {}),
  });
}
