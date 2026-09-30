import {test,expect} from '@playwright/test'
import {visit,openPage} from './helpers.ts'
test('rejected video previews are not offered or requested',async({page})=>{
 const videos:string[]=[]
 page.on('request',request=>{if(request.url().includes('/course-media/video/'))videos.push(request.url())})
 await visit(page)
 await openPage(page,'Lernkurse')
 await page.getByRole('button',{name:'Kurs öffnen : Begriffe durch Geschichten verbinden',exact:true}).click()
 await expect(page.locator('video')).toHaveCount(0)
 await expect(page.getByRole('option',{name:'Video-Probe',exact:true})).toHaveCount(0)
 expect(videos).toEqual([])
})
