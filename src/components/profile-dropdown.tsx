'use client'

import Cookies from 'js-cookie'
import { redirect } from 'next/navigation'
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
import { $axios } from '@/lib/axios'
import { useEffect, useState } from 'react'

export default function ProfileDropdown() {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Partial<DetailProfile>>({})

  const onMenuItem = (action: 'profile' | 'logout') => {
    if (action === 'profile') {
      redirect('/dashboard/profile/me')
    } else {
      Cookies.remove('token')
      Cookies.remove('role')
      window.location.replace('/')
    }
  }

  function getInitial(username: string): string {
    return username?.trim().charAt(0).toUpperCase() || 'A'
  }

  const fetchData = async () => {  
    try {
      setLoading(true)
      const response = await $axios.get<ResponseProfile>('/auth/profile')
      setData(response.data.data)
    } catch (error) {
      console.error('ERRROR', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  
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
