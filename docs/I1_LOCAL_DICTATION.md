# I1.1 — Local-only dictation runtime

ANITEW may use browser speech recognition for own material only when the browser can prove that recognition runs on-device.

The runtime therefore requires all of the following before recording starts:

- a SpeechRecognition implementation,
- the static on-device availability check,
- `available({ processLocally: true }) === "available"`,
- an instance that exposes and accepts `processLocally = true`.

There is deliberately no remote/cloud fallback. If any of those checks fails, dictation is reported as unavailable and no recording starts.

This slice does not yet add the button to **Eigene Inhalte**. UI wiring and translated copy follow separately so the privacy gate can be reviewed and tested in isolation first.
