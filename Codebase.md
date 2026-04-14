# Codebase Notes

## Purpose

This workspace has two goals:

1. **Data pipeline**: Extract text from the scanned PDF of *The Cave of Time*, build a story graph from extracted pages, write all possible bounded story paths, and render the graph as SVG.
2. **Web application**: A publicly deployable website with a reader mode (play the story) and an authoring tool (create/edit branching stories).

---

## Project Structure

```
choose-your-own-adventure/
├── samples/
│   └── the-cave-of-time.pdf         # Source PDF (two-page spread scan)
├── scripts/                          # Python data pipeline scripts
│   ├── reextract_cot_ocr_split.py
│   ├── build_story_graph.py
│   ├── write_all_stories.py
│   ├── render_story_graph_svg.py
│   └── generate_web_data.py         # Generates docs/story-data.json
├── output/                           # Generated pipeline artifacts
│   ├── cot-pages-ocr-v2/            # Canonical extracted page text files (*.txt)
│   ├── cot-story-graph.mmd          # Mermaid graph of all story transitions
│   ├── cot-story-graph.svg          # SVG visualization of the story graph
│   └── cot-stories/                 # 45 complete bounded story paths
│       ├── story-0001.txt
│       └── ...
├── docs/                             # Web application (served via GitHub Pages)
│   ├── index.html                   # Cave of Time reader mode
│   ├── style.css                    # Shared styles for Cave of Time reader
│   ├── reader.js                    # Cave of Time reader logic
│   ├── story-data.json              # Cave of Time web-ready story data
│   └── lastlight.html               # Last Light — original CYOA game (self-contained)
├── AI-Instructions.md               # Human-authored instructions given to AI (do not edit)
├── Codebase.md                      # This file — read first when resuming work
├── Brainstorm.md                    # Story design decisions, world-building, story graph
├── ToDo.md                          # Prioritized task list
└── README.md                        # Project overview and deployment info
```

---

## Canonical Source of Truth

The canonical extracted page set is:
- `output/cot-pages-ocr-v2`

Do not use the older `cot-pages` extraction workflow — it had bad OCR and was removed.

---

## Important PDF Mapping

The scan is a two-page spread layout.

Story start mapping:
- PDF page 8 contains story page 2 on the left and story page 3 on the right
- PDF page 9 contains story page 4 on the left and story page 5 on the right

The story begins on story page 2 with:
- "You've hiked through Snake Canyon once before ..."

Do **not** confuse story page numbers with PDF page numbers.

---

## Data Pipeline Scripts (in `scripts/`)

### reextract_cot_ocr_split.py

Re-extracts story pages from the PDF using OCR on left/right halves of each PDF spread page.

```bash
python3 scripts/reextract_cot_ocr_split.py \
  --pdf samples/the-cave-of-time.pdf \
  --pdf-start-page 8 \
  --pdf-end-page 66 \
  --story-start-page 2 \
  --output-dir output/cot-pages-ocr-v2
```

### build_story_graph.py

Builds Mermaid graph output from the corrected OCR page files.

```bash
python3 scripts/build_story_graph.py \
  --pages-dir output/cot-pages-ocr-v2 \
  --output output/cot-story-graph.mmd
```

Notes:
- Reads explicit "turn to page X" choices from page text
- Adds sequential continuation edges for pages that continue onto the next numbered page before any explicit choice appears

### write_all_stories.py

Writes all possible bounded stories from the graph.

```bash
python3 scripts/write_all_stories.py \
  --graph output/cot-story-graph.mmd \
  --pages-dir output/cot-pages-ocr-v2 \
  --start-page 2 \
  --max-decisions 20 \
  --output-dir output/cot-stories
```

Important behavior:
- Starts from story page 2
- Stops on cycles
- Stops if decision points exceed 20
- Clears old story-*.txt files in the target output directory before writing new ones

### render_story_graph_svg.py

Renders the Mermaid graph to SVG without external layout tools.

```bash
python3 scripts/render_story_graph_svg.py \
  --graph output/cot-story-graph.mmd \
  --output output/cot-story-graph.svg
```

Current visual behavior:
- Uses a layered Sugiyama-style layout with iterative barycenter ordering
- Colors terminal pages differently
- Highlights the main trunk from page 2

### generate_web_data.py (to be created)

Converts pipeline outputs into a web-ready JSON file for the web application.

```bash
python3 scripts/generate_web_data.py \
  --pages-dir output/cot-pages-ocr-v2 \
  --graph output/cot-story-graph.mmd \
  --output docs/story-data.json
```

Output format (`docs/story-data.json`):
```json
{
  "title": "The Cave of Time",
  "startPage": 2,
  "pages": {
    "2": {
      "id": 2,
      "text": "You've hiked through Snake Canyon...",
      "choices": [
        { "text": "Start back home", "target": 4 },
        { "text": "Wait in the cave", "target": 5 }
      ],
      "isTerminal": false,
      "isTrunk": true
    }
  }
}
```

---

## Web Application (to be built in `docs/`)

### Reader Mode (`docs/index.html` + `docs/reader.js`)

- Loads `story-data.json` via `fetch()`
- Displays one page at a time
- Renders choice buttons that navigate to target pages
- Shows terminal pages as story endings
- Saves reading progress to `localStorage`

### Graph Visualization (`docs/graph.html` + `docs/graph.js`)

- Renders interactive story graph using D3.js v7
- Color-codes nodes: terminal (red), trunk (blue), regular (gray)
- Click a node to jump to that page in reader mode
- Highlights current reading path

### Authoring Tool (`docs/author.html` + `docs/author.js`)

- Split-pane layout: interactive graph + text editor panel
- Edit page text, choices, and metadata in-browser
- Export modified `story-data.json` for download

---

## Current Canonical Outputs

Keep these:
- `output/cot-pages-ocr-v2`
- `output/cot-story-graph.mmd`
- `output/cot-story-graph.svg`
- `output/cot-stories`

These older directories were deleted because they were exploratory or obsolete:
- `output/cot-pages`
- `output/cot-pages-reextract`
- `output/cot-stories-from-page-02`
- `output/cot-stories-start10`
- `output/tmp`

---

## Current Known State

At the end of the initial session (April 8, 2026):
- The corrected OCR v2 extraction produced story pages in `output/cot-pages-ocr-v2`
- The graph was rebuilt from OCR v2 pages and saved to `output/cot-story-graph.mmd`
- The bounded story writer generated 45 stories into `output/cot-stories`
- The graph SVG was rendered to `output/cot-story-graph.svg`

Work begun April 13, 2026:
- Created `Brainstorm.md` with web app design ideas, tech stack, and data model
- Created `ToDo.md` with prioritized AI task list
- Updated `Codebase.md` (this file) with full project architecture
- Created `scripts/generate_web_data.py` — converts pipeline outputs to `docs/story-data.json`
- Created `docs/index.html`, `docs/style.css`, `docs/reader.js` — fully functional reader mode
- `docs/story-data.json` generated: 111 pages, 44 terminal endings, 35 branching-choice pages

Work done April 14, 2026:
- Locked all design decisions for *Last Light* original story (see `Brainstorm.md`)
- Created `docs/lastlight.html` — complete, self-contained *Last Light* game
  - 20 story nodes across 4 acts
  - 5 endings (Lost in Transit, Negative Findings, Partial Success, Mission Success, True Ending)
  - Crew survival tracking (Yusuf Osei, Mara Chen)
  - Hidden cooperation score (0–6) gating the True Ending
  - State-driven conditional text and branching
  - Gritty dark UI, no external dependencies

---

## Tech Stack

| Layer | Technology |
|---|---|
| Data pipeline | Python 3 (no web framework) |
| Web frontend | Vanilla HTML/CSS/JavaScript (no build step) |
| Graph visualization | D3.js v7 (CDN) |
| Data format | JSON (`docs/story-data.json`) |
| Hosting | GitHub Pages |

---

## Caveats

OCR is improved but not perfect.
- Some pages still have minor OCR noise
- Page continuations across spreads are important; graph construction relies on sequential edges when no explicit choice appears
- Story page numbers, not PDF page numbers, control graph edges and story traversal

---

## Last Light — Original Story Game

### File
`docs/lastlight.html` — fully self-contained (HTML + CSS + JS in one file, no external dependencies, no build step).

### Architecture
- Story data is a plain JS object (`PAGES`) keyed by page ID.
- State is a plain JS object (`S`): `page`, `yusuf`, `mara`, `cooperation`, `resources`, `irradiated`, `investigatedSignal`.
- Each page can have `textFn(state)` and `choicesFn(state)` for conditional content.
- Each page can have `enter(state)` — runs before render, modifies state in place (e.g. Yusuf's injury, Yusuf's death, Mara's death).
- Choices can have `effect(state)` — runs on click before navigation (e.g. cooperation++, resources assignment).
- `renderPage(id)` handles the full render loop: enter hook → state update → crew status → HTML injection → event binding.

### Story Map
| Node | Act | Description |
|------|-----|-------------|
| p01 | 1 | The Briefing (linear) |
| p02 | 1 | Crew & Cargo — CHOICE: resource allocation |
| p03 | 1 | Launch (linear) |
| p04 | 2 | Year 3 Breach — CHOICE: you go EVA or Yusuf goes |
| p04_you | 2 | You patch the seal (safe) |
| p04_yusuf | 2 | Yusuf goes; injured if resources ≠ eng |
| p05 | 2 | Year 7 Signal — CHOICE: investigate (+coop, +signal flag) or ignore |
| p05a | 2 | Debris field investigation |
| p06 | 2 | Year 12 Rationing — CHOICE: equal or Mara's plan (+coop) |
| p06a | 2 | Mara's plan confirmed |
| p07 | 2 | Year 14 Storm — CHOICE: Yusuf/Mara/You/Hold |
| p07_yusuf | 2 | Yusuf goes; may die if injured + coop < 2 |
| p07_mara | 2 | Mara goes; survives |
| p07_you | 2 | You go; irradiated = true, +coop |
| e1_lost | 4 | ENDING 1: Hold position — ship destroyed |
| p08 | 3 | Year 15 Approach (linear) |
| p09 | 3 | First Steps (linear) |
| p10 | 3 | The Markings — CHOICE: withdraw (+coop), document, or defend (−coop) |
| p10_defense | 3 | Defensive perimeter; Mara dies if coop < 0 |
| p11 | 3 | Final survey; branches to True Ending or probe launch |
| p11_contact | 3 | First Contact (True Ending path only) |
| p11_contact2 | 3 | Understanding / propellant gift |
| p_probe | 4 | Probe launch (conditional text; routes to ending) |
| e2_negative | 4 | ENDING 2: Mara dead, data incomplete |
| e3_partial | 4 | ENDING 3: One crewmate alive, partial data |
| e4_success | 4 | ENDING 4: Both alive, full data |
| e5_true | 4 | ENDING 5 (True): First Contact, you go home |

### True Ending Unlock Conditions
All of the following must be true at p11:
- `yusuf !== 'dead'`
- `mara !== 'dead'`
- `cooperation >= 3`
- `investigatedSignal === true`

### Cooperation Points Available
| Choice | Points |
|--------|--------|
| p05: Investigate signal | +1 |
| p06: Mara's rationing plan | +1 |
| p07: Send yourself to storm | +1 |
| p10: Leave markings undisturbed | +1 |
| p10: Defensive perimeter | −1 |
| p11: First contact approach (any of 3 choices) | +1 (post-gate) |

---

## Next-Time Guidance

When resuming work:
1. Read this file first.
2. Read `ToDo.md` for the current task list.
3. Read `Brainstorm.md` for design context.
4. For Cave of Time work: treat `output/cot-pages-ocr-v2` as the canonical source.
5. All new web code goes in the `docs/` directory.
6. Run `generate_web_data.py` before testing the Cave of Time web app.
7. For *Last Light* work: all story content and logic is in `docs/lastlight.html`.
8. If extraction quality needs improvement, update `reextract_cot_ocr_split.py` rather than rebuilding older workflows.
9. If graph or story outputs need regeneration, rerun `build_story_graph.py`, `write_all_stories.py`, and `render_story_graph_svg.py` in that order.
