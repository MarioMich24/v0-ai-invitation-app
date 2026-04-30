'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldMessage } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { updatePassword } from '@/app/auth/actions'
import { toast } from 'sonner'

export default function UpdatePasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

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

    const result = await updatePassword(formData)

    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    toast.success('Contrasena actualizada exitosamente')
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background px-4 py-12">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
            I
          </Link>
          <CardTitle className="text-2xl">Nueva Contrasena</CardTitle>
          <CardDescription>
            Ingresa tu nueva contrasena para actualizar tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">Nueva Contrasena</FieldLabel>
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
                  Actualizando...
                </>
              ) : (
                'Actualizar Contrasena'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
