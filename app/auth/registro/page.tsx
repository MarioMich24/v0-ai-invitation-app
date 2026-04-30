'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldMessage } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { signUp } from '@/app/auth/actions'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Las contrasenas no coinciden' })
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setErrors({ password: 'La contrasena debe tener al menos 6 caracteres' })
      setIsLoading(false)
      return
    }

    const result = await signUp(formData)

    setIsLoading(false)

    if (result?.error) {
      if (result.error.includes('already registered')) {
        toast.error('Este correo ya esta registrado. Intenta iniciar sesion.')
      } else {
        toast.error(result.error)
      }
      return
    }

    setSuccess(true)
    toast.success(result.message || 'Cuenta creada exitosamente')
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background px-4 py-12">
        <Card className="w-full max-w-md rounded-2xl shadow-xl text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl">Revisa tu Correo</CardTitle>
            <CardDescription className="text-base">
              Te hemos enviado un enlace de confirmacion a tu correo electronico.
              Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full rounded-xl">
              <Link href="/auth/login">Ir a Iniciar Sesion</Link>
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
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Registrate para comenzar a crear invitaciones digitales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fullName">Nombre Completo</FieldLabel>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Juan Perez"
                  required
                  autoComplete="name"
                  disabled={isLoading}
                />
                {errors.fullName && <FieldMessage variant="error">{errors.fullName}</FieldMessage>}
              </Field>
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
              <Field>
                <FieldLabel htmlFor="password">Contrasena</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                {errors.password && <FieldMessage variant="error">{errors.password}</FieldMessage>}
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirmar Contrasena</FieldLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                {errors.confirmPassword && <FieldMessage variant="error">{errors.confirmPassword}</FieldMessage>}
              </Field>
            </FieldGroup>

            <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Al registrarte, aceptas nuestros{' '}
            <Link href="/terminos" className="text-primary hover:underline">
              Terminos de Servicio
            </Link>{' '}
            y{' '}
            <Link href="/privacidad" className="text-primary hover:underline">
              Politica de Privacidad
            </Link>
          </p>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Ya tienes una cuenta?{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Inicia Sesion
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
