import { expect, it } from 'vitest'
import { courseRangePlugin } from '../../scripts/course-range-plugin.ts'
const read = (range: string) => courseRangePlugin.cachedResponseWillBeUsed({
 request: new Request('https://anitew.test/course-media/video/test.mp4', { headers: { Range: range } }),
 cachedResponse: new Response('0123456789', { headers: { 'Content-Type': 'video/mp4' } }),
})
it.each([
 ['bytes=2-4', 206, 'bytes 2-4/10', '234'],
 ['bytes=8-99', 206, 'bytes 8-9/10', '89'],
 ['bytes=8-', 206, 'bytes 8-9/10', '89'],
 ['bytes=-3', 206, 'bytes 7-9/10', '789'],
 ['bytes=-99', 206, 'bytes 0-9/10', '0123456789'],
 ['bytes=10-', 416, 'bytes */10', ''],
 ['bytes=11-', 416, 'bytes */10', ''],
 ['bytes=7-3', 416, 'bytes */10', ''],
 ['bytes=-0', 416, 'bytes */10', ''],
] as const)('serves cached media range %s correctly', async (range, status, header, content) => {
 const response = (await read(range))!
 expect(response.status).toBe(status)
 expect(response.headers.get('Content-Range')).toBe(header)
 expect(await response.text()).toBe(content)
})
it('serves complete media for unsupported multiple ranges', async () => {
 const response = (await read('bytes=0-1,4-5'))!
 expect(response.status).toBe(200)
 expect(await response.text()).toBe('0123456789')
})
