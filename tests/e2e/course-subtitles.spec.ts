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
