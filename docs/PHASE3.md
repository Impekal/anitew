# ANITEW Phase 3 — The system remembers with you

Phase 3 turns the working Personal Memory System into an experience that feels unmistakably like ANITEW without inventing cognitive claims.

## Product rule

The app should feel alive because **real information returns at meaningful moments**, not because a dashboard animates.

Every visible claim must come from one of four existing truths:

1. FSRS — when an item is due.
2. MemoryGraph — what the item is and how it is connected.
3. Training history — what was actually practiced or recalled.
4. Benchmark — the only source for claims about measured long-term memory change.

No new "memory score", "brain age", health gauge, intelligence score or fake prediction is introduced.

## Signature moment 1 — Reencounter

When a personal MemoryGraph item is genuinely due according to FSRS, Today may surface one concrete return:

- the exact memory that returns;
- how many whole days it has been away since creation/last recall;
- the real Memory World it belongs to, when one exists.

Examples of the intended tone:

- “Madrid is back today — after 10 days.”
- “Cello returns today in the world around Mira.”
- “This is Daniel’s first return.”

The timing is never recomputed here. FSRS remains the only scheduler.

## Signature moment 2 — Living world

A reencounter should visually wake the existing node and its immediate relationships rather than spawn confetti or coins. The user should feel that a personal constellation has memory over time.

Motion requirements:

- one quiet arrival pulse on the returning node;
- one relationship trace toward its world anchor when present;
- no perpetual attention animation;
- `prefers-reduced-motion` removes all non-essential movement.

Sound requirements:

- use the existing synthetic/offline sound port;
- a reencounter may have one very short cue, distinct from success/reward;
- no downloaded audio and no casino-like reward sound.

## Signature moment 3 — Adaptive explanation

When the Daily Mission changes because of due personal material, interference or a genuinely undertrained delayed dimension, the UI explains the reason in one sentence. It must never call a training opportunity a measured weakness.

## Signature moment 4 — Afterglow

After a successful delayed recall of a personal item, the system may briefly show that the same node has just been revisited. The graph update already exists; Phase 3 should make the event visible without creating a second progress currency.

## Architectural constraints

- Keep the existing Session Engine.
- Keep FSRS as the only scheduling source.
- Keep MemoryGraph as content/relationship state only.
- Do not infer exact node status for legacy Memory items without stable graph IDs.
- Keep all deterministic selection logic in browser-free core TypeScript.
- Local-first remains the default; no network call is required for the signature experience.
- Optional AI continues to pass through explicit human confirmation before MemoryGraph persistence.

## First implementation slice

`src/core/memory/reencounter.ts` provides a pure selector for one factual due reencounter. It is deliberately small: selection first, visual language second. Tests must prove that it:

1. chooses only a genuinely due FSRS item;
2. resolves only stable graph IDs;
3. returns the actual MemoryGraph node;
4. derives elapsed days only from recorded timestamps;
5. returns an existing Memory World anchor without inventing relationships;
6. returns nothing for legacy ID-less items rather than guessing by label.

Phase 3 is successful when a user opens ANITEW and occasionally experiences a real piece of their own world returning — in a way no generic brain-game dashboard could imitate.
