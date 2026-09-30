import { expect,it } from 'vitest'
import { compareVerbatim } from '../../src/core/courses/verbatim.ts'
it('distinguishes missing words and punctuation from added words without grading meaning',()=>{
 const result=compareVerbatim('Die Katze schläft.','Die kleine Katze schläft')!
 expect(result.filter(item=>item.kind==='missing')).toEqual([{text:'.',kind:'missing'}])
 expect(result.filter(item=>item.kind==='extra')).toEqual([{text:'kleine',kind:'extra'}])
})
it('normalizes Unicode and spacing but preserves case and word order',()=>{
 expect(compareVerbatim('Café ici.', 'Cafe\u0301  ici.')).toSatisfy((items:{kind:string}[])=>items.every(item=>item.kind==='same'))
 expect(compareVerbatim('Die Katze','die Katze')!.filter(item=>item.kind!=='same')).toHaveLength(2)
 expect(compareVerbatim('B A','A B')!.filter(item=>item.kind!=='same')).toHaveLength(2)
})
it('bounds comparison work for large imported text',()=>expect(compareVerbatim('word '.repeat(1100),'word '.repeat(1100))).toBeNull())
