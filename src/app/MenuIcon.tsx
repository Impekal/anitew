/**
 * Die kleinen Zeichen des Core-Menüs sind absichtlich selbst gezeichnet.
 * Kein Icon-Paket, kein Nachladen. Entscheidend ist jetzt nicht nur ein
 * anderer Pfad in derselben Plakette: Jede Funktion bekommt eine sofort
 * erkennbare Silhouette. Die umgebende Materialfläche gehört dem Wrapper,
 * nicht dem SVG selbst.
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
  | 'settings'

function Glyph({ kind }: { kind: MenuIconKind }) {
  switch (kind) {
    case 'reached':
      return <path d="M9 6.5h11M9 12h11M9 17.5h11M4 6.5l1.2 1.2L7.4 5.5M4 12l1.2 1.2L7.4 11M4 17.5l1.2 1.2 2.2-2.2" />
    case 'profile':
      return <path d="M4 20h16M7 20v-6M12 20V9M17 20v-3.5" />
    case 'coach':
      return <path d="M4.5 5.5h15v10h-8.5L7 19v-3.5H4.5zM8 9.5h8M8 12.5h5" />
    case 'contents':
      return <path d="M7.5 4.5h12v11h-12zM7.5 7.5h12M4.5 8.5v11h12" />
    case 'memories':
      return <path d="M6 8.5l6.5-3 5.5 5-4.5 8-6-2.5zM6 8.5l7.5 9.5M12.5 5.5l-1 9.5" />
    case 'about':
      return <path d="M12 5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM5 20c1.4-3.4 3.9-5 7-5s5.6 1.6 7 5" />
    case 'palace':
      return <path d="M4 9.5 12 4l8 5.5M6 10.5V19M12 10.5V19M18 10.5V19M4 19.5h16" />
    case 'reminder':
      return (
        <>
          <path d="M12 3.4c-3.3 0-5.7 2.6-5.7 5.9v3.1l-1.8 3.2h15l-1.8-3.2V9.3c0-3.3-2.4-5.9-5.7-5.9z" />
          <path d="M9.5 18.1c.6 1.6 1.4 2.3 2.5 2.3s1.9-.7 2.5-2.3" />
          <path d="M12 1.7v1.1" />
        </>
      )
    case 'science':
      return (
        <>
          <path d="M8.8 3h6.4M10.2 3v5.5L5.4 16.6A2.7 2.7 0 0 0 7.7 20.7h8.6a2.7 2.7 0 0 0 2.3-4.1l-4.8-8.1V3" />
          <path d="M7.3 15.2h9.4" />
          <circle cx="10" cy="17.2" r=".65" fill="currentColor" stroke="none" />
          <circle cx="14.3" cy="16.5" r=".45" fill="currentColor" stroke="none" />
        </>
      )
    case 'install':
      return (
        <>
          <rect x="6.5" y="2.7" width="11" height="18.6" rx="2.2" />
          <path d="M12 6.2v7M8.9 10.4 12 13.5l3.1-3.1M10 18.2h4" />
        </>
      )
    case 'privacy':
      return (
        <>
          <path d="M12 2.7 19 5.5v5.7c0 4.6-2.9 8.1-7 10.1-4.1-2-7-5.5-7-10.1V5.5z" />
          <rect x="9" y="10.8" width="6" height="5.1" rx="1" />
          <path d="M10.2 10.8V9.3a1.8 1.8 0 0 1 3.6 0v1.5" />
        </>
      )
    case 'backup':
      return (
        <>
          <path d="M4.3 6.5h15.4v4.1H4.3zM5.2 10.6h13.6v9.1H5.2z" />
          <path d="M9 14.3h6M7.2 4.1 4.8 6.5l2.4 2.4" />
          <path d="M5 6.5h5.1" />
        </>
      )
    case 'sync':
      return (
        <>
          <path d="M5.2 8.2A7.8 7.8 0 0 1 18.4 7" />
          <path d="M18.4 3.4V7h-3.7" />
          <path d="M18.8 15.8A7.8 7.8 0 0 1 5.6 17" />
          <path d="M5.6 20.6V17h3.7" />
          <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
        </>
      )
    case 'check':
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M4.9 12h3.3l1.7-3.6 2.7 7.2 1.8-3.6h4.7" />
        </>
      )
    case 'settings':
      // Drei Schieberegler — Einstellungen ohne das abgegriffene Zahnrad.
      return (
        <>
          <path d="M4 7h16M4 12h16M4 17h16" />
          <circle cx="9.5" cy="7" r="1.7" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r="1.7" fill="currentColor" stroke="none" />
          <circle cx="7.5" cy="17" r="1.7" fill="currentColor" stroke="none" />
        </>
      )
  }
}

export function MenuIcon({ kind }: { kind: MenuIconKind }) {
  return (
    <span className="menu-glyph-wrap" data-icon-kind={kind} aria-hidden="true">
      <svg
        className="menu-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Glyph kind={kind} />
      </svg>
    </span>
  )
}
