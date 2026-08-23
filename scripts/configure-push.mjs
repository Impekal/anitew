#!/usr/bin/env node
import { generateKeyPairSync } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const WORKER = 'anitew'
const SUBJECT = process.env.VAPID_SUBJECT ?? 'mailto:impekaltech@gmail.com'

function base64Url(buffer) {
  return Buffer.from(buffer).toString('base64url')
}

function decodeCoordinate(value) {
  return Buffer.from(value, 'base64url')
}

function wrangler(args, input) {
  const result = spawnSync('npx', ['wrangler', ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
    input,
    stdio: input === undefined ? ['inherit', 'pipe', 'inherit'] : ['pipe', 'inherit', 'inherit'],
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
  return result.stdout ?? ''
}

const listed = wrangler(['secret', 'list', '--name', WORKER, '--json'])
let names = []
try {
  names = JSON.parse(listed).map((entry) => entry.name)
} catch {
  console.error('Wrangler secret list konnte nicht gelesen werden.')
  process.exit(1)
}

const required = ['VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY', 'VAPID_SUBJECT']
if (required.every((name) => names.includes(name))) {
  console.log('Web-Push-Schlüssel sind bereits gesetzt. Nichts wurde rotiert.')
  process.exit(0)
}

if (required.some((name) => names.includes(name))) {
  console.error('Nur ein Teil der VAPID-Secrets existiert. Aus Sicherheitsgründen wird nichts automatisch überschrieben.')
  console.error('Bitte den inkonsistenten Zustand zuerst prüfen; eine Schlüsselrotation würde bestehende Push-Abos ungültig machen.')
  process.exit(1)
}

const { publicKey, privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' })
const publicJwk = publicKey.export({ format: 'jwk' })
const privateJwk = privateKey.export({ format: 'jwk' })
if (!publicJwk.x || !publicJwk.y || !privateJwk.d) throw new Error('P-256 key export failed')

const publicKeyBytes = Buffer.concat([
  Buffer.from([0x04]),
  decodeCoordinate(publicJwk.x),
  decodeCoordinate(publicJwk.y),
])
const values = {
  VAPID_PUBLIC_KEY: base64Url(publicKeyBytes),
  VAPID_PRIVATE_KEY: privateJwk.d,
  VAPID_SUBJECT: SUBJECT,
}

for (const name of required) {
  wrangler(['secret', 'put', name, '--name', WORKER], `${values[name]}\n`)
}

console.log('Web-Push-Schlüssel wurden einmalig gesetzt. Private Schlüssel wurden nicht ausgegeben.')
