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
import { CircleUser, LogOut } from 'lucide-react'

export default function ProfileDropdown() {
  const onMenuItem = (action: 'profile' | 'logout') => {
    if (action === 'profile') {
      redirect('/dashboard/profile/me')
    } else {
      Cookies.remove('token')
      Cookies.remove('role')
      window.location.replace('/')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback>TM</AvatarFallback>
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
