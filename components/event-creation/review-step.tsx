'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Users, Heart, Church, Sparkles, PawPrint, Baby } from 'lucide-react'
import { EVENT_TYPE_LABELS, PADRINO_TYPE_LABELS } from '@/lib/types'
import type { EventFormData } from '@/app/(main)/crear-evento/page'

interface ReviewStepProps {
  formData: EventFormData
}

export function ReviewStep({ formData }: ReviewStepProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return null
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeStr: string) => {
    if (!timeStr) return null
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground">Revisa tu Invitacion</h2>
        <p className="mt-2 text-muted-foreground">
          Verifica que toda la informacion sea correcta antes de crear tu evento
        </p>
      </div>

      {/* Event Type & Title */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Informacion del Evento</CardTitle>
            <Badge variant="secondary" className="text-sm">
              {formData.eventType && EVENT_TYPE_LABELS[formData.eventType]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{formData.title || 'Sin titulo'}</h3>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {formData.eventDate && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="capitalize">{formatDate(formData.eventDate)}</span>
              </div>
            )}
            {formData.eventTime && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="h-5 w-5 text-primary" />
                <span>{formatTime(formData.eventTime)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.dressCode && (
              <Badge variant="outline" className="capitalize">
                {formData.dressCode.replace('-', ' ')}
              </Badge>
            )}
            {formData.guestLimit && (
              <Badge variant="outline">
                <Users className="mr-1 h-3 w-3" />
                {formData.guestLimit} invitados max
              </Badge>
            )}
            {formData.petFriendly && (
              <Badge variant="outline" className="text-emerald-600">
                <PawPrint className="mr-1 h-3 w-3" />
                Pet Friendly
              </Badge>
            )}
            {formData.noKids && (
              <Badge variant="outline" className="text-amber-600">
                <Baby className="mr-1 h-3 w-3" />
                Solo Adultos
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Couple/Person Info */}
      {formData.eventType === 'boda' && formData.coupleInfo?.partner1_name && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-rose-500" />
              La Pareja
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-foreground">
              {formData.coupleInfo.partner1_name} & {formData.coupleInfo.partner2_name}
            </p>
            {formData.coupleInfo.story && (
              <p className="mt-2 text-muted-foreground">{formData.coupleInfo.story}</p>
            )}
          </CardContent>
        </Card>
      )}

      {formData.eventType === 'xv' && formData.quinceaneraInfo?.name && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-violet-500" />
              La Quinceanera
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-foreground">{formData.quinceaneraInfo.name}</p>
            {formData.quinceaneraInfo.parents && (
              <p className="mt-1 text-muted-foreground">Hija de {formData.quinceaneraInfo.parents}</p>
            )}
          </CardContent>
        </Card>
      )}

      {formData.eventType === 'bautizo' && formData.childInfo?.name && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Baby className="h-5 w-5 text-sky-500" />
              El Bautizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-foreground">{formData.childInfo.name}</p>
            {formData.childInfo.parents && (
              <p className="mt-1 text-muted-foreground">Hijo/a de {formData.childInfo.parents}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Padrinos */}
      {formData.padrinos.length > 0 && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Padrinos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {formData.padrinos.map((padrino, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span className="font-medium text-foreground">{padrino.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {PADRINO_TYPE_LABELS[padrino.role_type]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locations */}
      {(formData.churchInfo?.name || formData.venueInfo?.name) && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" />
              Ubicaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.churchInfo?.name && (
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Church className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Ceremonia</span>
                  {formData.churchInfo.time && (
                    <Badge variant="outline" className="ml-auto">
                      {formatTime(formData.churchInfo.time)}
                    </Badge>
                  )}
                </div>
                <p className="text-foreground">{formData.churchInfo.name}</p>
                {formData.churchInfo.address && (
                  <p className="text-sm text-muted-foreground">{formData.churchInfo.address}</p>
                )}
              </div>
            )}
            {formData.venueInfo?.name && (
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Recepcion</span>
                </div>
                <p className="text-foreground">{formData.venueInfo.name}</p>
                {formData.venueInfo.address && (
                  <p className="text-sm text-muted-foreground">{formData.venueInfo.address}</p>
                )}
                {formData.venueInfo.city && (
                  <p className="text-sm text-muted-foreground">{formData.venueInfo.city}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Invitation Text */}
      {formData.invitationPhrase && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Mensaje de Invitacion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-6">
              <p className="whitespace-pre-wrap text-foreground italic leading-relaxed">
                {formData.invitationPhrase}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
