/** Self-contained: Workbox serializes this hook into the generated service worker. */
export const courseRangePlugin = {
  cachedResponseWillBeUsed: async ({ request, cachedResponse }: { request: Request; cachedResponse?: Response }) => {
    const range = request.headers.get('Range')
    if (!cachedResponse || cachedResponse.status !== 200 || !range) return cachedResponse
    const match = /^bytes=(\d*)-(\d*)$/i.exec(range.trim())
    // Unsupported/multiple ranges can be ignored by serving the complete response.
    if (!match || (!match[1] && !match[2])) return cachedResponse
    const body = await cachedResponse.clone().blob()
    const size = body.size
    const suffix = !match[1]
    const first = Number(match[1] || match[2])
    const last = match[2] && !suffix ? Number(match[2]) : size - 1
    const start = suffix ? Math.max(0, size - first) : first
    const end = Math.min(last, size - 1)
    if (!Number.isSafeInteger(first) || !Number.isSafeInteger(last) || size === 0 ||
        (suffix && first === 0) || start >= size || end < start) {
      return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } })
    }
    const headers = new Headers(cachedResponse.headers)
    headers.set('Content-Range', `bytes ${start}-${end}/${size}`)
    headers.set('Content-Length', String(end - start + 1))
    headers.set('Accept-Ranges', 'bytes')
    return new Response(body.slice(start, end + 1), { status: 206, headers })
  },
}
