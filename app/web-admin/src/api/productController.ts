// @ts-ignore
/* eslint-disable */
import { request } from "@/request";

/** 此处后端没有提供注释 POST /product/add */
export async function addProduct(
  body: {
    product: API.Product;
  },
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

/** 此处后端没有提供注释 POST /product/upload/image */
export async function uploadImage(body: {}, options?: { [key: string]: any }) {
  return request<API.BaseResponseString>("/product/upload/image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
