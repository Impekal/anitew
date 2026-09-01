export interface LocalPhotoCopy {
  readonly pick: string
  readonly replace: string
  readonly remove: string
  readonly note: string
  readonly alt: string
  readonly invalid: string
  readonly tooLarge: string
  readonly analyze: string
  readonly analyzing: string
  readonly analyzeNote: string
  readonly noKey: string
  readonly unsupportedProvider: string
  readonly unsupportedImage: string
  readonly empty: string
  readonly ready: string
}

const de: LocalPhotoCopy = {
  pick: 'Foto als Vorlage',
  replace: 'Anderes Foto',
  remove: 'Foto entfernen',
  note: 'Das Foto bleibt nur für diese Ansicht auf diesem Gerät. ANITEW speichert oder synchronisiert es nicht.',
  alt: 'Ausgewähltes Foto als lokale Vorlage',
  invalid: 'Bitte wähle eine Bilddatei.',
  tooLarge: 'Das Foto ist zu groß. Wähle ein Bild bis 15 MB.',
  analyze: 'Foto auswerten',
  analyzing: 'Foto wird ausgewertet …',
  analyzeNote:
    'Nur wenn du „Foto auswerten“ drückst, sendet ANITEW eine verkleinerte Kopie ohne Dateimetadaten direkt an deinen gewählten KI-Anbieter. Erst deine spätere Bestätigung speichert Erinnerungen.',
  noKey: 'Für die Foto-Auswertung fehlt ein eigener KI-Schlüssel. Du kannst das Foto weiterhin lokal als Vorlage nutzen.',
  unsupportedProvider:
    'Der aktuell gewählte KI-Anbieter ist für Foto-Auswertung nicht freigeschaltet. Wähle Gemini, Anthropic oder OpenAI — oder nutze das Foto lokal als Vorlage.',
  unsupportedImage: 'Dieses Bild kann auf diesem Gerät nicht sicher für die Auswertung vorbereitet werden.',
  empty: 'Im Foto wurden keine sicheren, merkenswerten Informationen gefunden.',
  ready: 'Vorschläge aus dem Foto sind bereit. Prüfe sie unten und bestätige nur, was wirklich stimmt.',
}

const en: LocalPhotoCopy = {
  pick: 'Use photo as reference',
  replace: 'Choose another photo',
  remove: 'Remove photo',
  note: 'The photo stays only in this view on this device. ANITEW does not save or sync it.',
  alt: 'Selected photo as a local reference',
  invalid: 'Please choose an image file.',
  tooLarge: 'The photo is too large. Choose an image up to 15 MB.',
  analyze: 'Analyze photo',
  analyzing: 'Analyzing photo …',
  analyzeNote:
    'Only when you press “Analyze photo” does ANITEW send a reduced copy without file metadata directly to your selected AI provider. Nothing becomes a memory until you confirm it afterwards.',
  noKey: 'Photo analysis needs your own AI key. You can still use the photo locally as a reference.',
  unsupportedProvider:
    'The selected AI provider is not enabled for photo analysis. Choose Gemini, Anthropic or OpenAI — or keep using the photo locally as a reference.',
  unsupportedImage: 'This image cannot be prepared safely for analysis on this device.',
  empty: 'No reliable, memorable information was found in the photo.',
  ready: 'Suggestions from the photo are ready. Review them below and confirm only what is correct.',
}

const fr: LocalPhotoCopy = {
  pick: 'Photo comme référence',
  replace: 'Une autre photo',
  remove: 'Retirer la photo',
  note: 'La photo ne reste que dans cette vue, sur cet appareil. ANITEW ne l’enregistre ni ne la synchronise.',
  alt: 'Photo choisie comme référence locale',
  invalid: 'Choisis un fichier image.',
  tooLarge: 'La photo est trop grande. Choisis une image jusqu’à 15 Mo.',
  analyze: 'Analyser la photo',
  analyzing: 'Analyse de la photo …',
  analyzeNote:
    'Ce n’est que si tu touches « Analyser la photo » qu’ANITEW envoie une copie réduite sans métadonnées de fichier directement au fournisseur d’IA que tu as choisi. Rien ne devient un souvenir avant ta confirmation.',
  noKey: 'L’analyse de photo demande ta propre clé d’IA. Tu peux continuer à utiliser la photo localement comme référence.',
  unsupportedProvider:
    'Le fournisseur d’IA sélectionné n’est pas activé pour l’analyse de photo. Choisis Gemini, Anthropic ou OpenAI — ou continue d’utiliser la photo localement comme référence.',
  unsupportedImage: 'Cette image ne peut pas être préparée de façon sûre pour l’analyse sur cet appareil.',
  empty: 'Aucune information fiable et mémorable n’a été trouvée dans la photo.',
  ready: 'Les propositions issues de la photo sont prêtes. Vérifie-les ci-dessous et ne confirme que ce qui est exact.',
}

const es: LocalPhotoCopy = {
  pick: 'Foto como referencia',
  replace: 'Otra foto',
  remove: 'Quitar la foto',
  note: 'La foto se queda solo en esta vista, en este dispositivo. ANITEW no la guarda ni la sincroniza.',
  alt: 'Foto elegida como referencia local',
  invalid: 'Elige un archivo de imagen.',
  tooLarge: 'La foto es demasiado grande. Elige una imagen de hasta 15 MB.',
  analyze: 'Analizar foto',
  analyzing: 'Analizando la foto …',
  analyzeNote:
    'Solo si tocas «Analizar foto», ANITEW envía una copia reducida sin metadatos de archivo directamente al proveedor de IA que hayas elegido. Nada se convierte en recuerdo hasta que lo confirmes después.',
  noKey: 'El análisis de fotos necesita tu propia clave de IA. Puedes seguir usando la foto localmente como referencia.',
  unsupportedProvider:
    'El proveedor de IA seleccionado no está habilitado para el análisis de fotos. Elige Gemini, Anthropic u OpenAI, o sigue usando la foto localmente como referencia.',
  unsupportedImage: 'Esta imagen no se puede preparar de forma segura para el análisis en este dispositivo.',
  empty: 'No se encontró en la foto información fiable digna de recordar.',
  ready: 'Las propuestas de la foto están listas. Revísalas abajo y confirma solo lo que sea correcto.',
}

const it: LocalPhotoCopy = {
  pick: 'Foto come riferimento',
  replace: 'Un’altra foto',
  remove: 'Rimuovi la foto',
  note: 'La foto resta solo in questa vista, su questo dispositivo. ANITEW non la salva né la sincronizza.',
  alt: 'Foto scelta come riferimento locale',
  invalid: 'Scegli un file immagine.',
  tooLarge: 'La foto è troppo grande. Scegli un’immagine fino a 15 MB.',
  analyze: 'Analizza foto',
  analyzing: 'Analisi della foto …',
  analyzeNote:
    'Solo se tocchi «Analizza foto», ANITEW invia una copia ridotta senza metadati di file direttamente al fornitore di IA che hai scelto. Nulla diventa un ricordo prima della tua conferma.',
  noKey: 'L’analisi delle foto richiede una tua chiave di IA. Puoi continuare a usare la foto localmente come riferimento.',
  unsupportedProvider:
    'Il fornitore di IA selezionato non è abilitato all’analisi delle foto. Scegli Gemini, Anthropic o OpenAI — oppure continua a usare la foto localmente come riferimento.',
  unsupportedImage: 'Questa immagine non può essere preparata in sicurezza per l’analisi su questo dispositivo.',
  empty: 'Nella foto non sono state trovate informazioni affidabili degne di memoria.',
  ready: 'Le proposte dalla foto sono pronte. Controllale qui sotto e conferma solo ciò che è davvero corretto.',
}

const pt: LocalPhotoCopy = {
  pick: 'Foto como referência',
  replace: 'Outra foto',
  remove: 'Remover a foto',
  note: 'A foto fica apenas nesta vista, neste aparelho. A ANITEW não a guarda nem a sincroniza.',
  alt: 'Foto escolhida como referência local',
  invalid: 'Escolhe um ficheiro de imagem.',
  tooLarge: 'A foto é demasiado grande. Escolhe uma imagem até 15 MB.',
  analyze: 'Analisar foto',
  analyzing: 'A analisar a foto …',
  analyzeNote:
    'Só se tocares em «Analisar foto» é que a ANITEW envia uma cópia reduzida sem metadados de ficheiro diretamente ao fornecedor de IA que escolheste. Nada se torna memória antes da tua confirmação.',
  noKey: 'A análise de fotos precisa da tua própria chave de IA. Podes continuar a usar a foto localmente como referência.',
  unsupportedProvider:
    'O fornecedor de IA selecionado não está ativado para a análise de fotos. Escolhe Gemini, Anthropic ou OpenAI — ou continua a usar a foto localmente como referência.',
  unsupportedImage: 'Esta imagem não pode ser preparada em segurança para a análise neste aparelho.',
  empty: 'Não se encontrou na foto qualquer informação fiável digna de memória.',
  ready: 'As propostas da foto estão prontas. Verifica-as abaixo e confirma só o que estiver certo.',
}

const COPY: Record<string, LocalPhotoCopy> = { de, en, fr, es, it, pt }

/**
 * Die Sprache kommt aus dem Dokument, nicht aus einer Ja/Nein-Frage.
 *
 * Hier stand `lang === 'de' ? de : en` mit dem Kommentar, die App habe
 * „complete interface dictionaries for German and English". Das galt einmal;
 * seit den sechs App-Sprachen war es falsch, und ein französisches Gerät sah
 * an dieser Stelle Englisch. Deutsch bleibt der Rückfall (D-007).
 */
export function localPhotoCopyFor(language: string): LocalPhotoCopy {
  return COPY[language.toLowerCase().slice(0, 2)] ?? de
}

export function localPhotoCopyForCurrentUi(): LocalPhotoCopy {
  return localPhotoCopyFor(document.documentElement.lang)
}
