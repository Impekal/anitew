import type { CSSProperties } from 'react'

import { SPATIAL_CELLS, spatialCellOf, type SpatialCell } from '../core/index.ts'

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '0.65rem',
  width: 'min(72vw, 20rem)',
  aspectRatio: '1',
  margin: '1.25rem auto',
}

const cellStyle: CSSProperties = {
  position: 'relative',
  display: 'grid',
  placeItems: 'center',
  minWidth: 0,
  border: '1px solid currentColor',
  borderRadius: '1rem',
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
}

const markerStyle: CSSProperties = {
  width: '42%',
  aspectRatio: '1',
  borderRadius: '50%',
  background: 'currentColor',
}

export interface SpatialGridProps {
  itemId: string
  mode: 'encode' | 'recall'
  onChoose?: (cell: SpatialCell) => void
  label: string
}

export function SpatialGridImpl({ itemId, mode, onChoose, label }: SpatialGridProps) {
  const target = spatialCellOf(itemId)
  if (target === undefined) return null

  return (
    <div
      className={`spatial-grid spatial-grid-${mode}`}
      style={gridStyle}
      role={mode === 'encode' ? 'img' : 'group'}
      aria-label={label}
      data-spatial-item={itemId}
    >
      {SPATIAL_CELLS.map((cell, index) => {
        const marker = mode === 'encode' && cell === target
        if (mode === 'recall') {
          return (
            <button
              key={cell}
              type="button"
              className="spatial-cell"
              style={cellStyle}
              aria-label={`${index + 1}`}
              data-spatial-cell={cell}
              onClick={() => onChoose?.(cell)}
            >
              <span aria-hidden="true">{index + 1}</span>
            </button>
          )
        }

        return (
          <span
            key={cell}
            className={`spatial-cell${marker ? ' spatial-cell-target' : ''}`}
            style={cellStyle}
            data-spatial-cell={cell}
            data-spatial-target={marker ? 'true' : undefined}
          >
            {marker ? <span style={markerStyle} aria-hidden="true" /> : null}
          </span>
        )
      })}
    </div>
  )
}
