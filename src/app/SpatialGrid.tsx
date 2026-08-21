import { lazy, Suspense } from 'react'
import type { SpatialCell } from '../core/index.ts'

const SpatialGridImpl = lazy(async () => {
  const module = await import('./SpatialGridImpl.tsx')
  return { default: module.SpatialGridImpl }
})

export interface SpatialGridProps {
  itemId: string
  mode: 'encode' | 'recall'
  onChoose?: (cell: SpatialCell) => void
  label: string
}

export function SpatialGrid(props: SpatialGridProps) {
  return (
    <Suspense fallback={null}>
      <SpatialGridImpl {...props} />
    </Suspense>
  )
}
