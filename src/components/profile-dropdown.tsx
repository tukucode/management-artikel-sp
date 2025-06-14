/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Cookies from 'js-cookie'
import { $axios } from '@/lib/axios'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CircleUser, Loader2Icon, LogOut } from 'lucide-react'
import { ResponseProfile, DetailProfile } from '@/types/responses/profile_response_type'
import { useProfileStore } from '@/store/profile-store'

export default function ProfileDropdown() {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Partial<DetailProfile>>({})

  const clearProfile = useProfileStore((state) => state.clearProfile)
  const onMenuItem = (action: 'profile' | 'logout') => {
    if (action === 'profile') {
      redirect('/profile/me')
    } else {
      // clear cookie
      Cookies.remove('token')
      Cookies.remove('role')
      // clear data on profile store
      clearProfile()
      window.location.replace('/')
    }
  }

  function getInitial(username: string): string {
    return username?.trim().charAt(0).toUpperCase() || 'A'
  }

  const setProfile = useProfileStore((state) => state.setProfile)
  const fetchData = async () => {  
    try {
      setLoading(true)
      const response = await $axios.get<ResponseProfile>('/auth/profile')
      setData(response.data.data)

      // set data profile on store Profile
      const { id, username, role } = response.data.data
      setProfile({ id, username, role })
    } catch (error) {
      console.error('ERRROR', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [setProfile])
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback>
            {
              isLoading ? (
                <Loader2Icon className="animate-spin text-muted-foreground" />
              )
                : 
                getInitial(data.username!)
            }
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => onMenuItem('profile')}>
          <CircleUser /> Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onMenuItem('logout')}>
          <LogOut />  Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
