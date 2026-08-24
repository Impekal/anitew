# I1 — Local input boundaries

ANITEW accepts own material through text, on-device dictation and a local photo reference. None of these convenience inputs may silently create saved training material: the existing card preview and explicit **Karten übernehmen / Add cards** confirmation remain the storage boundary.

## Local-only dictation

ANITEW may use browser speech recognition for own material only when the browser can prove that recognition runs on-device.

The runtime therefore requires all of the following before recording starts:

- a SpeechRecognition implementation,
- the static on-device availability check,
- `available({ processLocally: true }) === "available"`,
- an instance that exposes and accepts `processLocally = true`.

There is deliberately no remote/cloud fallback. If any of those checks fails, dictation is reported as unavailable and no recording starts.

**Eigene Inhalte / Your material** exposes one dictation action next to the existing text entry. The action:

- uses the selected training language for recognition,
- appends recognised text to the current draft instead of replacing it,
- disables itself while one recognition turn is active,
- reports unavailable/failed states without altering the draft,
- keeps all visible dictation copy aligned with the interface language,
- never stores audio and never opts into a cloud speech fallback.

## Local photo reference

A selected or captured photo is deliberately a **temporary visual reference**, not a stored ANITEW object and not fake OCR.

- The browser exposes it to the panel through a `blob:` object URL only.
- ANITEW never writes the photo bytes to IndexedDB, backup or Drive sync.
- Reloading or leaving the mounted panel destroys the reference; replacing/removing it revokes the old object URL.
- The photo is never sent to a coach/AI provider.
- Only image MIME types up to 15 MB are accepted, avoiding accidental giant in-memory files.
- The user can type or locally dictate facts while looking at the photo; only the resulting text enters the normal preview/confirmation flow.

Automatic extraction from a photo belongs to the later MEMORY MODE (I3). It must preserve the same rule as text/AI suggestions: **suggest first, human confirms before anything becomes training material**. Adding a large OCR dependency to the cold-start bundle or silently uploading an image would violate ANITEW's local-first and performance rules.
