import { Link, createFileRoute } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ListingCard } from '@/components/boncote/listing-card'
import { SiteLayout } from '@/components/boncote/site-layout'
import { listings } from '@/data/fixtures'
import { useFavorites } from '@/lib/favorites'

export const Route = createFileRoute('/favoris')({
  head: () => ({ meta: [{ title: 'Mes favoris — BONCOTE' }] }),
  component: Favorites,
})

function Favorites() {
  const favorites = useFavorites()
  const saved = listings.filter((l) => favorites.includes(l.id))

  return (
    <SiteLayout>
      <div className="mx-auto max-w-content px-4 py-8">
        <h1 className="text-3xl font-extrabold">Mes favoris</h1>
        <p className="text-sm text-muted-foreground">
          {saved.length} annonce{saved.length > 1 ? 's' : ''} sauvegardée{saved.length > 1 ? 's' : ''}
        </p>
        {saved.length ? (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {saved.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
            <Heart className="size-10 text-primary" />
            <h2 className="mt-4 text-xl font-bold">Aucun favori pour l’instant</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Touchez le cœur sur une annonce pour la retrouver ici.
            </p>
            <Button asChild className="mt-6 h-11 rounded-xl">
              <Link to="/recherche">Parcourir les annonces</Link>
            </Button>
          </div>
        )}
      </div>
    </SiteLayout>
  )
}
