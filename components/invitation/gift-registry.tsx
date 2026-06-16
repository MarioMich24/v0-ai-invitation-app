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
import { Gift, ExternalLink, Check, Heart, CreditCard, Copy } from 'lucide-react'
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

    toast.success('¡Regalo reclamado exitosamente!')
    setClaimingGiftId(null)
    setClaimerName('')
    window.location.reload()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Datos copiados al portapapeles')
  }

  // Filtramos separando los Regalos Físicos de las Cuentas Bancarias
  const physicalGifts = gifts.filter(g => !g.title.startsWith('Datos Bancarios:'))
  const bankGifts = gifts.filter(g => g.title.startsWith('Datos Bancarios:'))
  
  const availableGifts = physicalGifts.filter(g => !g.claimed_by)
  const claimedGifts = physicalGifts.filter(g => g.claimed_by)

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl text-center border-none shadow-none bg-transparent">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Gift className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Mesa de Regalos</CardTitle>
          <CardDescription className="text-base">
            Tu presencia es nuestro mejor regalo. Pero si deseas obsequiarnos algo, aquí te dejamos algunas ideas:
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Bank Accounts - Tarjetas de Depósito */}
      {bankGifts.length > 0 && (
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" /> Depósitos y Transferencias
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {bankGifts.map((gift) => (
              <Card key={gift.id} className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-primary text-lg">{gift.title.replace('Datos Bancarios: ', '')}</h4>
                    <CreditCard className="h-6 w-6 text-primary/40" />
                  </div>
                  <p className="text-sm whitespace-pre-line font-mono text-foreground/80 leading-relaxed mb-6">
                    {gift.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full bg-background/50 hover:bg-primary hover:text-primary-foreground transition-all rounded-xl"
                    onClick={() => copyToClipboard(gift.description || '')}
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copiar Datos
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Physical Gifts */}
      {availableGifts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Regalos Sugeridos ({availableGifts.length})</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {availableGifts.map((gift) => (
              <Card key={gift.id} className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
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
                        <Button asChild variant="outline" size="sm" className="rounded-lg">
                          <a href={gift.store_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="rounded-lg"
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

      {/* Claimed Physical Gifts */}
      {claimedGifts.length > 0 && (
        <div className="space-y-4 mt-8">
          <h3 className="font-semibold text-muted-foreground">Ya regalados ({claimedGifts.length})</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {claimedGifts.map((gift) => (
              <Card key={gift.id} className="rounded-2xl overflow-hidden opacity-50 bg-muted/30">
                <div className="h-1 bg-emerald-500" />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground line-through">{gift.title}</h4>
                      {gift.description && (
                        <p className="text-sm text-muted-foreground mt-1">{gift.description}</p>
                      )}
                    </div>
                    <Badge className="bg-emerald-500 shrink-0">
                      <Check className="mr-1 h-3 w-3" />
                      Regalado
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Claim Dialog */}
      <Dialog open={!!claimingGiftId} onOpenChange={(open) => !open && setClaimingGiftId(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Confirmar Regalo</DialogTitle>
            <DialogDescription>
              Vas a regalar: <span className="font-medium text-foreground">{selectedGift?.title}</span>
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="claimerName">Tu Nombre Completo</FieldLabel>
            <Input
              id="claimerName"
              value={claimerName}
              onChange={(e) => setClaimerName(e.target.value)}
              placeholder="Escribe tu nombre para que los anfitriones lo sepan"
            />
          </Field>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setClaimingGiftId(null)} className="rounded-xl">
              Cancelar
            </Button>
            <Button onClick={handleClaimGift} disabled={!claimerName.trim() || isSubmitting} className="rounded-xl">
              {isSubmitting ? 'Confirmando...' : 'Confirmar Regalo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}