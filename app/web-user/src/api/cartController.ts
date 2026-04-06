// @ts-ignore
/* eslint-disable */
import { request } from "@/request";

export async function addCart(
  body: API.AddCartRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function getMyCart(options?: { [key: string]: any }) {
  return request<API.BaseResponseCartVO>("/cart/my", {
    method: "GET",
    ...(options || {}),
  });
}

export async function updateCartItemQuantity(
  body: API.UpdateCartItemQuantityRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/cart/item/quantity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function updateCartItemChecked(
  body: API.UpdateCartItemCheckedRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/cart/item/checked", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteCartItem(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/cart/item/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
