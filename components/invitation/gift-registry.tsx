'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Gift, ExternalLink, Check, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface GiftRegistryProps {
  gifts: Array<{
    id: string
    title: string
    description: string | null
    price: number | null
    store_url: string | null
    claimed_by: string | null
  }>
  eventId: string
}

export function GiftRegistry({ gifts, eventId }: GiftRegistryProps) {
  const [claimingGiftId, setClaimingGiftId] = useState<string | null>(null)
  const [claimerName, setClaimerName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedGift = gifts.find(g => g.id === claimingGiftId)

  const handleClaimGift = async () => {
    if (!claimingGiftId || !claimerName.trim()) return

    setIsSubmitting(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('gifts')
      .update({ claimed_by: claimerName })
      .eq('id', claimingGiftId)

    setIsSubmitting(false)

    if (error) {
      toast.error('No se pudo reclamar el regalo. Intenta de nuevo.')
      return
    }

    toast.success('Regalo reclamado exitosamente!')
    setClaimingGiftId(null)
    setClaimerName('')
    window.location.reload()
  }

  const availableGifts = gifts.filter(g => !g.claimed_by)
  const claimedGifts = gifts.filter(g => g.claimed_by)

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Gift className="h-6 w-6" />
          </div>
          <CardTitle>Mesa de Regalos</CardTitle>
          <CardDescription>
            Si deseas obsequiarnos algo, aqui te dejamos algunas ideas
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Available Gifts */}
      {availableGifts.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Disponibles ({availableGifts.length})</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {availableGifts.map((gift) => (
              <Card key={gift.id} className="rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  <h4 className="font-medium text-foreground">{gift.title}</h4>
                  {gift.description && (
                    <p className="text-sm text-muted-foreground mt-1">{gift.description}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    {gift.price && (
                      <span className="text-lg font-semibold text-primary">
                        ${gift.price.toLocaleString('es-MX')} MXN
                      </span>
                    )}
                    <div className="flex gap-2">
                      {gift.store_url && (
                        <Button asChild variant="outline" size="sm">
                          <a href={gift.store_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => setClaimingGiftId(gift.id)}
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Regalar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Claimed Gifts */}
      {claimedGifts.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-muted-foreground">Ya regalados ({claimedGifts.length})</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {claimedGifts.map((gift) => (
              <Card key={gift.id} className="rounded-2xl overflow-hidden opacity-60">
                <div className="h-1 bg-emerald-500" />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{gift.title}</h4>
                      {gift.description && (
                        <p className="text-sm text-muted-foreground mt-1">{gift.description}</p>
                      )}
                    </div>
                    <Badge className="bg-emerald-500 shrink-0">
                      <Check className="mr-1 h-3 w-3" />
                      Regalado
                    </Badge>
                  </div>
                  {gift.price && (
                    <p className="mt-2 text-lg font-semibold text-muted-foreground">
                      ${gift.price.toLocaleString('es-MX')} MXN
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Claim Dialog */}
      <Dialog open={!!claimingGiftId} onOpenChange={(open) => !open && setClaimingGiftId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Regalo</DialogTitle>
            <DialogDescription>
              Vas a regalar: <span className="font-medium">{selectedGift?.title}</span>
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="claimerName">Tu Nombre</FieldLabel>
            <Input
              id="claimerName"
              value={claimerName}
              onChange={(e) => setClaimerName(e.target.value)}
              placeholder="Escribe tu nombre"
            />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClaimingGiftId(null)}>
              Cancelar
            </Button>
            <Button onClick={handleClaimGift} disabled={!claimerName.trim() || isSubmitting}>
              {isSubmitting ? 'Confirmando...' : 'Confirmar Regalo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
