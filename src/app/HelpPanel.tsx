import { lazy, Suspense } from 'react'

/*
  Erst laden, wenn jemand eine der beiden Seiten öffnet: Hilfe und Fragen
  wiegen in sechs Sprachen deutlich mehr als der Startbildschirm, und dort
  werden sie nie gebraucht. Dieselbe Regel wie beim Lernbereich und beim
  Abgleich.
*/
const HelpPanelImpl = lazy(async () => {
  const module = await import('./HelpPanelImpl.tsx')
  return { default: module.HelpPanelImpl }
})

export function HelpPanel(props: { language: string; view: 'help' | 'faq' }) {
  return (
    <Suspense fallback={null}>
      <HelpPanelImpl {...props} />
    </Suspense>
  )
}
