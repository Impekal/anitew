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
  | 'memories'
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
  // Drei verbundene Punkte: die Konstellation.
  memories: 'M6 8.5l6.5-3 5.5 5-4.5 8-6-2.5zM6 8.5l7.5 9.5M12.5 5.5l-1 9.5',
  // Kopf und Schultern.
  about: 'M12 5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM5 20c1.4-3.4 3.9-5 7-5s5.6 1.6 7 5',
  // Giebel und Säulen.
  palace: 'M4 9.5 12 4l8 5.5M6 10.5V19M12 10.5V19M18 10.5V19M4 19.5h16',

  // App & Gerät: absichtlich sehr unterschiedliche Silhouetten.
  // Glocke mit deutlich abgesetztem Klöppel.
  reminder: 'M12 3.8c-3 0-5.3 2.4-5.3 5.4v3.1L5 15.2h14l-1.7-2.9V9.2c0-3-2.3-5.4-5.3-5.4zM9.8 18.1c.5 1.3 1.3 2 2.2 2s1.7-.7 2.2-2',
  // Labor-Kolben mit sichtbarer Flüssigkeitslinie.
  science: 'M9.2 3.5h5.6M10.2 3.5v5.1L5.8 16a2.5 2.5 0 0 0 2.1 3.8h8.2a2.5 2.5 0 0 0 2.1-3.8l-4.4-7.4V3.5M7.4 15h9.2',
  // Telefon/Display mit Pfeil hinein — klar als Installation erkennbar.
  install: 'M7 4.2h10v15.6H7zM10 16.8h4M12 6.5v6.2M9.7 10.5 12 12.8l2.3-2.3',
  // Schild plus Schloss statt nur Schildkontur.
  privacy: 'M12 3.2 18.3 5.7v5.1c0 4.1-2.5 7.3-6.3 9-3.8-1.7-6.3-4.9-6.3-9V5.7zM9.3 11.3h5.4v4.2H9.3zM10.3 11.3V9.9a1.7 1.7 0 0 1 3.4 0v1.4',
  // Zwei übereinanderliegende Archivschichten + Rückpfeil.
  backup: 'M5 6.2h14v4H5zM5 10.2h14v7.6H5zM9 14h6M8.2 4.2 5.8 6.2 8.2 8.2',
  // Zwei große Gegenpfeile — bewusst kreisförmig und dynamisch.
  sync: 'M5.3 8.1A7.6 7.6 0 0 1 18.2 7M18.2 3.8V7h-3.3M18.7 15.9A7.6 7.6 0 0 1 5.8 17M5.8 20.2V17h3.3',
  // Systemcheck als eigener Ring mit EKG-Linie.
  check: 'M12 3.8a8.2 8.2 0 1 1 0 16.4 8.2 8.2 0 0 1 0-16.4zM6.4 12h3l1.5-3.2 2.4 6.4 1.5-3.2h2.8',
}

export function MenuIcon({ kind }: { kind: MenuIconKind }) {
  return (
    <svg
      className="menu-icon"
      data-icon-kind={kind}
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
