'use client'

import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { Newspaper, Boxes } from 'lucide-react'
import ProfileDropdown from '@/components/profile-dropdown'
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
  const pathname = usePathname()
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroup className="relative flex w-full min-w-0 flex-col justify-center p-0 h-16 font-bold text-2xl">Dashboard</SidebarGroup>
            <SidebarContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = pathname.startsWith(item.url)
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className={clsx('py-6', { 'bg-muted cursor-not-allowed': isActive })}>
                        <a href={item.url}>
                          <item.icon />
                          <span className='font-semibold'>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <div className='w-full'>
        <header className='sticky top-0 z-10 flex justify-between items-center h-16 px-4 py-9 bg-sidebar shadow'>
          <SidebarTrigger />
          <ProfileDropdown />
        </header>

        <main className="p-10 min-h-screen">
          {children}
        </main>
      </div>

    </SidebarProvider>
  )
}
