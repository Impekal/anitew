import { expect, test } from '@playwright/test'

import { visit } from './helpers.ts'

test('der Core wird auf dem iPhone zu einem echten mobilen Atlas ohne Überlappung', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await visit(page)

  // Warten, bis die nachgeladene Signatur-Schicht die mobile Autorität besitzt.
  await expect
    .poll(() =>
      page.locator('.hamburger svg').evaluate((svg) => getComputedStyle(svg).display),
    )
    .toBe('none')

  await page.locator('.hamburger').click()
  const drawer = page.locator('.drawer')
  await expect(drawer).toBeVisible()
  await expect(page.locator('.theme-control')).toBeVisible()

  const geometry = await page.evaluate(() => {
    const personal = document.querySelector<HTMLElement>('.menu-group:not(.menu-group-device)')
    const device = document.querySelector<HTMLElement>('.menu-group-device')
    const drawer = document.querySelector<HTMLElement>('.drawer')
    const elements = [
      ...document.querySelectorAll<HTMLElement>('.drawer .drawer-item, .drawer .theme-control'),
    ].filter((element) => getComputedStyle(element).display !== 'none')

    const rects = elements.map((element) => {
      const rect = element.getBoundingClientRect()
      return {
        name: element.textContent?.trim() ?? element.className,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
      }
    })

    const overlaps: string[] = []
    for (let a = 0; a < rects.length; a += 1) {
      for (let b = a + 1; b < rects.length; b += 1) {
        const one = rects[a]
        const two = rects[b]
        if (one === undefined || two === undefined) continue
        const intersects =
          Math.min(one.right, two.right) - Math.max(one.left, two.left) > 1 &&
          Math.min(one.bottom, two.bottom) - Math.max(one.top, two.top) > 1
        if (intersects) overlaps.push(`${one.name} <> ${two.name}`)
      }
    }

    return {
      innerWidth: window.innerWidth,
      drawerClientWidth: drawer?.clientWidth ?? 0,
      drawerScrollWidth: drawer?.scrollWidth ?? 0,
      personalColumns: personal === null ? '' : getComputedStyle(personal).gridTemplateColumns,
      deviceColumns: device === null ? '' : getComputedStyle(device).gridTemplateColumns,
      rects,
      overlaps,
    }
  })

  expect(geometry.innerWidth).toBe(390)
  expect(geometry.drawerScrollWidth).toBeLessThanOrEqual(geometry.drawerClientWidth + 1)
  expect(geometry.personalColumns.trim().split(/\s+/u)).toHaveLength(2)
  expect(geometry.deviceColumns.trim().split(/\s+/u)).toHaveLength(1)
  expect(geometry.overlaps).toEqual([])
  for (const rect of geometry.rects) {
    expect(rect.left, rect.name).toBeGreaterThanOrEqual(0)
    expect(rect.right, rect.name).toBeLessThanOrEqual(390)
  }
})
