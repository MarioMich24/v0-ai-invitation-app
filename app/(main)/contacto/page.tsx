import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Contáctanos
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Estamos aquí para ayudarte. Llena el formulario y te responderemos lo antes posible.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-1">
          <Card className="rounded-2xl border-none bg-primary/5 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Correo</p>
                  <p className="text-sm text-muted-foreground">soporte@invitaciones.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Teléfono</p>
                  <p className="text-sm text-muted-foreground">+52 (55) 1234-5678</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Oficina</p>
                  <p className="text-sm text-muted-foreground">Ciudad de México, México</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl md:col-span-2">
          <CardHeader>
            <CardTitle>Envíanos un mensaje</CardTitle>
            <CardDescription>Te responderemos en un plazo máximo de 24 horas hábiles.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Nombre</FieldLabel>
                    <Input placeholder="Tu nombre" />
                  </Field>
                  <Field>
                    <FieldLabel>Correo Electrónico</FieldLabel>
                    <Input type="email" placeholder="tu@email.com" />
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Asunto</FieldLabel>
                  <Input placeholder="¿En qué podemos ayudarte?" />
                </Field>
                <Field>
                  <FieldLabel>Mensaje</FieldLabel>
                  <Textarea placeholder="Escribe tu mensaje aquí..." rows={5} />
                </Field>
              </FieldGroup>
              <Button className="w-full rounded-xl mt-4">Enviar Mensaje</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}