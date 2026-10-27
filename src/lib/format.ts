const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export function formatPrice(price: number, suffix = '') {
  return `${priceFormatter.format(price)}${suffix}`
}

export function formatCount(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n)
}

// Relative to a fixed "now" so server and client render identically in the preview.
const PREVIEW_NOW = new Date('2026-10-26T11:00:00')

export function formatPosted(iso: string) {
  const date = new Date(iso)
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const days = Math.floor(
    (startOfDay(PREVIEW_NOW) - startOfDay(date)) / (24 * 60 * 60 * 1000),
  )
  if (days === 0) return `Aujourd’hui, ${time}`
  if (days === 1) return `Hier, ${time}`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

/** Serve listing photos through the Netlify Image CDN at the requested width. */
export function imageUrl(file: string, width: number) {
  return `/.netlify/images?url=/img/${file}&w=${width}&fm=webp`
}
