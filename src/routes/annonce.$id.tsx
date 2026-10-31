import { useEffect, useState } from 'react'
import { Link, createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import {
  BadgeCheck,
  CalendarDays,
  Flag,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
  Pencil,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/boncote/favorite-button'
import { ListingCard } from '@/components/boncote/listing-card'
import SiteLayout from '@/components/boncote/site-layout'
import { getCategory, listings } from '@/data/fixtures'
import { formatPosted, formatPrice, imageUrl } from '@/lib/format'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/annonce/$id')({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from('annonces')
      .select('*')
      .eq('id', params.id)
      .maybeSingle()

    if (error) throw error

    if (data) {
      const template = listings[0]

      const listing = {
        ...template,
        id: data.id,
        title: data.title,
        description: data.description,
        price: Number(data.price),
        city: data.city,
        postcode: '',
        category: data.category,
        image: data.photo_url || template.image,
        postedAt: data.created_at,
        urgent: false,
        delivery: false,
        attributes: [],
        seller: {
          ...template.seller,
          name: 'Membre BONCOTE',
          pro: false,
          memberSince: '2026',
          listings: 1,
        },
        ownerId: data.user_id,
      }

      return { listing }
    }

    const { getListing } = await import('@/data/fixtures')
    const fixture = getListing(params.id)

    if (!fixture) throw notFound()

    return {
      listing: {
        ...fixture,
        ownerId: '',
      },
    }
  },

  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.listing.title} — BONCOTE` },
          {
            name: 'description',
            content: loaderData.listing.description.slice(0, 155),
          },
        ]
      : [],
  }),

  component: ListingPage,
})

function ListingPage() {
  const { listing } = Route.useLoaderData()
  const navigate = useNavigate()

  const [userId, setUserId] = useState('')
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(listing.title)
  const [description, setDescription] = useState(listing.description)
  const [price, setPrice] = useState(String(listing.price))
  const [city, setCity] = useState(listing.city)
  const [saving, setSaving] = useState(false)

  const [showReport, setShowReport] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDetails, setReportDetails] = useState('')
  const [sendingReport, setSendingReport] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || '')
    })
  }, [])

  const isOwner = Boolean(userId && listing.ownerId === userId)
  const category = getCategory(listing.category)

  const similar = listings
    .filter(
      (l) =>
        l.category === listing.category && l.id !== listing.id,
    )
    .slice(0, 4)

  const initials = listing.seller.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

  const isJob = listing.category === 'emploi'

  async function saveChanges() {
    if (!title.trim() || !description.trim() || !city.trim() || !price.trim()) {
      toast.error('Veuillez remplir tous les champs.')
      return
    }

    const numericPrice = Number(price)

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      toast.error('Veuillez saisir un prix valide.')
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from('annonces')
      .update({
        title: title.trim(),
        description: description.trim(),
        price: numericPrice,
        city: city.trim(),
      })
      .eq('id', listing.id)
      .eq('user_id', userId)

    setSaving(false)

    if (error) {
      toast.error('Impossible de modifier cette annonce.')
      return
    }

    toast.success('Annonce modifiée avec succès.')
    setEditing(false)
    window.location.reload()
  }

  async function deleteListing() {
    const confirmed = window.confirm(
      'Voulez-vous vraiment supprimer cette annonce ?',
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('annonces')
      .delete()
      .eq('id', listing.id)
      .eq('user_id', userId)

    if (error) {
      toast.error('Impossible de supprimer cette annonce.')
      return
    }

    toast.success('Annonce supprimée.')
    await navigate({ to: '/' })
  }

  async function sendReport() {
    if (!userId) {
      toast.error('Connectez-vous pour signaler cette annonce.')
      return
    }

    if (isOwner) {
      toast.error('Vous ne pouvez pas signaler votre propre annonce.')
      return
    }

    if (!listing.ownerId) {
      toast.error('Cette annonce ne peut pas être signalée.')
      return
    }

    if (!reportReason) {
      toast.error('Veuillez choisir un motif de signalement.')
      return
    }

    setSendingReport(true)

    const { error } = await supabase
      .from('signalements')
      .insert({
        annonce_id: listing.id,
        user_id: userId,
        raison: reportReason,
        details: reportDetails.trim() || null,
      })

    setSendingReport(false)

    if (error) {
      toast.error("Impossible d'envoyer le signalement. Réessayez.")
      return
    }

    toast.success('Signalement envoyé. Merci de votre aide.')
    setShowReport(false)
    setReportReason('')
    setReportDetails('')
  }

  const photo =
    typeof listing.image === 'string' && listing.image.startsWith('http')
      ? listing.image
      : imageUrl(listing.image, 1100)

  return (
    <SiteLayout>
      <div className="mx-auto max-w-content px-4 pt-6">
        <nav className="text-xs text-muted-foreground" aria-label="Fil d’Ariane">
          <Link to="/" className="hover:underline">
            Accueil
          </Link>
          <span className="mx-1.5">›</span>
          <Link
            to="/recherche"
            search={{ categorie: listing.category }}
            className="hover:underline"
          >
            {category?.label}
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-foreground">{listing.title}</span>
        </nav>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
          <article>
            <div className="relative overflow-hidden rounded-2xl bg-muted">
              <img
                src={photo}
                alt={listing.title}
                className="aspect-[4/3] w-full object-cover md:aspect-[16/10]"
              />
              <FavoriteButton
                id={listing.id}
                className="absolute right-3 top-3 size-11"
              />
              {listing.urgent && (
                <span className="absolute left-3 top-3 rounded-md bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                  Urgent
                </span>
              )}
            </div>

            {editing ? (
              <section className="mt-6 space-y-4 rounded-2xl border p-5">
                <h2 className="text-xl font-bold">Modifier mon annonce</h2>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Titre
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border bg-background p-3"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="w-full rounded-lg border bg-background p-3"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Prix (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-lg border bg-background p-3"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Ville
                  </label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border bg-background p-3"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={saveChanges} disabled={saving}>
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditing(false)}
                    disabled={saving}
                  >
                    Annuler
                  </Button>
                </div>
              </section>
            ) : (
              <>
                <div className="mt-6">
                  <h1 className="text-2xl font-extrabold leading-tight md:text-3xl">
                    {listing.title}
                  </h1>
                  <p className="mt-2 font-display text-3xl font-extrabold text-primary">
                    {formatPrice(listing.price, listing.priceSuffix)}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4" />
                      {listing.city} {listing.postcode}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-4" />
                      {formatPosted(listing.postedAt)}
                    </span>
                    {listing.delivery && (
                      <span className="inline-flex items-center gap-1.5 font-medium text-sea">
                        <Truck className="size-4" />
                        Livraison possible
                      </span>
                    )}
                  </div>
                </div>

                {listing.attributes.length > 0 && (
                  <section className="mt-8 border-t pt-6">
                    <h2 className="text-lg font-bold">Critères</h2>
                    <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {listing.attributes.map((a) => (
                        <div
                          key={a.label}
                          className="rounded-xl bg-secondary px-4 py-3"
                        >
                          <dt className="text-xs text-muted-foreground">
                            {a.label}
                          </dt>
                          <dd className="font-semibold">{a.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                )}

                <section className="mt-8 border-t pt-6">
                  <h2 className="text-lg font-bold">Description</h2>
                  <p className="mt-3 max-w-reading whitespace-pre-line leading-relaxed text-foreground/90">
                    {listing.description}
                  </p>
                </section>
              </>
            )}

            {isOwner && !editing && (
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => setEditing(true)}>
                  <Pencil className="mr-2 size-4" />
                  Modifier
                </Button>
                <Button variant="destructive" onClick={deleteListing}>
                  <Trash2 className="mr-2 size-4" />
                  Supprimer
                </Button>
              </div>
            )}

            {!isOwner && listing.ownerId && (
              <section className="mt-8 rounded-2xl border p-5">
                {!showReport ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (!userId) {
                        toast.error('Connectez-vous pour signaler cette annonce.')
                        return
                      }
                      setShowReport(true)
                    }}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Flag className="size-4" />
                    Signaler cette annonce
                  </button>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold">
                      Signaler cette annonce
                    </h2>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Motif du signalement
                      </label>
                      <select
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="w-full rounded-lg border bg-background p-3"
                      >
                        <option value="">Choisir un motif</option>
                        <option value="Annonce frauduleuse">Annonce frauduleuse</option>
                        <option value="Annonce interdite">Annonce interdite</option>
                        <option value="Prix incorrect">Prix incorrect</option>
                        <option value="Contenu inapproprié">Contenu inapproprié</option>
                        <option value="Annonce en double">Annonce en double</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Précisions (facultatif)
                      </label>
                      <textarea
                        value={reportDetails}
                        onChange={(e) => setReportDetails(e.target.value)}
                        rows={4}
                        maxLength={1000}
                        placeholder="Expliquez le problème..."
                        className="w-full rounded-lg border bg-background p-3"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={sendReport}
                        disabled={sendingReport}
                      >
                        {sendingReport ? 'Envoi...' : 'Envoyer le signalement'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowReport(false)}
                        disabled={sendingReport}
                      >
                        Annuler
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Votre signalement sera examiné par notre équipe.
                      Il ne supprime pas automatiquement l’annonce.
                    </p>
                  </div>
                )}
              </section>
            )}
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
                    {listing.seller.pro && (
                      <BadgeCheck
                        className="size-4 text-sea"
                        aria-label="Professionnel"
                      />
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {listing.seller.pro ? 'Professionnel' : 'Particulier'} ·
                    membre depuis {listing.seller.memberSince} ·{' '}
                    {listing.seller.listings} annonce
                    {listing.seller.listings > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {!isOwner && (
                <div className="mt-5 grid gap-2">
                  <Button
                    size="lg"
                    className="h-12 rounded-xl text-base font-semibold"
                    onClick={() =>
                      toast('La messagerie arrive très bientôt sur BONCOTE')
                    }
                  >
                    <MessageCircle />
                    {isJob ? 'Postuler' : 'Envoyer un message'}
                  </Button>

                  {!isJob && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 rounded-xl text-base font-semibold"
                      onClick={() =>
                        toast('Le vendeur préfère être contacté par message')
                      }
                    >
                      <Phone />
                      Voir le numéro
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-3 rounded-2xl bg-secondary p-4 text-sm">
              <ShieldCheck className="size-5 shrink-0 text-sea" />
              <p className="text-muted-foreground">
                Ne payez jamais par mandat cash ou virement à l’étranger.
                Privilégiez la remise en main propre ou le paiement sécurisé.
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

