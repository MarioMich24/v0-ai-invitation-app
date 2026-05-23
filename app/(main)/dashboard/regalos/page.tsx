import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { Gift, ExternalLink, Check, Calendar } from 'lucide-react'

export default async function RegalosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Obtener los eventos del usuario
  const { data: events } = await supabase
    .from('events')
    .select('id, title')
    .eq('user_id', user?.id)

  const eventIds = events?.map(e => e.id) || []

  // Obtener todos los regalos de esos eventos
  let gifts: any[] = []
  if (eventIds.length > 0) {
    const { data } = await supabase
      .from('gifts')
      .select('*, events(title)')
      .in('event_id', eventIds)
      .order('created_at', { ascending: false })
    
    gifts = data || []
  }

  const claimedGifts = gifts.filter(g => g.claimed_by)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Todos los Regalos</h1>
        <p className="text-muted-foreground">
          Gestiona la mesa de regalos de todos tus eventos
        </p>
      </div>

      {gifts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gifts.map((gift) => (
            <Card key={gift.id} className="rounded-2xl overflow-hidden">
              <div className={`h-2 ${gift.claimed_by ? 'bg-emerald-500' : 'bg-muted'}`} />
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">{gift.title}</h4>
                    <p className="text-xs flex items-center gap-1 text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      {gift.events?.title}
                    </p>
                  </div>
                  {gift.claimed_by && (
                    <Badge className="bg-emerald-500 shrink-0">
                      <Check className="mr-1 h-3 w-3" />
                      Reclamado por {gift.claimed_by}
                    </Badge>
                  )}
                </div>
                {gift.description && (
                  <p className="text-sm text-muted-foreground mt-2">{gift.description}</p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  {gift.price && (
                    <span className="text-lg font-semibold text-primary">
                      ${gift.price.toLocaleString('es-MX')} MXN
                    </span>
                  )}
                  {gift.store_url && (
                    <Button asChild variant="ghost" size="sm">
                      <a href={gift.store_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
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
              icon={<Gift className="h-12 w-12" />}
              title="Aún no hay regalos"
              description="No has agregado regalos a ninguno de tus eventos."
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}