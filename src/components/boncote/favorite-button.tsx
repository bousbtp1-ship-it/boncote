import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import { toggleFavorite, useFavorites } from '@/lib/favorites'
import { cn } from '@/lib/utils'

export function FavoriteButton({ id, className }: { id: string; className?: string }) {
  const favorites = useFavorites()
  const active = favorites.includes(id)
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(id)
        toast(active ? 'Annonce retirée de vos favoris' : 'Annonce ajoutée à vos favoris')
      }}
      className={cn(
        'grid size-9 place-items-center rounded-full bg-card/90 text-ink shadow-sm backdrop-blur transition hover:scale-110 focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none',
        className,
      )}
    >
      <Heart className={cn('size-[18px] transition', active && 'fill-primary text-primary')} />
    </button>
  )
}
