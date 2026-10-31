import { useState } from 'react'
import type { FormEvent } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import SiteLayout from '@/components/boncote/site-layout'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/connexion')({
  component: ConnexionPage,
})

function ConnexionPage() {
  const navigate = useNavigate()

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      if (mode === 'signup') {
        if (password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères.')
          return
        }

        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/connexion`,
          },
        })

        if (error) throw error

        setMessage(
          'Compte créé. Vérifiez votre boîte e-mail pour confirmer votre inscription.',
        )
        setMode('login')
        setPassword('')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (error) throw error

        await navigate({ to: '/' })
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue. Veuillez réessayer.',
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    setError('')
    setMessage('')

    if (!email.trim()) {
      setError('Veuillez saisir votre adresse e-mail.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        },
      )

      if (error) throw error

      setMessage('Un lien de réinitialisation a été envoyé à votre e-mail.')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible d’envoyer le lien.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <SiteLayout>
      <main className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="votre@email.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="6 caractères minimum"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? 'Veuillez patienter...'
                : mode === 'login'
                  ? 'Se connecter'
                  : 'Créer mon compte'}
            </button>
          </form>

          {mode === 'login' && (
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
              className="mt-4 block w-full text-center text-sm text-blue-600 hover:underline"
            >
              Mot de passe oublié ?
            </button>
          )}

          <div className="mt-6 border-t border-gray-200 pt-5 text-center">
            <p className="mb-3 text-sm text-gray-600">
              {mode === 'login'
                ? 'Vous n’avez pas encore de compte ?'
                : 'Vous avez déjà un compte ?'}
            </p>

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setError('')
                setMessage('')
              }}
              className="font-semibold text-blue-600 hover:underline"
            >
              {mode === 'login' ? 'Créer un compte' : 'Se connecter'}
            </button>
          </div>
        </div>
      </main>
    </SiteLayout>
  )
}

