/**
 * „Erst speichern, dann anzeigen" — für alle Einstellungen dieselbe Regel
 * (R3-06, Runde 3).
 *
 * Vorher behandelten die drei Einstellungen ihre Schreibfehler verschieden:
 * Die Sprache wechselte optimistisch und verschluckte den Fehler, die
 * Trainingssprache ebenso, und der Ton setzte seine Anzeige sogar im
 * `finally` — also **auch dann**, wenn das Speichern gescheitert war,
 * obwohl der Kommentar daneben das Gegenteil versprach. Wer danach neu lud,
 * bekam einen anderen Zustand als den angezeigten.
 *
 * Die Regel hier ist schmal genug, um sie in Node zu prüfen: Angewandt wird
 * nur nach erfolgreichem Schreiben; scheitert es, erfährt man davon.
 */
export async function persistThenApply(
  write: () => Promise<unknown>,
  apply: () => void,
  onFailure: () => void,
): Promise<void> {
  try {
    await write()
  } catch {
    onFailure()
    return
  }
  apply()
}
