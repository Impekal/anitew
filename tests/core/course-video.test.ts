import {expect,it} from 'vitest'
import {courseVideos,courseVideo} from '../../src/i18n/courseVideos.ts'
it('does not publish rejected motion or test fixtures',()=>{
 expect(courseVideos).toEqual([])
 for(const coach of ['original','lin','rafael'] as const)
  expect(courseVideo('story-method','de',coach)).toBeUndefined()
})
