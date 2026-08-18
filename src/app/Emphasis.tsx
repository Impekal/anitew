import { Fragment, type ReactNode } from 'react'

/**
 * Hervorhebung in einem Text aus `i18n`.
 *
 * Zwei Sterne machen fett — mehr kann das hier nicht, und mehr soll es nicht
 * können. Der Anlass war ein Fehler, der auf dem Bildschirm stand: In zwei
 * Texten waren `**Sterne**` gesetzt, und React zeigt eine Zeichenkette so, wie
 * sie dasteht. Da stand dann wörtlich „**nicht** gezeigt“.
 *
 * Warum nicht die Sterne einfach entfernen: An beiden Stellen trägt die
 * Hervorhebung die Aussage. „Was daraus folgt, ist damit **nicht** gezeigt“ —
 * genau dieses Wort ist der Unterschied zwischen einer ehrlichen und einer
 * werbenden Zeile (F4). Es zu betonen ist keine Zierde.
 *
 * Warum kein Markdown-Paket: Für zwei Sterne eine Abhängigkeit zu laden, die
 * Links, Listen und HTML kann, öffnet eine Tür, durch die niemand gehen soll —
 * Übersetzungen sind Text und dürfen kein Markup mitbringen.
 */
export function Emphasis({ text }: { text: string }): ReactNode {
  const parts = text.split('**')
  return (
    <>
      {parts.map((part, index) =>
        // Ungerade Abschnitte liegen zwischen zwei Sternen.
        index % 2 === 1 ? <strong key={index}>{part}</strong> : <Fragment key={index}>{part}</Fragment>,
      )}
    </>
  )
}
