import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, Gift, TrendingUp, ArrowLeft } from 'lucide-react'
import { EVENT_TYPE_LABELS } from '@/lib/types'

export const dynamic = 'force-dynamic' //esto yo lo agregue xd

export default async function AdminPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Get stats
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: totalEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })

  const { count: publishedEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const { count: totalRsvps } = await supabase
    .from('rsvps')
    .select('*', { count: 'exact', head: true })

  // Get recent events
  const { data: recentEvents } = await supabase
    .from('events')
    .select(`
      *,
      profiles(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-xl">
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Panel de Administracion</h1>
            <p className="text-muted-foreground">Gestion general del sistema</p>
          </div>
        </div>
        <Badge variant="outline" className="text-primary">Admin</Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">registrados</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalEvents || 0}</div>
            <p className="text-xs text-muted-foreground">{publishedEvents || 0} publicados</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">RSVPs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRsvps || 0}</div>
            <p className="text-xs text-muted-foreground">respuestas totales</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalEvents && publishedEvents ? Math.round((publishedEvents / totalEvents) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">eventos publicados</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Eventos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titulo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEvents?.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    {EVENT_TYPE_LABELS[event.event_type as keyof typeof EVENT_TYPE_LABELS]}
                  </TableCell>
                  <TableCell>{event.profiles?.full_name || 'Sin nombre'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={event.status === 'published' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(event.created_at).toLocaleDateString('es-MX')}
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
