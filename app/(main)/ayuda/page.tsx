import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Book, MessageCircle, HelpCircle } from 'lucide-react'

export default function AyudaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Centro de Ayuda
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          ¿Cómo podemos ayudarte hoy?
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="rounded-2xl transition-all hover:shadow-md">
          <CardHeader>
            <HelpCircle className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Preguntas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Encuentra respuestas rápidas a las dudas más comunes sobre la creación y gestión de tus invitaciones.
            </p>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/faq">Ver Preguntas</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl transition-all hover:shadow-md">
          <CardHeader>
            <MessageCircle className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Soporte Técnico</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              ¿No encuentras lo que buscas? Nuestro equipo está listo para ayudarte con cualquier problema.
            </p>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/contacto">Contactar Soporte</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}