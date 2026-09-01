# Privacy policy

**As of: 2026-08-29**

<!-- verbindlich: de -->
> **The German version is the legally binding one.** This translation is provided for convenience. In case of any discrepancy, the German text at [/datenschutz.html](/datenschutz.html) applies.

> The short part first: **ANITEW stays local-first.** There is **no ANITEW account**,
> no advertising, no external analytics services and no trackers. Training,
> memories, measurements and profile stay on your device. Only features you
> explicitly switch on or trigger — Google Drive sync, AI features, photo
> analysis and system notifications — use the network services they need.

This document describes what the current version of ANITEW actually does.

---

## 1. Controller for data protection

Controller within the meaning of the General Data Protection Regulation (GDPR):

**ANITEW by Impekal**  
Owner: **Dr. Mèhèza Kalibani**  
Holstenwall 24  
20335 Hamburg  
Germany

E-mail: impekaltech+anitew@gmail.com  
Phone: +49 151 12784951

Further provider details are given in the [legal notice](/impressum.en.html).

## 2. What is stored on your device

Browser storage (mainly IndexedDB; alongside it localStorage/sessionStorage for device preferences such as theme, first-start markers and transient notices) holds, among other things:

| What | What for |
|---|---|
| Training sessions and answers | Repetition schedule and evaluations |
| Repetition dates | Due re-encounters |
| Measurements | Comparison within your own series of measurements |
| Your own memories, cards and memory palace | Personal training |
| Settings such as language, sound and reminder time | Next start |

These contents are **not** copied to an ANITEW server for Web Push.

ANITEW can additionally compute purely technical diagnostic information and
aggregated beta metrics on the device. They contain no memory texts, answer
contents, API keys or OAuth tokens and are **not transmitted automatically**.
A user has to export such a report explicitly before they can pass it on
voluntarily.

## 3. What ANITEW does not do

- No advertising, advertising ID or advertising profiling.
- No external analytics services, automatic usage statistics or trackers.
- No upload of your training or memory contents for push.
- No access to contacts or location.
- No continuous background recording of microphone or camera.
- No public leaderboard or social user profiles.

## 4. Microphone, dictation and photos

### Dictation

If you explicitly start the dictation feature, ANITEW may use the microphone for
**one short dictation**. Speech recognition is only started if the browser
confirms local speech recognition and supports `processLocally`. ANITEW
deliberately does **not** fall back to a remote browser speech service. If local
processing is unavailable, dictation stays off. The recognised text is treated
like text you typed yourself.

### Photo selection and camera

“Choose photo” opens the image/camera picker provided by the device. The chosen
original photo first stays as a transient local working copy in browser memory
and is not automatically stored in IndexedDB, backup or Google Drive.

Only when you additionally tap **“Analyse photo”** does ANITEW create a reduced
JPEG copy in the browser without file/EXIF metadata and send it directly to the
AI provider you chose and set up with your own API key. The original photo is not
sent to the provider. The AI answer is only a suggestion; nothing is stored until
you explicitly confirm it.

## 5. What happens technically when the app is loaded

The app is delivered via Cloudflare Workers/Static Assets. As with any web
server, technical connection data such as IP address, time, browser and file
request arise at the infrastructure provider. ANITEW builds no usage profile
from this.

**In plain words:** After loading, **the training itself works offline**.
Network access is only needed for online features you explicitly choose.
Drive sync, AI features and system notifications are off until you touch them.
Only an explicit activation or action starts the respective online path.

## 6. Backup and restore

“Save backup” creates a JSON file with your ANITEW state. You decide where it
goes. Whoever holds this file can read its contents.

**Not included in the backup** are device-bound values: stored AI API keys, the
device’s Google account display and the technical state of the Drive sync. They
leave the device neither in the file nor during Drive sync; even when reading an
older file that still contains such values, they are discarded.

With the optional Google Drive sync, ANITEW places the same backup file in a
dedicated `Anitew` folder of your Google Drive. ANITEW does not touch other
files.

## 7. System notifications / Web Push

If you explicitly tap “Allow notifications” and your device supports Web Push,
the browser creates a **technical push address** for this device. For delivery,
ANITEW stores on the server only:

- this technical push address,
- the identifier of the reminder (`daily` or `benchmark`),
- the due time,
- for the daily reminder the time of day and the IANA time zone,
- the generic notification text — also as a short delivery note that waits at
  the server after triggering until your device picks it up, but at most
  24 hours **from the due time** (60 minutes for the measurement reminder);
  after that it is deleted instead of delivered late. The period counts from
  the due time and does not restart with another delivery attempt. This period
  applies regardless of whether later reminders are still scheduled or whether
  the push service is currently unreachable. If neither an appointment nor a
  note remains, the entire server-side entry is deleted.

**Not stored for this purpose:** training answers, memory contents, profile,
name, e-mail address, measurements or backup files.

Storage takes place in a Cloudflare Durable Object derived solely from the push
address. There is no ANITEW user account for this and no cross-platform user ID.
The actual delivery path runs via the push service determined by the
browser/operating system (on Apple devices the corresponding Apple
infrastructure).

“No reminder” deletes the daily reminder. “Start over” attempts to delete the
server-side push entry and additionally revokes the local push subscription;
this invalidates the previous push address even if the server is currently
unreachable. Notification permission can also be withdrawn at any time in the
system/browser settings.

On iPhone and iPad, Web Push only works for a web app added to the home screen
on supported iOS/iPadOS versions. Where Web Push is unavailable on a device,
ANITEW promises no closed-app system notification and falls back to the note
“only while open”.

## 8. Deletion and portability

- **Portability:** “Save backup” exports your local state.
- **Complete restart:** “Start over” deletes the local ANITEW data, switches
  the Google sync off locally and revokes the push subscription. Optionally,
  ANITEW’s own backup file in your Google Drive can be deleted as well. If the
  OAuth worker is unreachable at the time of the restart, the technical browser
  sign-out is caught up at the next reachable start; a Drive sync cannot start
  in the meantime because its local switch has already been deleted.
- **Reminder off only:** “No reminder” ends the daily reminder without deleting
  your training data.

## 9. Google Drive sync

Google Drive is off until you switch it on yourself. Sign-in works via Google
OAuth. Alongside Drive access, ANITEW requests the Google basic information
(`openid email profile`) — only so the interface can show who you are connected
as. The Cloudflare Worker exchanges the Google authorisation code for tokens and
keeps the session — including the Google refresh token — encrypted in an
`HttpOnly` cookie of your browser. The lifetime is fixed at a maximum of 180 days
from sign-in; the period is **not** extended by use.

When you tap “Disconnect Google account”, the Drive sync is switched off
**immediately and permanently** on the device and the locally shown account
identity is removed. If the worker is reachable, it also deletes the HttpOnly
session cookie and attempts to revoke the Google token. If the worker is
temporarily unreachable — for example because the device is offline — the
browser cannot technically delete the HttpOnly cookie itself. ANITEW then only
notes this pending technical logout locally and retries it at the next start or
when the device comes back online. The Drive sync stays off in the meantime; the
left-over cookie alone does not activate it. Independently of this, the sealed
session ends at the latest with its fixed 180-day period.

**Transitional rule for older sign-ins:** Sessions created before this fixed
period was introduced carry no sign-in time within them; it cannot be determined
retrospectively and is not estimated either. Such sessions therefore expire at
the latest **30 days** after first use with the new version — shorter than any
remaining time they would have had before. After that a new sign-in is needed;
for it, the fixed 180-day period from sign-in then applies. There is no ANITEW
user database in which tokens would be held. The device then uses the access for
the ANITEW folder in your own Drive. Name/e-mail shown in the interface for
account control are held locally in ANITEW’s device storage and removed on
disconnect.

Google’s own privacy terms apply in addition.

## 10. AI features with your own API key

The coach and AI suggestions are off until you store your own key and explicitly
trigger a corresponding feature. For the text coach, Gemini, Anthropic, OpenAI,
Groq, OpenRouter or Mistral are supported depending on your selection. The
question and the numeric context described for it then go directly to the chosen
AI provider. Your own memory texts are only transmitted for an AI suggestion
feature that you trigger.

For photo analysis, only Gemini, Anthropic or OpenAI are supported. As described
in section 4, a prepared image copy is only transmitted after “Analyse photo”.

The API key stays on your device. For processing at the respective provider,
that provider’s privacy policy applies in addition.

## 11. Legal bases and storage periods

Insofar as ANITEW processes data only on your device, you determine its
existence through use, export and deletion. For voluntarily activated online
features, processing serves to provide the feature explicitly chosen in each
case. Concrete periods: the encrypted Google session cookie expires at the
latest 180 days after sign-in and is not extended by use. On sign-out the local
Drive sync ends immediately; the worker deletes the cookie on confirmed logout.
If the worker cannot be reached at that moment, precisely this technical logout
is retried at the next online start. Sessions from before the 180-day rule
expire, under the transitional rule in section 9, at the latest 30 days after
first use with the new version. Server-side push entries exist until the
appointment has been delivered and picked up, you end the reminder or the push
subscription ends — unfetched delivery notes for at most 24 hours (measurement
reminder: 60 minutes). Technical infrastructure logs and data at external
providers are additionally subject to their statutory and contractual retention
rules.

## 12. Your rights

Insofar as personal data is processed by the controller, you have, to the extent
provided by law, in particular the rights to information, rectification,
erasure, restriction of processing, data portability and objection. There is
also the right to lodge a complaint with a competent data protection supervisory
authority. The e-mail address given above is sufficient for enquiries.

## 13. Children

ANITEW has no chat function between users, no public leaderboard and no
advertising. The voluntary online features described above follow the same
technical rules regardless of age.

## 14. Changes

If the processing changes, this policy will be adapted with a new date. A feature
that transmits additional data must not appear silently under an old privacy
text.
