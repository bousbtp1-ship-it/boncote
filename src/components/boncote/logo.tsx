import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <Link to="/" className={cn('group inline-flex items-center gap-2', className)} aria-label="BONCOTE, accueil">
      <span className="relative grid size-8 place-items-center rounded-[0.6rem] bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-6">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path d="M3 15c3-3 6-3 9 0s6 3 9 0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="12" cy="8" r="3" fill="currentColor" />
        </svg>
      </span>
      <span
        className={cn(
          'font-display text-[1.45rem] font-extrabold tracking-tight',
          inverted ? 'text-ink-foreground' : 'text-ink',
        )}
      >
        BON<span className="text-primary">COTE</span>
      </span>
    </Link>
  )
}
