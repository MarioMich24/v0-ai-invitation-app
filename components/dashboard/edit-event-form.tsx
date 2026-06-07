'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Save, Plus, Trash2, Sparkles, Heart, Church, MapPin, Users, Baby } from 'lucide-react'
import { toast } from 'sonner'
import { updateFullEvent } from '@/app/actions/update-full-event'
import { generateInvitationText } from '@/app/actions/ai-actions'
import { PADRINO_TYPE_LABELS } from '@/lib/types'
import type { Padrino, PadrinoType } from '@/lib/types'

export function EditEventForm({ initialEvent }: { initialEvent: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const details = initialEvent.event_details?.[0] || {}

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
    padrinos: (details.padrinos || []) as Padrino[],
    churchInfo: details.church_info || { name: '', address: '', time: '', maps_url: '' },
    venueInfo: details.venue_info || { name: '', address: '', maps_url: '' },
  })

  const handleGenerateText = async () => {
    setIsGenerating(true)
    let names = formData.title
    if (initialEvent.event_type === 'boda') {
      names = `${formData.coupleInfo.partner1_name} y ${formData.coupleInfo.partner2_name}`
    } else if (initialEvent.event_type === 'xv') {
      names = formData.quinceaneraInfo.name
    } else if (initialEvent.event_type === 'bautizo') {
      names = formData.childInfo.name
    }
    const result = await generateInvitationText(initialEvent.event_type, { names, date: formData.eventDate, venue: formData.venueInfo?.name })
    setIsGenerating(false)
    if (result.text) setFormData(prev => ({ ...prev, invitationPhrase: result.text }))
  }

  const addPadrino = () => {
    setFormData(prev => ({
      ...prev,
      padrinos: [...prev.padrinos, { name: '', role_type: 'general' }]
    }))
  }

  const removePadrino = (index: number) => {
    setFormData(prev => ({
      ...prev,
      padrinos: prev.padrinos.filter((_, i) => i !== index)
    }))
  }

  const updatePadrino = (index: number, data: Partial<Padrino>) => {
    const updated = [...formData.padrinos]
    updated[index] = { ...updated[index], ...data } as Padrino
    setFormData(prev => ({ ...prev, padrinos: updated }))
  }

  const getPadrinoOptions = (): PadrinoType[] => {
    switch (initialEvent.event_type) {
      case 'boda':
        return ['honor', 'velacion', 'lazo', 'arras', 'anillos', 'biblia', 'rosario', 'ramo', 'brindis', 'pastel']
      case 'xv':
        return ['honor', 'vals', 'ultima_muneca', 'zapato', 'corona', 'brindis', 'pastel']
      case 'bautizo':
        return ['honor', 'general']
      default:
        return ['general']
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('El título del evento es requerido')
      return
    }

    if (!formData.venueInfo?.name || formData.venueInfo.name.trim() === '') {
      toast.error('El nombre del lugar de la Recepción es obligatorio.')
      return
    }
    if (!formData.venueInfo?.address || formData.venueInfo.address.trim() === '') {
      toast.error('La dirección completa de la Recepción es obligatoria.')
      return
    }
    if (!formData.venueInfo?.maps_url || formData.venueInfo.maps_url.trim() === '') {
      toast.error('El enlace de Google Maps de la Recepción es obligatorio.')
      return
    }

    if (formData.guestLimit !== '' && Number(formData.guestLimit) < 1) {
      toast.error('El límite de invitados debe ser al menos 1')
      return
    }

    const mapRegex = /^https?:\/\/(www\.)?(google\.com\/maps|maps\.app\.goo\.gl|goo\.gl\/maps).*/;
    
    if (formData.churchInfo?.maps_url && formData.churchInfo.maps_url.trim() !== '') {
      if (!mapRegex.test(formData.churchInfo.maps_url.trim())) {
        toast.error('El enlace de la Ceremonia Religiosa debe ser de Google Maps')
        return
      }
    }
    
    if (!mapRegex.test(formData.venueInfo.maps_url.trim())) {
      toast.error('El enlace de la Recepción debe ser de Google Maps')
      return
    }

    setIsSubmitting(true)
    const res = await updateFullEvent(initialEvent.id, formData)
    setIsSubmitting(false)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success('¡Invitación modificada exitosamente!')
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
                <Input type="date" min={new Date().toISOString().split('T')[0]} value={formData.eventDate} onChange={e => setFormData({ ...formData, eventDate: e.target.value })} />
              </Field>
              <Field>
                <FieldLabel>Hora</FieldLabel>
                <Input type="time" value={formData.eventTime} onChange={e => setFormData({ ...formData, eventTime: e.target.value })} />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {initialEvent.event_type === 'boda' && (
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              <CardTitle className="text-lg">Información de los Novios</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <Field>
                <FieldLabel>Nombre de la Novia</FieldLabel>
                <Input value={formData.coupleInfo.partner1_name} onChange={e => setFormData({ ...formData, coupleInfo: { ...formData.coupleInfo, partner1_name: e.target.value } })} />
              </Field>
              <Field>
                <FieldLabel>Nombre del Novio</FieldLabel>
                <Input value={formData.coupleInfo.partner2_name} onChange={e => setFormData({ ...formData, coupleInfo: { ...formData.coupleInfo, partner2_name: e.target.value } })} />
              </Field>
            </div>
            {/* NUEVO BLOQUE PARA LOS PADRES */}
            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <Field>
                <FieldLabel>Padres de la Novia</FieldLabel>
                <Input placeholder="Ej: Sr. Juan y Sra. María" value={formData.coupleInfo.partner1_parents || ''} onChange={e => setFormData({ ...formData, coupleInfo: { ...formData.coupleInfo, partner1_parents: e.target.value } })} />
              </Field>
              <Field>
                <FieldLabel>Padres del Novio</FieldLabel>
                <Input placeholder="Ej: Sr. Pedro y Sra. Ana" value={formData.coupleInfo.partner2_parents || ''} onChange={e => setFormData({ ...formData, coupleInfo: { ...formData.coupleInfo, partner2_parents: e.target.value } })} />
              </Field>
            </div>
            <Field>
              <FieldLabel>Nuestra Historia (Opcional)</FieldLabel>
              <Textarea rows={3} value={formData.coupleInfo.story || ''} onChange={e => setFormData({ ...formData, coupleInfo: { ...formData.coupleInfo, story: e.target.value } })} />
            </Field>
          </CardContent>
        </Card>
      )}

      {initialEvent.event_type === 'xv' && (
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-500" />
              <CardTitle className="text-lg">Información de la Quinceañera</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Nombre de la Quinceañera</FieldLabel>
                <Input value={formData.quinceaneraInfo.name} onChange={e => setFormData({ ...formData, quinceaneraInfo: { ...formData.quinceaneraInfo, name: e.target.value } })} />
              </Field>
              <Field>
                <FieldLabel>Nombre de los Padres</FieldLabel>
                <Input value={formData.quinceaneraInfo.parents || ''} onChange={e => setFormData({ ...formData, quinceaneraInfo: { ...formData.quinceaneraInfo, parents: e.target.value } })} placeholder="Ej: Sr. Juan Pérez y Sra. María de Pérez" />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      )}

      {initialEvent.event_type === 'bautizo' && (
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-sky-500" />
              <CardTitle className="text-lg">Información del Bautizo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Nombre del Bebé</FieldLabel>
                <Input value={formData.childInfo.name} onChange={e => setFormData({ ...formData, childInfo: { ...formData.childInfo, name: e.target.value } })} />
              </Field>
              <Field>
                <FieldLabel>Nombre de los Padres</FieldLabel>
                <Input value={formData.childInfo.parents || ''} onChange={e => setFormData({ ...formData, childInfo: { ...formData.childInfo, parents: e.target.value } })} />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      )}

      {['boda', 'xv', 'bautizo'].includes(initialEvent.event_type) && (
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Padrinos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.padrinos.map((padrino, index) => (
                <div key={index} className="flex gap-3 items-start p-4 rounded-xl bg-muted/50">
                  <div className="flex-1 grid gap-3 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>Nombre</FieldLabel>
                      <Input value={padrino.name} onChange={e => updatePadrino(index, { name: e.target.value })} placeholder="Nombre del padrino/madrina" />
                    </Field>
                    <Field>
                      <FieldLabel>Tipo de Padrino</FieldLabel>
                      <Select value={padrino.role_type} onValueChange={value => updatePadrino(index, { role_type: value as PadrinoType })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getPadrinoOptions().map(type => (
                            <SelectItem key={type} value={type}>{PADRINO_TYPE_LABELS[type]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removePadrino(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addPadrino} className="w-full rounded-xl">
                <Plus className="mr-2 h-4 w-4" /> Agregar Padrino
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {['boda', 'xv', 'bautizo'].includes(initialEvent.event_type) && (
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Church className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Ceremonia Religiosa (Opcional)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="churchName">Nombre de la Iglesia</FieldLabel>
                <Input id="churchName" name="churchName" value={formData.churchInfo?.name || ''} onChange={e => setFormData({ ...formData, churchInfo: { ...formData.churchInfo, name: e.target.value } })} placeholder="Ej: Parroquia de San José" />
              </Field>
              <Field>
                <FieldLabel htmlFor="churchAddress">Dirección de la Iglesia</FieldLabel>
                <Input id="churchAddress" name="churchAddress" value={formData.churchInfo?.address || ''} onChange={e => setFormData({ ...formData, churchInfo: { ...formData.churchInfo, address: e.target.value } })} placeholder="Calle, número, colonia..." autoComplete="off" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="churchTime">Hora de la Ceremonia</FieldLabel>
                  <Input id="churchTime" type="time" value={formData.churchInfo?.time || ''} onChange={e => setFormData({ ...formData, churchInfo: { ...formData.churchInfo, time: e.target.value } })} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="churchMaps">Link de Google Maps</FieldLabel>
                  <Input id="churchMaps" name="churchMaps" value={formData.churchInfo?.maps_url || ''} onChange={e => setFormData({ ...formData, churchInfo: { ...formData.churchInfo, maps_url: e.target.value } })} placeholder="https://maps.google.com/..." autoComplete="off" />
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Recepción / Lugar del Evento</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Nombre del Lugar</FieldLabel>
              <Input value={formData.venueInfo?.name || ''} onChange={e => setFormData({ ...formData, venueInfo: { ...formData.venueInfo, name: e.target.value } })} placeholder="Ej: Salón de Eventos La Hacienda" />
            </Field>
            <Field>
              <FieldLabel htmlFor="venueAddress">Dirección de la Recepción</FieldLabel>
              <Input id="venueAddress" name="venueAddress" value={formData.venueInfo?.address || ''} onChange={e => setFormData({ ...formData, venueInfo: { ...formData.venueInfo, address: e.target.value } })} placeholder="Calle, número, colonia..." autoComplete="off" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Ciudad</FieldLabel>
                <Input value={formData.venueInfo?.city || ''} onChange={e => setFormData({ ...formData, venueInfo: { ...formData.venueInfo, city: e.target.value } })} placeholder="Ciudad" />
              </Field>
              <Field>
                <FieldLabel htmlFor="venueMaps">Link de Google Maps</FieldLabel>
                <Input id="venueMaps" name="venueMaps" value={formData.venueInfo?.maps_url || ''} onChange={e => setFormData({ ...formData, venueInfo: { ...formData.venueInfo, maps_url: e.target.value } })} placeholder="https://maps.google.com/..." autoComplete="off" />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

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
                    <SelectItem value="formal">Formal - Traje y vestido largo</SelectItem>
                    <SelectItem value="semi-formal">Semi-formal - Vestido cocktail</SelectItem>
                    <SelectItem value="casual-elegante">Casual Elegante</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="tematico">Temático</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Límite de Invitados por Pase</FieldLabel>
                <Input type="number" min="1" value={formData.guestLimit} onChange={e => setFormData({ ...formData, guestLimit: e.target.value })} placeholder="Sin límite" />
              </Field>
            </div>
            <div className="flex items-center justify-between py-2 border-t">
              <div>
                <p className="font-medium">Evento Pet Friendly</p>
                <p className="text-sm text-muted-foreground">Se permite mascotas en el evento</p>
              </div>
              <Switch checked={formData.petFriendly} onCheckedChange={val => setFormData({ ...formData, petFriendly: val })} />
            </div>
            <div className="flex items-center justify-between py-2 border-t">
              <div>
                <p className="font-medium">Solo Adultos (No Niños)</p>
                <p className="text-sm text-muted-foreground">No se permiten niños</p>
              </div>
              <Switch checked={formData.noKids} onCheckedChange={val => setFormData({ ...formData, noKids: val })} />
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    </form>
  )
}