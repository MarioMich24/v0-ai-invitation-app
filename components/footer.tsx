import Link from 'next/link'
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            {/* AQUÍ ESTÁ EL CAMBIO DE LOS LOGOS */}
            <Link href="/" className="flex items-center gap-2">
              {/* Logo para celulares (solo la galletita) */}
              <Image 
                src="/GALLETITA.svg" 
                alt="Cookie Print" 
                width={40} 
                height={40} 
                className="block md:hidden object-contain"
              />
              {/* Logo para computadoras (logo completo) */}
              <Image 
                src="/cookie-logo.png" 
                alt="Cookie Print" 
                width={140} 
                height={55} 
                className="hidden md:block object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Crea invitaciones digitales únicas para tus eventos especiales con el respaldo y la calidad de Cookie Print.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Producto</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/plantillas" className="text-muted-foreground hover:text-foreground transition-colors">
                  Plantillas
                </Link>
              </li>
              <li>
                <Link href="/precios" className="text-muted-foreground hover:text-foreground transition-colors">
                  Precios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Soporte</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/ayuda" className="text-muted-foreground hover:text-foreground transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacidad" className="text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Términos de Servicio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Invitaciones Digitales. Cookie Print | Una plataforma impulsada por PROCEL TI, S.A.S. DE C.V. Todos los derechos reservados. 
          </p>
        </div>
      </div>
    </footer>
  )
}