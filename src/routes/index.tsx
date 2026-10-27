import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, MessageCircle, PlusSquare, ShieldCheck, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryIcon } from '@/components/boncote/category-icon'
import { ListingCard } from '@/components/boncote/listing-card'
import { SearchBar } from '@/components/boncote/search-bar'
import { SiteLayout } from '@/components/boncote/site-layout'
import { categories, listings, type CategoryId } from '@/data/fixtures'
import { formatCount } from '@/lib/format'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: Home,
})

const popular = ['Vélo électrique', 'Canapé', 'Appartement T2', 'Smartphone', 'Table en chêne']

function Home() {
  return (
    <SiteLayout>
      <Hero />
      <Categories />
      <RecentListings />
      <SellBanner />
      <Trust />
    </SiteLayout>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-primary/25"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
      >
        <path d="M0 80 C 240 20, 480 140, 720 80 S 1200 20, 1440 80 V160 H0Z" fill="currentColor" />
        <path d="M0 110 C 240 60, 480 170, 720 110 S 1200 60, 1440 110 V160 H0Z" className="text-background" fill="currentColor" />
      </svg>
      <div className="absolute -right-24 -top-24 size-80 rounded-full bg-primary/30 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-content px-4 pb-28 pt-12 md:pb-36 md:pt-20">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-ink-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-foreground/80">
          <span className="size-1.5 rounded-full bg-primary" /> 221 671 annonces près de chez vous
        </p>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] md:text-6xl">
          Tout se vend, tout s’achète,{' '}
          <span className="relative whitespace-nowrap text-primary">
            juste à côté.
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-ink-foreground/75 md:text-lg">
          Voitures, logements, meubles, high-tech ou emplois : trouvez la bonne affaire entre particuliers et professionnels, partout en France.
        </p>
        <div className="mt-8 max-w-4xl">
          <SearchBar />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-ink-foreground/60">Populaire :</span>
          {popular.map((p) => (
            <Link
              key={p}
              to="/recherche"
              search={{ q: p }}
              className="rounded-full border border-ink-foreground/20 px-3 py-1 text-ink-foreground/85 transition hover:border-primary hover:text-ink-foreground"
            >
              {p}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function Categories() {
  return (
    <section className="mx-auto -mt-14 max-w-content px-4 md:-mt-20 relative">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((c, i) => (
          <Link
            key={c.id}
            to="/recherche"
            search={{ categorie: c.id }}
            className={cn(
              'group flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md',
              i === 4 && 'col-span-2 sm:col-span-1',
            )}
          >
            <span className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
              <CategoryIcon id={c.id} className="size-5" />
            </span>
            <span>
              <span className="block font-display text-lg font-bold leading-tight">{c.label}</span>
              <span className="block text-xs text-muted-foreground">{c.description}</span>
            </span>
            <span className="mt-auto text-xs font-semibold text-accent-foreground">
              {formatCount(c.count)} annonces
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function RecentListings() {
  const [filter, setFilter] = useState<CategoryId | 'all'>('all')
  const shown = filter === 'all' ? listings : listings.filter((l) => l.category === filter)

  return (
    <section className="mx-auto mt-14 max-w-content px-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold md:text-3xl">Annonces du moment</h2>
          <p className="text-sm text-muted-foreground">Fraîchement publiées par vos voisins</p>
        </div>
        <Link to="/recherche" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-foreground hover:underline">
          Voir toutes les annonces <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1">
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
          Tout
        </Chip>
        {categories.map((c) => (
          <Chip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
            <CategoryIcon id={c.id} className="size-4" /> {c.label}
          </Chip>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </section>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition',
        active ? 'border-ink bg-ink text-ink-foreground' : 'bg-card hover:border-ink/40',
      )}
    >
      {children}
    </button>
  )
}

function SellBanner() {
  return (
    <section className="mx-auto mt-16 max-w-content px-4">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-10 text-primary-foreground md:px-12 md:py-14">
        <div className="absolute -bottom-16 -right-10 size-64 rounded-full bg-ink/15" aria-hidden />
        <div className="absolute -top-10 right-40 size-28 rounded-full bg-primary-foreground/15" aria-hidden />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-extrabold md:text-4xl">Un placard qui déborde ? Vendez-le.</h2>
            <p className="mt-2 text-primary-foreground/85">
              Publiez votre annonce gratuitement en moins de 2 minutes et touchez des acheteurs près de chez vous.
            </p>
          </div>
          <Button asChild size="lg" className="h-12 rounded-xl bg-ink px-6 text-base font-semibold text-ink-foreground hover:bg-ink/90">
            <Link to="/deposer">
              <PlusSquare /> Déposer une annonce
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function Trust() {
  const items = [
    { icon: ShieldCheck, title: 'Paiement sécurisé', text: 'Votre argent est protégé jusqu’à la réception de l’objet.' },
    { icon: Truck, title: 'Livraison partout en France', text: 'Envoyez et recevez en point relais ou à domicile.' },
    { icon: MessageCircle, title: 'Messagerie intégrée', text: 'Échangez sans partager votre numéro de téléphone.' },
  ]
  return (
    <section className="mx-auto mt-16 grid max-w-content gap-6 px-4 md:grid-cols-3">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-sea">
            <Icon className="size-5" />
          </span>
          <div>
            <h3 className="font-display text-base font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
