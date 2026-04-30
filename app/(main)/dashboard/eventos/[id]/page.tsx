import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Gift,
  Copy,
  Check
} from 'lucide-react'
import { EVENT_TYPE_LABELS, PADRINO_TYPE_LABELS } from '@/lib/types'
import { EventActions } from '@/components/dashboard/event-actions'
import { RsvpList } from '@/components/dashboard/rsvp-list'
import { GiftList } from '@/components/dashboard/gift-list'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

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
    .eq('user_id', user?.id)
    .single()

  if (error || !event) {
    notFound()
  }

  const confirmedRsvps = event.rsvps?.filter((r: { status: string }) => r.status === 'confirmed').length || 0
  const totalRsvps = event.rsvps?.length || 0
  const claimedGifts = event.gifts?.filter((g: { claimed_by: string }) => g.claimed_by).length || 0
  const totalGifts = event.gifts?.length || 0

  const invitationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/i/${event.slug}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-xl">
            <Link href="/dashboard/eventos">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{event.title}</h1>
              <Badge
                variant={event.status === 'published' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {event.status === 'published' ? 'Publicado' : event.status === 'draft' ? 'Borrador' : 'Archivado'}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {EVENT_TYPE_LABELS[event.event_type as keyof typeof EVENT_TYPE_LABELS]}
            </p>
          </div>
        </div>
        <EventActions event={event} />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="rounded-2xl">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha</p>
              <p className="font-semibold">
                {event.event_date 
                  ? new Date(event.event_date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'Sin definir'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confirmados</p>
              <p className="font-semibold">{confirmedRsvps} de {totalRsvps}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Regalos</p>
              <p className="font-semibold">{claimedGifts} de {totalGifts}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hora</p>
              <p className="font-semibold">
                {event.event_time ? event.event_time.slice(0, 5) : 'Sin definir'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Share Link */}
      {event.status === 'published' && (
        <Card className="rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-foreground">Enlace de tu Invitacion</p>
              <p className="text-sm text-muted-foreground break-all">{invitationUrl}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg">
                <Copy className="mr-2 h-4 w-4" />
                Copiar
              </Button>
              <Button asChild size="sm" className="rounded-lg">
                <Link href={`/i/${event.slug}`} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="rounded-xl bg-muted p-1">
          <TabsTrigger value="details" className="rounded-lg">Detalles</TabsTrigger>
          <TabsTrigger value="rsvps" className="rounded-lg">Confirmaciones ({totalRsvps})</TabsTrigger>
          <TabsTrigger value="gifts" className="rounded-lg">Regalos ({totalGifts})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          {/* Event Details */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Informacion del Evento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.invitation_phrase && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Mensaje de Invitacion</p>
                  <p className="text-foreground whitespace-pre-wrap">{event.invitation_phrase}</p>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {event.dress_code && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Codigo de Vestimenta</p>
                    <p className="text-foreground capitalize">{event.dress_code.replace('-', ' ')}</p>
                  </div>
                )}
                {event.guest_limit && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Limite de Invitados</p>
                    <p className="text-foreground">{event.guest_limit}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                {event.pet_friendly && (
                  <Badge variant="outline" className="text-emerald-600">Pet Friendly</Badge>
                )}
                {event.no_kids && (
                  <Badge variant="outline" className="text-amber-600">Solo Adultos</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Padrinos */}
          {event.event_details?.[0]?.padrinos && event.event_details[0].padrinos.length > 0 && (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Padrinos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {event.event_details[0].padrinos.map((padrino: { name: string; role_type: string }, index: number) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
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
        </TabsContent>

        <TabsContent value="rsvps">
          <RsvpList rsvps={event.rsvps || []} eventId={event.id} />
        </TabsContent>

        <TabsContent value="gifts">
          <GiftList gifts={event.gifts || []} eventId={event.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
