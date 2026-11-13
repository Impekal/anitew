import {test,expect} from '@playwright/test'
import {visitCourseReader as visit,openPage} from './helpers.ts'
import {courseVideo} from '../../src/i18n/courseVideos.ts'
test.use({channel:'chromium',launchOptions:{args:['--disable-gpu',...(process.platform==='darwin'?['--disable-audio-output']:[])]}})
for(const [id,title] of [['method-of-loci','Orte als Gedächtnisstützen nutzen'],['number-images','Zahlen in Bilder übersetzen'],['interleaved-practice','Passende Vorgehensweisen unterscheiden']] as const){
 test(`${id}: complete French visual lesson works offline through practice`,async({page,context})=>{
  test.setTimeout(90000)
  await visit(page);await openPage(page,'Lernkurse')
  await page.getByRole('button',{name:`Kurs öffnen : ${title}`,exact:true}).click()
  await page.getByRole('button',{name:'Anhören und ansehen',exact:true}).click()
  await page.locator('#course-audio-language').selectOption('fr')
  await page.locator('#course-format').selectOption('video')
  const asset=courseVideo(id,'fr','rafael')!
  const video=page.locator('.course-media video:not([data-lesson-intro])')
  await expect(video).toHaveAttribute('src',asset.src)
  await expect(page.locator('.course-coach-presence')).toHaveCount(0)
  await page.getByRole('button',{name:'Für offline laden / fortsetzen',exact:true}).click()
  await expect(page.getByText(/Dieses Video ist offline verfügbar/)).toBeVisible()
  await context.setOffline(true);await page.reload();await openPage(page,'Lernkurse')
  await page.getByRole('button',{name:`Kurs öffnen : ${title}`,exact:true}).click()
  await video.evaluate((el:HTMLVideoElement)=>el.load())
  await expect.poll(()=>video.evaluate((el:HTMLVideoElement)=>el.readyState)).toBeGreaterThanOrEqual(2)
  await expect(video.locator('track')).toHaveAttribute('srclang','de')
  expect(await video.evaluate((el:HTMLVideoElement)=>el.duration)).toBeCloseTo(asset.duration,1)
  await video.evaluate((el:HTMLVideoElement,t)=>{el.currentTime=t+.05;el.dispatchEvent(new Event('timeupdate'))},asset.recallBoundary!)
  await page.getByLabel('Deine Antwort',{exact:true}).fill('Mein Abruf')
  await page.getByRole('button',{name:'Mit der Vorlage vergleichen',exact:true}).click()
  await expect(video).toHaveCount(1)
  await video.evaluate((el:HTMLVideoElement)=>el.load())
  await expect.poll(()=>video.evaluate((el:HTMLVideoElement)=>el.readyState)).toBeGreaterThanOrEqual(2)
  await video.evaluate((el:HTMLVideoElement)=>{el.muted=true;el.currentTime=el.duration-.4;void el.play()})
  await expect.poll(()=>video.evaluate((el:HTMLVideoElement)=>el.ended)).toBe(true)
  await context.setOffline(false)
 })
}
