'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// Importamos los componentes pre-construidos de formulario de Shadcn UI
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { signIn } from '@/app/auth/actions'

// 1. Definimos el esquema de validación con Zod
const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, ingresa un correo válido' }),
  password: z.string().min(1, { message: 'La contraseña es obligatoria' }),
})

// Inferimos el tipo de TypeScript a partir del esquema
type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // 2. Inicializamos react-hook-form con el resolver de Zod
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // 3. Esta función SOLO se ejecutará si Zod valida que todo está correcto
  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)

    try {
      // Como tu server action espera FormData, convertimos el objeto de React Hook Form
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)

      const result = await signIn(formData)

      if (!result?.success) {
        toast.error(result?.error || 'Error al iniciar sesión')
        setIsLoading(false)
        return
      }

      window.location.href = '/dashboard'
    } catch (error) {
      console.error(error)
      toast.error('Ocurrió un error inesperado')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background px-4 py-12">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
            I
          </Link>
          <CardTitle className="text-2xl">Bienvenido de Nuevo</CardTitle>
          <CardDescription>Ingresa tus datos para acceder a tu cuenta</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="tu@email.com" autoComplete="email" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage /> {/* Aquí aparecerá el error de Zod automáticamente */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Contraseña</FormLabel>
                      <Link href="/auth/recuperar-password" className="text-sm text-primary hover:underline">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" autoComplete="current-password" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage /> {/* Aquí aparecerá el error de Zod automáticamente */}
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
                {isLoading ? <><Spinner className="mr-2" /> Iniciando...</> : 'Iniciar Sesión'}
              </Button>

            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <Link href="/auth/registro" className="font-medium text-primary hover:underline">
              Regístrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}