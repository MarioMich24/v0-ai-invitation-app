'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { EventType, EventDetails, Padrino } from '@/lib/types'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    + '-' + Math.random().toString(36).substring(2, 8)
}

export async function createEvent(formData: {
  eventType: EventType
  title: string
  invitationPhrase?: string
  dressCode?: string
  guestLimit?: number
  petFriendly?: boolean
  noKids?: boolean
  eventDate?: string
  eventTime?: string
  details?: Partial<EventDetails>
  padrinos?: Padrino[]
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'No autorizado' }
  }

  const slug = generateSlug(formData.title)

  // Create the event
  const { data: event, error: eventError } = await supabase
    .from('events')
    .insert({
      user_id: user.id,
      event_type: formData.eventType,
      title: formData.title,
      slug,
      invitation_phrase: formData.invitationPhrase,
      dress_code: formData.dressCode,
      guest_limit: formData.guestLimit,
      pet_friendly: formData.petFriendly || false,
      no_kids: formData.noKids || false,
      event_date: formData.eventDate,
      event_time: formData.eventTime,
      status: 'draft',
    })
    .select()
    .single()

  if (eventError) {
    console.error('Error creating event:', eventError)
    return { error: 'No se pudo crear el evento' }
  }

  // Create event details if provided
  if (formData.details) {
    const { error: detailsError } = await supabase
      .from('event_details')
      .insert({
        event_id: event.id,
        couple_info: formData.details.couple_info,
        quinceanera_info: formData.details.quinceanera_info,
        child_info: formData.details.child_info,
        host_info: formData.details.host_info,
        parents_info: formData.details.parents_info,
        padrinos: formData.padrinos,
        church_info: formData.details.church_info,
        venue_info: formData.details.venue_info,
      })

    if (detailsError) {
      console.error('Error creating event details:', detailsError)
    }
  }

  return { success: true, eventId: event.id, slug: event.slug }
}

export async function updateEvent(eventId: string, formData: Partial<{
  title: string
  invitationPhrase: string
  dressCode: string
  guestLimit: number
  petFriendly: boolean
  noKids: boolean
  eventDate: string
  eventTime: string
  status: 'draft' | 'published' | 'archived'
}>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'No autorizado' }
  }

  const { error } = await supabase
    .from('events')
    .update({
      title: formData.title,
      invitation_phrase: formData.invitationPhrase,
      dress_code: formData.dressCode,
      guest_limit: formData.guestLimit,
      pet_friendly: formData.petFriendly,
      no_kids: formData.noKids,
      event_date: formData.eventDate,
      event_time: formData.eventTime,
      status: formData.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', eventId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating event:', error)
    return { error: 'No se pudo actualizar el evento' }
  }

  return { success: true }
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'No autorizado' }
  }

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting event:', error)
    return { error: 'No se pudo eliminar el evento' }
  }

  redirect('/dashboard')
}

export async function getMyEvents() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'No autorizado', events: [] }
  }

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching events:', error)
    return { error: 'No se pudieron cargar los eventos', events: [] }
  }

  return { events }
}

export async function getEventBySlug(slug: string) {
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      event_details(*),
      locations(*),
      participants(*),
      gifts(*),
      rsvps(*)
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching event:', error)
    return { error: 'Evento no encontrado' }
  }

  return { event }
}

export async function getEventById(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'No autorizado' }
  }

  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      event_details(*),
      locations(*),
      participants(*),
      gifts(*),
      rsvps(*)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching event:', error)
    return { error: 'Evento no encontrado' }
  }

  return { event }
}
