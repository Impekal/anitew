import {test,expect} from '@playwright/test'
import {visit,openPage} from './helpers.ts'

for(const language of ['es','it','pt','nl','tr','ar','zh','ja']) {
 test(`library captions stay ${language} while the spoken language changes`,async({page,context})=>{
  await visit(page)
  await page.getByRole('combobox',{name:'Sprache',exact:true}).selectOption(language)
  await openPage(page,'Learning courses')
  await page.getByRole('button',{name:'Open course : Remember long words',exact:true}).click()
  await page.getByRole('button',{name:'Listen and watch',exact:true}).click()
  const caption=page.locator('.course-caption')
  const audio=page.locator('.course-media audio')
  await expect(audio).toHaveAttribute('src',/-en-/)
  await expect(caption).toHaveAttribute('lang',language)
  await expect(caption).not.toBeEmpty()
  if(language==='ar')await expect(caption).toHaveCSS('direction','rtl')
  // Captions and all choices are bundled; changing the voice needs no request.
  await context.setOffline(true)
  for(const spoken of ['de','fr']) {
   await page.locator('#course-audio-language').selectOption(spoken)
   await expect(audio).toHaveAttribute('src',new RegExp(`-${spoken}-`))
   await expect(caption).toHaveAttribute('lang',language)
   await expect(caption).not.toBeEmpty()
   await expect(page.locator('#course-audio-language')).toBeEnabled()
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1)
  await page.getByRole('button',{name:'Practise without the source',exact:true}).click()
  await expect(caption).toHaveCount(0)
  await page.getByLabel('Your answer',{exact:true}).fill('incompréhensible')
  await page.getByRole('button',{name:'Compare with the source',exact:true}).click()
  await expect(page.locator('.course-lesson blockquote')).toHaveAttribute('lang','fr')
  await expect(page.locator('.course-lesson blockquote')).toContainText('incompréhensible')
  await context.setOffline(false)
 })
}

test('French captions and transcript use the selected voice’s spoken formula explanation',async({page})=>{
 await visit(page)
 await page.getByRole('combobox',{name:'Sprache',exact:true}).selectOption('fr')
 await openPage(page,'Cours d’apprentissage')
 await page.getByRole('button',{name:'Ouvrir le cours : Transformer les nombres en images',exact:true}).click()
 await page.getByRole('button',{name:'Écouter et regarder',exact:true}).click()
 await page.locator('.course-media audio').evaluate((el:HTMLAudioElement)=>el.load())
 await expect.poll(()=>page.locator('.course-media audio').evaluate((el:HTMLAudioElement)=>el.readyState)).toBeGreaterThan(0)
 await page.getByRole('button',{name:'Exemple',exact:true}).click()
 // This cue spells out sounds through familiar words instead of ambiguous isolated letters.
 await expect(page.locator('.course-caption')).toContainText('premier son de tapis')
 await expect(page.locator('.course-caption')).toHaveAttribute('lang','fr')
 const transcript=page.locator('.course-media details').filter({has:page.locator('summary',{hasText:'Transcription complète'})})
 await transcript.locator('summary').click()
 await expect(transcript).toContainText('premier son de nez')
 await page.locator('.course-coaches summary').click()
 await page.locator('#course-coach-mode').selectOption('global')
 await page.locator('#course-coach-all').selectOption('lin')
 await expect(page.locator('.course-media audio')).toHaveAttribute('src',/lin-number-images-fr-/)
 await page.locator('.course-media audio').evaluate((el:HTMLAudioElement)=>el.load())
 await expect.poll(()=>page.locator('.course-media audio').evaluate((el:HTMLAudioElement)=>el.readyState)).toBeGreaterThan(0)
 await page.getByRole('button',{name:'Exemple',exact:true}).click()
 await expect(page.locator('.course-caption')).toContainText('premier son de tapis')
 const credits=page.locator('.course-media details').filter({has:page.locator('summary',{hasText:'Voix et sources'})})
 await credits.locator('summary').click()
 await expect(credits.getByRole('link',{name:'Lin · Qwen VoiceDesign · Apache 2.0',exact:true})).toBeVisible()
 await expect(credits).not.toContainText('CML-TTS')
})
