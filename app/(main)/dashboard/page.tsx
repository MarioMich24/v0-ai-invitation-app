import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Empty } from '@/components/ui/empty'
import { 
  Plus, 
  Calendar, 
  Users, 
  Gift, 
  Eye,
  ArrowRight,
  Clock
} from 'lucide-react'
import { EVENT_TYPE_LABELS, type Event } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // 1. Obtener TODOS los eventos del usuario para calcular estadísticas globales correctas
  const { data: allEvents } = await supabase
    .from('events')
    .select('id, status')
    .eq('user_id', user?.id)

  const totalEvents = allEvents?.length || 0
  const publishedEvents = allEvents?.filter(e => e.status === 'published').length || 0
  const allEventIds = allEvents?.map(e => e.id) || []

  // 2. Obtener solo los 5 más recientes para la lista visual inferior
  const { data: recentEvents } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // 3. Obtener confirmaciones (RSVPs) de TODOS los eventos del usuario
  let rsvpStats: any[] = []
  if (allEventIds.length > 0) {
    const { data } = await supabase
      .from('rsvps')
      .select('status')
      .in('event_id', allEventIds)
    rsvpStats = data || []
  }
  const totalRsvps = rsvpStats.length
  const confirmedRsvps = rsvpStats.filter(r => r.status === 'confirmed').length

  // 4. Obtener regalos (Gifts) de TODOS los eventos del usuario (¡NUEVO!)
  let giftStats: any[] = []
  if (allEventIds.length > 0) {
    const { data } = await supabase
      .from('gifts')
      .select('id, claimed_by')
      .in('event_id', allEventIds)
    giftStats = data || []
  }
  const totalGifts = giftStats.length
  const claimedGifts = giftStats.filter(g => g.claimed_by).length

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'Usuario'

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hola, {userName}</h1>
          <p className="text-muted-foreground">Aquí tienes un resumen de tus eventos</p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href="/crear-evento">
            <Plus className="mr-2 h-4 w-4" />
            Crear Invitación
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">{publishedEvents} publicados</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confirmaciones</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{confirmedRsvps}</div>
            <p className="text-xs text-muted-foreground">de {totalRsvps} respuestas</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vistas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Nota: Como no hay una tabla de analíticas/vistas en tu esquema actual, 
                dejamos la UI lista. Puedes añadir una columna `views_count` en la tabla `events` más adelante */}
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">vistas totales</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Regalos</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalGifts}</div>
            <p className="text-xs text-muted-foreground">{claimedGifts} reclamados</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Eventos Recientes</CardTitle>
              <CardDescription>Tus últimas invitaciones creadas</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/eventos">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentEvents && recentEvents.length > 0 ? (
            <div className="space-y-4">
              {recentEvents.map((event: Event) => (
                <Link
                  key={event.id}
                  href={`/dashboard/eventos/${event.id}`}
                  className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                      {event.title.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{EVENT_TYPE_LABELS[event.event_type as keyof typeof EVENT_TYPE_LABELS]}</span>
                        {event.event_date && (
                          <>
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(event.event_date).toLocaleDateString('es-MX', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={event.status === 'published' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {event.status === 'published' ? 'Publicado' : event.status === 'draft' ? 'Borrador' : 'Archivado'}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : (
            <Empty
              icon={<Calendar className="h-10 w-10" />}
              title="No tienes eventos"
              description="Crea tu primera invitación digital para comenzar"
              action={
                <Button asChild className="rounded-xl">
                  <Link href="/crear-evento">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Invitación
                  </Link>
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}