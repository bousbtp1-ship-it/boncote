import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import SiteLayout from '@/components/boncote/site-layout'
import { supabase } from '@/lib/supabase'

type Signalement = {
  id: string
  annonce_id: string
  user_id: string
  raison: string
  details: string | null
  created_at: string
  statut: string
}

export const Route = createFileRoute('/admin/signalements')({
  component: AdminSignalements,
})

function AdminSignalements() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState('')
  const [reports, setReports] = useState<Signalement[]>([])
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadReports() {
      setLoading(true)
      setError('')

      const { data: userData, error: userError } =
        await supabase.auth.getUser()

      if (userError || !userData.user) {
        setError('Veuillez vous connecter pour accéder à cette page.')
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

      const { data, error: reportsError } = await supabase
        .from('signalements')
        .select(
          'id, annonce_id, user_id, raison, details, created_at, statut'
        )
        .order('created_at', { ascending: false })

      if (reportsError) {
        setError('Impossible de charger les signalements.')
      } else {
        setReports(data ?? [])
      }

      setLoading(false)
    }

    loadReports()
  }, [])

  async function updateStatus(reportId: string, newStatus: string) {
    setSavingId(reportId)
    setError('')

    const { error: updateError } = await supabase
      .from('signalements')
      .update({ statut: newStatus })
      .eq('id', reportId)

    if (updateError) {
      setError('Impossible de modifier le statut du signalement.')
    } else {
      setReports((currentReports) =>
        currentReports.map((report) =>
          report.id === reportId
            ? { ...report, statut: newStatus }
            : report
        )
      )
    }

    setSavingId(null)
  }

  return (
    <SiteLayout>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-bold">
          Administration des signalements
        </h1>

        <p className="mb-8 text-sm text-gray-500">
          Gestion des signalements des annonces BONCOTE.
        </p>

        {loading && <p>Chargement...</p>}

        {!loading && error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
            <p className="mt-3">
              <a href="/connexion" className="font-semibold underline">
                Se connecter
              </a>
            </p>
          </div>
        )}

        {!loading && isAdmin && (
          <section className="space-y-4">
            <p className="font-semibold">
              {reports.length} signalement(s)
            </p>

            {reports.length === 0 && (
              <p className="rounded-lg border p-5 text-gray-500">
                Aucun signalement pour le moment.
              </p>
            )}

            {reports.map((report) => (
              <article
                key={report.id}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <h2 className="mb-3 text-lg font-bold">
                  {report.raison}
                </h2>

                <p className="mb-2 text-sm">
                  <strong>Annonce :</strong> {report.annonce_id}
                </p>

                <p className="mb-2 text-sm">
                  <strong>Utilisateur :</strong> {report.user_id}
                </p>

                <p className="mb-2 text-sm">
                  <strong>Détails :</strong>{' '}
                  {report.details || 'Aucun détail fourni'}
                </p>

                <p className="mb-4 text-xs text-gray-500">
                  {new Date(report.created_at).toLocaleString('fr-FR')}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <label
                    htmlFor={`statut-${report.id}`}
                    className="text-sm font-semibold"
                  >
                    Statut :
                  </label>

                  <select
                    id={`statut-${report.id}`}
                    value={report.statut || 'En attente'}
                    disabled={savingId === report.id}
                    onChange={(event) =>
                      updateStatus(report.id, event.target.value)
                    }
                    className="rounded-lg border px-3 py-2 text-sm"
                  >
                    <option value="En attente">En attente</option>
                    <option value="Traité">Traité</option>
                    <option value="Rejeté">Rejeté</option>
                  </select>

                  {savingId === report.id && (
                    <span className="text-sm text-gray-500">
                      Enregistrement...
                    </span>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </SiteLayout>
  )
}
