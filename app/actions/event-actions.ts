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
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Tu sesión expiró por el reinicio del servidor. Por favor, cierra sesión y vuelve a entrar.' }
  }

  const slug = generateSlug(formData.title)

  // SEGURIDAD EXTRA: Si la fecha u hora vienen como texto vacío "", lo convertimos a nulo
  // para que la base de datos de PostgreSQL no lance un error de sintaxis.
  const safeDate = formData.eventDate && formData.eventDate.trim() !== '' ? formData.eventDate : null;
  const safeTime = formData.eventTime && formData.eventTime.trim() !== '' ? formData.eventTime : null;

  // Creamos el evento principal
  const { data: event, error: eventError } = await supabase
    .from('events')
    .insert({
      user_id: user.id,
      event_type: formData.eventType,
      title: formData.title,
      slug,
      invitation_phrase: formData.invitationPhrase || null,
      dress_code: formData.dressCode || null,
      guest_limit: formData.guestLimit || null,
      pet_friendly: formData.petFriendly || false,
      no_kids: formData.noKids || false,
      event_date: safeDate,
      event_time: safeTime,
      status: 'draft',
    })
    .select()
    .single()

  if (eventError) {
    console.error('Error de Supabase al crear evento:', eventError)
    // Ahora el recuadro rojo te mostrará exactamente por qué falló
    return { error: `Error de Base de Datos: ${eventError.message}` }
  }

  // Creamos los detalles del evento si existen
  if (formData.details || formData.padrinos) {
    const { error: detailsError } = await supabase
      .from('event_details')
      .insert({
        event_id: event.id,
        couple_info: formData.details?.couple_info || null,
        quinceanera_info: formData.details?.quinceanera_info || null,
        child_info: formData.details?.child_info || null,
        host_info: formData.details?.host_info || null,
        parents_info: formData.details?.parents_info || null,
        padrinos: formData.padrinos || [],
        church_info: formData.details?.church_info || null,
        venue_info: formData.details?.venue_info || null,
      })

    if (detailsError) {
      console.error('Error al crear detalles:', detailsError)
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
    return { error: error.message }
  }

  return { success: true }
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'No autorizado' }

  await supabase.from('events').delete().eq('id', eventId).eq('user_id', user.id)
  redirect('/dashboard')
}

export async function getMyEvents() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'No autorizado', events: [] }

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return { events: events || [], error: error?.message }
}

export async function getEventBySlug(slug: string) {
  const supabase = await createClient()
  const { data: event, error } = await supabase
    .from('events')
    .select('*, event_details(*), locations(*), participants(*), gifts(*), rsvps(*)')
    .eq('slug', slug)
    .single()

  return { event, error: error?.message }
}

export async function getEventById(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'No autorizado' }

  const { data: event, error } = await supabase
    .from('events')
    .select('*, event_details(*), locations(*), participants(*), gifts(*), rsvps(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  return { event, error: error?.message }
}