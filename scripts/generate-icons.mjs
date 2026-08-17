/**
 * Erzeugt public/icons/icon-192.png und icon-512.png aus public/icons/icon.svg
 * — ohne Bildbibliothek: Die Pixel werden in einen RGBA-Puffer gezeichnet und
 * mit Nodes eingebautem zlib als PNG kodiert. Eine Abhängigkeit weniger, die
 * in THIRD_PARTY_LICENSES.md gehört (Backlog R1).
 *
 * Das Zeichen: fünf Punkte auf einem Bogen, mit wachsenden Abständen. Das ist
 * die Wiederholungskurve aus D-004 — erst dicht, dann immer weiter
 * auseinander. Vorläufig, bis die Markenrecherche (R3) durch ist.
 *
 *     npm run icons
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c
})

function crc32(buf) {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePng(width, height, rgba) {
  const stride = width * 4 + 1
  const raw = Buffer.alloc(stride * height)
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0 // Filter 0 = keiner
    rgba.copy(raw, y * stride + 1, y * width * 4, (y + 1) * width * 4)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // Bittiefe
  ihdr[9] = 6 // Farbtyp RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const BACKGROUND = [15, 18, 24, 255] // --paper dunkel
const MARK = [224, 168, 106, 255] // --accent dunkel

/** Die fünf Punkte, in Anteilen der Kantenlänge. Abstände wachsen. */
const DOTS = [
  { x: 0.2, y: 0.66, r: 0.037 },
  { x: 0.3, y: 0.56, r: 0.042 },
  { x: 0.45, y: 0.45, r: 0.049 },
  { x: 0.65, y: 0.36, r: 0.057 },
  { x: 0.83, y: 0.32, r: 0.066 },
]

function render(size) {
  const scale = 4 // 4×4 Überabtastung gegen harte Kanten
  const big = size * scale
  const cover = new Float32Array(big * big)

  const dots = DOTS.map((d) => ({ x: d.x * big, y: d.y * big, r: d.r * big }))
  const lineWidth = 0.016 * big

  for (let y = 0; y < big; y++) {
    for (let x = 0; x < big; x++) {
      let inside = 0
      for (const d of dots) {
        if ((x - d.x) ** 2 + (y - d.y) ** 2 <= d.r ** 2) {
          inside = 1
          break
        }
      }
      if (inside === 0) {
        for (let i = 0; i < dots.length - 1; i++) {
          if (distanceToSegment(x, y, dots[i], dots[i + 1]) <= lineWidth / 2) {
            inside = 1
            break
          }
        }
      }
      cover[y * big + x] = inside
    }
  }

  const rgba = Buffer.alloc(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let sum = 0
      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          sum += cover[(y * scale + sy) * big + (x * scale + sx)]
        }
      }
      const a = sum / (scale * scale)
      const o = (y * size + x) * 4
      for (let c = 0; c < 3; c++) {
        rgba[o + c] = Math.round(BACKGROUND[c] * (1 - a) + MARK[c] * a)
      }
      rgba[o + 3] = 255
    }
  }
  return encodePng(size, size, rgba)
}

function distanceToSegment(px, py, a, b) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const lengthSquared = dx * dx + dy * dy
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / lengthSquared))
  return Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy))
}

const dir = new URL('../public/icons/', import.meta.url)
mkdirSync(dir, { recursive: true })
for (const size of [192, 512]) {
  writeFileSync(new URL(`icon-${size}.png`, dir), render(size))
  console.log(`icon-${size}.png`)
}
