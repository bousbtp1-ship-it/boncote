import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { BadgeCheck, CalendarDays, Flag, MapPin, MessageCircle, Phone, ShieldCheck, Truck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/boncote/favorite-button'
import { ListingCard } from '@/components/boncote/listing-card'
import { SiteLayout } from '@/components/boncote/site-layout'
import { getCategory, getListing, listings } from '@/data/fixtures'
import { formatPosted, formatPrice, imageUrl } from '@/lib/format'

export const Route = createFileRoute('/annonce/$id')({
  loader: ({ params }) => {
    const listing = getListing(params.id)
    if (!listing) throw notFound()
    return { listing }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.listing.title} — BONCOTE` },
          { name: 'description', content: loaderData.listing.description.slice(0, 155) },
        ]
      : [],
  }),
  component: ListingPage,
})

function ListingPage() {
  const { listing } = Route.useLoaderData()
  const category = getCategory(listing.category)
  const similar = listings.filter((l) => l.category === listing.category && l.id !== listing.id).slice(0, 4)
  const initials = listing.seller.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
  const isJob = listing.category === 'emploi'

  return (
    <SiteLayout>
      <div className="mx-auto max-w-content px-4 pt-6">
        <nav className="text-xs text-muted-foreground" aria-label="Fil d’Ariane">
          <Link to="/" className="hover:underline">Accueil</Link>
          <span className="mx-1.5">›</span>
          <Link to="/recherche" search={{ categorie: listing.category }} className="hover:underline">
            {category?.label}
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-foreground">{listing.title}</span>
        </nav>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
          <article>
            <div className="relative overflow-hidden rounded-2xl bg-muted">
              <img
                src={imageUrl(listing.image, 1100)}
                srcSet={`${imageUrl(listing.image, 640)} 640w, ${imageUrl(listing.image, 1100)} 1100w`}
                sizes="(min-width: 1024px) 760px, 100vw"
                alt={listing.title}
                className="aspect-[4/3] w-full object-cover md:aspect-[16/10]"
              />
              <FavoriteButton id={listing.id} className="absolute right-3 top-3 size-11" />
              {listing.urgent && (
                <span className="absolute left-3 top-3 rounded-md bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                  Urgent
                </span>
              )}
            </div>

            <div className="mt-6">
              <h1 className="text-2xl font-extrabold leading-tight md:text-3xl">{listing.title}</h1>
              <p className="mt-2 font-display text-3xl font-extrabold text-primary">
                {formatPrice(listing.price, listing.priceSuffix)}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" /> {listing.city} {listing.postcode}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4" /> {formatPosted(listing.postedAt)}
                </span>
                {listing.delivery && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-sea">
                    <Truck className="size-4" /> Livraison possible
                  </span>
                )}
              </div>
            </div>

            <section className="mt-8 border-t pt-6">
              <h2 className="text-lg font-bold">Critères</h2>
              <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {listing.attributes.map((a) => (
                  <div key={a.label} className="rounded-xl bg-secondary px-4 py-3">
                    <dt className="text-xs text-muted-foreground">{a.label}</dt>
                    <dd className="font-semibold">{a.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-8 border-t pt-6">
              <h2 className="text-lg font-bold">Description</h2>
              <p className="mt-3 max-w-reading whitespace-pre-line leading-relaxed text-foreground/90">
                {listing.description}
              </p>
            </section>

            <button
              type="button"
              onClick={() => toast('Merci, notre équipe va examiner cette annonce.')}
              className="mt-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Flag className="size-3.5" /> Signaler l’annonce
            </button>
          </article>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-ink font-display font-bold text-ink-foreground">
                  {initials}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 font-semibold">
                    {listing.seller.name}
                    {listing.seller.pro && <BadgeCheck className="size-4 text-sea" aria-label="Professionnel" />}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {listing.seller.pro ? 'Professionnel' : 'Particulier'} · membre depuis {listing.seller.memberSince} ·{' '}
                    {listing.seller.listings} annonce{listing.seller.listings > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-2">
                <Button
                  size="lg"
                  className="h-12 rounded-xl text-base font-semibold"
                  onClick={() => toast('La messagerie arrive très bientôt sur BONCOTE')}
                >
                  <MessageCircle /> {isJob ? 'Postuler' : 'Envoyer un message'}
                </Button>
                {!isJob && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-xl text-base font-semibold"
                    onClick={() => toast('Le vendeur préfère être contacté par message')}
                  >
                    <Phone /> Voir le numéro
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-3 rounded-2xl bg-secondary p-4 text-sm">
              <ShieldCheck className="size-5 shrink-0 text-sea" />
              <p className="text-muted-foreground">
                Ne payez jamais par mandat cash ou virement à l’étranger. Privilégiez la remise en main propre ou le paiement sécurisé.
              </p>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Annonces similaires</h2>
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {similar.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  )
}
