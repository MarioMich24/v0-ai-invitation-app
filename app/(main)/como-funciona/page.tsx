import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Sparkles, 
  Palette, 
  Share2, 
  Users, 
  Gift, 
  BarChart,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const steps = [
  {
    number: '1',
    title: 'Selecciona tu Evento',
    description: 'Elige el tipo de evento: boda, XV anos, bautizo, graduacion, cumpleanos u otros.',
    icon: <Palette className="h-6 w-6" />
  },
  {
    number: '2',
    title: 'Personaliza tu Invitacion',
    description: 'Agrega los detalles de tu evento, padrinos, ubicaciones y genera textos con IA.',
    icon: <Sparkles className="h-6 w-6" />
  },
  {
    number: '3',
    title: 'Comparte con tus Invitados',
    description: 'Publica tu invitacion y comparte el enlace por WhatsApp, redes sociales o email.',
    icon: <Share2 className="h-6 w-6" />
  },
  {
    number: '4',
    title: 'Gestiona las Confirmaciones',
    description: 'Recibe las respuestas de tus invitados y administra la mesa de regalos.',
    icon: <Users className="h-6 w-6" />
  }
]

const features = [
  { icon: <Sparkles className="h-5 w-5" />, text: 'Textos generados con inteligencia artificial' },
  { icon: <Palette className="h-5 w-5" />, text: 'Plantillas profesionales personalizables' },
  { icon: <Users className="h-5 w-5" />, text: 'Gestion de confirmaciones RSVP' },
  { icon: <Gift className="h-5 w-5" />, text: 'Mesa de regalos integrada' },
  { icon: <BarChart className="h-5 w-5" />, text: 'Estadisticas de vistas y confirmaciones' },
  { icon: <Share2 className="h-5 w-5" />, text: 'Facil de compartir en cualquier plataforma' }
]

export default function ComoFuncionaPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Como Funciona
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Crear invitaciones digitales nunca fue tan facil. Sigue estos simples pasos
            y tendras tu invitacion lista en minutos.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {steps.map((step, index) => (
              <Card key={index} className="rounded-2xl border-2 border-transparent hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{step.title}</h3>
                      <p className="mt-2 text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Todo Incluido</h2>
            <p className="mt-4 text-muted-foreground">
              Herramientas poderosas para crear la invitacion perfecta
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <span className="text-foreground">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Card className="rounded-3xl bg-gradient-to-r from-primary to-primary/80 overflow-hidden">
            <CardContent className="p-8 sm:p-12 text-center">
              <h2 className="text-3xl font-bold text-primary-foreground">
                Listo para Crear tu Invitacion?
              </h2>
              <p className="mt-4 text-primary-foreground/90">
                Comienza gratis y crea tu primera invitacion digital hoy mismo
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" variant="secondary" className="rounded-2xl px-8">
                  <Link href="/auth/registro">
                    Comenzar Gratis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
