import { describe, expect, it } from 'vitest'

import { persistThenApply } from '../../src/app/persistThenApply.ts'

describe('erst speichern, dann anzeigen (R3-06)', () => {
  it('wendet die Änderung erst nach erfolgreichem Schreiben an', async () => {
    const order: string[] = []
    await persistThenApply(
      async () => {
        await Promise.resolve()
        order.push('geschrieben')
      },
      () => order.push('angezeigt'),
      () => order.push('fehler'),
    )
    expect(order).toEqual(['geschrieben', 'angezeigt'])
  })

  it('zeigt nichts an, wenn das Schreiben scheitert — und sagt es', async () => {
    const order: string[] = []
    await persistThenApply(
      () => Promise.reject(new Error('quota')),
      () => order.push('angezeigt'),
      () => order.push('fehler'),
    )
    expect(order).toEqual(['fehler'])
  })

  it('lässt einen synchronen Wurf nicht durchschlagen', async () => {
    const failures: number[] = []
    await expect(
      persistThenApply(
        () => {
          throw new Error('kaputt')
        },
        () => undefined,
        () => failures.push(1),
      ),
    ).resolves.toBeUndefined()
    expect(failures).toEqual([1])
  })
})
