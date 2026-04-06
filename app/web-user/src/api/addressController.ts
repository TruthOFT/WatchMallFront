// @ts-ignore
/* eslint-disable */
import { request } from "@/request";

export async function addAddress(
  body: API.UserAddressAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/address/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function updateAddress(
  body: API.UserAddressUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/address/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteAddress(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/address/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function listMyAddress(options?: { [key: string]: any }) {
  return request<API.BaseResponseListUserAddressVO>("/address/my/list", {
    method: "GET",
    ...(options || {}),
  });
}

export async function getMyAddressDetail(
  params: API.getMyAddressDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUserAddressVO>("/address/my/detail", {
    method: "GET",
    params,
    ...(options || {}),
  });
}

export async function setDefaultAddress(
  body: API.SetDefaultAddressRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/address/default", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
