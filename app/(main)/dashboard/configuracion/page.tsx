'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { User, Lock, Settings } from 'lucide-react'
import { updateProfile } from '@/app/actions/profile-actions'
import { updatePassword } from '@/app/auth/actions'

export default function ConfiguracionPage() {
  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  const supabase = createClient()

  // Cargar datos actuales del usuario al montar la página
  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoadingUser(false)
    }
    loadUserData()
  }, [])

  // Manejar actualización de Nombre Completo
  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSavingProfile(true)

    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)

    setIsSavingProfile(false)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    toast.success('Perfil actualizado correctamente')
    // Actualizar estado local para reflejar el cambio en la vista de configuración
    const updatedName = formData.get('fullName') as string
    setUser((prev: any) => ({
      ...prev,
      user_metadata: { ...prev?.user_metadata, full_name: updatedName }
    }))
  }

  // Manejar actualización de Contraseña
  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSavingPassword(true)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      setIsSavingPassword(false)
      return
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      setIsSavingPassword(false)
      return
    }

    const result = await updatePassword(formData)
    setIsSavingPassword(false)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    toast.success('Contraseña actualizada exitosamente')
    e.currentTarget.reset()
  }

  if (loadingUser) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground">Administra los detalles de tu cuenta y seguridad</p>
      </div>

      <Tabs defaultValue="perfil" className="space-y-4">
        <TabsList className="rounded-xl bg-muted p-1">
          <TabsTrigger value="perfil" className="rounded-lg flex items-center gap-2">
            <User className="h-4 w-4" />
            Mi Perfil
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="rounded-lg flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Seguridad
          </TabsTrigger>
        </TabsList>

        {/* Pestaña: Mi Perfil */}
        <TabsContent value="perfil">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Información del Perfil</CardTitle>
              <CardDescription>Actualiza tu información personal pública</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user?.email || ''}
                      disabled
                      className="bg-muted/50 cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">El correo electrónico no puede ser modificado.</p>
                  </Field>
                  
                  <Field>
                    <FieldLabel htmlFor="fullName">Nombre Completo</FieldLabel>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Tu nombre completo"
                      defaultValue={user?.user_metadata?.full_name || ''}
                      required
                      disabled={isSavingProfile}
                    />
                  </Field>
                </FieldGroup>

                <Button type="submit" className="rounded-xl mt-2" disabled={isSavingProfile}>
                  {isSavingProfile ? (
                    <>
                      <Spinner className="mr-2" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña: Seguridad */}
        <TabsContent value="seguridad">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>Asegúrate de usar una contraseña larga y difícil de adivinar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="password">Nueva Contraseña</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      disabled={isSavingPassword}
                    />
                  </Field>
                  
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirmar Nueva Contrasena</FieldLabel>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      disabled={isSavingPassword}
                    />
                  </Field>
                </FieldGroup>

                <Button type="submit" className="rounded-xl mt-2" disabled={isSavingPassword}>
                  {isSavingPassword ? (
                    <>
                      <Spinner className="mr-2" />
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Contraseña'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}