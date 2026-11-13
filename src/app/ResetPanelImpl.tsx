import { useEffect, useRef, useState } from 'react'

import { type ResetCopy, resetCopyFor } from '../i18n/panelCopy.ts'

import type { Platform } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'
import { wipeEverything } from '../data/reset.ts'
import { disconnectGoogleAuthorization } from '../platform/web/oauthLogout.ts'
import { resolveClientId } from './driveSync.ts'

/**
 * „Neu anfangen" — der Vollzug des Löschrechts aus PRIVACY §8.
 *
 * Bis Runde 4 stand dieser Weg nur unter „Sicherung". Dort ist er richtig
 * aufgehoben (wer löscht, sollte vorher sichern), aber niemand sucht ihn
 * dort: Gefragt wird danach in den **Einstellungen**. Deshalb steht er
 * jetzt an beiden Stellen — als eine Komponente, nicht als zweite
 * Umsetzung, denn zwei Löschwege wären zwei Gelegenheiten, dass einer
 * unvollständig löscht.
 *
 * Der Ablauf ist bewusst unbequem: erst die Warnung, dann das Wort ANITEW
 * eintippen. Danach verschwinden Datenbank, Browserspeicher, das
 * Push-Abonnement und die Google-Verknüpfung, und die App startet neu —
 * wie beim allerersten Öffnen. Das ist unwiderruflich, und genau so soll
 * es sich anfühlen.
 */
/* Die Texte stehen in `i18n/panelCopy.ts`, in allen sechs App-Sprachen. */
function resetCopy(): ResetCopy {
  return resetCopyFor(document.documentElement.lang)
}

/**
 * Wartet auf ein Versprechen — aber nicht ewig.
 *
 * `Promise.race` gegen einen Zeitgeber: Was zuerst fertig ist, gewinnt. Das
 * hängende Versprechen läuft im Hintergrund weiter, es interessiert nur
 * niemanden mehr. Ein `AbortController` wäre sauberer, aber `fetch` steckt
 * hier zwei Schichten tiefer in `drive.ts`, und eine Frist an der richtigen
 * Stelle ist besser als ein Umbau an der falschen.
 */
async function mitFrist<T>(arbeit: Promise<T>, ms: number): Promise<T> {
  let zeitgeber: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      arbeit,
      new Promise<never>((_, ablehnen) => {
        zeitgeber = setTimeout(() => ablehnen(new Error('drive_timeout')), ms)
      }),
    ])
  } finally {
    if (zeitgeber !== undefined) clearTimeout(zeitgeber)
  }
}

export function ResetPanelImpl({
  platform,
  dictionary,
}: {
  platform: Platform
  dictionary: Dictionary
}) {
  const t = dictionary.backup
  const reset = resetCopy()
  const [confirmWipe, setConfirmWipe] = useState(false)
  const [wipeDrive, setWipeDrive] = useState(false)
  const [wipePhrase, setWipePhrase] = useState('')
  const [busy, setBusy] = useState(false)
  /** Wurde gelöscht gedrückt, ohne dass das Wort dasteht? */
  const [missingPhrase, setMissingPhrase] = useState(false)
  /*
   * Zählt die Löschversuche. Ein Abbruch erhöht ihn, und ein noch laufender
   * Versuch erkennt daran, dass er nicht mehr gemeint ist: Er schreibt dann
   * weder eine Fehlermeldung noch springt er auf die nackte App.
   */
  const laufenderVersuch = useRef(0)
  const [failed, setFailed] = useState<string | undefined>(undefined)
  const phraseField = useRef<HTMLInputElement>(null)
  const goButton = useRef<HTMLButtonElement>(null)

  /*
   * Den Bestätigungsschritt ins Bild holen.
   *
   * Auf einem iPhone stand „Alles löschen" ganz unten am Rand — gemessen bei
   * 820 Pixeln in einem 852 Pixel hohen Fenster. Nach dem Antippen erschien
   * die Warnung gerade noch sichtbar, das Eingabefeld für das Wort aber bei
   * 936 und der eigentliche Löschknopf bei 967: **beide außerhalb des
   * Bildschirms**, und die Seite scrollte nicht mit. Am unteren Rand tauschte
   * sich nur eine Zeile aus. Es sah aus, als täte der Knopf nichts — so wurde
   * es auch gemeldet.
   *
   * Die beiden E2E-Tests dazu waren grün, weil Playwright vor jedem Klick von
   * sich aus scrollt. Sie sind den Weg also nie so gegangen wie ein Mensch mit
   * einem Telefon in der Hand.
   *
   * Der Schritt bleibt unbequem — das ist bei einer unwiderruflichen Löschung
   * Absicht (PRIVACY §8). Unbequem heißt aber „man muss etwas Bewusstes tun",
   * nicht „man muss erraten, dass es weiter unten weitergeht".
   *
   * ── Warum hier **kein** Fokus mehr gesetzt wird (02.09.) ────────────────
   *
   * Bis zum 02.09. sprang der Fokus von selbst ins Feld. Gut gemeint: ohne
   * Suchen ist klar, was dran ist. Auf einem Telefon fährt dadurch aber die
   * Tastatur hoch — und der **erste** Tipp daneben schließt nur sie. Er
   * erreicht keinen Knopf.
   *
   * Genau so wurde es gemeldet: „Ich drücke vergebens auf tout supprimer,
   * passiert nichts, und auch auf annuler, nada!" Der Tipp kam an. Er schloss
   * die Tastatur.
   *
   * Das Feld ins Bild zu holen bleibt — das war die Behebung von vorher und
   * sie stimmt. Wer tippen will, tippt das Feld an; dann öffnet die Tastatur
   * auf eine Absicht hin und nicht gegen eine.
   */
  useEffect(() => {
    if (!confirmWipe) return
    phraseField.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center',
    })
  }, [confirmWipe])

  const phraseComplete = wipePhrase.trim().toUpperCase() === 'ANITEW'

  /*
   * Und derselbe Griff noch einmal für den letzten Schritt.
   *
   * Sobald das Wort steht, ist der Löschknopf das Einzige, was noch fehlt —
   * er steht aber unmittelbar unter dem Eingabefeld, und auf einem Telefon
   * liegt dort die eingeblendete Tastatur. Eine Zusage, die man nur einlösen
   * kann, indem man die Tastatur erst wegwischt, ist dieselbe Sackgasse wie
   * vorher, nur eine Stufe später.
   *
   * `block: 'end'` holt ihn an die Unterkante des sichtbaren Bereichs — das
   * ist die Stelle, die über der Tastatur am ehesten frei bleibt.
   */
  useEffect(() => {
    if (!confirmWipe || !phraseComplete) return
    goButton.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'end',
    })
  }, [confirmWipe, phraseComplete])

  /**
   * Wie lange auf Google gewartet wird, bevor die App etwas sagt.
   *
   * Vorher gab es **keine** Frist. Der Nutzerbefund vom 02.09. las sich
   * zunächst wie zwei Fehler („Alles löschen tut nichts", „Abbrechen auch
   * nicht") und war einer: `disabled={busy}` steht auf beiden Knöpfen. Wer
   * „auch im Drive löschen" anhakt, schickt eine Anfrage los; antwortet
   * Google nicht, bleibt `busy` für immer wahr — und der Bildschirm ist tot,
   * ohne Spinner, ohne Satz, ohne Ausweg.
   *
   * Zwanzig Sekunden sind lang genug für eine müde Mobilverbindung und kurz
   * genug, dass niemand sie für einen Absturz hält.
   */
  const DRIVE_FRIST_MS = 20_000

  const resetFromScratch = async () => {
    setBusy(true)
    setFailed(undefined)
    const versuch = ++laufenderVersuch.current
    try {
      const drive = await import('../platform/web/drive.ts')
      if (wipeDrive) {
        const clientId = await resolveClientId(platform.settings)
        /*
         * Der Netzteil bekommt eine Frist. Alles danach ist lokal und schnell.
         *
         * Wichtig ist die Reihenfolge: Erst Google, dann löschen. Wäre es
         * umgekehrt, stünde man nach einer hängenden Anfrage ohne lokale Daten
         * und ohne gelöschte Sicherung da — das Schlechteste von beidem.
         */
        await mitFrist(
          (async () => {
            let token: string
            try {
              token = await drive.requestDriveToken(clientId, true)
            } catch (fehler) {
              /*
               * Ohne erteilte Drive-Freigabe liegt in Google Drive nichts von
               * ANITEW — es gibt also nichts zu löschen. Hier einen Fehler zu
               * zeigen hieße, jemandem eine gescheiterte Cloud-Löschung zu
               * melden, der nie eine Cloud-Kopie hatte.
               */
              if (
                typeof fehler === 'object' &&
                fehler !== null &&
                (fehler as { detail?: unknown }).detail === 'drive_scope_missing'
              ) {
                return
              }
              throw fehler
            }
            await drive.deleteDriveBackup(token)
          })(),
          DRIVE_FRIST_MS,
        )
        if (laufenderVersuch.current !== versuch) return
      }
      await wipeEverything()
      try {
        window.localStorage.clear()
        window.sessionStorage.clear()
      } catch {
        // Der eigentliche Nutzerdatenspeicher ist bereits gelöscht.
      }
      /*
       * Erst NACH `localStorage.clear()`: Bei einem Offline-Reset kann der
       * HttpOnly-OAuth-Cookie nicht sofort vom Worker gelöscht werden. Die
       * Logout-Schicht legt dann eine einzige technische Retry-Marke neu an,
       * die den Reset überlebt und beim nächsten Online-Start abgearbeitet
       * wird. Der Drive-Abgleich selbst ist durch die geleerte DB schon aus.
       */
      await disconnectGoogleAuthorization()
      if (laufenderVersuch.current !== versuch) return
      // Neustart auf der nackten App — wie nach der ersten Installation.
      window.location.replace('/')
    } catch {
      // Wer inzwischen abgebrochen hat, will keine Fehlermeldung mehr sehen.
      if (laufenderVersuch.current !== versuch) return
      setFailed(wipeDrive ? reset.cloudFailed : t.failed)
      setBusy(false)
    }
  }

  return (
    <div className="wipe wipe-reset">
      <h2>{reset.heading}</h2>
      <p className="hint">{reset.scope}</p>
      {confirmWipe ? (
        <>
          <p className="hint wipe-warn" role="alert">
            {t.wipeConfirm}
          </p>
          <label className="hint">
            <input
              type="checkbox"
              checked={wipeDrive}
              onChange={(event) => setWipeDrive(event.target.checked)}
              disabled={busy}
            />{' '}
            {reset.cloud}
          </label>
          <p className="hint">{wipeDrive ? reset.cloudNote : reset.keepCloud}</p>
          <label className="hint">
            <span>{reset.type}</span>
            <input
              ref={phraseField}
              className="wipe-confirm-input"
              type="text"
              value={wipePhrase}
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => {
                setWipePhrase(event.target.value)
                setMissingPhrase(false)
              }}
              disabled={busy}
            />
          </label>
          {missingPhrase && (
            <p className="hint wipe-missing" role="alert">
              {reset.type}
            </p>
          )}
          {/*
            Dass gearbeitet wird, muss man sehen. Vorher war der einzige
            Unterschied, dass die Knöpfe nicht mehr reagierten — und das sieht
            von außen genauso aus wie eine kaputte App.
          */}
          {busy && (
            <p className="hint wipe-busy" role="status">
              {reset.working}
            </p>
          )}
          <div className="backup-actions">
            {/*
              Nicht gesperrt, sondern auskunftsfähig (Gerätebefund 02.09.).

              Vorher stand hier `disabled={busy || !phraseComplete}`. Am Gerät
              hieß das: Der Knopf mit dem leuchtenden Rahmen sieht aus wie die
              Hauptaktion, und wer ihn drückt, bekommt nichts — keinen
              Hinweis, keine Bewegung, keine Auskunft, was fehlt. Ein
              gesperrter Knopf ist eine Auskunft, die niemand hört.

              Gelöscht wird weiterhin **nur** mit dem getippten Wort. Der
              Unterschied ist, dass die Bedingung jetzt gesagt wird, statt
              stumm zu gelten — und der Fokus springt dann ins Feld, weil ihn
              diesmal jemand angefordert hat.
            */}
            <button
              ref={goButton}
              type="button"
              className="quiet wipe-go"
              disabled={busy}
              onClick={() => {
                if (!phraseComplete) {
                  setMissingPhrase(true)
                  phraseField.current?.focus()
                  return
                }
                void resetFromScratch()
              }}
            >
              {t.wipe}
            </button>
            {/*
              Abbrechen ist **nie** gesperrt (Gerätebefund 02.09.).

              Hier stand `disabled={busy}`. Zusammen mit derselben Sperre am
              Löschknopf ergab das den gemeldeten Zustand: Wer „auch im Drive
              löschen" angehakt hatte und auf ein stummes Google traf, saß vor
              zwei toten Knöpfen. Abbrechen ist nichts Zerstörerisches — es
              muss immer gehen, gerade dann.

              Der Abbruch erhöht die Versuchsnummer; ein noch laufender
              Versuch sieht daran, dass er nicht mehr gemeint ist.
            */}
            <button
              type="button"
              className="quiet"
              onClick={() => {
                laufenderVersuch.current += 1
                setBusy(false)
                setConfirmWipe(false)
                setWipeDrive(false)
                setWipePhrase('')
                setMissingPhrase(false)
                setFailed(undefined)
              }}
            >
              {t.wipeCancel}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="hint">{t.wipeNote}</p>
          <div className="backup-actions">
            <button type="button" className="quiet" onClick={() => setConfirmWipe(true)}>
              {t.wipe}
            </button>
          </div>
        </>
      )}
      {failed !== undefined && (
        <p className="coach-failure" role="alert">
          {failed}
        </p>
      )}
    </div>
  )
}
