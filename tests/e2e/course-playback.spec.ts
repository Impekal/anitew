import { test, expect } from '@playwright/test'
import { visit, openPage } from './helpers.ts'

// Full Chromium uses the native media pipeline, unlike headless shell.
test.use({channel:'chromium',launchOptions:{args:['--disable-gpu']}})

test('story narration advances continuously and pauses itself before the spoken answer',async({page})=>{
 test.setTimeout(90_000)
 await visit(page)
 await openPage(page,'Lernkurse')
 await page.getByRole('button',{name:'Kurs öffnen : Begriffe durch Geschichten verbinden',exact:true}).click()
 await page.getByRole('button',{name:'Anhören und ansehen',exact:true}).click()
 await page.locator('#course-speed').selectOption('2')
 await expect(page.locator('#course-speed')).toBeEnabled()
 const audio=page.locator('.course-media audio')
 await audio.evaluate(async(element:HTMLAudioElement)=>{await element.play()})
 await expect.poll(()=>audio.evaluate((element:HTMLAudioElement)=>element.currentTime),{timeout:10_000}).toBeGreaterThan(.5)
 await expect(page.getByLabel('Deine Antwort',{exact:true})).toBeVisible({timeout:45_000})
 await expect(audio).toHaveCount(0)
 await expect(page.locator('.course-lesson blockquote')).toHaveCount(0)
 await expect(page.locator('.course-illustration')).toHaveCount(0)
 await expect(page.locator('.course-caption')).toHaveCount(0)
})
