export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 prose prose-slate dark:prose-invert">
      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-8">Política de Privacidad</h1>
      <p className="text-muted-foreground mb-4">Última actualización: {new Date().toLocaleDateString('es-MX')}</p>
      
      <div className="space-y-6 text-foreground/80">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Información que Recopilamos</h2>
          <p>Recopilamos información que nos proporcionas directamente al registrarte, como tu nombre y correo electrónico. También almacenamos los datos relacionados con los eventos que creas (fechas, ubicaciones y listas de invitados).</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. Uso de la Información</h2>
          <p>Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios, así como para comunicarnos contigo y procesar las confirmaciones de asistencia (RSVP) de tus eventos.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. Protección de Datos</h2>
          <p>Implementamos medidas de seguridad para mantener la seguridad de tu información personal. Toda la información sensible y de inicio de sesión se transmite a través de tecnología Secure Socket Layer (SSL) y se encripta en nuestras bases de datos (Supabase).</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. Compartir Información</h2>
          <p>No vendemos, intercambiamos ni transferimos de ninguna manera tu información personal identificable a terceros. La información de tu evento solo es accesible para ti y para las personas con las que decidas compartir el enlace público de tu invitación.</p>
        </section>
      </div>
    </div>
  )
}