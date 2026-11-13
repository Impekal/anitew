import { expect, test } from '@playwright/test'

import { visit } from './helpers.ts'

async function assertMobileCoreFitsViewport(page: import('@playwright/test').Page, width: number, height: number) {
  await page.setViewportSize({ width, height })
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
    const drawerScroll = document.querySelector<HTMLElement>('.drawer-scroll')
    const elements = [
      drawerScroll,
      ...document.querySelectorAll<HTMLElement>(
        '.drawer .menu-group, .drawer .drawer-item, .drawer .theme-control',
      ),
    ].filter((element): element is HTMLElement =>
      element !== null && getComputedStyle(element).display !== 'none',
    )

    const rects = elements.map((element) => {
      const rect = element.getBoundingClientRect()
      return {
        name: element.className || element.tagName,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
      }
    })

    const itemRects = [
      ...document.querySelectorAll<HTMLElement>('.drawer .drawer-item, .drawer .theme-control'),
    ]
      .filter((element) => getComputedStyle(element).display !== 'none')
      .map((element) => {
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
    for (let a = 0; a < itemRects.length; a += 1) {
      for (let b = a + 1; b < itemRects.length; b += 1) {
        const one = itemRects[a]
        const two = itemRects[b]
        if (one === undefined || two === undefined) continue
        const intersects =
          Math.min(one.right, two.right) - Math.max(one.left, two.left) > 1 &&
          Math.min(one.bottom, two.bottom) - Math.max(one.top, two.top) > 1
        if (intersects) overlaps.push(`${one.name} <> ${two.name}`)
      }
    }

    const drawerScrollStyle = drawerScroll === null ? null : getComputedStyle(drawerScroll)

    return {
      innerWidth: window.innerWidth,
      rootScrollWidth: document.documentElement.scrollWidth,
      drawerClientWidth: drawer?.clientWidth ?? 0,
      drawerScrollWidth: drawer?.scrollWidth ?? 0,
      innerClientWidth: drawerScroll?.clientWidth ?? 0,
      innerScrollWidth: drawerScroll?.scrollWidth ?? 0,
      innerScrollLeft: drawerScroll?.scrollLeft ?? 0,
      innerOverflowX: drawerScrollStyle?.overflowX ?? '',
      innerTouchAction: drawerScrollStyle?.touchAction ?? '',
      personalColumns: personal === null ? '' : getComputedStyle(personal).gridTemplateColumns,
      deviceColumns: device === null ? '' : getComputedStyle(device).gridTemplateColumns,
      rects,
      overlaps,
    }
  })

  expect(geometry.innerWidth).toBe(width)
  expect(geometry.rootScrollWidth).toBeLessThanOrEqual(width)
  expect(geometry.drawerScrollWidth).toBeLessThanOrEqual(geometry.drawerClientWidth + 1)
  expect(geometry.innerScrollWidth).toBeLessThanOrEqual(geometry.innerClientWidth + 1)
  expect(geometry.innerScrollLeft).toBe(0)
  expect(geometry.innerOverflowX).toBe('hidden')
  expect(geometry.innerTouchAction).toContain('pan-y')
  expect(geometry.personalColumns.trim().split(/\s+/u)).toHaveLength(2)
  expect(geometry.deviceColumns.trim().split(/\s+/u)).toHaveLength(1)
  expect(geometry.overlaps).toEqual([])
  for (const rect of geometry.rects) {
    expect(rect.left, rect.name).toBeGreaterThanOrEqual(0)
    expect(rect.right, rect.name).toBeLessThanOrEqual(width)
  }
}

test('der Core bleibt auf einem 390px-iPhone vollständig im Viewport', async ({ page }) => {
  await assertMobileCoreFitsViewport(page, 390, 844)
})

test('der Core kann auf einem Pro-Max-Viewport nicht horizontal verrutschen', async ({ page }) => {
  // Das Nutzergerät liefert Screenshots mit 1320 physischen Pixeln Breite,
  // entsprechend 440 CSS-Pixeln bei 3x Retina. Genau dieses Profil fehlte.
  await assertMobileCoreFitsViewport(page, 440, 956)
})
