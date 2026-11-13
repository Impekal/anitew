import {test,expect} from '@playwright/test'
import {visit,openPage} from './helpers.ts'
import {readingCourses} from '../../src/i18n/courses.ts'
import {courseVideo} from '../../src/i18n/courseVideos.ts'

const menus={de:'Lernkurse',en:'Learning courses',fr:'Cours d’apprentissage'}
async function openLongWords(page:Parameters<typeof visit>[0],language:'de'|'en'|'fr'='de') {
 await openPage(page,menus[language])
 const title=readingCourses[language].find(course=>course.id==='long-words')!.title
 await page.locator('.course-list article').filter({has:page.getByRole('heading',{name:title,exact:true})}).getByRole('button').click()
}

for(const language of ['de','en','fr'] as const)test(`${language}: fresh course opens directly as video without autoplay or unsolicited video download`,async({page})=>{
 const requested:string[]=[]
 page.on('request',request=>{if(request.url().includes('/course-media/video/'))requested.push(request.url())})
 await visit(page)
 if(language!=='de')await page.getByRole('combobox',{name:'Sprache',exact:true}).selectOption(language)
 await openLongWords(page,language)
 await expect(page.locator('#course-format')).toHaveValue('video')
 const video=page.locator('.course-media video:not([data-lesson-intro])')
 await expect(video).toHaveAttribute('src',courseVideo('long-words',language,'rafael')!.src)
 await expect(video).toHaveAttribute('preload','none')
 expect(await video.evaluate((el:HTMLVideoElement)=>({paused:el.paused,autoplay:el.autoplay,currentTime:el.currentTime}))).toEqual({paused:true,autoplay:false,currentTime:0})
 await expect(page.locator('.course-lesson > blockquote')).toHaveCount(0)
 expect(requested).toEqual([])
})

test('all twelve default German lessons offer their video immediately',async({page})=>{
 await visit(page)
 await openPage(page,'Lernkurse')
 for(const course of readingCourses.de){
  await page.locator('.course-list article').filter({has:page.getByRole('heading',{name:course.title,exact:true})}).getByRole('button').click()
  await expect(page.locator('#course-format')).toHaveValue('video')
  await expect(page.locator('.course-media video:not([data-lesson-intro])')).toHaveAttribute('src',courseVideo(course.id,'de','rafael')!.src)
  await page.getByRole('button',{name:'Zur Kursübersicht',exact:true}).click()
 }
})

test('explicit audio and reading choices survive restart while voice and speed remain',async({page})=>{
 await visit(page)
 await openLongWords(page)
 await page.locator('#course-audio-language').selectOption('fr')
 await page.locator('#course-speed').selectOption('1.5')
 await page.locator('#course-format').selectOption('audio')
 await expect(page.locator('.course-media audio')).toHaveCount(1)
 await expect(page.locator('#course-format')).toBeEnabled()
 await page.reload();await openLongWords(page)
 await expect(page.locator('#course-format')).toHaveValue('audio')
 await expect(page.locator('#course-audio-language')).toHaveValue('fr')
 await expect(page.locator('#course-speed')).toHaveValue('1.5')
 await page.getByRole('button',{name:'Nur lesen',exact:true}).click()
 await expect(page.getByRole('button',{name:'Anhören und ansehen',exact:true})).toBeEnabled()
 await page.reload();await openLongWords(page)
 await expect(page.getByRole('button',{name:'Anhören und ansehen',exact:true})).toBeEnabled()
 await expect(page.getByRole('button',{name:'Vorlage ausblenden und üben',exact:true})).toBeVisible()
 await expect(page.locator('.course-media audio,.course-media video')).toHaveCount(0)
 await page.getByRole('button',{name:'Anhören und ansehen',exact:true}).click()
 await expect(page.locator('#course-format')).toHaveValue('audio')
 await expect(page.locator('#course-audio-language')).toHaveValue('fr')
 await expect(page.locator('#course-speed')).toHaveValue('1.5')
})

test('old implicit audio setting migrates to video without changing narration or speed',async({page})=>{
 await visit(page)
 await page.evaluate(async()=>{
  const open=indexedDB.open('anitew')
  const db:IDBDatabase=await new Promise((resolve,reject)=>{open.onsuccess=()=>resolve(open.result);open.onerror=()=>reject(open.error)})
  await new Promise<void>((resolve,reject)=>{
   const tx=db.transaction('settings','readwrite')
   tx.objectStore('settings').put({key:'courses.media.v1',value:{audio:'fr',speed:1.25,view:'listen'}})
   tx.oncomplete=()=>resolve();tx.onabort=()=>reject(tx.error);tx.onerror=()=>reject(tx.error)
  });db.close()
 })
 await openLongWords(page)
 await expect(page.locator('#course-format')).toHaveValue('video')
 await expect(page.locator('#course-audio-language')).toHaveValue('fr')
 await expect(page.locator('#course-speed')).toHaveValue('1.25')
 await expect(page.locator('.course-media video')).toHaveAttribute('src',courseVideo('long-words','fr','rafael')!.src)
})
