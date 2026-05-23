'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'No autorizado' }
  }

  const fullName = formData.get('fullName') as string
  if (!fullName || fullName.trim() === '') {
    return { error: 'El nombre completo es requerido' }
  }

  // 1. Actualizar los metadatos de autenticación del usuario (usado en el Navbar/Dashboard)
  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: fullName }
  })

  if (authError) {
    return { error: authError.message }
  }

  // 2. Actualizar la tabla pública 'profiles' para consistencia de datos
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
      full_name: fullName, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', user.id)

  if (profileError) {
    console.error('Error al actualizar la tabla profiles:', profileError)
  }

  // Revalidar las rutas del dashboard para que muestren de inmediato el nuevo nombre
  revalidatePath('/dashboard')
  
  return { success: true }
}