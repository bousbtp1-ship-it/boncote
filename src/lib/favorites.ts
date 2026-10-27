import { useSyncExternalStore } from 'react'

// Favorites live in localStorage until accounts exist (see PLAN.md).
const KEY = 'boncote:favorites'
const listeners = new Set<() => void>()
const EMPTY: string[] = []
let cache: string[] | null = null

function read(): string[] {
  if (cache) return cache
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]
  } catch {
    cache = []
  }
  return cache
}

export function toggleFavorite(id: string) {
  const current = read()
  cache = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
  localStorage.setItem(KEY, JSON.stringify(cache))
  listeners.forEach((l) => l())
}

export function useFavorites() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    read,
    () => EMPTY,
  )
}
