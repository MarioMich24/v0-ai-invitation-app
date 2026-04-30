import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <DashboardSidebar user={user} />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-6xl py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
