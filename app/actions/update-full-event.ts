'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateFullEvent(eventId: string, data: any) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  // 1. Actualizar la tabla principal 'events'
  const { error: eventError } = await supabase
    .from('events')
    .update({
      title: data.title,
      invitation_phrase: data.invitationPhrase,
      dress_code: data.dressCode,
      guest_limit: data.guestLimit ? parseInt(data.guestLimit) : null,
      pet_friendly: data.petFriendly,
      no_kids: data.noKids,
      event_date: data.eventDate || null,
      event_time: data.eventTime || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', eventId)
    .eq('user_id', user.id)

  if (eventError) {
    console.error(eventError)
    return { error: 'No se pudo actualizar la información básica del evento' }
  }

  // 2. Actualizar la tabla relacional 'event_details'
  const { error: detailsError } = await supabase
    .from('event_details')
    .update({
      couple_info: data.coupleInfo || null,
      quinceanera_info: data.quinceaneraInfo || null,
      child_info: data.childInfo || null,
      padrinos: data.padrinos || [],
      church_info: data.churchInfo || null,
      venue_info: data.venueInfo || null,
      updated_at: new Date().toISOString(),
    })
    .eq('event_id', eventId)

  if (detailsError) {
    console.error(detailsError)
    return { error: 'No se pudieron actualizar los detalles específicos' }
  }

  // Revalidar las páginas para refrescar la caché
  revalidatePath(`/dashboard/eventos/${eventId}`)
  revalidatePath(`/dashboard/eventos`)
  
  return { success: true }
}