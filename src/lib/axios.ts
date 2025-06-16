import Cookies from 'js-cookie'
import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { BASE_API_URL } from '@/constants/variables_const'

const isServer = typeof window === 'undefined'

export const $axios = axios.create({
  baseURL: isServer ? '/api-proxy/api' : `${BASE_API_URL}/api-proxy/api`,
  withCredentials: true,
})

$axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = Cookies.get('token')

    // set token to header Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error)
  },
)

$axios.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {        
    // set cookie token and role from response
    if (response.data.token) {
      Cookies.set('token', response.data.token)
    }

    if (response.data.role) {
      Cookies.set('role', response.data.role)
    }

    return response
  },
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