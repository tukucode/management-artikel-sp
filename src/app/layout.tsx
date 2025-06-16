import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Nunito_Sans } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { APP_NAME, APP_DESCRIPTION, PUBLIC_SERVER_URL} from '@/constants/variables_const'
import './globals.css'

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
  preload: true,
})

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(PUBLIC_SERVER_URL),
  // icons: {
  //   icon: `${PUBLIC_SERVER_URL}/images/icon.png`,
  // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunitoSans.variable} antialiased`}
      >
        <Toaster 
          position='top-right'
          expand={true}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}