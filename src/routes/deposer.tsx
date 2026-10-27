import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { CheckCircle2, ImagePlus, MapPin, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CategoryIcon } from '@/components/boncote/category-icon'
import { SiteLayout } from '@/components/boncote/site-layout'
import { categories, type CategoryId } from '@/data/fixtures'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/deposer')({
  head: () => ({ meta: [{ title: 'Déposer une annonce — BONCOTE' }] }),
  component: PostListing,
})

type Draft = {
  category?: CategoryId
  title: string
  description: string
  price: string
  city: string
}

type Errors = Partial<Record<keyof Draft, string>>

function validate(d: Draft): Errors {
  const e: Errors = {}
  if (!d.category) e.category = 'Choisissez une catégorie'
  if (d.title.trim().length < 5) e.title = 'Le titre doit faire au moins 5 caractères'
  if (d.description.trim().length < 20) e.description = 'Décrivez votre annonce en 20 caractères minimum'
  if (!/^\d+$/.test(d.price.trim())) e.price = 'Indiquez un prix en euros'
  if (d.city.trim().length < 2) e.city = 'Indiquez une ville ou un code postal'
  return e
}

function PostListing() {
  const [draft, setDraft] = useState<Draft>({ title: '', description: '', price: '', city: '' })
  const [photo, setPhoto] = useState<string>()
  const [errors, setErrors] = useState<Errors>({})
  const [done, setDone] = useState(false)

  useEffect(() => () => {
    if (photo) URL.revokeObjectURL(photo)
  }, [photo])

  const update = (patch: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...patch }))
    setErrors((e) => {
      const next = { ...e }
      for (const k of Object.keys(patch)) delete next[k as keyof Draft]
      return next
    })
  }

  if (done) {
    return (
      <SiteLayout>
        <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
          <CheckCircle2 className="size-14 text-primary" />
          <h1 className="mt-5 text-3xl font-extrabold">Votre annonce est prête !</h1>
          <p className="mt-2 text-muted-foreground">
            « {draft.title} » sera visible par les acheteurs dès l’ouverture des publications sur BONCOTE.
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild variant="outline" className="h-11 rounded-xl">
              <Link to="/">Retour à l’accueil</Link>
            </Button>
            <Button
              className="h-11 rounded-xl"
              onClick={() => {
                setDraft({ title: '', description: '', price: '', city: '' })
                setPhoto(undefined)
                setDone(false)
              }}
            >
              Déposer une autre annonce
            </Button>
          </div>
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-content px-4 py-8">
        <h1 className="text-3xl font-extrabold md:text-4xl">Déposer une annonce</h1>
        <p className="mt-1 text-muted-foreground">C’est gratuit et ça prend moins de 2 minutes.</p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
          <form
            noValidate
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault()
              const found = validate(draft)
              setErrors(found)
              if (Object.keys(found).length) {
                toast.error('Quelques informations manquent encore')
                return
              }
              setDone(true)
              window.scrollTo({ top: 0 })
            }}
          >
            <fieldset>
              <legend className="font-display text-lg font-bold">1. Catégorie</legend>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={draft.category === c.id}
                    onClick={() => update({ category: c.id })}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border bg-card px-2 py-4 text-sm font-medium transition',
                      draft.category === c.id
                        ? 'border-primary bg-accent text-accent-foreground ring-2 ring-primary/30'
                        : 'hover:border-ink/40',
                    )}
                  >
                    <CategoryIcon id={c.id} className="size-6" />
                    {c.label}
                  </button>
                ))}
              </div>
              <FieldError msg={errors.category} />
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="font-display text-lg font-bold">2. Votre annonce</legend>
              <div className="space-y-1.5">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={draft.title}
                  maxLength={70}
                  placeholder="Ex. : Vélo de ville très bon état"
                  aria-invalid={!!errors.title}
                  onChange={(e) => update({ title: e.target.value })}
                  className="h-11"
                />
                <FieldError msg={errors.title} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  value={draft.description}
                  placeholder="État, dimensions, raison de la vente…"
                  aria-invalid={!!errors.description}
                  onChange={(e) => update({ description: e.target.value })}
                />
                <FieldError msg={errors.description} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Prix (€)</Label>
                  <Input
                    id="price"
                    inputMode="numeric"
                    value={draft.price}
                    placeholder="0"
                    aria-invalid={!!errors.price}
                    onChange={(e) => update({ price: e.target.value.replace(/\D/g, '') })}
                    className="h-11"
                  />
                  <FieldError msg={errors.price} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city">Localisation</Label>
                  <Input
                    id="city"
                    value={draft.city}
                    placeholder="Ville ou code postal"
                    aria-invalid={!!errors.city}
                    onChange={(e) => update({ city: e.target.value })}
                    className="h-11"
                  />
                  <FieldError msg={errors.city} />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-display text-lg font-bold">3. Photo</legend>
              {photo ? (
                <div className="relative mt-3 w-48 overflow-hidden rounded-xl border">
                  <img src={photo} alt="Aperçu de votre photo" className="aspect-[4/3] w-full object-cover" />
                  <button
                    type="button"
                    aria-label="Retirer la photo"
                    onClick={() => setPhoto(undefined)}
                    className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-card/90 shadow"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <label className="mt-3 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed bg-card px-6 py-10 text-center transition hover:border-primary">
                  <ImagePlus className="size-8 text-primary" />
                  <span className="font-semibold">Ajouter une photo</span>
                  <span className="text-xs text-muted-foreground">Les annonces avec photo reçoivent 7× plus de messages</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setPhoto(URL.createObjectURL(file))
                    }}
                  />
                </label>
              )}
            </fieldset>

            <Button type="submit" size="lg" className="h-12 w-full rounded-xl text-base font-semibold sm:w-auto sm:px-10">
              Valider mon annonce
            </Button>
          </form>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aperçu</p>
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="grid aspect-[4/3] place-items-center bg-muted text-muted-foreground">
                {photo ? (
                  <img src={photo} alt="" className="size-full object-cover" />
                ) : draft.category ? (
                  <CategoryIcon id={draft.category} className="size-12 opacity-40" />
                ) : (
                  <ImagePlus className="size-12 opacity-40" />
                )}
              </div>
              <div className="space-y-1 p-4">
                <p className="line-clamp-2 font-semibold">{draft.title || 'Titre de votre annonce'}</p>
                <p className="font-display text-lg font-bold text-ink">
                  {draft.price ? formatPrice(Number(draft.price)) : '— €'}
                </p>
                <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" /> {draft.city || 'Votre ville'}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  )
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1.5 text-sm text-destructive">{msg}</p> : null
}
