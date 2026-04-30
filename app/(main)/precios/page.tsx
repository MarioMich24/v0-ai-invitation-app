import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Sparkles } from 'lucide-react'

const plans = [
  {
    name: 'Gratis',
    description: 'Perfecto para probar la plataforma',
    price: '$0',
    period: 'siempre',
    features: [
      '1 evento activo',
      'Plantillas basicas',
      'Hasta 50 confirmaciones',
      'Mesa de regalos (hasta 10 items)',
      'Soporte por email'
    ],
    cta: 'Comenzar Gratis',
    href: '/auth/registro',
    popular: false
  },
  {
    name: 'Premium',
    description: 'Todo lo que necesitas para tu evento',
    price: '$299',
    period: 'por evento',
    features: [
      'Eventos ilimitados',
      'Todas las plantillas',
      'Confirmaciones ilimitadas',
      'Mesa de regalos ilimitada',
      'Generacion de textos con IA',
      'Personalizacion avanzada',
      'Sin marca de agua',
      'Soporte prioritario'
    ],
    cta: 'Elegir Premium',
    href: '/auth/registro',
    popular: true
  },
  {
    name: 'Profesional',
    description: 'Para organizadores de eventos',
    price: '$999',
    period: 'al mes',
    features: [
      'Todo de Premium',
      'Hasta 10 eventos activos',
      'Plantillas exclusivas',
      'Dominio personalizado',
      'Estadisticas avanzadas',
      'API access',
      'Soporte dedicado 24/7'
    ],
    cta: 'Contactar Ventas',
    href: '/contacto',
    popular: false
  }
]

export default function PreciosPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="mr-1 h-3 w-3" />
            Precios Transparentes
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Planes para Todos los Eventos
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Elige el plan que mejor se adapte a tus necesidades.
            Sin costos ocultos, sin sorpresas.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative rounded-2xl ${
                  plan.popular 
                    ? 'border-2 border-primary shadow-lg shadow-primary/10' 
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary shadow-lg">Mas Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground"> MXN {plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full rounded-xl ${plan.popular ? '' : 'bg-muted text-foreground hover:bg-muted/80'}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-foreground">Tienes Preguntas?</h2>
          <p className="mt-4 text-muted-foreground">
            Consulta nuestras preguntas frecuentes o contactanos directamente
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/faq">Ver Preguntas Frecuentes</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/contacto">Contactar Soporte</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
