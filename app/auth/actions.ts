'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const redirectUrl =
    process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
    `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Create profile manually
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: data.user.id,
          full_name: fullName,
        },
        { onConflict: 'id' }
      )

    if (profileError) {
      console.error('PROFILE ERROR:', profileError)
    }
  }

  return {
    success: true,
    message: 'Revisa tu correo para confirmar tu cuenta',
  }
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  return {
    success: true,
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string

  const redirectUrl =
    process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
    `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/actualizar-password`

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  })

  if (error) {
    return { error: error.message }
  }

  return {
    success: true,
    message: 'Revisa tu correo para restablecer tu contrasena',
  }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }
}
