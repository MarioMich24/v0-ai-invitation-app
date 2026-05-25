import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Preguntas Frecuentes
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Resuelve tus dudas rápidamente sobre nuestra plataforma.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="item-1" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">¿Es gratis crear una invitación?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Sí, puedes crear tu primera invitación totalmente gratis con nuestras plantillas básicas. Si deseas funciones avanzadas o quitar la marca de agua, contamos con planes premium.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">¿Cómo confirman asistencia mis invitados?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Cuando compartes el enlace de tu invitación, tus invitados verán un botón de "Confirmar Asistencia". Al llenar el formulario, la respuesta aparecerá inmediatamente en tu panel de control.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">¿Puedo editar la invitación después de publicarla?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            ¡Por supuesto! Puedes editar cualquier detalle (fecha, lugar, textos) en cualquier momento desde tu panel. Los cambios se reflejarán instantáneamente para todos los que tengan el enlace.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">¿Cómo funciona la mesa de regalos?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Puedes agregar opciones de regalos con enlaces a tiendas online. Tus invitados podrán marcar qué regalo te van a dar para que los demás sepan que ese artículo ya fue seleccionado.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}