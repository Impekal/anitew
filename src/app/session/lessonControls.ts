/**
 * Stellt den in den E2E-Verträgen festgehaltenen Lektionsweg wieder her:
 * Die Merkkarte ist Inhalt, nicht heimlich der Weiter-Knopf. Der bewusste
 * Schritt steht als eigener Button darunter.
 *
 * `SessionScreenImpl` ist ein großer, spät geladener Trainingschunk. Bis die
 * Karten dort bei einer späteren Aufräumrunde direkt als nicht-interaktive
 * Elemente gerendert werden, hält dieser kleine Session-seitige Adapter die
 * bestehende React-Logik unangetastet: Der neue Button löst den vorhandenen
 * React-Handler programmgesteuert aus. `pointer-events:none` verhindert nur
 * den direkten Finger-/Mausweg, nicht `HTMLElement.click()`.
 *
 * Die Beschriftung wird nicht neu übersetzt: Die bereits aus dem aktiven
 * Dictionary gerenderte letzte `.hint`-Zeile der Lektion wird selbst zum
 * Button. Damit bleibt jede unterstützte Sprache exakt bei ihrer Quelle.
 */
function enhanceLesson(lesson: HTMLElement): void {
  if (lesson.dataset.explicitContinue === 'true') return

  const card = lesson.querySelector<HTMLButtonElement>('.lesson-card')
  const hints = [...lesson.querySelectorAll<HTMLElement>(':scope > .hint')]
  const ready = hints.at(-1)
  if (card === null || ready === undefined) return

  lesson.dataset.explicitContinue = 'true'

  // Die Karte bleibt vollständig lesbar, ist aber nicht mehr der versteckte
  // Bedienweg. Tastatur und Pointer landen ausschließlich auf dem sichtbaren
  // Weiter-Knopf.
  card.tabIndex = -1
  card.style.pointerEvents = 'none'
  card.style.cursor = 'default'

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'quiet lesson-continue'
  button.textContent = ready.textContent?.trim() || '→'
  button.addEventListener('click', () => card.click())
  ready.replaceWith(button)
}

export function installLessonControls(): () => void {
  const sync = () => {
    document.querySelectorAll<HTMLElement>('.lesson').forEach(enhanceLesson)
  }

  const observer = new MutationObserver(sync)
  observer.observe(document.body, { childList: true, subtree: true })
  sync()

  return () => observer.disconnect()
}
