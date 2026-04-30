import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Sparkles, Baby, GraduationCap, Cake, CalendarDays } from 'lucide-react'
import { EVENT_TYPE_LABELS, type EventType } from '@/lib/types'

const templateCategories: { type: EventType; icon: React.ReactNode; color: string; templates: { name: string; style: string }[] }[] = [
  {
    type: 'boda',
    icon: <Heart className="h-6 w-6" />,
    color: 'from-rose-500/20 to-rose-500/5',
    templates: [
      { name: 'Clasico Elegante', style: 'Tradicional y sofisticado' },
      { name: 'Moderno Minimalista', style: 'Limpio y contemporaneo' },
      { name: 'Romantico Floral', style: 'Detalles florales delicados' },
      { name: 'Rustico Campestre', style: 'Natural y acogedor' },
    ]
  },
  {
    type: 'xv',
    icon: <Sparkles className="h-6 w-6" />,
    color: 'from-violet-500/20 to-violet-500/5',
    templates: [
      { name: 'Princesa', style: 'Elegante y brillante' },
      { name: 'Moderno Chic', style: 'Actual y sofisticado' },
      { name: 'Bohemio', style: 'Libre y artistico' },
      { name: 'Glamour', style: 'Lujoso y llamativo' },
    ]
  },
  {
    type: 'bautizo',
    icon: <Baby className="h-6 w-6" />,
    color: 'from-sky-500/20 to-sky-500/5',
    templates: [
      { name: 'Angelical', style: 'Suave y celestial' },
      { name: 'Clasico Azul', style: 'Tradicional para nino' },
      { name: 'Clasico Rosa', style: 'Tradicional para nina' },
      { name: 'Naturaleza', style: 'Tonos tierra suaves' },
    ]
  },
  {
    type: 'graduacion',
    icon: <GraduationCap className="h-6 w-6" />,
    color: 'from-amber-500/20 to-amber-500/5',
    templates: [
      { name: 'Academico', style: 'Formal y profesional' },
      { name: 'Celebracion', style: 'Festivo y colorido' },
      { name: 'Minimalista', style: 'Simple y elegante' },
    ]
  },
  {
    type: 'cumpleanos',
    icon: <Cake className="h-6 w-6" />,
    color: 'from-pink-500/20 to-pink-500/5',
    templates: [
      { name: 'Fiesta', style: 'Colorido y divertido' },
      { name: 'Elegante', style: 'Sofisticado para adultos' },
      { name: 'Infantil', style: 'Alegre para ninos' },
      { name: 'Tematico', style: 'Personalizable' },
    ]
  },
  {
    type: 'otros',
    icon: <CalendarDays className="h-6 w-6" />,
    color: 'from-emerald-500/20 to-emerald-500/5',
    templates: [
      { name: 'Versatil', style: 'Adaptable a cualquier evento' },
      { name: 'Corporativo', style: 'Profesional y serio' },
      { name: 'Casual', style: 'Informal y amigable' },
    ]
  }
]

export default function PlantillasPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Plantillas para Todos los Eventos
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Explora nuestra coleccion de plantillas profesionales y elige la que mejor
            se adapte a tu estilo y tipo de evento.
          </p>
        </div>
      </section>

      {/* Templates by Category */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="space-y-16">
            {templateCategories.map((category) => (
              <div key={category.type}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.color}`}>
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {EVENT_TYPE_LABELS[category.type]}
                    </h2>
                    <p className="text-muted-foreground">
                      {category.templates.length} plantillas disponibles
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {category.templates.map((template, index) => (
                    <Card key={index} className="group rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                      <div className={`h-32 bg-gradient-to-br ${category.color}`} />
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{template.style}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link href={`/crear-evento?tipo=${category.type}`}>
                      Crear invitacion de {EVENT_TYPE_LABELS[category.type].toLowerCase()}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-foreground">
            No Encuentras lo que Buscas?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Nuestro equipo puede crear una plantilla personalizada para ti
          </p>
          <Button asChild className="mt-8 rounded-xl">
            <Link href="/contacto">Solicitar Plantilla Personalizada</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
