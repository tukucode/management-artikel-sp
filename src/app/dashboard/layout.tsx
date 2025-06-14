'use client'

import Cookies from 'js-cookie'
import { Newspaper, Boxes, CircleUser, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Menu items.
const items = [
  {
    title: 'Article',
    url: '/dashboard/article',
    icon: Newspaper,
  },
  {
    title: 'Category',
    url: '/dashboard/category',
    icon: Boxes,
  },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const onMenuItem = (action: 'profile' | 'logout') => {
    if (action === 'profile') {
      window.location.replace('/dashboard/profile/me')
    } else {
      Cookies.remove('token')
      Cookies.remove('role')
      window.location.replace('/')
    }
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroup className="relative flex w-full min-w-0 flex-col justify-center p-0 h-16 font-bold text-2xl">Dashboard</SidebarGroup>
            <SidebarContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className='py-6'>
                      <a href={item.url}>
                        <item.icon />
                        <span className='font-semibold'>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <div className='w-full'>
        <header className='sticky top-0 flex justify-between items-center h-16 px-4 py-9 bg-sidebar shadow'>
          <SidebarTrigger />

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
        </header>

        <main className="p-4 min-h-screen">
          {children}
        </main>
      </div>

    </SidebarProvider>
  )
}