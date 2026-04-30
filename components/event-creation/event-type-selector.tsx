'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Heart, Sparkles, Baby, GraduationCap, Cake, CalendarDays, Check } from 'lucide-react'
import type { EventType } from '@/lib/types'
import { EVENT_TYPE_LABELS } from '@/lib/types'

interface EventTypeSelectorProps {
  selected: EventType | null
  onSelect: (type: EventType) => void
}

const eventTypeConfig: { type: EventType; icon: React.ReactNode; description: string; color: string }[] = [
  { 
    type: 'boda', 
    icon: <Heart className="h-8 w-8" />, 
    description: 'Invitaciones elegantes para tu gran dia',
    color: 'text-rose-500'
  },
  { 
    type: 'xv', 
    icon: <Sparkles className="h-8 w-8" />, 
    description: 'Celebra tus XV anos con estilo',
    color: 'text-violet-500'
  },
  { 
    type: 'bautizo', 
    icon: <Baby className="h-8 w-8" />, 
    description: 'Anuncia el bautizo de tu bebe',
    color: 'text-sky-500'
  },
  { 
    type: 'graduacion', 
    icon: <GraduationCap className="h-8 w-8" />, 
    description: 'Festeja tus logros academicos',
    color: 'text-amber-500'
  },
  { 
    type: 'cumpleanos', 
    icon: <Cake className="h-8 w-8" />, 
    description: 'Invitaciones para fiestas de cumpleanos',
    color: 'text-pink-500'
  },
  { 
    type: 'otros', 
    icon: <CalendarDays className="h-8 w-8" />, 
    description: 'Cualquier otro tipo de celebracion',
    color: 'text-emerald-500'
  },
]

export function EventTypeSelector({ selected, onSelect }: EventTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground">Que tipo de evento estas organizando?</h2>
        <p className="mt-2 text-muted-foreground">
          Selecciona el tipo de evento para personalizar tu invitacion
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {eventTypeConfig.map((item) => (
          <Card
            key={item.type}
            className={`cursor-pointer rounded-2xl transition-all hover:shadow-lg ${
              selected === item.type
                ? 'border-2 border-primary ring-2 ring-primary/20'
                : 'border-2 border-transparent hover:border-border'
            }`}
            onClick={() => onSelect(item.type)}
          >
            <CardContent className="relative p-6">
              {selected === item.type && (
                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </div>
              )}
              <div className={`mb-4 inline-flex rounded-xl bg-muted p-3 ${item.color}`}>
                {item.icon}
              </div>
              <h3 className="font-semibold text-foreground">{EVENT_TYPE_LABELS[item.type]}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
