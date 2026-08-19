/**
 * Die kleinen Zeichen des Menüs — selbst gezeichnet, eine Strichstärke,
 * `currentColor` (D-005: kein fremdes Icon-Paket, keine Lizenzfrage, kein
 * Nachladen). Sie sind Wegweiser, keine Bilder: `aria-hidden`, denn der
 * Text daneben sagt alles.
 *
 * Bewusst **kein** Pokal und kein Stern beim Erreichten — ein Belohnungs-
 * symbol wäre genau der Trophäenschrank, den D-019 ausschließt.
 */

export type MenuIconKind =
  | 'reached'
  | 'profile'
  | 'coach'
  | 'contents'
  | 'about'
  | 'palace'
  | 'reminder'
  | 'science'
  | 'install'
  | 'privacy'
  | 'backup'
  | 'sync'
  | 'check'

const PATHS: Readonly<Record<MenuIconKind, string>> = {
  // Drei Zeilen mit Haken: eine Liste von Tatsachen.
  reached: 'M9 6.5h11M9 12h11M9 17.5h11M4 6.5l1.2 1.2L7.4 5.5M4 12l1.2 1.2L7.4 11M4 17.5l1.2 1.2 2.2-2.2',
  // Drei Balken auf einer Grundlinie: die Achsen des Profils.
  profile: 'M4 20h16M7 20v-6M12 20V9M17 20v-3.5',
  // Die Sprechblase: jemand, der antwortet.
  coach: 'M4.5 5.5h15v10h-8.5L7 19v-3.5H4.5zM8 9.5h8M8 12.5h5',
  // Zwei Karten, leicht versetzt: der eigene Stapel.
  contents: 'M7.5 4.5h12v11h-12zM7.5 7.5h12M4.5 8.5v11h12',
  // Kopf und Schultern.
  about: 'M12 5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM5 20c1.4-3.4 3.9-5 7-5s5.6 1.6 7 5',
  // Giebel und Säulen.
  palace: 'M4 9.5 12 4l8 5.5M6 10.5V19M12 10.5V19M18 10.5V19M4 19.5h16',
  // Die Glocke.
  reminder: 'M12 4a5 5 0 0 0-5 5v3.2L5.4 15h13.2L17 12.2V9a5 5 0 0 0-5-5zM10 18a2 2 0 0 0 4 0',
  // Der Kolben.
  science: 'M9.8 3.5v5L5.2 16.6A2.4 2.4 0 0 0 7.3 20h9.4a2.4 2.4 0 0 0 2.1-3.4L14.2 8.5v-5M8.3 3.5h7.4',
  // Pfeil in die Ablage.
  install: 'M12 4v9.5M12 13.5 8.5 10M12 13.5 15.5 10M5 19.5h14',
  // Der Schild.
  privacy: 'M12 3.5 18.5 6v5.2c0 4.3-2.7 7.6-6.5 9.3-3.8-1.7-6.5-5-6.5-9.3V6z',
  // Die Kiste mit Deckel.
  backup: 'M4.5 8.5h15V19h-15zM4.5 8.5 6.7 5h10.6l2.2 3.5M9.5 12.5h5',
  // Zwei Pfeile im Kreis: hin und zurück.
  sync: 'M6.5 7.5A7 7 0 0 1 18 9M18 4.5V9h-4.5M17.5 16.5A7 7 0 0 1 6 15M6 19.5V15h4.5',
  // Der Puls.
  check: 'M3 13h4l2-5.5 4.5 10L15.5 13H21',
}

export function MenuIcon({ kind }: { kind: MenuIconKind }) {
  return (
    <svg
      className="menu-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[kind]} />
    </svg>
  )
}
