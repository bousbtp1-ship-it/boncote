import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Pencil, Trash2, PlusCircle } from 'lucide-react'
import { toast } from 'sonner'
import SiteLayout from '@/components/boncote/site-layout'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/format'

export const Route = createFileRoute('/mes-annonces')({
  component: MesAnnoncesPage,
})

type Annonce = {
  id: string
  title: string
  price: number
  city: string
  photo_url: string | null
  created_at: string
}

function MesAnnoncesPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  async function loadAnnonces() {
    setLoading(true)

    const { data: authData } = await supabase.auth.getUser()

    if (!authData.user) {
      setUserId(null)
      setAnnonces([])
      setLoading(false)
      return
    }

    setUserId(authData.user.id)

    const { data, error } = await supabase
      .from('annonces')
      .select('id, title, price, city, photo_url, created_at')
      .eq('user_id', authData.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Impossible de charger vos annonces.')
    } else {
      setAnnonces((data ?? []) as Annonce[])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadAnnonces()
  }, [])

  async function supprimerAnnonce(id: string) {
    if (!userId) return

    const confirme = window.confirm(
      'Voulez-vous vraiment supprimer cette annonce ?',
    )

    if (!confirme) return

    const { error } = await supabase
      .from('annonces')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      toast.error('La suppression a échoué.')
      return
    }

    setAnnonces((anciennes) => anciennes.filter((annonce) => annonce.id !== id))
    toast.success('Annonce supprimée.')
  }

  return (
    <SiteLayout>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Mes annonces</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gérez les annonces que vous avez publiées.
            </p>
          </div>

          <Link
            to="/deposer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <PlusCircle size={18} />
            Déposer une annonce
          </Link>
        </div>

        {loading ? (
          <p className="py-10 text-center">Chargement de vos annonces...</p>
        ) : !userId ? (
          <div className="rounded-xl border p-8 text-center">
            <p className="mb-4">Connectez-vous pour voir vos annonces.</p>
            <Link to="/connexion" className="font-semibold text-primary">
              Se connecter
            </Link>
          </div>
        ) : annonces.length === 0 ? (
          <div className="rounded-xl border p-8 text-center">
            <p className="mb-4">Vous n'avez pas encore publié d'annonce.</p>
            <Link to="/deposer" className="font-semibold text-primary">
              Déposer ma première annonce
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {annonces.map((annonce) => (
              <article
                key={annonce.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border p-4"
              >
                {annonce.photo_url ? (
                  <img
                    src={annonce.photo_url}
                    alt={annonce.title}
                    className="h-24 w-28 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-28 items-center justify-center rounded-lg bg-muted text-sm">
                    Sans photo
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">{annonce.title}</h2>
                  <p className="mt-1 font-bold">
                    {formatPrice(Number(annonce.price))}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {annonce.city}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/annonce/$id"
                    params={{ id: annonce.id }}
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                  >
                    Voir
                  </Link>

                  <Link
                    to="/annonce/$id"
                    params={{ id: annonce.id }}
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                  >
                    <Pencil size={16} />
                    Modifier
                  </Link>

                  <button
                    type="button"
                    onClick={() => supprimerAnnonce(annonce.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600"
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </SiteLayout>
  )
}

