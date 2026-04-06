// @ts-ignore
/* eslint-disable */
import { request } from "@/request";

export async function checkoutOrder(
  body: API.CheckoutOrderRequest = {},
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOrderDetailVO>("/order/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function mockPayOrder(
  body: API.MockPayRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/order/pay/mock", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function listMyOrders(options?: { [key: string]: any }) {
  return request<API.BaseResponseListOrderVO>("/order/my", {
    method: "GET",
    ...(options || {}),
  });
}

export async function getOrderDetail(
  params: API.getOrderDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOrderDetailVO>("/order/detail", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
