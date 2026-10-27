import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { MapPin, Search } from 'lucide-react'
import { categories, type CategoryId } from '@/data/fixtures'
import { cn } from '@/lib/utils'

type Props = {
  defaultQuery?: string
  defaultCategory?: CategoryId
  defaultLocation?: string
  size?: 'lg' | 'sm'
  className?: string
}

export function SearchBar({ defaultQuery = '', defaultCategory, defaultLocation = '', size = 'lg', className }: Props) {
  const navigate = useNavigate()
  const [q, setQ] = useState(defaultQuery)
  const [categorie, setCategorie] = useState<CategoryId | ''>(defaultCategory ?? '')
  const [lieu, setLieu] = useState(defaultLocation)
  const lg = size === 'lg'

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        void navigate({
          to: '/recherche',
          search: {
            q: q.trim() || undefined,
            categorie: categorie || undefined,
            lieu: lieu.trim() || undefined,
          },
        })
      }}
      className={cn(
        'flex w-full flex-col gap-2 rounded-2xl bg-card p-2 shadow-[0_10px_40px_-12px_oklch(0.25_0.06_258/0.35)] ring-1 ring-border md:flex-row md:items-center md:gap-0 md:rounded-full md:p-1.5',
        className,
      )}
    >
      <label className="flex flex-1 items-center gap-2 rounded-xl px-3 md:rounded-full">
        <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden />
        <span className="sr-only">Que recherchez-vous ?</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Que recherchez-vous ?"
          className={cn('w-full bg-transparent outline-none placeholder:text-muted-foreground', lg ? 'h-12 text-base' : 'h-10 text-sm')}
        />
      </label>
      <div className="hidden h-7 w-px bg-border md:block" />
      <label className="flex items-center gap-2 rounded-xl border px-3 md:w-48 md:border-0">
        <span className="sr-only">Catégorie</span>
        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value as CategoryId | '')}
          className={cn('w-full cursor-pointer bg-transparent text-foreground outline-none', lg ? 'h-11 text-base md:h-12' : 'h-10 text-sm')}
        >
          <option value="">Toutes catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <div className="hidden h-7 w-px bg-border md:block" />
      <label className="flex items-center gap-2 rounded-xl border px-3 md:w-56 md:border-0">
        <MapPin className="size-5 shrink-0 text-muted-foreground" aria-hidden />
        <span className="sr-only">Ville ou code postal</span>
        <input
          value={lieu}
          onChange={(e) => setLieu(e.target.value)}
          placeholder="Ville ou code postal"
          className={cn('w-full bg-transparent outline-none placeholder:text-muted-foreground', lg ? 'h-11 text-base md:h-12' : 'h-10 text-sm')}
        />
      </label>
      <button
        type="submit"
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none md:rounded-full',
          lg ? 'h-12' : 'h-10 text-sm',
        )}
      >
        <Search className="size-4" aria-hidden />
        Rechercher
      </button>
    </form>
  )
}
