'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Empty } from '@/components/ui/empty'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, Check, X, Clock } from 'lucide-react'
import type { RSVP } from '@/lib/types'

interface RsvpListProps {
  rsvps: RSVP[]
  eventId: string
}

export function RsvpList({ rsvps, eventId }: RsvpListProps) {
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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (rsvps.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="py-16">
          <Empty
            icon={<Users className="h-12 w-12" />}
            title="Sin confirmaciones"
            description="Cuando tus invitados confirmen su asistencia, apareceran aqui"
          />
        </CardContent>
      </Card>
    )
  }

  const confirmedCount = rsvps.filter(r => r.status === 'confirmed').length
  const declinedCount = rsvps.filter(r => r.status === 'declined').length
  const pendingCount = rsvps.filter(r => r.status === 'pending').length
  const totalAttendees = rsvps
    .filter(r => r.status === 'confirmed')
    .reduce((acc, r) => acc + (r.num_attendees || 1), 0)

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="rounded-xl">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{rsvps.length}</p>
            <p className="text-sm text-muted-foreground">Total Respuestas</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-500">{confirmedCount}</p>
            <p className="text-sm text-muted-foreground">Confirmados</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">{declinedCount}</p>
            <p className="text-sm text-muted-foreground">Declinados</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{totalAttendees}</p>
            <p className="text-sm text-muted-foreground">Total Asistentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Lista de Confirmaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Asistentes</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Mensaje</TableHead>
                <TableHead>Fecha</TableHead>
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
                  <TableCell>{rsvp.num_attendees || 1}</TableCell>
                  <TableCell>{getStatusBadge(rsvp.status)}</TableCell>
                  <TableCell className="max-w-xs truncate">{rsvp.message || '-'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(rsvp.responded_at || rsvp.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
