import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Heart, Search, UserRound, LogOut } from 'lucide-react'
import { categories } from '@/data/fixtures'
import { useFavorites } from '@/lib/favorites'
import { supabase } from '@/lib/supabase'
import { Logo } from './logo'

export default function SiteLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col pb-16">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <MobileTabBar />
    </div>
  )
}

function SiteHeader() {
  const favorites = useFavorites()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUserEmail(null)
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center gap-4 px-4">
        <Logo />

        <Link
          to="/recherche"
          className="ml-auto flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs"
        >
          <Search className="size-5" />
          <span>Rechercher</span>
        </Link>

        <Link
          to="/favoris"
          className="flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs"
        >
          <Heart className="size-5" />
          <span>Favoris</span>
          {favorites.length > 0 && (
            <span className="text-xs">{favorites.length}</span>
          )}
        </Link>

        {userEmail ? (
          <div className="flex items-center gap-2">
            <span className="hidden max-w-32 truncate text-xs sm:inline">
              {userEmail}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs"
            >
              <LogOut className="size-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        ) : (
          <Link
            to="/connexion"
            className="flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs"
          >
            <UserRound className="size-5" />
            <span>Se connecter</span>
          </Link>
        )}
      </div>

      <nav className="flex gap-4 overflow-x-auto border-t px-4 py-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            to="/recherche"
            className="shrink-0 text-sm"
          >
            {category.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="mt-12 border-t px-4 py-8 text-sm text-muted-foreground">
      <div className="mx-auto max-w-content">
        <Logo />
        <p className="mt-3">
          Les petites annonces entre voisins, partout en France.
        </p>
        <p className="mt-4">© 2026 BONCOTE. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

function MobileTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-background md:hidden">
      <Link to="/recherche" className="flex flex-1 flex-col items-center gap-1 py-3 text-xs">
        <Search className="size-5" />
        Rechercher
      </Link>
      <Link to="/favoris" className="flex flex-1 flex-col items-center gap-1 py-3 text-xs">
        <Heart className="size-5" />
        Favoris
      </Link>
      <Link to="/connexion" className="flex flex-1 flex-col items-center gap-1 py-3 text-xs">
        <UserRound className="size-5" />
        Connexion
      </Link>
    </nav>
  )
}

