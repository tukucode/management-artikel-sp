import { $axios } from '@/lib/axios'
import { ResponseProfile } from '@/types/responses/profile_response_type'
import Cookies from 'js-cookie'



export function useApiProfile() {
  const token = Cookies.get('token')
  
  const getMe = () => {
    return  $axios.get<ResponseProfile>('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  return {
    getMe,
  }
} 