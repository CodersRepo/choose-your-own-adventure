# Brainstorm: Choose Your Own Adventure Web App

## Project Goal

Build a publicly deployed web application that:
1. **Lets readers** experience The Cave of Time as an interactive story
2. **Lets authors** create, manage, and visualize branching narratives

---

## Core Concepts

### What We Already Have
- 100+ extracted story pages from "The Cave of Time" (OCR'd from PDF)
- A Mermaid-format story graph (`cot-story-graph.mmd`) with all transitions
- 45 pre-generated complete story paths (txt files)
- An SVG visualization of the story graph

### What We Need to Build
A web interface that uses those assets to create both a reader experience and an authoring tool.

---

## Feature Ideas

### 1. Reader Mode
The primary public-facing experience. Like a classic CYOA book, but in a browser.

**Core flow:**
- Land on the story start (page 2)
- Read a passage
- Presented with 2–3 choices, click one
- Navigate forward through the story
- Reach an ending (terminal page) — see an "The End" message

**Nice-to-haves:**
- Progress indicator ("You've made 5 choices")
- Breadcrumb trail showing path taken
- "Start over" button
- Highlight which pages you've already visited (avoid revisiting)
- Animated page transitions

### 2. Story Graph Visualization
An interactive view of the full branching structure.

**Ideas:**
- Use D3.js or Cytoscape.js to render the graph interactively
- Click a node to jump to that page in reader mode
- Color coding:
  - Green: terminal (ending) pages
  - Blue: main trunk (page 2 onward)
  - Gray: unvisited in current session
  - Yellow: currently at
- Show the current reader's path highlighted on the graph
- Zoom and pan support

### 3. Authoring Tool
A way to create and edit stories in the browser.

**Core features:**
- View all existing page nodes in the graph
- Click a node to edit its text
- Add a new node (page)
- Draw edges (choices) between nodes
- Label edges with choice text (e.g., "If you enter the cave, go to page 5")
- Mark a node as a terminal ending
- Export the graph as JSON for use in reader mode

**Stretch features:**
- Detect unreachable nodes (orphaned pages)
- Detect pages with no outgoing edges but not marked as endings
- Show "story statistics" — number of paths, average length, longest/shortest ending
- Side-by-side: text editor on left, graph on right

---

## Approach: Static vs. Dynamic

### Option A: Fully Static HTML (Simplest to deploy)
- Pre-convert all story pages and graph edges to a single `story-data.json`
- A single `index.html` loads that JSON and renders reader + graph views
- No server needed — deploy to GitHub Pages, Netlify, Vercel
- Authoring: local edits to JSON, regenerate static site

**Pros:** Simple, fast, free to host, no backend
**Cons:** Authoring requires manual JSON editing or a separate local tool

### Option B: Static Site with Client-Side Authoring (Medium complexity)
- Story data lives in `story-data.json`
- Reader mode reads from JSON
- Authoring tool edits JSON in memory and lets the user export/download the updated file
- No server: authors download the JSON, edit locally via the UI, re-upload

**Pros:** No backend, authoring-capable, deployable everywhere
**Cons:** No persistent save — authors must manage their JSON file manually

### Option C: Node.js/Express Backend (Most powerful)
- REST API to read/write story pages and graph edges
- Frontend: React or vanilla JS
- Authors can save changes directly to the server
- Can support multiple stories and users

**Pros:** Full authoring power, persistent storage
**Cons:** Requires hosting (Heroku, Railway, Render, etc.), more complexity

### Recommended Approach: Option B
Start with a fully static site (Option A) to get a deployed reader demo quickly.
Then layer in client-side authoring capabilities (Option B) so authors can work locally.

---

## Tech Stack Recommendations

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Vanilla JS + HTML/CSS | No build step, easiest to deploy, no dependencies |
| Graph viz | D3.js | Powerful, flexible, works with Mermaid-derived data |
| Styling | CSS custom properties + minimal framework | Consistent theming, no overhead |
| Data format | JSON (converted from .mmd + .txt files) | Easy to load, edit, export |
| Hosting | GitHub Pages | Free, version controlled, easy CI/CD |

---

## Data Model

Each "page" (story node) should be represented as:

```json
{
  "id": 2,
  "text": "You've hiked through Snake Canyon...",
  "choices": [
    { "text": "Start back home", "target": 4 },
    { "text": "Wait in the cave", "target": 5 }
  ],
  "isTerminal": false,
  "isTrunk": true
}
```

The full story is a `story-data.json` file:
```json
{
  "title": "The Cave of Time",
  "startPage": 2,
  "pages": { "2": { ... }, "3": { ... }, ... }
}
```

---

## UI/UX Ideas

### Reader Layout
- Left: story text (large, readable font, book-like feel)
- Bottom: choice buttons (styled like worn book tabs or buttons)
- Right sidebar: mini-map graph showing current position (optional/collapsible)

### Authoring Layout
- Top: toolbar (New Page, Save/Export, Stats)
- Center: interactive graph (click nodes to select)
- Right panel: selected node editor (text, choices, metadata)

### Visual Theme
- Aged parchment / book aesthetic for reader mode
- Clean, technical dark theme for authoring mode
- Toggle between reader and author views

---

## Coordination & Workflow

### Team Workflow
- Each member takes ownership of a different feature area
- Use GitHub Issues to track tasks
- `main` branch = deployable; use feature branches for development
- PR reviews before merging to main

### Brainstorming Sessions
1. Start with low-fidelity sketches / wireframes
2. Agree on data model (JSON structure) before coding
3. Build reader mode first (quickest win, sets the stage)
4. Then build graph viz
5. Authoring tool last (most complex)

### AI Assistance Strategy
- Use planning mode for architecture decisions
- Use agent mode for implementation
- Always read `Codebase.md` at the start of each AI session
- Log significant AI instructions in `AI-Instructions.md`
- Commit after each working feature milestone

---

## Open Questions

1. Should the deployed site use the existing Cave of Time story data, or allow uploading entirely new stories?
2. How much OCR cleanup do we want to do before deploying?
3. Do we want a persistent "save my progress" feature for readers (localStorage)?
4. Should the graph visualization be embedded in the reader, or a separate page/mode?
5. What's the MVP — reader-only first, or reader + graph together?
