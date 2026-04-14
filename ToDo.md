# To-Do — Choose Your Own Adventure: *Last Light*

> This project has two parallel tracks:
> 1. **The Game** — an original CYOA story (the dying-sun space mission from Brainstorm.md)
> 2. **The Platform** — a web-based authoring + reader tool (per Fork-Instructions.md)
>
> Work on the game first to validate the platform's requirements.

---

## Track 1 — Story Design & Writing

### 1.1 Resolve Open Questions (before writing)
- [x] Name the two crewmates and write a 1-paragraph backstory for each — **Yusuf Osei** (Engineer) and **Mara Chen** (Biologist). See `Brainstorm.md`.
- [x] Decide what causes the sun decay — **Natural entropy**, unexplained and nobodyless.
- [x] Define the alien species — **Afraid of you**. Small, watching. Trust earned through restraint and patience.
- [x] Decide how the player earns the alien's trust — hidden **cooperation score** (≥3) + signal investigated + both crew alive.
- [x] Lock the planet name — **Planet Solace** (KOI-3284b, star HR 7672).
- [x] Choose the medium — **Static HTML** in `docs/lastlight.html`.
- [x] Decide tone — **Gritty sci-fi realism** (*The Martian* / *Annihilation*).

### 1.2 Design the Choice Architecture
- [x] Map out all major decision points across the 4 acts — **20 nodes** across 4 acts. See `Codebase.md` story map.
- [x] Assign each decision point a page/node ID — `p01`–`p11`, `p_probe`, `e1`–`e5`. See story map.
- [x] Define which decisions risk crewmate lives and which protect them — see `Brainstorm.md` mechanical notes.
- [x] Define the hidden "cooperation track" conditions required to unlock the True Ending — 4 opportunities, need ≥3.
- [x] Story graph documented in `Brainstorm.md` and `Codebase.md`.
- [x] Every path leads to one of the 5 defined endings.

### 1.3 Write Act 1 — Departure
- [x] p01 — Opening: the dying sun, mission briefing
- [x] p02 — Meet Yusuf and Mara; resource allocation choice
- [x] p03 — Launch sequence

### 1.4 Write Act 2 — The Journey (15 Years in Transit)
- [x] p04 / p04_you / p04_yusuf — Year 3 oxygen recycler breach; EVA choice; Yusuf's potential injury
- [x] p05 / p05a — Year 7 mysterious signal; investigation or ignore
- [x] p06 / p06a — Year 12 rationing crisis; equal or Mara's plan
- [x] p07 / p07_yusuf / p07_mara / p07_you — Year 14 particle storm; four choices, one ending
- [x] Cooperation track choices woven throughout Act 2
- [x] Mid-journey anomaly (p05a) hints at alien presence

### 1.5 Write Act 3 — Arrival at Planet Solace
- [x] p08 — Year 15 orbital approach
- [x] p09 — First steps on the surface
- [x] p10 / p10_defense — The Markings; 3 choices, aggressive path risks Mara
- [x] p11 — Final survey; True Ending gate or standard path
- [x] p11_contact / p11_contact2 — First contact scene (True Ending only)

### 1.6 Write Act 4 — Endings
- [x] Ending 1 (e1_lost): *Lost in Transit* — hold position during storm, ship destroyed
- [x] Ending 2 (e2_negative): *Negative Findings* — both crew dead, ambiguous data
- [x] Ending 3 (e3_partial): *Partial Success* — one crewmate alive, partial data
- [x] Ending 4 (e4_success): *Mission Success* — both alive, full data
- [x] Ending 5 (e5_true): *First Contact* — alien provides fuel, crew makes it home

### 1.7 Story Review
- [ ] Play-test every major path end-to-end
- [ ] Verify crew survival state is tracked correctly across all branches
- [ ] Verify True Ending is only reachable via correct conditions
- [ ] Proofread all prose

---

## Track 2 — Story Graph & Scripts

### 2.1 Adapt Existing Scripts for the New Story
- [ ] Decide whether to reuse `build_story_graph.py` or write a new graph builder for hand-authored pages
- [ ] Write a graph builder that reads the new story's page files and extracts "turn to page X" edges
- [ ] Generate `output/lastlight-story-graph.mmd` from the new page files
- [ ] Render `output/lastlight-story-graph.svg` using `render_story_graph_svg.py`
- [ ] Add a `crewmate_alive` edge label/color scheme to distinguish safe vs. deadly branches

### 2.2 Validate the Story Graph
- [ ] Confirm all 5 endings appear as terminal nodes
- [ ] Confirm no unintended orphan nodes or dead ends exist
- [ ] Confirm the True Ending node is only reachable through the cooperation-track path
- [ ] Run `write_all_stories.py` equivalent on the new graph to enumerate all possible playthroughs

---

## Track 3 — Web Platform (Authoring + Reader)

### 3.1 Reader Interface
- [x] Design the reader UI: dark gritty space aesthetic, Georgia serif body text
- [x] Implement static-HTML reader (`docs/lastlight.html`, fully self-contained)
- [x] Crew survival tracker (top-right, color-coded: alive/injured/lost)
- [ ] Add a "cooperation track" dev indicator (visible only in dev mode / URL param)
- [x] Styled to match the gritty tone of the story

### 3.2 Authoring Tool (from Fork-Instructions.md)
- [ ] Design the authoring UI: upload a page, define choices, link to other pages
- [ ] Implement interactive story graph visualization (click a node to edit that page)
- [ ] Highlight unfinished/orphan nodes so authors can see what's incomplete
- [ ] Highlight terminal/ending nodes distinctly
- [ ] Support importing the existing Mermaid `.mmd` graph format
- [ ] Support exporting the story graph as SVG and as a playable HTML reader

### 3.3 Infrastructure
- [ ] Choose a tech stack for the web app (e.g. Next.js, plain HTML/JS, etc.)
- [ ] Set up project scaffolding and a `package.json` / `requirements.txt`
- [ ] Deploy a live demo (GitHub Pages, Vercel, or similar)

---

## Track 4 — Documentation & Housekeeping

- [ ] Update `README.md` to mention the new original story project alongside Cave of Time
- [x] Update `Codebase.md` with Last Light game architecture, story map, and state model
- [ ] Add a `CHANGELOG.md` entry when major milestones are hit
- [ ] Keep `AI-Instructions.md` up to date with each session's instructions (per existing convention)

---

## Priority Order (suggested)

1. Resolve open questions (1.1)
2. Design choice architecture + story graph sketch (1.2)
3. Write Act 1 & 2 (1.3, 1.4)
4. Build story graph from new pages (2.1, 2.2)
5. Write Act 3 & 4 / all endings (1.5, 1.6)
6. Story review (1.7)
7. Static HTML reader (3.1)
8. Authoring tool (3.2, 3.3)
