import { faceFor } from '../core/index.ts'

/** The photograph is the recall cue. Never put the answer in its alt text. */
export function Face({ name, size = 132 }: { name: string; size?: number }) {
  const face = faceFor(name)
  if (face === undefined) {
    return <span className="face face-unavailable" aria-hidden="true" style={{ width: size, height: size * 1.25 }}>?</span>
  }
  return (
    <img
      className="face"
      src={face.src}
      width={size}
      height={size * 1.25}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  )
}
