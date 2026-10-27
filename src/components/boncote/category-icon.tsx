import { Briefcase, Car, Home, Smartphone, Sofa, type LucideProps } from 'lucide-react'
import type { CategoryId } from '@/data/fixtures'

const icons: Record<CategoryId, React.ComponentType<LucideProps>> = {
  vehicules: Car,
  immobilier: Home,
  maison: Sofa,
  electronique: Smartphone,
  emploi: Briefcase,
}

export function CategoryIcon({ id, ...props }: { id: CategoryId } & LucideProps) {
  const Icon = icons[id]
  return <Icon {...props} />
}
