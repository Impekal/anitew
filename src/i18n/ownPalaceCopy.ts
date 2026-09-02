/**
 * Die Texte des eigenen Gedächtnispalasts in allen sechs App-Sprachen (G3).
 *
 * Warum nicht im Wörterbuch: `de` und `en` liegen im Kaltstart-Bündel (P4).
 * Diese sechzehn Zeilen braucht nur, wer den Palast-Bildschirm öffnet — und
 * der lädt ohnehin verzögert (`PalacePanel.tsx`). Sie standen trotzdem im
 * ersten Bild, und beim Gerätebefund vom 02.09. riss das Budget an ihnen:
 * 167,1 von 167 KB. Die Grenze zu heben wäre der bequeme Weg gewesen und der
 * falsche — sie ist da, damit solche Entscheidungen sichtbar sind. Dasselbe
 * Muster wie `brainCareCopy.ts`, `driveCopy.ts` und `panelCopy.ts`.
 *
 * ── Mehrere Paläste, und Paläste dürfen wachsen ───────────────────────────
 *
 * Der Hinweis nennt beides in einem Satz, weil es dieselbe Sache ist: Wer die
 * Technik benutzt, hat mehrere Paläste und längere. Was er **nicht** sagt:
 * dass ein längerer Palast längere Einheiten bedeutet. Tut er nicht — ein
 * Gang bleibt bei fünf Orten, ein langer Palast liefert stattdessen mehr
 * verschiedene Gänge.
 *
 * Und er sagt, was ein Palast ist: ein Ort, den man blind durchgeht. Vorher
 * hieß er „Weg", und der Gerätebefund vom 02.09. zeigte, was das anrichtet —
 * gefragt wurde, ob man nicht mehrere Paläste haben könne, obwohl es acht
 * längst gibt. Wer die Funktion nicht findet, hat sie nicht.
 *
 * ── Jeder Ort lässt sich entfernen, nicht nur der letzte ──────────────────
 *
 * Das ging erst, seit ein Ort eine dauerhafte Nummer hat statt einer
 * Position: Wer den dritten von sechs herausnimmt, hinterlässt 1, 2, 4, 5, 6
 * — und die vier bleibt die vier. Vorher wäre aus dem vierten der dritte
 * geworden, und seine Termine hingen plötzlich am falschen Ort.
 */

export interface OwnPalaceCopy {
  readonly ownIntro: string
  readonly ownName: string
  readonly ownNamePlaceholder: string
  readonly ownStation: string
  readonly ownStationPlaceholder: string
  readonly ownSave: string
  readonly ownCreate: string
  readonly ownCancel: string
  readonly ownAdd: string
  readonly ownAddStation: string
  readonly ownRemoveStation: string
  readonly ownDiscard: string
  readonly ownSaved: string
  readonly ownFailed: string
  readonly ownFull: string
  readonly ownRule: string
}

const DE: OwnPalaceCopy = {
  ownIntro: 'Ein Palast ist ein Ort, den du blind durchgehen kannst — deine Wohnung, dein Büro, das Haus deiner Eltern. Du kannst dir mehrere anlegen, bis zu acht. In jedem markierst du mindestens fünf Orte, immer in derselben Richtung. Ein Gang nimmt sich davon fünf, nie den ganzen Palast auf einmal.',
  ownName: 'Wie heißt der Palast?',
  ownNamePlaceholder: 'Meine Wohnung',
  ownStation: 'Station',
  ownStationPlaceholder: 'Ort',
  ownSave: 'Änderungen merken',
  ownCreate: 'Palast anlegen',
  ownCancel: 'Abbrechen',
  ownAdd: 'Weiteren Palast anlegen',
  ownAddStation: 'Ort anhängen',
  ownRemoveStation: 'Ort entfernen',
  ownDiscard: 'Palast verwerfen',
  ownSaved: 'Gemerkt. Er kommt ab jetzt im Training vor.',
  ownFailed: 'Das hat nicht geklappt. Es wurde nichts verändert.',
  ownFull: 'Acht Paläste sind genug. Mehr, und man kommt in keinem mehr richtig an.',
  ownRule: 'Mindestens fünf Orte, alle verschieden, keiner leer — und ein Name für den Palast.',
}

const EN: OwnPalaceCopy = {
  ownIntro: 'A palace is a place you could walk through blind — your flat, your office, your parents’ house. You can lay out several, up to eight. In each you mark at least five places, always in the same direction. A walk takes five of them, never the whole palace at once.',
  ownName: 'What is the palace called?',
  ownNamePlaceholder: 'My flat',
  ownStation: 'Stop',
  ownStationPlaceholder: 'Place',
  ownSave: 'Keep the changes',
  ownCreate: 'Lay out the palace',
  ownCancel: 'Cancel',
  ownAdd: 'Lay out another palace',
  ownAddStation: 'Append a place',
  ownRemoveStation: 'Remove this place',
  ownDiscard: 'Discard the palace',
  ownSaved: 'Kept. It appears in training from now on.',
  ownFailed: 'That did not go through. Nothing was changed.',
  ownFull: 'Eight palaces are enough. More, and you never really arrive in any of them.',
  ownRule: 'At least five places, all different, none empty — and a name for the palace.',
}

const FR: OwnPalaceCopy = {
  ownIntro: 'Un palais est un lieu que tu pourrais parcourir les yeux fermés — ton appartement, ton bureau, la maison de tes parents. Tu peux en créer plusieurs, jusqu’à huit. Dans chacun tu marques au moins cinq lieux, toujours dans le même sens. Un parcours en prend cinq, jamais tout le palais d’un coup.',
  ownName: 'Comment s’appelle le palais ?',
  ownNamePlaceholder: 'Mon logement',
  ownStation: 'Étape',
  ownStationPlaceholder: 'Lieu',
  ownSave: 'Garder les modifications',
  ownCreate: 'Créer le palais',
  ownCancel: 'Annuler',
  ownAdd: 'Créer un autre palais',
  ownAddStation: 'Ajouter un lieu',
  ownRemoveStation: 'Retirer ce lieu',
  ownDiscard: 'Abandonner le palais',
  ownSaved: 'Gardé. Il apparaît désormais à l’entraînement.',
  ownFailed: 'Cela n’a pas abouti. Rien n’a été modifié.',
  ownFull: 'Huit palais suffisent. Au-delà, on n’arrive plus vraiment dans aucun.',
  ownRule: 'Au moins cinq lieux, tous différents, aucun vide — et un nom pour le palais.',
}

const ES: OwnPalaceCopy = {
  ownIntro: 'Un palacio es un lugar que podrías recorrer a ciegas — tu casa, tu oficina, la casa de tus padres. Puedes crear varios, hasta ocho. En cada uno marcas al menos cinco lugares, siempre en la misma dirección. Un recorrido toma cinco, nunca el palacio entero de una vez.',
  ownName: '¿Cómo se llama el palacio?',
  ownNamePlaceholder: 'Mi casa',
  ownStation: 'Parada',
  ownStationPlaceholder: 'Lugar',
  ownSave: 'Guardar los cambios',
  ownCreate: 'Crear el palacio',
  ownCancel: 'Cancelar',
  ownAdd: 'Crear otro palacio',
  ownAddStation: 'Añadir un lugar',
  ownRemoveStation: 'Quitar este lugar',
  ownDiscard: 'Descartar el palacio',
  ownSaved: 'Guardado. A partir de ahora aparece en el entrenamiento.',
  ownFailed: 'No salió. No se cambió nada.',
  ownFull: 'Ocho palacios bastan. Con más, ya no llegas de verdad a ninguno.',
  ownRule: 'Al menos cinco lugares, todos distintos, ninguno vacío — y un nombre para el palacio.',
}

const IT: OwnPalaceCopy = {
  ownIntro: 'Un palazzo è un luogo che potresti percorrere a occhi chiusi — casa tua, il tuo ufficio, la casa dei tuoi genitori. Puoi crearne più d’uno, fino a otto. In ognuno segni almeno cinque luoghi, sempre nella stessa direzione. Un giro ne prende cinque, mai tutto il palazzo in una volta.',
  ownName: 'Come si chiama il palazzo?',
  ownNamePlaceholder: 'Casa mia',
  ownStation: 'Tappa',
  ownStationPlaceholder: 'Luogo',
  ownSave: 'Tenere le modifiche',
  ownCreate: 'Creare il palazzo',
  ownCancel: 'Annullare',
  ownAdd: 'Creare un altro palazzo',
  ownAddStation: 'Aggiungere un luogo',
  ownRemoveStation: 'Togliere questo luogo',
  ownDiscard: 'Scartare il palazzo',
  ownSaved: 'Tenuto. Da adesso compare nell’allenamento.',
  ownFailed: 'Non è andata. Non è stato cambiato nulla.',
  ownFull: 'Otto palazzi bastano. Con di più, non arrivi più davvero in nessuno.',
  ownRule: 'Almeno cinque luoghi, tutti diversi, nessuno vuoto — e un nome per il palazzo.',
}

const PT: OwnPalaceCopy = {
  ownIntro: 'Um palácio é um lugar que consegues percorrer às cegas — a tua casa, o teu escritório, a casa dos teus pais. Podes criar vários, até oito. Em cada um marcas pelo menos cinco lugares, sempre na mesma direção. Uma volta leva cinco, nunca o palácio inteiro de uma vez.',
  ownName: 'Como se chama o palácio?',
  ownNamePlaceholder: 'A minha casa',
  ownStation: 'Paragem',
  ownStationPlaceholder: 'Lugar',
  ownSave: 'Guardar as alterações',
  ownCreate: 'Criar o palácio',
  ownCancel: 'Cancelar',
  ownAdd: 'Criar outro palácio',
  ownAddStation: 'Acrescentar um lugar',
  ownRemoveStation: 'Retirar este lugar',
  ownDiscard: 'Descartar o palácio',
  ownSaved: 'Guardado. A partir de agora aparece no treino.',
  ownFailed: 'Não resultou. Nada foi alterado.',
  ownFull: 'Oito palácios chegam. Com mais, já não chegas de verdade a nenhum.',
  ownRule: 'Pelo menos cinco lugares, todos diferentes, nenhum vazio — e um nome para o palácio.',
}

const COPY: Record<string, OwnPalaceCopy> = { de: DE, en: EN, fr: FR, es: ES, it: IT, pt: PT }

/** Der Wortlaut zur Oberflächensprache; Englisch, wo es keinen eigenen gibt. */
export function ownPalaceCopyFor(language: string): OwnPalaceCopy {
  return COPY[language.slice(0, 2).toLocaleLowerCase()] ?? EN
}
