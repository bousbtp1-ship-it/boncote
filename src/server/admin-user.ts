import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'
import { createClient } from '@supabase/supabase-js'

type AdminInput = {
  accessToken: string
}

type UserInput = AdminInput & {
  userId: string
}

type RuntimeEnvKey =
  | 'VITE_SUPABASE_URL'
  | 'VITE_SUPABASE_ANON_KEY'
  | 'SUPABASE_SERVICE_ROLE_KEY'

function getRuntimeEnv(name: RuntimeEnvKey): string | undefined {
  const cloudflareEnv = env as Record<string, unknown>
  const value = cloudflareEnv[name]

  return typeof value === 'string' ? value : undefined
}

function getAdminClient() {
  const url = getRuntimeEnv('VITE_SUPABASE_URL')
  const key = getRuntimeEnv('SUPABASE_SERVICE_ROLE_KEY')

  if (!url) {
    throw new Error('Variable manquante: VITE_SUPABASE_URL')
  }

  if (!key) {
    throw new Error('Variable manquante: SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

async function verifyAdmin(accessToken: string) {
  const url = getRuntimeEnv('VITE_SUPABASE_URL')
  const anonKey = getRuntimeEnv('VITE_SUPABASE_ANON_KEY')

  if (!url) {
    throw new Error('Variable manquante: VITE_SUPABASE_URL')
  }

  if (!anonKey) {
    throw new Error('Variable manquante: VITE_SUPABASE_ANON_KEY')
  }

  const supabase = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const { data, error } = await supabase.auth.getUser(accessToken)

  if (error || !data.user) {
    throw new Error('Authentification requise.')
  }

  const adminClient = getAdminClient()

  const { data: admin, error: adminError } = await adminClient
    .from('admins')
    .select('user_id')
    .eq('user_id', data.user.id)
    .maybeSingle()

  if (adminError || !admin) {
    throw new Error('Accès réservé aux administrateurs.')
  }

  return adminClient
}

export const listAdminUsers = createServerFn({ method: 'POST' })
  .validator((data: AdminInput) => data)
  .handler(async ({ data }) => {
    const client = await verifyAdmin(data.accessToken)

    const { data: result, error } = await client.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    })

    if (error) throw error

    const { data: admins, error: adminError } = await client
      .from('admins')
      .select('user_id')

    if (adminError) throw adminError

    const adminIds = new Set(
      (admins ?? []).map((admin) => admin.user_id),
    )

    return result.users
      .filter((user) => !adminIds.has(user.id))
      .map((user) => ({
        id: user.id,
        email: user.email ?? '',
        created_at: user.created_at,
        banned_until: user.banned_until ?? null,
      }))
  })

export const banAdminUser = createServerFn({ method: 'POST' })
  .validator((data: UserInput) => data)
  .handler(async ({ data }) => {
    const client = await verifyAdmin(data.accessToken)

    const { data: admin, error: adminError } = await client
      .from('admins')
      .select('user_id')
      .eq('user_id', data.userId)
      .maybeSingle()

    if (adminError) throw adminError

    if (admin) {
      throw new Error('Impossible de bloquer un administrateur.')
    }

    const { error } = await client.auth.admin.updateUserById(
      data.userId,
      { ban_duration: '876000h' },
    )

    if (error) throw error

    return { success: true }
  })

export const unbanAdminUser = createServerFn({ method: 'POST' })
  .validator((data: UserInput) => data)
  .handler(async ({ data }) => {
    const client = await verifyAdmin(data.accessToken)

    const { data: admin, error: adminError } = await client
      .from('admins')
      .select('user_id')
      .eq('user_id', data.userId)
      .maybeSingle()

    if (adminError) throw adminError

    if (admin) {
      throw new Error('Impossible de modifier un administrateur.')
    }

    const { error } = await client.auth.admin.updateUserById(
      data.userId,
      { ban_duration: 'none' },
    )

    if (error) throw error

    return { success: true }
  })

