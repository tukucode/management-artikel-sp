/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Cookies from 'js-cookie'
import { $axios } from '@/lib/axios'
import { redirect, usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CircleUser, Loader2Icon, LogOut, LayoutDashboard } from 'lucide-react'
import { useProfileStore } from '@/store/profile-store'
import { ResponseProfile, DetailProfile } from '@/types/responses/profile_response_type'

export default function ProfileDropdown() {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Partial<DetailProfile>>({})
  const profileStore = useProfileStore((state) => state)
  
  const pathname = usePathname()
  const showMenutItemDashboard = useMemo(() => {
    if (profileStore.role.toLocaleLowerCase() == 'admin') {
      return !pathname.startsWith('/dashboard')
    }

    return false
  }, [pathname, profileStore.role])
  
  const onMenuItem = (action: 'dashboard' | 'profile' | 'logout') => {
    if (action === 'dashboard') {
      redirect('/dashboard/article')
    } 
    else if (action === 'profile') {
      redirect('/profile/me')
    } else {
      // clear cookie
      Cookies.remove('token')
      Cookies.remove('role')
      // clear data on profile store
      profileStore.clearProfile()
      window.location.replace('/auth/login')
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

      // set data profile on store Profile
      const { id, username, role } = response.data.data
      profileStore.setProfile({ id, username, role })
    } catch (error) {
      console.error('ERROR', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [profileStore.setProfile])
  
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
      <DropdownMenuContent align='end' className='min-w-52'>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem disabled>
          <span className='capitalize'>{profileStore.username || '-'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <span>Role access: {profileStore.role.toLocaleLowerCase() || '-'}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {
          showMenutItemDashboard && (
            <DropdownMenuItem onClick={() => onMenuItem('dashboard')}>
              <LayoutDashboard /> Dashboard
            </DropdownMenuItem>
          )
        }
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
