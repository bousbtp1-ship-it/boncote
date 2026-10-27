import { Link } from '@tanstack/react-router'
import { MapPin, Truck } from 'lucide-react'
import type { Listing } from '@/data/fixtures'
import { formatPosted, formatPrice, imageUrl } from '@/lib/format'
import { FavoriteButton } from './favorite-button'

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      to="/annonce/$id"
      params={{ id: listing.id }}
      className="group flex flex-col rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        <img
          src={imageUrl(listing.image, 480)}
          srcSet={`${imageUrl(listing.image, 320)} 320w, ${imageUrl(listing.image, 480)} 480w, ${imageUrl(listing.image, 720)} 720w`}
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
          alt={listing.title}
          loading="lazy"
          className="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-2 top-2 flex gap-1.5">
          {listing.urgent && (
            <span className="rounded-md bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
              Urgent
            </span>
          )}
          {listing.seller.pro && (
            <span className="rounded-md bg-ink px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-foreground">
              Pro
            </span>
          )}
        </div>
        <FavoriteButton id={listing.id} className="absolute right-2 top-2" />
      </div>
      <div className="flex flex-1 flex-col gap-0.5 px-0.5 pt-2.5">
        <h3 className="line-clamp-2 font-sans text-[15px] font-semibold leading-snug tracking-normal text-foreground group-hover:underline underline-offset-2">
          {listing.title}
        </h3>
        <p className="font-display text-lg font-bold text-ink">
          {formatPrice(listing.price, listing.priceSuffix)}
        </p>
        {listing.delivery && (
          <p className="inline-flex items-center gap-1 text-xs font-medium text-sea">
            <Truck className="size-3.5" /> Livraison possible
          </p>
        )}
        <p className="mt-auto inline-flex items-center gap-1 pt-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">
            {listing.city} {listing.postcode}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">{formatPosted(listing.postedAt)}</p>
      </div>
    </Link>
  )
}
