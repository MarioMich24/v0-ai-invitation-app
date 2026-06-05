import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

// 1. Aquí agregamos la configuración para la pestaña (favicon y título)
export const metadata = {
  title: "Cookie Print | Invitaciones Digitales",
  description: "Crea y personaliza tus invitaciones digitales para eventos especiales con Cookie Print.",
  icons: {
    icon: "/GALLETITA.svg",
  },
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}