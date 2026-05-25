export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 prose prose-slate dark:prose-invert">
      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-8">Términos de Servicio</h1>
      <p className="text-muted-foreground mb-4">Última actualización: {new Date().toLocaleDateString('es-MX')}</p>
      
      <div className="space-y-6 text-foreground/80">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Aceptación de los Términos</h2>
          <p>Al acceder y utilizar este sitio web, aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder al servicio.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. Creación de Cuentas</h2>
          <p>Al crear una cuenta, debes proporcionarnos información precisa, completa y actualizada. El incumplimiento de esto constituye una violación de los Términos, lo que puede resultar en la terminación inmediata de tu cuenta en nuestro servicio.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. Contenido del Usuario</h2>
          <p>Tú eres responsable del contenido de las invitaciones que creas, incluyendo textos e imágenes. Nos reservamos el derecho de eliminar cualquier contenido que consideremos inapropiado, ofensivo o que viole derechos de autor.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. Modificaciones</h2>
          <p>Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en cualquier momento. Al continuar accediendo o utilizando nuestro Servicio después de que esas revisiones se hagan efectivas, aceptas estar sujeto a los términos revisados.</p>
        </section>
      </div>
    </div>
  )
}