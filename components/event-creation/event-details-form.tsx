'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Field, FieldGroup, FieldLabel, FieldMessage } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { generateInvitationText } from '@/app/actions/ai-actions'
import { Sparkles, Plus, Trash2, MapPin, Church, Users, Heart, Baby, GraduationCap, PartyPopper } from 'lucide-react'
import type { EventType, PadrinoType, Padrino, CoupleInfo, QuinceaneraInfo, ChildInfo, LocationInfo, ParentsInfo } from '@/lib/types'
import { PADRINO_TYPE_LABELS, EVENT_TYPE_LABELS } from '@/lib/types'
import type { EventFormData } from '@/app/(main)/crear-evento/page'

interface EventDetailsFormProps {
  eventType: EventType
  formData: EventFormData
  updateFormData: (data: Partial<EventFormData>) => void
}

// Card Section Component
function CardSection({ 
  title, 
  description, 
  icon, 
  children,
  className = ''
}: { 
  title: string
  description?: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={`rounded-2xl ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function EventDetailsForm({ eventType, formData, updateFormData }: EventDetailsFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateText = async () => {
    setIsGenerating(true)
    
    const names = eventType === 'boda' && formData.coupleInfo
      ? `${formData.coupleInfo.partner1_name} y ${formData.coupleInfo.partner2_name}`
      : eventType === 'xv' && formData.quinceaneraInfo
      ? formData.quinceaneraInfo.name
      : eventType === 'bautizo' && formData.childInfo
      ? formData.childInfo.name
      : formData.title

    const result = await generateInvitationText(eventType, {
      names,
      date: formData.eventDate,
      venue: formData.venueInfo?.name,
    })

    setIsGenerating(false)

    if (result.text) {
      updateFormData({ invitationPhrase: result.text })
    }
  }

  const addPadrino = () => {
    updateFormData({
      padrinos: [...formData.padrinos, { name: '', role_type: 'general' }]
    })
  }

  const removePadrino = (index: number) => {
    updateFormData({
      padrinos: formData.padrinos.filter((_, i) => i !== index)
    })
  }

  const updatePadrino = (index: number, data: Partial<Padrino>) => {
    const updated = [...formData.padrinos]
    updated[index] = { ...updated[index], ...data }
    updateFormData({ padrinos: updated })
  }

  // Get padrino options based on event type
  const getPadrinoOptions = (): PadrinoType[] => {
    switch (eventType) {
      case 'boda':
        return ['honor', 'velacion', 'lazo', 'arras', 'anillos', 'biblia', 'rosario', 'ramo', 'brindis', 'pastel']
      case 'xv':
        return ['honor', 'vals', 'ultima_muneca', 'zapato', 'corona', 'cojin', 'brindis', 'pastel']
      case 'bautizo':
        return ['honor', 'general']
      default:
        return ['general']
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <CardSection 
        title="Informacion Basica" 
        description="Datos principales de tu evento"
        icon={<PartyPopper className="h-5 w-5" />}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Titulo del Evento *</FieldLabel>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              placeholder={`Ej: ${eventType === 'boda' ? 'Boda de Maria y Juan' : eventType === 'xv' ? 'XV Anos de Sofia' : 'Mi Evento Especial'}`}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="eventDate">Fecha del Evento</FieldLabel>
              <Input
                id="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={(e) => updateFormData({ eventDate: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="eventTime">Hora del Evento</FieldLabel>
              <Input
                id="eventTime"
                type="time"
                value={formData.eventTime}
                onChange={(e) => updateFormData({ eventTime: e.target.value })}
              />
            </Field>
          </div>
        </FieldGroup>
      </CardSection>

      {/* Event-specific sections */}
      {eventType === 'boda' && (
        <CardSection 
          title="Informacion de la Pareja" 
          description="Datos de los novios"
          icon={<Heart className="h-5 w-5" />}
        >
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="partner1">Nombre del Novio/a</FieldLabel>
                <Input
                  id="partner1"
                  value={formData.coupleInfo?.partner1_name || ''}
                  onChange={(e) => updateFormData({ 
                    coupleInfo: { 
                      ...formData.coupleInfo,
                      partner1_name: e.target.value,
                      partner2_name: formData.coupleInfo?.partner2_name || ''
                    }
                  })}
                  placeholder="Nombre completo"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="partner2">Nombre del Novio/a</FieldLabel>
                <Input
                  id="partner2"
                  value={formData.coupleInfo?.partner2_name || ''}
                  onChange={(e) => updateFormData({ 
                    coupleInfo: { 
                      ...formData.coupleInfo,
                      partner1_name: formData.coupleInfo?.partner1_name || '',
                      partner2_name: e.target.value
                    }
                  })}
                  placeholder="Nombre completo"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="coupleStory">Historia de Amor (Opcional)</FieldLabel>
              <Textarea
                id="coupleStory"
                value={formData.coupleInfo?.story || ''}
                onChange={(e) => updateFormData({ 
                  coupleInfo: { 
                    ...formData.coupleInfo,
                    partner1_name: formData.coupleInfo?.partner1_name || '',
                    partner2_name: formData.coupleInfo?.partner2_name || '',
                    story: e.target.value
                  }
                })}
                placeholder="Cuenta brevemente como se conocieron..."
                rows={3}
              />
            </Field>
          </FieldGroup>
        </CardSection>
      )}

      {eventType === 'xv' && (
        <CardSection 
          title="Informacion de la Quinceanera" 
          description="Datos de la festejada"
          icon={<Sparkles className="h-5 w-5" />}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="quinceaneraName">Nombre de la Quinceanera</FieldLabel>
              <Input
                id="quinceaneraName"
                value={formData.quinceaneraInfo?.name || ''}
                onChange={(e) => updateFormData({ 
                  quinceaneraInfo: { 
                    ...formData.quinceaneraInfo,
                    name: e.target.value
                  }
                })}
                placeholder="Nombre completo"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="quinceaneraParents">Nombre de los Padres</FieldLabel>
              <Input
                id="quinceaneraParents"
                value={formData.quinceaneraInfo?.parents || ''}
                onChange={(e) => updateFormData({ 
                  quinceaneraInfo: { 
                    ...formData.quinceaneraInfo,
                    name: formData.quinceaneraInfo?.name || '',
                    parents: e.target.value
                  }
                })}
                placeholder="Ej: Sr. Juan Perez y Sra. Maria de Perez"
              />
            </Field>
          </FieldGroup>
        </CardSection>
      )}

      {eventType === 'bautizo' && (
        <CardSection 
          title="Informacion del Bautizo" 
          description="Datos del bebe y familia"
          icon={<Baby className="h-5 w-5" />}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="childName">Nombre del Bebe</FieldLabel>
              <Input
                id="childName"
                value={formData.childInfo?.name || ''}
                onChange={(e) => updateFormData({ 
                  childInfo: { 
                    ...formData.childInfo,
                    name: e.target.value
                  }
                })}
                placeholder="Nombre completo"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="childParents">Nombre de los Padres</FieldLabel>
              <Input
                id="childParents"
                value={formData.childInfo?.parents || ''}
                onChange={(e) => updateFormData({ 
                  childInfo: { 
                    ...formData.childInfo,
                    name: formData.childInfo?.name || '',
                    parents: e.target.value
                  }
                })}
                placeholder="Ej: Juan y Maria Perez"
              />
            </Field>
          </FieldGroup>
        </CardSection>
      )}

      {/* Padrinos Section - Only for certain event types */}
      {['boda', 'xv', 'bautizo'].includes(eventType) && (
        <CardSection 
          title="Padrinos" 
          description="Agrega a los padrinos del evento"
          icon={<Users className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {formData.padrinos.map((padrino, index) => (
              <div key={index} className="flex gap-3 items-start p-4 rounded-xl bg-muted/50">
                <div className="flex-1 grid gap-3 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Nombre</FieldLabel>
                    <Input
                      value={padrino.name}
                      onChange={(e) => updatePadrino(index, { name: e.target.value })}
                      placeholder="Nombre del padrino/madrina"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Tipo de Padrino</FieldLabel>
                    <Select
                      value={padrino.role_type}
                      onValueChange={(value) => updatePadrino(index, { role_type: value as PadrinoType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getPadrinoOptions().map((type) => (
                          <SelectItem key={type} value={type}>
                            {PADRINO_TYPE_LABELS[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removePadrino(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addPadrino} className="w-full rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Padrino
            </Button>
          </div>
        </CardSection>
      )}

      {/* Church Info */}
      {['boda', 'xv', 'bautizo'].includes(eventType) && (
        <CardSection 
          title="Ceremonia Religiosa" 
          description="Informacion de la iglesia (opcional)"
          icon={<Church className="h-5 w-5" />}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="churchName">Nombre de la Iglesia</FieldLabel>
              <Input
                id="churchName"
                value={formData.churchInfo?.name || ''}
                onChange={(e) => updateFormData({ 
                  churchInfo: { 
                    ...formData.churchInfo,
                    name: e.target.value
                  }
                })}
                placeholder="Ej: Parroquia de San Jose"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="churchAddress">Direccion</FieldLabel>
              <Input
                id="churchAddress"
                value={formData.churchInfo?.address || ''}
                onChange={(e) => updateFormData({ 
                  churchInfo: { 
                    ...formData.churchInfo,
                    name: formData.churchInfo?.name || '',
                    address: e.target.value
                  }
                })}
                placeholder="Direccion completa"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="churchTime">Hora de la Ceremonia</FieldLabel>
                <Input
                  id="churchTime"
                  type="time"
                  value={formData.churchInfo?.time || ''}
                  onChange={(e) => updateFormData({ 
                    churchInfo: { 
                      ...formData.churchInfo,
                      name: formData.churchInfo?.name || '',
                      time: e.target.value
                    }
                  })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="churchMaps">Link de Google Maps</FieldLabel>
                <Input
                  id="churchMaps"
                  value={formData.churchInfo?.maps_url || ''}
                  onChange={(e) => updateFormData({ 
                    churchInfo: { 
                      ...formData.churchInfo,
                      name: formData.churchInfo?.name || '',
                      maps_url: e.target.value
                    }
                  })}
                  placeholder="https://maps.google.com/..."
                />
              </Field>
            </div>
          </FieldGroup>
        </CardSection>
      )}

      {/* Venue Info */}
      <CardSection 
        title="Recepcion / Lugar del Evento" 
        description="Donde se llevara a cabo la celebracion"
        icon={<MapPin className="h-5 w-5" />}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="venueName">Nombre del Lugar</FieldLabel>
            <Input
              id="venueName"
              value={formData.venueInfo?.name || ''}
              onChange={(e) => updateFormData({ 
                venueInfo: { 
                  ...formData.venueInfo,
                  name: e.target.value
                }
              })}
              placeholder="Ej: Salon de Eventos La Hacienda"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="venueAddress">Direccion</FieldLabel>
            <Input
              id="venueAddress"
              value={formData.venueInfo?.address || ''}
              onChange={(e) => updateFormData({ 
                venueInfo: { 
                  ...formData.venueInfo,
                  name: formData.venueInfo?.name || '',
                  address: e.target.value
                }
              })}
              placeholder="Direccion completa"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="venueCity">Ciudad</FieldLabel>
              <Input
                id="venueCity"
                value={formData.venueInfo?.city || ''}
                onChange={(e) => updateFormData({ 
                  venueInfo: { 
                    ...formData.venueInfo,
                    name: formData.venueInfo?.name || '',
                    city: e.target.value
                  }
                })}
                placeholder="Ciudad"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="venueMaps">Link de Google Maps</FieldLabel>
              <Input
                id="venueMaps"
                value={formData.venueInfo?.maps_url || ''}
                onChange={(e) => updateFormData({ 
                  venueInfo: { 
                    ...formData.venueInfo,
                    name: formData.venueInfo?.name || '',
                    maps_url: e.target.value
                  }
                })}
                placeholder="https://maps.google.com/..."
              />
            </Field>
          </div>
        </FieldGroup>
      </CardSection>

      {/* Invitation Text with AI */}
      <CardSection 
        title="Texto de Invitacion" 
        description="Escribe o genera con IA el mensaje de tu invitacion"
        icon={<Sparkles className="h-5 w-5" />}
      >
        <FieldGroup>
          <Field>
            <div className="flex items-center justify-between mb-2">
              <FieldLabel htmlFor="invitationPhrase">Mensaje de Invitacion</FieldLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateText}
                disabled={isGenerating}
                className="rounded-lg"
              >
                {isGenerating ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generar con IA
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="invitationPhrase"
              value={formData.invitationPhrase}
              onChange={(e) => updateFormData({ invitationPhrase: e.target.value })}
              placeholder="Escribe el texto de tu invitacion o usa el boton de IA para generarlo automaticamente..."
              rows={6}
            />
          </Field>
        </FieldGroup>
      </CardSection>

      {/* Additional Options */}
      <CardSection 
        title="Opciones Adicionales" 
        description="Configuracion extra para tu evento"
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="dressCode">Codigo de Vestimenta</FieldLabel>
            <Select
              value={formData.dressCode}
              onValueChange={(value) => updateFormData({ dressCode: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal - Traje y vestido largo</SelectItem>
                <SelectItem value="semi-formal">Semi-formal - Vestido cocktail</SelectItem>
                <SelectItem value="casual-elegante">Casual Elegante</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="tematico">Tematico</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="guestLimit">Limite de Invitados</FieldLabel>
            <Input
              id="guestLimit"
              type="number"
              value={formData.guestLimit || ''}
              onChange={(e) => updateFormData({ guestLimit: e.target.value ? parseInt(e.target.value) : null })}
              placeholder="Sin limite"
            />
          </Field>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Evento Pet Friendly</p>
              <p className="text-sm text-muted-foreground">Permite mascotas en el evento</p>
            </div>
            <Switch
              checked={formData.petFriendly}
              onCheckedChange={(checked) => updateFormData({ petFriendly: checked })}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Evento Solo Adultos</p>
              <p className="text-sm text-muted-foreground">No se permiten ninos</p>
            </div>
            <Switch
              checked={formData.noKids}
              onCheckedChange={(checked) => updateFormData({ noKids: checked })}
            />
          </div>
        </FieldGroup>
      </CardSection>
    </div>
  )
}
