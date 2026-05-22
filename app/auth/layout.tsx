import Navbar from '@/components/navbar'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        {children}
      </main>
    </>
  )
}