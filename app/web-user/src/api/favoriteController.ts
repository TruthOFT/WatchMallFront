// @ts-ignore
/* eslint-disable */
import { request } from "@/request";

export async function addFavorite(
  body: API.AddFavoriteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/favorite/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function removeFavorite(
  body: API.RemoveFavoriteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/favorite/remove", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function getFavoriteStatus(
  params: API.getFavoriteStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseFavoriteStatusVO>("/favorite/status", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function listMyFavorites(options?: { [key: string]: any }) {
  return request<API.BaseResponseListFavoriteProductVO>("/favorite/my", {
    method: "GET",
    ...(options || {}),
  });
}
