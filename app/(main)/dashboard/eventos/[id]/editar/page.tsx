import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { EditEventForm } from '@/components/dashboard/edit-event-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarEventoPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Descargamos el evento y sus detalles asegurando que pertenezca al usuario
  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      event_details(*)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !event) {
    notFound()
  }

  return (
    <div className="container max-w-4xl py-8">
      <EditEventForm initialEvent={event} />
    </div>
  )
}