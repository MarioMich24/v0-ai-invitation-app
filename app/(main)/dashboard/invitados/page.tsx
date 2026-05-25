import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Empty } from '@/components/ui/empty'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, Check, X, Clock, Calendar } from 'lucide-react'

export default async function InvitadosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Obtener los eventos del usuario
  const { data: events } = await supabase
    .from('events')
    .select('id, title')
    .eq('user_id', user?.id)

  const eventIds = events?.map(e => e.id) || []

  // Obtener todas las confirmaciones de esos eventos
  let rsvps: any[] = []
  if (eventIds.length > 0) {
    const { data } = await supabase
      .from('rsvps')
      .select('*, events(title)')
      .in('event_id', eventIds)
      .order('created_at', { ascending: false })
    
    rsvps = data || []
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-emerald-500"><Check className="mr-1 h-3 w-3" />Confirmado</Badge>
      case 'declined':
        return <Badge variant="destructive"><X className="mr-1 h-3 w-3" />Declinado</Badge>
      default:
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Pendiente</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Todos los Invitados</h1>
        <p className="text-muted-foreground">
          Historial de confirmaciones (RSVP) de todos tus eventos
        </p>
      </div>

      {rsvps.length > 0 ? (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Confirmaciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Asistentes</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Mensaje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps.map((rsvp) => (
                  <TableRow key={rsvp.id}>
                    <TableCell className="font-medium">
                      {rsvp.guest_name}
                      {rsvp.guest_email && (
                        <p className="text-xs text-muted-foreground">{rsvp.guest_email}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {rsvp.events?.title}
                      </div>
                    </TableCell>
                    <TableCell>{rsvp.num_attendees || 1}</TableCell>
                    <TableCell>{getStatusBadge(rsvp.status)}</TableCell>
                    <TableCell className="max-w-xs truncate">{rsvp.message || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl">
          <CardContent className="py-16">
            <Empty
              icon={<Users className="h-12 w-12" />}
              title="Aún no hay invitados"
              description="Las confirmaciones de tus eventos aparecerán aquí."
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}