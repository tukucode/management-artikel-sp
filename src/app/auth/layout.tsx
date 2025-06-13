export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main id='layout__auth' className='flex justify-center items-center min-h-screen sm:p-0 px-4'>
      {children}
    </main>
  )
}