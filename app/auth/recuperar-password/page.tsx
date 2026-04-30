'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldMessage } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { resetPassword } from '@/app/auth/actions'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

export default function RecoverPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const result = await resetPassword(formData)

    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    setSuccess(true)
    toast.success(result.message || 'Correo enviado exitosamente')
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background px-4 py-12">
        <Card className="w-full max-w-md rounded-2xl shadow-xl text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <CardTitle className="text-2xl">Revisa tu Correo</CardTitle>
            <CardDescription className="text-base">
              Te hemos enviado un enlace para restablecer tu contrasena.
              Por favor, revisa tu bandeja de entrada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full rounded-xl">
              <Link href="/auth/login">Volver a Iniciar Sesion</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background px-4 py-12">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
            I
          </Link>
          <CardTitle className="text-2xl">Recuperar Contrasena</CardTitle>
          <CardDescription>
            Ingresa tu correo electronico y te enviaremos un enlace para restablecer tu contrasena
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Correo Electronico</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
                {errors.email && <FieldMessage variant="error">{errors.email}</FieldMessage>}
              </Field>
            </FieldGroup>

            <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Enviando...
                </>
              ) : (
                'Enviar Enlace de Recuperacion'
              )}
            </Button>
          </form>

          <div className="mt-6">
            <Link 
              href="/auth/login" 
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Iniciar Sesion
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
