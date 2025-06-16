export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main 
      id='layout__auth' 
      className='flex justify-center items-center bg-gray-100 dark:bg-muted-foreground/5 min-h-screen sm:p-0 px-4'
    >
      {children}
    </main>
  )
}