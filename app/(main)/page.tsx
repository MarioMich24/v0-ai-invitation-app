import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Calendar, Users, Gift, Heart, GraduationCap, Baby, Cake, Crown } from 'lucide-react'
import { EVENT_TYPE_LABELS, type EventType } from '@/lib/types'
import Image from "next/image"

const eventTypes: { type: EventType; icon: React.ReactNode; description: string }[] = [
  { type: 'boda', icon: <Heart className="h-8 w-8" />, description: 'Celebra el amor con invitaciones elegantes' },
  { type: 'xv', icon: <Crown className="h-8 w-8" />, description: 'Invitaciones mágicas para tus XV años' },
  { type: 'bautizo', icon: <Baby className="h-8 w-8" />, description: 'Anuncia el bautizo de tu pequeño ángel' },
  { type: 'graduacion', icon: <GraduationCap className="h-8 w-8" />, description: 'Celebra tus logros académicos' },
  { type: 'cumpleanos', icon: <Cake className="h-8 w-8" />, description: 'Fiestas de cumpleaños inolvidables' },
]

const features = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: 'Asistente IA',
    description: 'Genera textos y sugerencias personalizadas con inteligencia artificial'
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'Gestión de Eventos',
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
    description: 'Crea tu lista de regalos y compártela con tus invitados'
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section con Imagen de Fondo */}
      <section className="relative w-full pt-8 px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] shadow-2xl border border-border">
          
          {/* CAPA 0: BANNER DE FONDO */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/img-banner.png" 
              alt="Cookie Print Banner" 
              fill
              className="object-cover object-center opacity-50" 
              priority
            />
            
          </div>

          {/* CAPA 1: TEXTO Y BOTONES (ENCIMA DE LA IMAGEN) */}
          <div className="relative z-10 px-4 py-24 sm:py-32 lg:px-8 text-center">
            
            {/* Etiqueta flotante */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-background/90 backdrop-blur-md px-5 py-2 text-sm font-medium text-primary shadow-sm border border-primary/20">
              <Sparkles className="h-4 w-4" />
              Potenciado por Inteligencia Artificial
            </div>
            
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl drop-shadow-lg">
              Invitaciones Digitales para{' '}
              <span className="text-primary">Momentos Especiales</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-foreground font-medium sm:text-xl drop-shadow-md">
              Crea invitaciones hermosas y personalizadas para bodas, XV años, bautizos, graduaciones y más. 
              Nuestra IA te ayuda a escribir los textos perfectos.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-2xl px-8 shadow-lg shadow-primary/25 h-14 text-base">
                <Link href="/auth/registro">Comenzar Gratis</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl px-8 h-14 text-base bg-background/80 backdrop-blur-sm border-2 hover:bg-background">
                <Link href="/como-funciona">Ver Cómo Funciona</Link>
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
              Selecciona el tipo de evento y comienza a crear tu invitación perfecta
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
      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden rounded-3xl shadow-2xl border-0">
            
            {/* CAPA 0: IMAGEN DE FONDO */}
            <div className="absolute inset-0 z-0">
              <Image 
                src="/fondoCookie.png" 
                alt="Fondo Cookie Print" 
                fill
                className="object-cover object-center" 
              />
              {/* Filtro oscuro muy suave para asegurar que las letras blancas se lean bien */}
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* CAPA 1: TEXTO Y BOTONES */}
            <CardContent className="relative z-10 p-8 text-center sm:p-12 lg:p-16">
              <h2 className="text-3xl font-bold text-white sm:text-4xl drop-shadow-md">
                Comienza a Crear tu Invitación Hoy
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-white/90 drop-shadow">
                Regístrate gratis y descubre lo fácil que es crear invitaciones digitales profesionales
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" variant="secondary" className="rounded-2xl px-8 shadow-lg h-12">
                  <Link href="/auth/registro">Crear Cuenta Gratis</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-2xl px-8 h-12 text-white border-white/40 hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all">
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