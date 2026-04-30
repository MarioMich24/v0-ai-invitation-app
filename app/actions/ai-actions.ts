'use server'

import { generateText, Output } from 'ai'
import { z } from 'zod'
import type { EventType } from '@/lib/types'

export async function generateInvitationText(
  eventType: EventType,
  eventDetails: {
    names?: string
    date?: string
    venue?: string
    additionalContext?: string
  }
) {
  const eventTypeLabels: Record<EventType, string> = {
    boda: 'una boda',
    xv: 'una fiesta de XV anos',
    bautizo: 'un bautizo',
    graduacion: 'una graduacion',
    cumpleanos: 'una fiesta de cumpleanos',
    otros: 'un evento especial'
  }

  const prompt = `Genera un texto de invitacion elegante y emotivo en espanol para ${eventTypeLabels[eventType]}.
${eventDetails.names ? `Nombres: ${eventDetails.names}` : ''}
${eventDetails.date ? `Fecha: ${eventDetails.date}` : ''}
${eventDetails.venue ? `Lugar: ${eventDetails.venue}` : ''}
${eventDetails.additionalContext ? `Contexto adicional: ${eventDetails.additionalContext}` : ''}

El texto debe ser formal pero calido, y debe invitar a los lectores a compartir este momento especial.
Incluye una frase de bienvenida, el mensaje principal de la invitacion, y un cierre emotivo.
No incluyas placeholders ni instrucciones, solo el texto final.`

  try {
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt,
      maxOutputTokens: 500,
    })

    return { text: result.text }
  } catch (error) {
    console.error('Error generating invitation text:', error)
    return { error: 'No se pudo generar el texto. Por favor, intenta de nuevo.' }
  }
}

export async function suggestEventInfo(
  eventType: EventType,
  fieldType: 'dress_code' | 'gift_suggestions' | 'menu_ideas' | 'music_suggestions'
) {
  const prompts: Record<string, string> = {
    dress_code: `Sugiere 5 opciones de codigo de vestimenta apropiadas para ${eventType === 'boda' ? 'una boda' : eventType === 'xv' ? 'una fiesta de XV anos' : 'este evento'} en Mexico. 
    Para cada opcion, da un nombre corto y una breve descripcion. 
    Ejemplos: "Formal - Traje y vestido largo", "Semi-formal - Vestido cocktail"`,
    
    gift_suggestions: `Sugiere 10 ideas de regalos apropiados para ${eventType === 'boda' ? 'una boda' : eventType === 'xv' ? 'una fiesta de XV anos' : eventType === 'bautizo' ? 'un bautizo' : 'este evento'}.
    Incluye una variedad de precios y tipos de regalos.`,
    
    menu_ideas: `Sugiere ideas de menu para ${eventType === 'boda' ? 'una boda' : eventType === 'xv' ? 'una fiesta de XV anos' : 'este evento'} incluyendo entradas, plato fuerte y postre.`,
    
    music_suggestions: `Sugiere una lista de 10 canciones populares para ${eventType === 'boda' ? 'una boda' : eventType === 'xv' ? 'una fiesta de XV anos' : 'este evento'} incluyendo el vals y musica para la fiesta.`
  }

  try {
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt: prompts[fieldType],
      maxOutputTokens: 500,
    })

    return { suggestions: result.text }
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return { error: 'No se pudieron generar las sugerencias.' }
  }
}

export async function generateGiftSuggestions(eventType: EventType, budget?: string) {
  const schema = z.object({
    gifts: z.array(z.object({
      title: z.string(),
      description: z.string(),
      estimatedPrice: z.string(),
      category: z.string(),
    }))
  })

  try {
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt: `Genera una lista de 8 sugerencias de regalos para ${eventType === 'boda' ? 'una boda' : eventType === 'xv' ? 'una fiesta de XV anos' : eventType === 'bautizo' ? 'un bautizo' : 'este evento'}.
${budget ? `Presupuesto aproximado por regalo: ${budget}` : 'Incluye variedad de precios.'}
Incluye el titulo, descripcion breve, precio estimado en pesos mexicanos, y categoria del regalo.`,
      output: Output.object({ schema }),
      maxOutputTokens: 1000,
    })

    return { gifts: result.output.gifts }
  } catch (error) {
    console.error('Error generating gift suggestions:', error)
    return { error: 'No se pudieron generar las sugerencias de regalos.' }
  }
}
