import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { CheckCircle2, ImagePlus, MapPin, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CategoryIcon } from '@/components/boncote/category-icon'
import  SiteLayout  from '@/components/boncote/site-layout'
import { categories, type CategoryId } from '@/data/fixtures'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/deposer')({
  head: () => ({
    meta: [{ title: 'Déposer une annonce — BONCOTE' }],
  }),
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

function validate(draft: Draft): Errors {
  const errors: Errors = {}

  if (!draft.category) {
    errors.category = 'Choisissez une catégorie'
  }

  if (draft.title.trim().length < 5) {
    errors.title = 'Le titre doit faire au moins 5 caractères'
  }

  if (draft.description.trim().length < 20) {
    errors.description = 'Décrivez votre annonce en 20 caractères minimum'
  }

  if (!/^\d+$/.test(draft.price.trim())) {
    errors.price = 'Indiquez un prix en euros'
  }

  if (draft.city.trim().length < 2) {
    errors.city = 'Indiquez une ville ou un code postal'
  }

  return errors
}

function PostListing() {
  const [draft, setDraft] = useState<Draft>({
    title: '',
    description: '',
    price: '',
    city: '',
  })

  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | undefined>()
  const [errors, setErrors] = useState<Errors>({})
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!photo) {
      setPhotoPreview(undefined)
      return
    }

    const previewUrl = URL.createObjectURL(photo)
    setPhotoPreview(previewUrl)

    return () => {
      URL.revokeObjectURL(previewUrl)
    }
  }, [photo])

  function update(patch: Partial<Draft>) {
    setDraft((current) => ({
      ...current,
      ...patch,
    }))

    setErrors((current) => {
      const next = { ...current }

      Object.keys(patch).forEach((key) => {
        delete next[key as keyof Draft]
      })

      return next
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationErrors = validate(draft)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Quelques informations manquent encore')
      return
    }

    setSubmitting(true)

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser()

      if (authError || !authData.user) {
        toast.error('Connectez-vous pour déposer une annonce')
        return
      }

      let photoUrl: string | null = null

      if (photo) {
        const extension = photo.name.split('.').pop()?.toLowerCase() || 'jpg'
        const filePath = `${authData.user.id}/${crypto.randomUUID()}.${extension}`

        const { error: uploadError } = await supabase.storage
          .from('annonces')
          .upload(filePath, photo, {
            cacheControl: '3600',
            upsert: false,
            contentType: photo.type,
          })

        if (uploadError) {
          throw uploadError
        }

        const { data: publicUrlData } = supabase.storage
          .from('annonces')
          .getPublicUrl(filePath)

        photoUrl = publicUrlData.publicUrl
      }

      const { error: insertError } = await supabase
        .from('annonces')
        .insert({
          user_id: authData.user.id,
          category: draft.category!,
          title: draft.title.trim(),
          description: draft.description.trim(),
          price: Number(draft.price),
          city: draft.city.trim(),
          photo_url: photoUrl,
        })

      if (insertError) {
        throw insertError
      }

      toast.success('Votre annonce a été publiée !')
      setDone(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Erreur de publication :', error)

      toast.error(
        error instanceof Error
          ? `Erreur : ${error.message}`
          : 'Impossible de publier votre annonce.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <SiteLayout>
        <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
          <CheckCircle2 className="size-14 text-primary" />

          <h1 className="mt-5 text-3xl font-extrabold">
            Votre annonce est publiée !
          </h1>

          <p className="mt-2 text-muted-foreground">
            « {draft.title} » est maintenant enregistrée sur BONCOTE.
          </p>

          <div className="mt-8 flex gap-3">
            <Button asChild variant="outline" className="h-11 rounded-xl">
              <Link to="/">Retour à l’accueil</Link>
            </Button>

            <Button
              className="h-11 rounded-xl"
              onClick={() => {
                setDraft({
                  title: '',
                  description: '',
                  price: '',
                  city: '',
                })
                setPhoto(null)
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
        <h1 className="text-3xl font-extrabold md:text-4xl">
          Déposer une annonce
        </h1>

        <p className="mt-1 text-muted-foreground">
          C’est gratuit et ça prend moins de 2 minutes.
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
          <form
            noValidate
            className="space-y-8"
            onSubmit={handleSubmit}
          >
            <fieldset>
              <legend className="font-display text-lg font-bold">
                1. Catégorie
              </legend>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={draft.category === category.id}
                    onClick={() => update({ category: category.id })}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border bg-card px-2 py-4 text-sm font-medium transition',
                      draft.category === category.id
                        ? 'border-primary bg-accent text-accent-foreground ring-2 ring-primary/30'
                        : 'hover:border-ink/40',
                    )}
                  >
                    <CategoryIcon
                      id={category.id}
                      className="size-6"
                    />
                    {category.label}
                  </button>
                ))}
              </div>

              <FieldError msg={errors.category} />
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="font-display text-lg font-bold">
                2. Votre annonce
              </legend>

              <div className="space-y-1.5">
                <Label htmlFor="title">Titre</Label>

                <Input
                  id="title"
                  value={draft.title}
                  maxLength={70}
                  placeholder="Ex. : Vélo de ville très bon état"
                  aria-invalid={!!errors.title}
                  onChange={(event) =>
                    update({ title: event.target.value })
                  }
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
                  onChange={(event) =>
                    update({ description: event.target.value })
                  }
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
                    onChange={(event) =>
                      update({
                        price: event.target.value.replace(/\D/g, ''),
                      })
                    }
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
                    onChange={(event) =>
                      update({ city: event.target.value })
                    }
                    className="h-11"
                  />

                  <FieldError msg={errors.city} />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-display text-lg font-bold">
                3. Photo
              </legend>

              {photoPreview ? (
                <div className="relative mt-3 w-48 overflow-hidden rounded-xl border">
                  <img
                    src={photoPreview}
                    alt="Aperçu de votre photo"
                    className="aspect-[4/3] w-full object-cover"
                  />

                  <button
                    type="button"
                    aria-label="Retirer la photo"
                    onClick={() => setPhoto(null)}
                    className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-card/90 shadow"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <label className="mt-3 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed bg-card px-6 py-10 text-center transition hover:border-primary">
                  <ImagePlus className="size-8 text-primary" />

                  <span className="font-semibold">
                    Ajouter une photo
                  </span>

                  <span className="text-xs text-muted-foreground">
                    Formats image acceptés — 5 Mo maximum
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0]

                      if (!file) return

                      if (!file.type.startsWith('image/')) {
                        toast.error('Choisissez un fichier image.')
                        event.target.value = ''
                        return
                      }

                      if (file.size > 5 * 1024 * 1024) {
                        toast.error('La photo ne doit pas dépasser 5 Mo.')
                        event.target.value = ''
                        return
                      }

                      setPhoto(file)
                    }}
                  />
                </label>
              )}
            </fieldset>

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="h-12 w-full rounded-xl text-base font-semibold sm:w-auto sm:px-10"
            >
              {submitting
                ? 'Publication en cours...'
                : 'Valider mon annonce'}
            </Button>
          </form>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Aperçu
            </p>

            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="grid aspect-[4/3] place-items-center bg-muted text-muted-foreground">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : draft.category ? (
                  <CategoryIcon
                    id={draft.category}
                    className="size-12 opacity-40"
                  />
                ) : (
                  <ImagePlus className="size-12 opacity-40" />
                )}
              </div>

              <div className="space-y-1 p-4">
                <p className="line-clamp-2 font-semibold">
                  {draft.title || 'Titre de votre annonce'}
                </p>

                <p className="font-display text-lg font-bold text-ink">
                  {draft.price
                    ? formatPrice(Number(draft.price))
                    : '— €'}
                </p>

                <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {draft.city || 'Votre ville'}
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
  if (!msg) {
    return null
  }

  return (
    <p className="mt-1.5 text-sm text-destructive">
      {msg}
    </p>
  )
}

