# Choose Your Own Adventure — Brainstorm

## Concept

Earth's sun is dying. So are the stars of every nearby solar system. Humanity's last hope is a distant planet — **15 years of travel away** — orbiting a stable, healthy star. You are one of the few chosen for the mission.

---

## Premise

- Earth's sun has entered an irreversible decay. Neighboring stars are following the same pattern.
- Scientists have identified **Planet Solace** (working title), 15 light-years away, whose star shows no signs of decay.
- A crew of **3** is assembled and launched on a one-way mission to assess if Planet Solace can sustain human life and relay the findings back to Earth.
- You are the mission commander. Your two crewmates are your only allies.

---

## Player & Crew

| Role | Character | Notes |
|---|---|---|
| **You** | Mission Commander | Narrator / player character |
| **Crewmate 1** | Engineer / Mechanic | Keeps the ship running |
| **Crewmate 2** | Biologist / Medic | Keeps the crew alive, assesses the planet |

> Crewmate names and personalities can be fleshed out during development. Their survival matters mechanically — the more crewmates alive, the easier certain challenges become.

---

## Core Mechanic — Crew Survival

- Choices throughout the journey put crewmates at risk or protect them.
- **More crewmates alive = more options, easier skill checks, higher mission success odds.**
- Losing a crewmate doesn't end the game but it narrows your path and makes later choices harder.
- You **always die** before the story ends — but before you do, you launch a **data probe back to Earth** carrying everything you learned.

---

## Story Structure

### Act 1 — Departure (Earth / Launch)
- Intro: the dying sun, the mission briefing, meet your crew.
- First choices: resource allocation, crew relationships, launch decisions.
- Establishes tone and which crewmates the player bonds with.

### Act 2 — The Journey (15 Years in Transit)
- Long-haul travel with periodic crises: equipment failures, rationing, interpersonal conflict, mysterious signals.
- Key branching choices that determine crewmate survival.
- A mid-journey anomaly hints at something waiting at the destination.

### Act 3 — Arrival at Planet Solace
- The planet assessment begins.
- Environmental dangers, unknown terrain, potential alien life signs.
- Final push to complete the mission and send data home.

### Act 4 — The Ending (Always: You Die)
- Every ending ends with your death, but the *context* of that death varies.
- Before dying, you launch the probe — ensuring your sacrifice was not in vain.

---

## Endings

| # | Ending | Condition | Outcome |
|---|---|---|---|
| 1 | **Mission Failed — Lost in Transit** | Ship catastrophically damaged en route | Crew lost, no data sent, Earth never hears back |
| 2 | **Mission Failed — Planet Uninhabitable** | Arrive but planet cannot sustain life | You send a "negative findings" probe, Earth loses hope |
| 3 | **Mission Partial Success** | Arrive, mixed findings, 1 crewmate survived | Probe sent with incomplete data, Earth has a slim chance |
| 4 | **Mission Success** | Both crewmates survive, planet confirmed habitable | Probe sent with full data, Earth begins evacuation planning |
| 5 | **True Ending — First Contact** | Special conditions met (see below) | You encounter an alien who helps you get home |

### True Ending — First Contact
- Hidden path unlocked only if **both crewmates are alive** and specific choices were made during the journey (curiosity over aggression, cooperation over dominance).
- An alien native to Planet Solace makes contact.
- They understand your mission and **provide additional fuel** to get you back to Earth.
- You survive the journey home — the only ending where you live.
- Earth receives not just data, but a living crew and a new ally.

---

## Themes

- Sacrifice vs. survival
- What does it mean to succeed when you don't make it back?
- Humanity's resilience in the face of extinction
- First contact as hope, not threat

---

## Locked Design Decisions (session: April 14, 2026)

### Tone
**Gritty sci-fi realism** — cold, tense, clinical. Reference points: *The Martian*, *Annihilation*. No purple prose. Let silence and physical detail do the work.

### Sun Decay Cause
**Natural entropy** — an unexplained cosmic phenomenon. No one is to blame. The horror is that it simply *is*.

### The Alien Species
**Afraid of you.** They've been watching since the ship entered orbit. First contact is not aggression — it's a terrified creature that has decided, despite the fear, not to run. The player must prove they mean no harm, mirroring humanity's own worst-case fear of meeting something unknown. Trust is earned through patience, restraint, and consistent non-threatening behavior (the cooperation track).

### Crewmates
| Role | Name | Background |
|---|---|---|
| Engineer / Mechanic | **Yusuf Osei** | Nigerian-British aerospace engineer. Grew up fixing fishing boats on the Ghanaian coast with his father. Calm under crisis, hands always moving. His family asked not to be told the mission's true stakes — they decided not knowing was the only way to cope. His left hand gets injured early in the journey and how well it heals depends on how well the Commander takes care of the crew. |
| Biologist / Medic | **Mara Chen** | Chinese-Canadian evolutionary biologist. Youngest person on the mission. Volunteered knowing Earth's collapse timeline means everyone she left behind won't survive to see the result. Channels grief into ferocious curiosity. Darkly funny. Keeps a voice journal addressed to her younger sister. |

### Medium
**Static HTML in `docs/`** — same tech stack and hosting (GitHub Pages) as the Cave of Time reader. File: `docs/lastlight.html` (self-contained).

### Mechanical Notes
- **Cooperation track**: Hidden score (0–6) tracking whether the Commander chooses patience, restraint, and crew welfare over expediency. Score ≥ 3 + signal investigated + both crew alive = True Ending unlocked.
- **Yusuf's injury**: If engineering supplies were not prioritized in Act 1, Yusuf injures his hand during the Year 3 EVA. If *also* the rationing crisis is handled poorly (cooperation low), his deteriorated health makes him vulnerable in the Year 14 storm.
- **Mara's death path**: If the Commander takes the aggressive "defensive perimeter" option at the alien markings (Act 3), and cooperation is below 0, the resulting confrontation costs Mara her life — leading to the incomplete-data endings.

### Story Graph Summary (20 nodes, 5 endings)
```
p01 → p02 [resources choice] → p03 → p04 [EVA choice]
  p04_you / p04_yusuf [conditional injury] → p05 [signal choice]
  p05a [investigated] → p06 [rationing choice]
  p06a [mara's plan] → p07 [storm choice]
  p07_yusuf / p07_mara / p07_you / p07_hold [ENDING 1]
  → p08 → p09 → p10 [markings choice]
  p10 → p10c [aggressive path, Mara at risk] or → p11
  p11 [True Ending gate or standard] → p11_contact → p11_contact2 → end_5
  p11 standard → p_probe → end_2 / end_3 / end_4
```

---

## Open Questions / Deferred

- [ ] Should the alien have a name / language? (deferred to post-v1)
- [ ] Does Mara's voice journal feature in the ending text? (yes, planned)
- [ ] Post-game stats / replayability features?
