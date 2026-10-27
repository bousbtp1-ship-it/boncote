import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { SearchX } from 'lucide-react'
import { CategoryIcon } from '@/components/boncote/category-icon'
import { ListingCard } from '@/components/boncote/listing-card'
import { SearchBar } from '@/components/boncote/search-bar'
import { SiteLayout } from '@/components/boncote/site-layout'
import { categories, getCategory, listings, type CategoryId } from '@/data/fixtures'
import { cn } from '@/lib/utils'

type Sort = 'recent' | 'prix-asc' | 'prix-desc'

type SearchParams = {
  q?: string
  categorie?: CategoryId
  lieu?: string
  prixMax?: number
  tri?: Sort
}

const sorts: { id: Sort; label: string }[] = [
  { id: 'recent', label: 'Plus récentes' },
  { id: 'prix-asc', label: 'Prix croissant' },
  { id: 'prix-desc', label: 'Prix décroissant' },
]

const priceCaps = [100, 500, 1000, 5000, 20000]

function str(v: unknown) {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}

export const Route = createFileRoute('/recherche')({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    q: str(s.q),
    categorie: getCategory(String(s.categorie ?? ''))?.id,
    lieu: str(s.lieu),
    prixMax: Number(s.prixMax) > 0 ? Number(s.prixMax) : undefined,
    tri: sorts.some((x) => x.id === s.tri) ? (s.tri as Sort) : undefined,
  }),
  head: () => ({ meta: [{ title: 'Rechercher une annonce — BONCOTE' }] }),
  component: SearchPage,
})

function normalize(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function SearchPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const { q, categorie, lieu, prixMax, tri = 'recent' } = search
  const category = categorie ? getCategory(categorie) : undefined

  const terms = q ? normalize(q).split(/\s+/) : []
  const results = listings
    .filter((l) => !categorie || l.category === categorie)
    .filter((l) => {
      if (!terms.length) return true
      const hay = normalize(`${l.title} ${l.description}`)
      return terms.some((t) => hay.includes(t))
    })
    .filter((l) => !lieu || normalize(`${l.city} ${l.postcode}`).includes(normalize(lieu)))
    .filter((l) => !prixMax || l.price <= prixMax)
    .sort((a, b) =>
      tri === 'prix-asc' ? a.price - b.price : tri === 'prix-desc' ? b.price - a.price : b.postedAt.localeCompare(a.postedAt),
    )

  const set = (patch: Partial<SearchParams>) =>
    void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })

  return (
    <SiteLayout>
      <div className="border-b bg-secondary/60">
        <div className="mx-auto max-w-content px-4 py-6">
          <SearchBar
            key={`${q}-${categorie}-${lieu}`}
            size="sm"
            defaultQuery={q}
            defaultCategory={categorie}
            defaultLocation={lieu}
          />
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 pt-6">
        <nav className="text-xs text-muted-foreground" aria-label="Fil d’Ariane">
          <Link to="/" className="hover:underline">Accueil</Link>
          <span className="mx-1.5">›</span>
          {category ? category.label : 'Toutes les annonces'}
        </nav>
        <h1 className="mt-2 text-2xl font-extrabold md:text-3xl">
          {q ? `« ${q} »` : category ? category.label : 'Toutes les annonces'}
          {lieu && <span className="text-muted-foreground"> · {lieu}</span>}
        </h1>
        <p className="text-sm text-muted-foreground">
          {results.length} annonce{results.length > 1 ? 's' : ''}
        </p>

        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            <FilterChip active={!categorie} onClick={() => set({ categorie: undefined })}>
              Toutes
            </FilterChip>
            {categories.map((c) => (
              <FilterChip key={c.id} active={categorie === c.id} onClick={() => set({ categorie: c.id })}>
                <CategoryIcon id={c.id} className="size-4" /> {c.label}
              </FilterChip>
            ))}
          </div>
          <div className="flex gap-2">
            <label className="flex items-center gap-2 rounded-lg border bg-card px-3 text-sm">
              <span className="text-muted-foreground">Prix max</span>
              <select
                value={prixMax ?? ''}
                onChange={(e) => set({ prixMax: e.target.value ? Number(e.target.value) : undefined })}
                className="h-9 cursor-pointer bg-transparent font-medium outline-none"
              >
                <option value="">Indifférent</option>
                {priceCaps.map((p) => (
                  <option key={p} value={p}>
                    {new Intl.NumberFormat('fr-FR').format(p)} €
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 rounded-lg border bg-card px-3 text-sm">
              <span className="text-muted-foreground">Trier</span>
              <select
                value={tri}
                onChange={(e) => set({ tri: e.target.value === 'recent' ? undefined : (e.target.value as Sort) })}
                className="h-9 cursor-pointer bg-transparent font-medium outline-none"
              >
                {sorts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {results.length ? (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
            <SearchX className="size-10 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-bold">Aucune annonce ne correspond</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Essayez d’élargir votre recherche : retirez un filtre ou changez de ville.
            </p>
            <Link to="/recherche" className="mt-5 text-sm font-semibold text-accent-foreground hover:underline">
              Réinitialiser les filtres
            </Link>
          </div>
        )}
      </div>
    </SiteLayout>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition',
        active ? 'border-ink bg-ink text-ink-foreground' : 'bg-card hover:border-ink/40',
      )}
    >
      {children}
    </button>
  )
}
