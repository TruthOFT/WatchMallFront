import { request } from "@/request";

export async function uploadFile(
  params: API.UploadFileParams,
  file?: File,
  options?: Record<string, any>
) {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }
  return request<API.BaseResponse<string>>("/file/upload", {
    method: "POST",
    params,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    ...(options || {}),
  });
}
