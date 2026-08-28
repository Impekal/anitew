/**
 * Welche Einstellungen ein Gerät verlassen dürfen.
 *
 * Die Backup-Datei und der automatische Drive-Abgleich teilen dasselbe Format.
 * Deshalb ist diese Funktion die Datenschutzgrenze für **beide** Wege.
 * Alles, was einen geheimen Zugang oder nur den Zustand dieses einen Geräts
 * beschreibt, bleibt lokal — auch wenn eine alte Sicherung solche Zeilen noch
 * enthält und später wieder eingelesen wird.
 */
export function isPortableSettingKey(key: string): boolean {
  // BYOK-Schlüssel sind echte Zugangsdaten. `coach.provider` dagegen ist nur
  // eine Vorliebe und darf mitreisen.
  if (key === 'coach.key' || key.startsWith('coach.key.')) return false

  // OAuth-/Drive-Verbindung, Kontoanzeige, letzter Abgleich und eine lokale
  // Client-ID-Übersteuerung sind gerätegebundener technischer Zustand.
  if (key.startsWith('sync.')) return false

  return true
}
