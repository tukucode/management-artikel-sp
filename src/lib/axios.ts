import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { BASE_API_URL } from '@/constants/variables_const'

const $axios = axios.create({
  baseURL: `${BASE_API_URL}/api`,
  withCredentials: true,
})

$axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // if (typeof window !== 'undefined') {
    //   const token = document.cookie
    //     .split('; ')
    //     .find((row) => row.startsWith('token='))
    //     ?.split('=')[1]

    //   if (token) {
    //     config.headers.Authorization = `Bearer ${token}`
    //   }
    // }

    return config
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error)
  },
)

$axios.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<AxiosError> => {
    // if (error.response) {
    //   const status = error.response.status

    //   if (status === 401) {
    //     // Unauthorized: Token salah atau expired
    //     console.warn('Unauthorized, redirecting to login...')
    //     if (typeof window !== 'undefined') {
    //       window.location.href = '/auth/login'
    //     }
    //   } else if (status === 403) {
    //     // Forbidden
    //     if (typeof window !== 'undefined') {
    //       window.location.href = '/403'
    //     }
    //   } else if (status >= 500) {
    //     // Server error
    //     alert('Server sedang bermasalah. Coba lagi nanti.')
    //   }
    // }

    return Promise.reject(error)
  },
)

export default $axios