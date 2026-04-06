import axios, { type AxiosRequestConfig } from "axios";
import { message } from "ant-design-vue";

export const BASE_URL = "http://localhost:8080";
const CONTEXT_PATH = "/api";

const myAxios = axios.create({
  baseURL: BASE_URL + CONTEXT_PATH,
  timeout: 60000,
  withCredentials: true,
});

myAxios.interceptors.response.use(
  async (response) => {
    const { data } = response;
    if (data?.code === 40100) {
      const isLoginPage = window.location.pathname.includes("/login");
      if (!isLoginPage) {
        await message.warning("请先登录后台账号");
        const redirect = `${window.location.pathname}${window.location.search}`;
        window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
      }
    }
    if (data?.code === 40101) {
      await message.error(data.message || "当前账号没有后台权限");
    }
    return data;
  },
  (error) => Promise.reject(error)
);

export function request<T>(url: string, options: AxiosRequestConfig = {}): Promise<T> {
  return myAxios.request<any, T>({
    url,
    ...options,
  });
}

export default myAxios;
