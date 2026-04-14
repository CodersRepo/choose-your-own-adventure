# Choose Your Own Adventure

An interactive fiction platform built on top of *The Cave of Time* (1979), extended with an original story — *Last Light* (2026).

## 🌐 Deployed Website

**[https://codersrepo.github.io/choose-your-own-adventure/](https://codersrepo.github.io/choose-your-own-adventure/)**

| Page | URL |
|---|---|
| Story Library (home) | [/](https://codersrepo.github.io/choose-your-own-adventure/) |
| The Cave of Time | [/cot.html](https://codersrepo.github.io/choose-your-own-adventure/cot.html) |
| Last Light (original) | [/lastlight.html](https://codersrepo.github.io/choose-your-own-adventure/lastlight.html) |

## 📁 GitHub Repository

**[https://github.com/CodersRepo/choose-your-own-adventure](https://github.com/CodersRepo/choose-your-own-adventure)**

## 👥 Team

- CodersRepo

## 📖 About the Stories

### The Cave of Time
A classic CYOA digitized from the 1979 Edward Packard original. The PDF was OCR-extracted, parsed into 111 story pages, and assembled into a branching graph with 44 distinct endings. The web reader lets you navigate choices exactly as you would in the physical book.

### Last Light (Original)
An original gritty sci-fi CYOA written for this project. You command humanity's final mission to Planet Solace as Earth's sun dims — a 15-year voyage with two crewmates, impossible resource choices, and a hidden alien contact mechanic that unlocks a secret fifth ending.

- 20 story nodes across 4 acts
- 5 endings (including a hidden True Ending)
- Crew survival tracking (Yusuf Osei, Mara Chen)
- Hidden cooperation score gates the First Contact ending

> **Dev mode**: append `?dev=1` to the Last Light URL to see the live cooperation score and page ID as you play.

## 🛠 How to Regenerate the Cave of Time Data

```bash
# Re-extract OCR pages from PDF
python3 scripts/reextract_cot_ocr_split.py \
  --pdf samples/the-cave-of-time.pdf \
  --pdf-start-page 8 --pdf-end-page 66 \
  --story-start-page 2 --output-dir output/cot-pages-ocr-v2

# Rebuild story graph
python3 scripts/build_story_graph.py \
  --pages-dir output/cot-pages-ocr-v2 \
  --output output/cot-story-graph.mmd

# Generate web data
python3 scripts/generate_web_data.py \
  --pages-dir output/cot-pages-ocr-v2 \
  --graph output/cot-story-graph.mmd \
  --output docs/story-data.json
```

## 📂 Project Structure

```
docs/               ← GitHub Pages root
  index.html        ← Story library landing page
  cot.html          ← Cave of Time reader
  lastlight.html    ← Last Light game (self-contained)
  style.css         ← Cave of Time styles
  reader.js         ← Cave of Time reader logic
  story-data.json   ← Cave of Time structured data (111 pages)
scripts/            ← Python data pipeline
output/             ← Generated artifacts (graph, stories, OCR pages)
samples/            ← Source PDF
```
