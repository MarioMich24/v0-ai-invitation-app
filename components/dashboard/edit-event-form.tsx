'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Save, Plus, Trash2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { updateFullEvent } from '@/app/actions/update-full-event'
import { generateInvitationText } from '@/app/actions/ai-actions'
import { PADRINO_TYPE_LABELS } from '@/lib/types'

export function EditEventForm({ initialEvent }: { initialEvent: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const details = initialEvent.event_details?.[0] || {}

  // Inicializamos el estado completo con los datos que ya existen en la BD
  const [formData, setFormData] = useState({
    title: initialEvent.title || '',
    eventDate: initialEvent.event_date || '',
    eventTime: initialEvent.event_time ? initialEvent.event_time.slice(0, 5) : '',
    invitationPhrase: initialEvent.invitation_phrase || '',
    dressCode: initialEvent.dress_code || 'formal',
    guestLimit: initialEvent.guest_limit || '',
    petFriendly: initialEvent.pet_friendly || false,
    noKids: initialEvent.no_kids || false,
    coupleInfo: details.couple_info || { partner1_name: '', partner2_name: '', story: '' },
    quinceaneraInfo: details.quinceanera_info || { name: '', parents: '' },
    childInfo: details.child_info || { name: '', parents: '' },
    padrinos: details.padrinos || [],
    churchInfo: details.church_info || { name: '', address: '', time: '', maps_url: '' },
    venueInfo: details.venue_info || { name: '', address: '', city: '', maps_url: '' },
  })

  const handleGenerateText = async () => {
    setIsGenerating(true)
    const names = initialEvent.event_type === 'boda' ? `${formData.coupleInfo.partner1_name} y ${formData.coupleInfo.partner2_name}` : formData.title
    const result = await generateInvitationText(initialEvent.event_type, { names, date: formData.eventDate, venue: formData.venueInfo?.name })
    setIsGenerating(false)
    if (result.text) setFormData(prev => ({ ...prev, invitationPhrase: result.text }))
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('El título del evento es requerido')
      return
    }
    setIsSubmitting(true)
    const res = await updateFullEvent(initialEvent.id, formData)
    setIsSubmitting(false)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success('¡Invitación guardada exitosamente!')
      router.push(`/dashboard/eventos/${initialEvent.id}`)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" className="rounded-xl" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Editar Invitación</h1>
            <p className="text-muted-foreground">Modifica los detalles públicos de tu evento</p>
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting} className="rounded-xl">
          {isSubmitting ? <Spinner className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
          Guardar Cambios
        </Button>
      </div>

      {/* 1. Información Básica */}
      <Card className="rounded-2xl">
        <CardHeader><CardTitle className="text-lg">Información Básica</CardTitle></CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Título del Evento *</FieldLabel>
              <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Fecha</FieldLabel>
                <Input type="date" value={formData.eventDate} onChange={e => setFormData({ ...formData, eventDate: e.target.value })} />
              </Field>
              <Field>
                <FieldLabel>Hora</FieldLabel>
                <Input type="time" value={formData.eventTime} onChange={e => setFormData({ ...formData, eventTime: e.target.value })} />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* 2. Dinámico por Tipo de Evento */}
      {initialEvent.event_type === 'boda' && (
        <Card className="rounded-2xl">
          <CardHeader><CardTitle className="text-lg">Información de los Novios</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <Field>
                <FieldLabel>Nombre Novio/a 1</FieldLabel>
                <Input value={formData.coupleInfo.partner1_name} onChange={e => setFormData({ ...formData, coupleInfo: { ...formData.coupleInfo, partner1_name: e.target.value } })} />
              </Field>
              <Field>
                <FieldLabel>Nombre Novio/a 2</FieldLabel>
                <Input value={formData.coupleInfo.partner2_name} onChange={e => setFormData({ ...formData, coupleInfo: { ...formData.coupleInfo, partner2_name: e.target.value } })} />
              </Field>
            </div>
            <Field>
              <FieldLabel>Nuestra Historia (Opcional)</FieldLabel>
              <Textarea rows={3} value={formData.coupleInfo.story || ''} onChange={e => setFormData({ ...formData, coupleInfo: { ...formData.coupleInfo, story: e.target.value } })} />
            </Field>
          </CardContent>
        </Card>
      )}

      {/* 3. Lugares */}
      <Card className="rounded-2xl">
        <CardHeader><CardTitle className="text-lg">Ubicación de la Recepción</CardTitle></CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Nombre del Lugar</FieldLabel>
              <Input value={formData.venueInfo?.name || ''} onChange={e => setFormData({ ...formData, venueInfo: { ...formData.venueInfo, name: e.target.value } })} />
            </Field>
            <Field>
              <FieldLabel>Dirección Completa</FieldLabel>
              <Input value={formData.venueInfo?.address || ''} onChange={e => setFormData({ ...formData, venueInfo: { ...formData.venueInfo, address: e.target.value } })} />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* 4. Frase e Inteligencia Artificial */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Texto de la Invitación</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={handleGenerateText} disabled={isGenerating} className="rounded-lg">
              {isGenerating ? <Spinner className="mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Regenerar con IA
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea rows={5} value={formData.invitationPhrase} onChange={e => setFormData({ ...formData, invitationPhrase: e.target.value })} />
        </CardContent>
      </Card>

      {/* 5. Opciones Extra */}
      <Card className="rounded-2xl">
        <CardHeader><CardTitle className="text-lg">Configuraciones del Evento</CardTitle></CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Código de Vestimenta</FieldLabel>
                <Select value={formData.dressCode} onValueChange={val => setFormData({ ...formData, dressCode: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="semi-formal">Semi-formal</SelectItem>
                    <SelectItem value="casual-elegante">Casual Elegante</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Límite de Invitados por Pase</FieldLabel>
                <Input type="number" value={formData.guestLimit} onChange={e => setFormData({ ...formData, guestLimit: e.target.value })} />
              </Field>
            </div>
            <div className="flex items-center justify-between py-2 border-t">
              <div><p className="font-medium">Evento Pet Friendly</p></div>
              <Switch checked={formData.petFriendly} onCheckedChange={val => setFormData({ ...formData, petFriendly: val })} />
            </div>
            <div className="flex items-center justify-between py-2 border-t">
              <div><p className="font-medium">Solo Adultos (No Niños)</p></div>
              <Switch checked={formData.noKids} onCheckedChange={val => setFormData({ ...formData, noKids: val })} />
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    </form>
  )
}