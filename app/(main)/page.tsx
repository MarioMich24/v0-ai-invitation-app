import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Calendar, Users, Gift, Heart, GraduationCap, Baby, Cake } from 'lucide-react'
import { EVENT_TYPE_LABELS, type EventType } from '@/lib/types'

const eventTypes: { type: EventType; icon: React.ReactNode; description: string }[] = [
  { type: 'boda', icon: <Heart className="h-8 w-8" />, description: 'Celebra el amor con invitaciones elegantes' },
  { type: 'xv', icon: <Sparkles className="h-8 w-8" />, description: 'Invitaciones magicas para tus XV anos' },
  { type: 'bautizo', icon: <Baby className="h-8 w-8" />, description: 'Anuncia el bautizo de tu pequeno angel' },
  { type: 'graduacion', icon: <GraduationCap className="h-8 w-8" />, description: 'Celebra tus logros academicos' },
  { type: 'cumpleanos', icon: <Cake className="h-8 w-8" />, description: 'Fiestas de cumpleanos inolvidables' },
]

const features = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: 'Asistente IA',
    description: 'Genera textos y sugerencias personalizadas con inteligencia artificial'
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'Gestion de Eventos',
    description: 'Organiza todos los detalles de tu evento en un solo lugar'
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Confirmaciones RSVP',
    description: 'Recibe y gestiona las confirmaciones de tus invitados'
  },
  {
    icon: <Gift className="h-6 w-6" />,
    title: 'Mesa de Regalos',
    description: 'Crea tu lista de regalos y comparte con tus invitados'
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Potenciado por Inteligencia Artificial
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Invitaciones Digitales para{' '}
              <span className="text-primary">Momentos Especiales</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
              Crea invitaciones hermosas y personalizadas para bodas, XV anos, bautizos, graduaciones y mas. 
              Nuestra IA te ayuda a escribir los textos perfectos.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-2xl px-8 shadow-lg shadow-primary/25">
                <Link href="/auth/registro">Comenzar Gratis</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl px-8">
                <Link href="/como-funciona">Ver Como Funciona</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Invitaciones para Todo Tipo de Eventos
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Selecciona el tipo de evento y comienza a crear tu invitacion perfecta
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {eventTypes.map((event) => (
              <Link key={event.type} href={`/crear-evento?tipo=${event.type}`}>
                <Card className="group h-full cursor-pointer rounded-2xl border-2 border-transparent transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-4 rounded-2xl bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      {event.icon}
                    </div>
                    <h3 className="font-semibold text-foreground">{EVENT_TYPE_LABELS[event.type]}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Todo lo que Necesitas
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Herramientas poderosas para crear invitaciones impresionantes
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="rounded-2xl border-0 bg-card shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80">
            <CardContent className="p-8 text-center sm:p-12 lg:p-16">
              <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
                Comienza a Crear tu Invitacion Hoy
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/90">
                Registrate gratis y descubre lo facil que es crear invitaciones digitales profesionales
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" variant="secondary" className="rounded-2xl px-8 shadow-lg">
                  <Link href="/auth/registro">Crear Cuenta Gratis</Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="rounded-2xl px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                  <Link href="/plantillas">Ver Plantillas</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
