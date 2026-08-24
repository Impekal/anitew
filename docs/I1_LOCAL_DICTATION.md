# I1 — Local-only dictation

ANITEW may use browser speech recognition for own material only when the browser can prove that recognition runs on-device.

The runtime therefore requires all of the following before recording starts:

- a SpeechRecognition implementation,
- the static on-device availability check,
- `available({ processLocally: true }) === "available"`,
- an instance that exposes and accepts `processLocally = true`.

There is deliberately no remote/cloud fallback. If any of those checks fails, dictation is reported as unavailable and no recording starts.

## UI wiring

**Eigene Inhalte / Your material** exposes one dictation action next to the existing text entry. The action:

- uses the selected training language for recognition,
- appends recognised text to the current draft instead of replacing it,
- disables itself while one recognition turn is active,
- reports unavailable/failed states without altering the draft,
- keeps all visible dictation copy aligned with the interface language,
- never stores audio and never opts into a cloud speech fallback.

The same card preview and explicit **Karten übernehmen / Add cards** confirmation still sit between dictated text and saved training material. Dictation therefore changes input convenience, not the existing consent or storage boundary.
