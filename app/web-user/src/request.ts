import axios, { type AxiosRequestConfig } from 'axios'
import { message } from 'ant-design-vue'
import { useUserStore } from './config/stores'

export const BASE_URL = 'http://localhost:8080'
const CONTEXT_PATH = '/api'

const myAxios = axios.create({
    baseURL: BASE_URL + CONTEXT_PATH,
    timeout: 60000,
    withCredentials: true,
})

myAxios.interceptors.request.use(
    function (config) {
        return config
    },
    function (error) {
        return Promise.reject(error)
    },
)

myAxios.interceptors.response.use(
    async function (response) {
        const { data } = response
        if (data.code === 40100) {
            const userStore = useUserStore()
            userStore.clearLoginUser()
            if (
                !response.request.responseURL.includes('user/get/login') &&
                !window.location.pathname.includes('/user/login')
            ) {
                await message.warning('请先登录')
                window.location.href = `/user/login?redirect=${window.location.href}`
            }
        }
        return response.data
    },
    function (error) {
        return Promise.reject(error)
    },
)

export function request<T>(
    url: string,
    options: AxiosRequestConfig = {},
): Promise<T> {
    return myAxios.request<any, T>({
        url,
        ...options,
    })
}

export default myAxios
