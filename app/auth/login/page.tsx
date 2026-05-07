'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

import { signIn } from '@/app/auth/actions'

export default function LoginPage() {
  const router = useRouter()

  async function handleSubmit(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault()

  try {
    const formData = new FormData(e.currentTarget)

    const result = await signIn(formData)

    console.log(result)

    if (!result?.success) {
      toast.error(
        result?.error || 'Error al iniciar sesion'
      )
      return
    }

    router.push('/dashboard')
    router.refresh()
  } catch (error) {
    console.error(error)

    toast.error('Ocurrio un error inesperado')
  }
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background px-4 py-12">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardHeader className="text-center">
          <Link
            href="/"
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl"
          >
            I
          </Link>

          <CardTitle className="text-2xl">
            Bienvenido de Nuevo
          </CardTitle>

          <CardDescription>
            Ingresa tus datos para acceder a tu cuenta
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">
                  Correo Electronico
                </FieldLabel>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">
                    Contrasena
                  </FieldLabel>

                  <Link
                    href="/auth/recuperar-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Olvidaste tu contrasena?
                  </Link>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              className="w-full rounded-xl"
            >
              Iniciar Sesion
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            No tienes una cuenta?{' '}
            <Link
              href="/auth/registro"
              className="font-medium text-primary hover:underline"
            >
              Registrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}