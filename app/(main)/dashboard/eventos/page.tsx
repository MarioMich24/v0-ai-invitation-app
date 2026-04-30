import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Empty } from '@/components/ui/empty'
import { Plus, Calendar, Clock, ExternalLink, MoreVertical, Pencil, Trash2, Eye } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EVENT_TYPE_LABELS, type Event } from '@/lib/types'

export default async function EventsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis Eventos</h1>
          <p className="text-muted-foreground">Gestiona todas tus invitaciones digitales</p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href="/crear-evento">
            <Plus className="mr-2 h-4 w-4" />
            Crear Invitacion
          </Link>
        </Button>
      </div>

      {events && events.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event: Event) => (
            <Card key={event.id} className="group rounded-2xl overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 relative">
                <Badge
                  variant={event.status === 'published' ? 'default' : 'secondary'}
                  className="absolute top-3 left-3 capitalize"
                >
                  {event.status === 'published' ? 'Publicado' : event.status === 'draft' ? 'Borrador' : 'Archivado'}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/eventos/${event.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    {event.status === 'published' && (
                      <DropdownMenuItem asChild>
                        <Link href={`/i/${event.slug}`} target="_blank">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Ver Invitacion
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                <CardDescription>
                  {EVENT_TYPE_LABELS[event.event_type as keyof typeof EVENT_TYPE_LABELS]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  {event.event_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.event_date).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  )}
                  {event.event_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {event.event_time.slice(0, 5)}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1 rounded-lg">
                    <Link href={`/dashboard/eventos/${event.id}`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                  {event.status === 'published' && (
                    <Button asChild size="sm" className="flex-1 rounded-lg">
                      <Link href={`/i/${event.slug}`} target="_blank">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl">
          <CardContent className="py-16">
            <Empty
              icon={<Calendar className="h-12 w-12" />}
              title="No tienes eventos"
              description="Crea tu primera invitacion digital para comenzar a compartir con tus invitados"
              action={
                <Button asChild className="rounded-xl">
                  <Link href="/crear-evento">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Invitacion
                  </Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
