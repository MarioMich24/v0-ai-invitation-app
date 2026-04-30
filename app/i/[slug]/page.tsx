import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { InvitationContent } from '@/components/invitation/invitation-content'
import { EVENT_TYPE_LABELS } from '@/lib/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('title, event_type, invitation_phrase')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!event) {
    return {
      title: 'Invitacion no encontrada'
    }
  }

  return {
    title: event.title,
    description: event.invitation_phrase || `Te invitamos a ${EVENT_TYPE_LABELS[event.event_type as keyof typeof EVENT_TYPE_LABELS]}`,
    openGraph: {
      title: event.title,
      description: event.invitation_phrase || `Te invitamos a ${EVENT_TYPE_LABELS[event.event_type as keyof typeof EVENT_TYPE_LABELS]}`,
      type: 'website',
    }
  }
}

export default async function InvitationPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      event_details(*),
      locations(*),
      gifts(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !event) {
    notFound()
  }

  return <InvitationContent event={event} />
}
