import {test,expect} from '@playwright/test'
import {visit,openPage} from './helpers.ts'

test('backup imports merge course history and keep the higher unlocked stage',async({page})=>{
 await visit(page)
 await openPage(page,'Sicherung')
 const backup=(completed:string[],stages:Record<string,number>)=>({name:'course-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'anitew-backup',version:1,createdAt:1,app:'course-regression',tables:{settings:[{key:'courses.practised.v1',value:completed},{key:'courses.stages.v1',value:stages}],sessions:[],events:[],itemStates:[],benchmarks:[]}}))})
 await page.locator('input[type=file]').setInputFiles(backup(['text-meaning'],{'text-meaning':3}))
 await expect(page.getByText(/Eingelesen:/)).toBeVisible()
 await page.locator('input[type=file]').setInputFiles(backup(['long-words'],{'long-words':2}))
 await expect(page.getByText(/Eingelesen: 0 neu dazu/)).toBeVisible()
 await page.reload()
 await openPage(page,'Lernkurse')
 await expect(page.getByText('2 von 12 Übungen durchgeführt',{exact:true})).toBeVisible()
 await page.getByRole('button',{name:'Kurs öffnen : Lange Texte inhaltlich behalten',exact:true}).click()
 await page.locator('#course-stage').selectOption('3')
 await expect(page.getByLabel('Eigener Text oder eigenes Wort (nur für diesen Versuch)',{exact:true})).toBeVisible()
 await page.getByRole('button',{name:'Zur Kursübersicht',exact:true}).click()
 await page.getByRole('button',{name:'Kurs öffnen : Lange Wörter sicher behalten',exact:true}).click()
 await page.locator('#course-stage').selectOption('3')
 await expect(page.getByLabel('Eigener Text oder eigenes Wort (nur für diesen Versuch)',{exact:true})).toBeVisible()
})
