'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Gift, Plus, ExternalLink, Check, Sparkles } from 'lucide-react'
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
  const [isGenerating, setIsGenerating] = useState(false)
  const [newGift, setNewGift] = useState({ title: '', description: '', price: '', store_url: '' })

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

  if (gifts.length === 0 && !isAddingGift) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="py-16">
          <Empty
            icon={<Gift className="h-12 w-12" />}
            title="Sin regalos"
            description="Agrega regalos a tu mesa de regalos para que tus invitados puedan verlos"
            action={
              <Button onClick={() => setIsAddingGift(true)} className="rounded-xl">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Regalo
              </Button>
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
            {gifts.filter(g => g.claimed_by).length} de {gifts.length} regalos reclamados
          </p>
        </div>
        <Dialog open={isAddingGift} onOpenChange={setIsAddingGift}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Regalo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Regalo</DialogTitle>
              <DialogDescription>
                Agrega un nuevo regalo a tu mesa de regalos
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel>Nombre del Regalo</FieldLabel>
                <Input
                  value={newGift.title}
                  onChange={(e) => setNewGift({ ...newGift, title: e.target.value })}
                  placeholder="Ej: Juego de sabanas"
                />
              </Field>
              <Field>
                <FieldLabel>Descripcion (Opcional)</FieldLabel>
                <Textarea
                  value={newGift.description}
                  onChange={(e) => setNewGift({ ...newGift, description: e.target.value })}
                  placeholder="Descripcion breve del regalo"
                  rows={2}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Precio Estimado (MXN)</FieldLabel>
                  <Input
                    type="number"
                    value={newGift.price}
                    onChange={(e) => setNewGift({ ...newGift, price: e.target.value })}
                    placeholder="0.00"
                  />
                </Field>
                <Field>
                  <FieldLabel>Link de Tienda</FieldLabel>
                  <Input
                    value={newGift.store_url}
                    onChange={(e) => setNewGift({ ...newGift, store_url: e.target.value })}
                    placeholder="https://..."
                  />
                </Field>
              </div>
            </FieldGroup>
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateSuggestions}
                disabled={isGenerating}
                className="rounded-lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generando...' : 'Sugerir con IA'}
              </Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingGift(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddGift} disabled={!newGift.title}>
                Agregar Regalo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gifts.map((gift) => (
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
  )
}
