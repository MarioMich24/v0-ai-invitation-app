import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Mail, MapPin, Phone, Facebook, MessageCircle } from 'lucide-react'

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
        {/* Columna Izquierda: Sucursales */}
        <div className="space-y-6 md:col-span-1">
          
          {/* Sucursal Cd. Hidalgo */}
          <Card className="rounded-2xl border-none bg-primary/5 shadow-none">
            <CardHeader className="pb-2 pt-6 px-6">
              <CardTitle className="text-lg">Sucursal Cd. Hidalgo</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-5">
              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">Correo</p>
                  <p className="text-sm text-muted-foreground break-all">galletitasdigitales@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">Teléfono</p>
                  <p className="text-sm text-muted-foreground">786 129 8174</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">Dirección</p>
                  <p className="text-sm text-muted-foreground">De Cuauhtémoc Nte. 169, La Estación, Cdad. Hidalgo, Mich.</p>
                </div>
              </div>

              {/* Botones de Contacto */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-xl bg-background" asChild>
                  <a href="https://wa.me/527861298174" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-xl bg-background" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sucursal Queréndaro */}
          <Card className="rounded-2xl border-none bg-primary/5 shadow-none">
            <CardHeader className="pb-2 pt-6 px-6">
              <CardTitle className="text-lg">Sucursal Queréndaro</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-5">
              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">Teléfono</p>
                  <p className="text-sm text-muted-foreground">[Tu Teléfono Aquí]</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">Dirección</p>
                  <p className="text-sm text-muted-foreground">Queréndaro, Mich.</p>
                </div>
              </div>

              {/* Botones de Contacto */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-xl bg-background" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-xl bg-background" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Columna Derecha: Formulario */}
        <Card className="rounded-2xl md:col-span-2 h-fit">
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