'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Empty } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Gift, Plus, ExternalLink, Check, Sparkles, CreditCard, Copy } from 'lucide-react'
import { generateGiftSuggestions } from '@/app/actions/ai-actions'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Gift as GiftType, EventType } from '@/lib/types'

interface GiftListProps {
  gifts: GiftType[]
  eventId: string
}

export function GiftList({ gifts, eventId }: GiftListProps) {
  const [isAddingGift, setIsAddingGift] = useState(false)
  const [isAddingBank, setIsAddingBank] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [newGift, setNewGift] = useState({ title: '', description: '', price: '', store_url: '' })
  const [bankInfo, setBankInfo] = useState({ bank: '', owner: '', account: '', clabe: '' })

  const handleAddGift = async () => {
    const supabase = createClient()
    
    const { error } = await supabase.from('gifts').insert({
      event_id: eventId,
      title: newGift.title,
      description: newGift.description || null,
      price: newGift.price ? parseFloat(newGift.price) : null,
      store_url: newGift.store_url || null,
    })

    if (error) {
      toast.error('No se pudo agregar el regalo')
      return
    }

    toast.success('Regalo agregado exitosamente')
    setNewGift({ title: '', description: '', price: '', store_url: '' })
    setIsAddingGift(false)
    window.location.reload()
  }

  const handleAddBank = async () => {
    // 1. Validación de campos obligatorios
    if (!bankInfo.bank || !bankInfo.owner) {
      toast.error('El banco y titular son obligatorios')
      return
    }

    // 2. Validación de 16 dígitos para Cuenta/Tarjeta
    if (bankInfo.account && bankInfo.account.length !== 16) {
      toast.error('El número de cuenta/tarjeta debe tener exactamente 16 dígitos')
      return
    }

    // 3. Validación de 18 dígitos para CLABE
    if (bankInfo.clabe && bankInfo.clabe.length !== 18) {
      toast.error('La CLABE interbancaria debe tener exactamente 18 dígitos')
      return
    }

    // 4. Se requiere al menos uno de los dos (Cuenta o CLABE)
    if (!bankInfo.account && !bankInfo.clabe) {
      toast.error('Debes proporcionar al menos el número de cuenta o la CLABE')
      return
    }

    const supabase = createClient()
    const descLines = [
      `Titular: ${bankInfo.owner}`,
      bankInfo.account ? `Cuenta/Tarjeta: ${bankInfo.account}` : '',
      bankInfo.clabe ? `CLABE: ${bankInfo.clabe}` : ''
    ].filter(Boolean).join('\n')

    const { error } = await supabase.from('gifts').insert({
      event_id: eventId,
      title: `Datos Bancarios: ${bankInfo.bank}`,
      description: descLines,
      price: null,
      store_url: null,
    })

    if (error) {
      toast.error('No se pudo agregar la cuenta')
      return
    }

    toast.success('Cuenta bancaria agregada')
    setBankInfo({ bank: '', owner: '', account: '', clabe: '' })
    setIsAddingBank(false)
    window.location.reload()
  }

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true)
    const result = await generateGiftSuggestions('boda' as EventType)
    setIsGenerating(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    if (result.gifts && result.gifts.length > 0) {
      const firstGift = result.gifts[0]
      setNewGift({
        title: firstGift.title,
        description: firstGift.description,
        price: firstGift.estimatedPrice.replace(/[^0-9.]/g, ''),
        store_url: ''
      })
    }
  }

  // Separamos los regalos físicos de los datos bancarios
  const physicalGifts = gifts.filter(g => !g.title.startsWith('Datos Bancarios:'))
  const bankGifts = gifts.filter(g => g.title.startsWith('Datos Bancarios:'))
  const claimedCount = physicalGifts.filter(g => g.claimed_by).length

  if (gifts.length === 0 && !isAddingGift && !isAddingBank) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="py-16">
          <Empty
            icon={<Gift className="h-12 w-12" />}
            title="Mesa de Regalos Vacía"
            description="Agrega regalos físicos o una cuenta bancaria para que tus invitados te puedan dar un obsequio."
            action={
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={() => setIsAddingBank(true)} className="rounded-xl">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Añadir Cuenta
                </Button>
                <Button onClick={() => setIsAddingGift(true)} className="rounded-xl">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Regalo
                </Button>
              </div>
            }
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Mesa de Regalos</h3>
          <p className="text-sm text-muted-foreground">
            {claimedCount} de {physicalGifts.length} regalos físicos reclamados
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAddingBank(true)} className="rounded-xl hidden sm:flex">
            <CreditCard className="mr-2 h-4 w-4" />
            Añadir Cuenta
          </Button>
          <Button onClick={() => setIsAddingGift(true)} className="rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Regalo
          </Button>
        </div>
      </div>

      {/* Botón en versión móvil para la cuenta */}
      <Button variant="outline" onClick={() => setIsAddingBank(true)} className="w-full rounded-xl sm:hidden">
        <CreditCard className="mr-2 h-4 w-4" />
        Añadir Cuenta Bancaria
      </Button>

      {/* Cuentas Bancarias Registradas */}
      {bankGifts.length > 0 && (
        <div className="mt-6 mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Depósitos y Transferencias
          </h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bankGifts.map((gift) => (
              <Card key={gift.id} className="rounded-2xl border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <h4 className="font-medium text-primary mb-2">{gift.title.replace('Datos Bancarios: ', '')}</h4>
                  <p className="text-sm text-foreground/80 font-mono whitespace-pre-line leading-relaxed">{gift.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regalos Físicos */}
      {physicalGifts.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Gift className="h-4 w-4" /> Lista de Regalos Físicos
          </h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {physicalGifts.map((gift) => (
              <Card key={gift.id} className="rounded-2xl overflow-hidden">
                <div className={`h-2 ${gift.claimed_by ? 'bg-emerald-500' : 'bg-muted'}`} />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{gift.title}</h4>
                      {gift.description && (
                        <p className="text-sm text-muted-foreground mt-1">{gift.description}</p>
                      )}
                    </div>
                    {gift.claimed_by && (
                      <Badge className="bg-emerald-500 shrink-0">
                        <Check className="mr-1 h-3 w-3" />
                        Reclamado
                      </Badge>
                    )}
                  </div>
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
        </div>
      )}

      {/* Modal - Agregar Regalo Físico */}
      <Dialog open={isAddingGift} onOpenChange={setIsAddingGift}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Regalo Físico</DialogTitle>
            <DialogDescription>Agrega un nuevo regalo a tu mesa de regalos</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel>Nombre del Regalo</FieldLabel>
              <Input value={newGift.title} onChange={(e) => setNewGift({ ...newGift, title: e.target.value })} placeholder="Ej: Juego de sábanas" />
            </Field>
            <Field>
              <FieldLabel>Descripción (Opcional)</FieldLabel>
              <Textarea value={newGift.description} onChange={(e) => setNewGift({ ...newGift, description: e.target.value })} placeholder="Descripción breve del regalo" rows={2} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Precio Estimado (MXN)</FieldLabel>
                <Input type="number" value={newGift.price} onChange={(e) => setNewGift({ ...newGift, price: e.target.value })} placeholder="0.00" />
              </Field>
              <Field>
                <FieldLabel>Link de Tienda</FieldLabel>
                <Input value={newGift.store_url} onChange={(e) => setNewGift({ ...newGift, store_url: e.target.value })} placeholder="https://..." />
              </Field>
            </div>
          </FieldGroup>
          <div className="flex justify-center">
            <Button variant="outline" size="sm" onClick={handleGenerateSuggestions} disabled={isGenerating} className="rounded-lg">
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? 'Generando...' : 'Sugerir con IA'}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingGift(false)}>Cancelar</Button>
            <Button onClick={handleAddGift} disabled={!newGift.title}>Agregar Regalo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal - Agregar Cuenta Bancaria */}
      <Dialog open={isAddingBank} onOpenChange={setIsAddingBank}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Cuenta Bancaria</DialogTitle>
            <DialogDescription>
              Agrega los datos para recibir depósitos o transferencias de tus invitados.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel>Banco *</FieldLabel>
              <Input value={bankInfo.bank} onChange={(e) => setBankInfo({ ...bankInfo, bank: e.target.value })} placeholder="Ej: BBVA, Santander, Banamex..." />
            </Field>
            <Field>
              <FieldLabel>Nombre del Titular *</FieldLabel>
              <Input value={bankInfo.owner} onChange={(e) => setBankInfo({ ...bankInfo, owner: e.target.value })} placeholder="Nombre completo del titular" />
            </Field>
            <Field>
              <FieldLabel>Número de Cuenta o Tarjeta</FieldLabel>
              <Input 
                value={bankInfo.account} 
                onChange={(e) => setBankInfo({ ...bankInfo, account: e.target.value.replace(/\D/g, '') })} 
                placeholder="16 dígitos" 
                maxLength={16} // Limita la entrada a 16 caracteres
              />
            </Field>
            <Field>
              <FieldLabel>CLABE Interbancaria (Opcional)</FieldLabel>
              <Input 
                value={bankInfo.clabe} 
                onChange={(e) => setBankInfo({ ...bankInfo, clabe: e.target.value.replace(/\D/g, '') })} 
                placeholder="18 dígitos" 
                maxLength={18} // Limita la entrada a 18 caracteres
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingBank(false)}>Cancelar</Button>
            <Button onClick={handleAddBank} disabled={!bankInfo.bank || !bankInfo.owner}>Agregar Cuenta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}