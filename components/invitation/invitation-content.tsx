'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Church, 
  Users, 
  Gift, 
  Heart, 
  Sparkles, 
  Baby,
  ExternalLink,
  Share2
} from 'lucide-react'
import { EVENT_TYPE_LABELS, PADRINO_TYPE_LABELS } from '@/lib/types'
import { RsvpForm } from '@/components/invitation/rsvp-form'
import { GiftRegistry } from '@/components/invitation/gift-registry'

interface InvitationContentProps {
  event: {
    id: string
    event_type: string
    title: string
    slug: string
    invitation_phrase: string | null
    dress_code: string | null
    guest_limit: number | null
    pet_friendly: boolean
    no_kids: boolean
    event_date: string | null
    event_time: string | null
    event_details: Array<{
      couple_info: { partner1_name: string; partner2_name: string; story?: string } | null
      quinceanera_info: { name: string; parents?: string } | null
      child_info: { name: string; parents?: string } | null
      padrinos: Array<{ name: string; role_type: string }> | null
      church_info: { name: string; address?: string; time?: string; maps_url?: string } | null
      venue_info: { name: string; address?: string; city?: string; maps_url?: string } | null
    }> | null
    gifts: Array<{
      id: string
      title: string
      description: string | null
      price: number | null
      store_url: string | null
      claimed_by: string | null
    }> | null
  }
}

export function InvitationContent({ event }: InvitationContentProps) {
  const [activeSection, setActiveSection] = useState<'info' | 'rsvp' | 'gifts'>('info')
  
  const details = event.event_details?.[0]
  const hasGifts = event.gifts && event.gifts.length > 0

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const getEventIcon = () => {
    switch (event.event_type) {
      case 'boda':
        return <Heart className="h-8 w-8 text-rose-500" />
      case 'xv':
        return <Sparkles className="h-8 w-8 text-violet-500" />
      case 'bautizo':
        return <Baby className="h-8 w-8 text-sky-500" />
      default:
        return <Calendar className="h-8 w-8 text-primary" />
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: event.invitation_phrase || `Te invitamos a ${EVENT_TYPE_LABELS[event.event_type as keyof typeof EVENT_TYPE_LABELS]}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Yzg5ZjMiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzNHYtMkgyNHYyaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-background/80 p-4 shadow-lg">
            {getEventIcon()}
          </div>
          <Badge variant="secondary" className="mb-4">
            {EVENT_TYPE_LABELS[event.event_type as keyof typeof EVENT_TYPE_LABELS]}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {event.title}
          </h1>
          
          {/* Names */}
          {event.event_type === 'boda' && details?.couple_info && (
            <p className="mt-4 text-2xl font-light text-muted-foreground sm:text-3xl">
              {details.couple_info.partner1_name} & {details.couple_info.partner2_name}
            </p>
          )}
          {event.event_type === 'xv' && details?.quinceanera_info && (
            <p className="mt-4 text-2xl font-light text-muted-foreground sm:text-3xl">
              {details.quinceanera_info.name}
            </p>
          )}
          {event.event_type === 'bautizo' && details?.child_info && (
            <p className="mt-4 text-2xl font-light text-muted-foreground sm:text-3xl">
              {details.child_info.name}
            </p>
          )}

          {/* Date & Time */}
          {event.event_date && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-lg">
              <div className="flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 shadow">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="capitalize">{formatDate(event.event_date)}</span>
              </div>
              {event.event_time && (
                <div className="flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 shadow">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>{formatTime(event.event_time)}</span>
                </div>
              )}
            </div>
          )}

          <Button variant="outline" size="sm" onClick={handleShare} className="mt-6 rounded-full">
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex gap-1 py-2">
            <Button
              variant={activeSection === 'info' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('info')}
              className="flex-1 rounded-xl"
            >
              Informacion
            </Button>
            <Button
              variant={activeSection === 'rsvp' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('rsvp')}
              className="flex-1 rounded-xl"
            >
              Confirmar
            </Button>
            {hasGifts && (
              <Button
                variant={activeSection === 'gifts' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('gifts')}
                className="flex-1 rounded-xl"
              >
                Regalos
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        {activeSection === 'info' && (
          <div className="space-y-6">
            {/* Invitation Message */}
            {event.invitation_phrase && (
              <Card className="rounded-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary to-primary/50" />
                <CardContent className="p-6 sm:p-8">
                  <p className="whitespace-pre-wrap text-lg leading-relaxed text-foreground italic text-center">
                    {event.invitation_phrase}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Padrinos */}
            {details?.padrinos && details.padrinos.length > 0 && (
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Padrinos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {details.padrinos.map((padrino, index) => (
                      <div key={index} className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                        <span className="font-medium">{padrino.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {PADRINO_TYPE_LABELS[padrino.role_type as keyof typeof PADRINO_TYPE_LABELS]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Locations */}
            {(details?.church_info || details?.venue_info) && (
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Ubicaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {details?.church_info?.name && (
                    <div className="rounded-xl bg-muted/50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Church className="h-4 w-4 text-primary" />
                        <span className="font-medium">Ceremonia</span>
                        {details.church_info.time && (
                          <Badge variant="outline" className="ml-auto">
                            {formatTime(details.church_info.time)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-foreground">{details.church_info.name}</p>
                      {details.church_info.address && (
                        <p className="text-sm text-muted-foreground mt-1">{details.church_info.address}</p>
                      )}
                      {details.church_info.maps_url && (
                        <Button asChild variant="link" size="sm" className="mt-2 px-0">
                          <a href={details.church_info.maps_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ver en Google Maps
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                  {details?.venue_info?.name && (
                    <div className="rounded-xl bg-muted/50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium">Recepcion</span>
                      </div>
                      <p className="text-foreground">{details.venue_info.name}</p>
                      {details.venue_info.address && (
                        <p className="text-sm text-muted-foreground mt-1">{details.venue_info.address}</p>
                      )}
                      {details.venue_info.city && (
                        <p className="text-sm text-muted-foreground">{details.venue_info.city}</p>
                      )}
                      {details.venue_info.maps_url && (
                        <Button asChild variant="link" size="sm" className="mt-2 px-0">
                          <a href={details.venue_info.maps_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ver en Google Maps
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Additional Info */}
            {(event.dress_code || event.pet_friendly || event.no_kids) && (
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Informacion Adicional</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {event.dress_code && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Codigo de Vestimenta</span>
                      <Badge variant="secondary" className="capitalize">
                        {event.dress_code.replace('-', ' ')}
                      </Badge>
                    </div>
                  )}
                  {event.pet_friendly && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Mascotas</span>
                      <Badge className="bg-emerald-500">Permitidas</Badge>
                    </div>
                  )}
                  {event.no_kids && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Ninos</span>
                      <Badge variant="outline" className="text-amber-600">Solo Adultos</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeSection === 'rsvp' && (
          <RsvpForm eventId={event.id} guestLimit={event.guest_limit} />
        )}

        {activeSection === 'gifts' && hasGifts && (
          <GiftRegistry gifts={event.gifts!} eventId={event.id} />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-muted/30 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Creado con Invitaciones Digitales
        </p>
      </div>
    </div>
  )
}
