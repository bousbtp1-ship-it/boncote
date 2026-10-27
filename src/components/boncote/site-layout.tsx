import { Link } from '@tanstack/react-router'
import { Heart, MessageCircle, PlusSquare, Search, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { categories } from '@/data/fixtures'
import { useFavorites } from '@/lib/favorites'
import { CategoryIcon } from './category-icon'
import { Logo } from './logo'

function comingSoon(feature: string) {
  toast(`${feature} arrive très bientôt sur BONCOTE`)
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col pb-16 md:pb-0">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <MobileTabBar />
    </div>
  )
}

function SiteHeader() {
  const favorites = useFavorites()
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center gap-4 px-4">
        <Logo />
        <Button asChild className="ml-2 hidden h-10 rounded-lg px-4 font-semibold md:inline-flex">
          <Link to="/deposer">
            <PlusSquare /> Déposer une annonce
          </Link>
        </Button>
        <nav className="ml-auto flex items-center gap-1">
          <Link
            to="/recherche"
            className="hidden flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground md:flex"
          >
            <Search className="size-5" /> Rechercher
          </Link>
          <Link
            to="/favoris"
            className="relative hidden flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground md:flex"
          >
            <Heart className="size-5" /> Favoris
            {favorites.length > 0 && (
              <span className="absolute right-3 top-0.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {favorites.length}
              </span>
            )}
          </Link>
          <Button
  asChild
  variant="outline"
  className="h-10 rounded-lg font-semibold"
>
  <Link to="/connexion">
    <UserRound />
    <span className="hidden sm:inline">Se connecter</span>
  </Link>
</Button>
            variant="outline"
            className="h-10 rounded-lg font-semibold"
            onClick={() => comingSoon('La connexion')}
          >
            <UserRound /> <span className="hidden sm:inline">Se connecter</span>
          </Button>
        </nav>
      </div>
      <div className="hidden border-t md:block">
        <nav className="mx-auto flex max-w-content items-center gap-6 overflow-x-auto px-4 text-sm">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/recherche"
              search={{ categorie: c.id }}
              className="flex h-10 shrink-0 items-center gap-1.5 border-b-2 border-transparent text-muted-foreground transition hover:border-primary hover:text-foreground"
            >
              <CategoryIcon id={c.id} className="size-4" /> {c.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

function MobileTabBar() {
  const item =
    'flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-muted-foreground'
  const active = { className: 'text-primary' }
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 border-t bg-card/95 backdrop-blur md:hidden">
      <Link to="/recherche" className={item} activeProps={active}>
        <Search className="size-5" /> Rechercher
      </Link>
      <Link to="/favoris" className={item} activeProps={active}>
        <Heart className="size-5" /> Favoris
      </Link>
      <Link to="/deposer" className={item} activeProps={active}>
        <span className="-mt-5 grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg ring-4 ring-background">
          <PlusSquare className="size-6" />
        </span>
        Publier
      </Link>
      <button type="button" className={item} onClick={() => comingSoon('La messagerie')}>
        <MessageCircle className="size-5" /> Messages
      </button>
      <button type="button" className={item} onClick={() => comingSoon('La connexion')}>
        <UserRound className="size-5" /> Compte
      </button>
    </nav>
  )
}

function SiteFooter() {
  return (
    <footer className="mt-16 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo inverted />
          <p className="max-w-xs text-sm text-ink-foreground/70">
            Les petites annonces entre voisins, partout en France. Achetez, vendez, trouvez votre prochain job — près de chez vous.
          </p>
        </div>
        <FooterCol title="Catégories" items={categories.map((c) => c.label)} />
        <FooterCol title="BONCOTE" items={['Qui sommes-nous', 'Nous rejoindre', 'Espace presse']} />
        <FooterCol title="Aide" items={['Centre d’aide', 'Conseils de sécurité', 'Conditions générales', 'Vie privée']} />
      </div>
      <div className="border-t border-ink-foreground/10">
        <p className="mx-auto max-w-content px-4 py-5 text-xs text-ink-foreground/60">
          © 2026 BONCOTE. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-ink-foreground/90">{title}</h4>
      <ul className="space-y-2 text-sm text-ink-foreground/70">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  )
}
