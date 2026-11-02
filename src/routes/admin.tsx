import { useEffect, useState } from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import SiteLayout from '@/components/boncote/site-layout'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/admin')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function checkAdmin() {
      const { data: userData, error: userError } =
        await supabase.auth.getUser()

      if (userError || !userData.user) {
        setError('Veuillez vous connecter pour accéder à l’administration.')
        setLoading(false)
        return
      }

      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', userData.user.id)
        .maybeSingle()

      if (adminError || !admin) {
        setError('Accès réservé à l’administrateur.')
        setLoading(false)
        return
      }

      setIsAdmin(true)
      setLoading(false)
    }

    void checkAdmin()
  }, [])

  return (
    <SiteLayout>
      <main className="mx-auto max-w-5xl px-4 py-10">
        {loading && <p>Chargement...</p>}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
            <p className="mt-3">
              <a href="/connexion" className="font-semibold underline">
                Se connecter
              </a>
            </p>
          </div>
        )}

        {!loading && isAdmin && (
          <>
            <h1 className="mb-2 text-3xl font-bold">
              Administration BONCOTE
            </h1>

            <p className="mb-8 text-gray-500">
              Tableau de bord de gestion de la plateforme.
            </p>

            <section className="grid gap-5 sm:grid-cols-2">
              <a
                href="/admin/signalements"
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <h2 className="mb-2 text-xl font-bold">
                  Gestion des signalements
                </h2>
                <p className="text-sm text-gray-500">
                  Consulter et traiter les signalements des annonces.
                </p>
              </a>

              <a
                href="/admin/user"
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <h2 className="mb-2 text-xl font-bold">
                  Gestion des utilisateurs
                </h2>
                <p className="text-sm text-gray-500">
                  Consulter les comptes, bloquer ou débloquer les utilisateurs.
                </p>
              </a>

              <div className="rounded-xl border bg-white p-6">
                <h2 className="mb-2 text-xl font-bold">
                  Gestion des annonces
                </h2>
                <p className="text-sm text-gray-500">
                  Cette section sera ajoutée prochainement.
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6">
                <h2 className="mb-2 text-xl font-bold">
                  Gestion des catégories
                </h2>
                <p className="text-sm text-gray-500">
                  Cette section sera ajoutée prochainement.
                </p>
              </div>
            </section>

            <Outlet />
          </>
        )}
      </main>
    </SiteLayout>
  )
}

