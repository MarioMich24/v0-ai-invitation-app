'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field' //aqui lo cambie por q chatsito me lo dijo xd
import { Spinner } from '@/components/ui/spinner'
import { Check, X, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface RsvpFormProps {
  eventId: string
  guestLimit: number | null
}

export function RsvpForm({ eventId, guestLimit }: RsvpFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    num_attendees: '1',
    dietary_restrictions: '',
    message: '',
    status: 'confirmed' as 'confirmed' | 'declined'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createClient()

    const { error } = await supabase.from('rsvps').insert({
      event_id: eventId,
      guest_name: formData.guest_name,
      guest_email: formData.guest_email || null,
      guest_phone: formData.guest_phone || null,
      num_attendees: parseInt(formData.num_attendees),
      dietary_restrictions: formData.dietary_restrictions || null,
      message: formData.message || null,
      status: formData.status,
      responded_at: new Date().toISOString()
    })

    setIsSubmitting(false)

    if (error) {
      toast.error('No se pudo enviar tu respuesta. Intenta de nuevo.')
      return
    }

    setSubmitted(true)
    toast.success(
      formData.status === 'confirmed' 
        ? 'Gracias por confirmar tu asistencia!' 
        : 'Gracias por tu respuesta. Lamentamos que no puedas asistir.'
    )
  }

  if (submitted) {
    return (
      <Card className="rounded-2xl text-center">
        <CardContent className="py-12">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
            formData.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-muted text-muted-foreground'
          }`}>
            {formData.status === 'confirmed' ? <Check className="h-8 w-8" /> : <X className="h-8 w-8" />}
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {formData.status === 'confirmed' ? 'Te Esperamos!' : 'Gracias por tu Respuesta'}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {formData.status === 'confirmed' 
              ? 'Tu asistencia ha sido confirmada exitosamente.'
              : 'Lamentamos que no puedas asistir. Gracias por avisarnos.'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Confirmar Asistencia
        </CardTitle>
        <CardDescription>
          Por favor confirma si podras asistir al evento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            {/* Attendance Choice */}
            <Field>
              <FieldLabel>Podras asistir?</FieldLabel>
              <RadioGroup
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as 'confirmed' | 'declined' })}
                className="grid grid-cols-2 gap-4 mt-2"
              >
                <label className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  formData.status === 'confirmed' 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-border hover:border-emerald-300'
                }`}>
                  <RadioGroupItem value="confirmed" className="sr-only" />
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Si, asistire</span>
                </label>
                <label className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  formData.status === 'declined' 
                    ? 'border-destructive bg-destructive/10 text-destructive' 
                    : 'border-border hover:border-destructive/50'
                }`}>
                  <RadioGroupItem value="declined" className="sr-only" />
                  <X className="h-5 w-5" />
                  <span className="font-medium">No podre asistir</span>
                </label>
              </RadioGroup>
            </Field>

            {/* Name */}
            <Field>
              <FieldLabel htmlFor="guest_name">Tu Nombre Completo *</FieldLabel>
              <Input
                id="guest_name"
                value={formData.guest_name}
                onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                placeholder="Juan Perez"
                required
              />
            </Field>

            {/* Contact Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="guest_email">Correo Electronico</FieldLabel>
                <Input
                  id="guest_email"
                  type="email"
                  value={formData.guest_email}
                  onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                  placeholder="tu@email.com"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="guest_phone">Telefono</FieldLabel>
                <Input
                  id="guest_phone"
                  type="tel"
                  value={formData.guest_phone}
                  onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                  placeholder="+52 55 1234 5678"
                />
              </Field>
            </div>

            {/* Number of Attendees - Only show if confirmed */}
            {formData.status === 'confirmed' && (
              <Field>
                <FieldLabel htmlFor="num_attendees">Numero de Asistentes</FieldLabel>
                <Input
                  id="num_attendees"
                  type="number"
                  min="1"
                  max={guestLimit || 10}
                  value={formData.num_attendees}
                  onChange={(e) => setFormData({ ...formData, num_attendees: e.target.value })}
                />
                <FieldMessage>Incluyendote a ti</FieldMessage>
              </Field>
            )}

            {/* Dietary Restrictions - Only show if confirmed */}
            {formData.status === 'confirmed' && (
              <Field>
                <FieldLabel htmlFor="dietary_restrictions">Restricciones Alimentarias</FieldLabel>
                <Input
                  id="dietary_restrictions"
                  value={formData.dietary_restrictions}
                  onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
                  placeholder="Ej: Vegetariano, alergias, etc."
                />
              </Field>
            )}

            {/* Message */}
            <Field>
              <FieldLabel htmlFor="message">Mensaje para los Anfitriones (Opcional)</FieldLabel>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Escribe un mensaje..."
                rows={3}
              />
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner className="mr-2" />
                Enviando...
              </>
            ) : (
              'Enviar Respuesta'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
