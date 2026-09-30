import {test,expect} from '@playwright/test'
import {visit,openPage} from './helpers.ts'

for(const colorScheme of ['light','dark'] as const)test(`course controls stay usable with large text in ${colorScheme} mode`,async({page})=>{
 await page.emulateMedia({colorScheme,reducedMotion:'reduce'})
 await visit(page)
 await openPage(page,'Lernkurse')
 await page.getByRole('button',{name:'Kurs öffnen : Lange Wörter sicher behalten',exact:true}).press('Enter')
 await expect(page.locator('.course-lesson h3')).toBeFocused()
 await page.addStyleTag({content:'html{font-size:200% !important} .courses{font-size:2rem !important}'})
 await page.getByRole('button',{name:'Anhören und ansehen',exact:true}).press('Enter')
 await expect(page.locator('#course-audio-language')).toBeVisible()
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)
 expect(overflow).toBeLessThanOrEqual(1)
 // Entering listen mode removes reading controls in a following React effect.
 // Measure one settled DOM snapshot, not live nth() locators that can disappear.
 await expect(page.getByRole('button',{name:'Vorlage ausblenden und üben',exact:true})).toHaveCount(0)
 const boxes=await page.locator('.courses button:visible,.courses select:visible').evaluateAll(controls=>controls.map(control=>{
  const {height,x,width}=control.getBoundingClientRect()
  return {height,x,width,label:control.textContent}
 }))
 expect(boxes.length).toBeGreaterThan(0)
 for(const box of boxes){
  expect(box.height,box.label??'control').toBeGreaterThanOrEqual(43)
  expect(box.x,box.label??'control').toBeGreaterThanOrEqual(-1)
  expect(box.x+box.width,box.label??'control').toBeLessThanOrEqual(page.viewportSize()!.width+1)
 }
 await page.getByRole('button',{name:'Jetzt ohne Vorlage üben',exact:true}).press('Enter')
 await expect(page.locator('.course-lesson h3')).toBeFocused()
 await expect(page.getByLabel('Deine Antwort',{exact:true})).toBeVisible()
 await expect(page.locator('audio,.course-caption,.course-illustration')).toHaveCount(0)
})
