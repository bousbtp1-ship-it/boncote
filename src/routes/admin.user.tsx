import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import {
  listAdminUsers,
  banAdminUser,
  unbanAdminUser,
} from '@/server/admin-user'

type AdminUser = {
  id: string
  email: string
  created_at: string
  banned_until: string | null
}

export const Route = createFileRoute('/admin/user')({
  component: AdminUsersPage,
})

function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [workingId, setWorkingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  async function loadUsers() {
    setLoading(true)
    setMessage('')

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Veuillez vous connecter.')
      }

      const result = await listAdminUsers({
        data: { accessToken: session.access_token },
      })

      setUsers(result)
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Impossible de charger les utilisateurs.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  async function changeBanStatus(user: AdminUser) {
    const isBanned =
      user.banned_until !== null &&
      new Date(user.banned_until).getTime() > Date.now()

    const confirmation = window.confirm(
      isBanned
        ? `Débloquer le compte ${user.email} ?`
        : `Bloquer le compte ${user.email} ?`,
    )

    if (!confirmation) return

    setWorkingId(user.id)
    setMessage('')

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Veuillez vous connecter.')
      }

      const input = {
        data: {
          accessToken: session.access_token,
          userId: user.id,
        },
      }

      if (isBanned) {
        await unbanAdminUser(input)
      } else {
        await banAdminUser(input)
      }

      await loadUsers()
      setMessage('Opération effectuée avec succès.')
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue.',
      )
    } finally {
      setWorkingId(null)
    }
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            Gestion des utilisateurs
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Comptes inscrits sur BONCOTE
          </p>
        </div>

        <Link
          to="/admin"
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Retour à l’administration
        </Link>
      </div>

      {message && (
        <p className="mb-4 rounded-lg border p-3 text-sm" role="status">
          {message}
        </p>
      )}

      {loading ? (
        <p>Chargement des utilisateurs...</p>
      ) : users.length === 0 ? (
        <p>Aucun utilisateur à afficher.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">E-mail</th>
                <th className="p-3">Date d’inscription</th>
                <th className="p-3">État du compte</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isBanned =
                  user.banned_until !== null &&
                  new Date(user.banned_until).getTime() > Date.now()

                return (
                  <tr key={user.id} className="border-t">
                    <td className="p-3">
                      {user.email || 'Non renseigné'}
                    </td>

                    <td className="p-3">
                      {new Date(user.created_at).toLocaleDateString(
                        'fr-FR',
                      )}
                    </td>

                    <td className="p-3">
                      {isBanned ? 'Bloqué' : 'Actif'}
                    </td>

                    <td className="p-3">
                      <button
                        type="button"
                        disabled={workingId === user.id}
                        onClick={() => void changeBanStatus(user)}
                        className="rounded-lg border px-3 py-2 disabled:opacity-50"
                      >
                        {workingId === user.id
                          ? 'Patientez...'
                          : isBanned
                            ? 'Débloquer'
                            : 'Bloquer'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

