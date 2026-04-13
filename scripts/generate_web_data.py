#!/usr/bin/env python3
"""Generate docs/story-data.json from pipeline outputs.

Reads:
  - output/cot-pages-ocr-v2/*.txt  (canonical story page text)
  - output/cot-story-graph.mmd     (story graph with transitions)

Writes:
  - docs/story-data.json            (web-ready structured story data)

Usage:
    python3 scripts/generate_web_data.py \
        --pages-dir output/cot-pages-ocr-v2 \
        --graph output/cot-story-graph.mmd \
        --output docs/story-data.json
"""

from __future__ import annotations

import argparse
import json
import re
from collections import deque
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

PAGE_FILE_RE = re.compile(r"^(\d+)-CoT\.txt$")
MMD_EDGE_RE = re.compile(r"^\s*P(\d+)\s*-->\s*P(\d+)")
MMD_NODE_RE = re.compile(r'^\s*P(\d+)\["(\d+)"\]')

# Matches "If you [choice text across lines], turn/tum to page N"
CHOICE_BLOCK_RE = re.compile(
    r"If\s+you\s+((?:(?!If\s+you)[^\n]|\n(?!\n))+?)"
    r"\s*[,.]?\s*\n?\s*(?:turn|tum|go)\s+to\s+page\s+(\d+)",
    re.IGNORECASE,
)

# Simpler fallback: any "turn to page N" mention
TURN_TO_RE = re.compile(
    r"(?:turn|tum|go)\s+to\s+page\s+(\d+)",
    re.IGNORECASE,
)

TERMINAL_RE = re.compile(r"\bthe\s+end\b", re.IGNORECASE)


def normalize_page_text(raw: str) -> str:
    """Strip the leading 'Page N' header and clean up OCR hyphenation."""
    # Remove leading "Page N\n" header
    text = re.sub(r"^Page\s+\d+\s*\n", "", raw.strip())
    # Rejoin OCR soft-hyphen line breaks (e.g. "some-\nword" -> "someword")
    text = re.sub(r"-\n(\S)", r"\1", text)
    return text.strip()


def parse_pages(pages_dir: Path) -> Dict[int, str]:
    pages: Dict[int, str] = {}
    for path in sorted(pages_dir.glob("*-CoT.txt")):
        m = PAGE_FILE_RE.match(path.name)
        if not m:
            continue
        page_num = int(m.group(1))
        raw = path.read_text(encoding="utf-8", errors="ignore")
        pages[page_num] = normalize_page_text(raw)
    return pages


def parse_graph(mmd_path: Path) -> Tuple[Set[int], Dict[int, List[int]]]:
    """Return (all_nodes, edges) where edges[src] = [dst, ...]."""
    nodes: Set[int] = set()
    edges: Dict[int, List[int]] = {}

    for line in mmd_path.read_text(encoding="utf-8").splitlines():
        m = MMD_NODE_RE.match(line)
        if m:
            nodes.add(int(m.group(1)))
            continue
        m = MMD_EDGE_RE.match(line)
        if m:
            src, dst = int(m.group(1)), int(m.group(2))
            edges.setdefault(src, []).append(dst)
    return nodes, edges


def extract_choice_text(text: str, target: int) -> Optional[str]:
    """Extract the 'If you ...' choice label for a given target page."""
    for m in CHOICE_BLOCK_RE.finditer(text):
        if int(m.group(2)) == target:
            label = m.group(1).strip()
            # Collapse whitespace / newlines inside the label
            label = re.sub(r"\s+", " ", label)
            # Capitalise first letter
            if label:
                label = label[0].upper() + label[1:]
            return label
    return None


def detect_trunk(edges: Dict[int, List[int]], start: int = 2) -> Set[int]:
    """Follow the first outgoing edge from each page to find the main trunk."""
    trunk: Set[int] = set()
    page: Optional[int] = start
    visited: Set[int] = set()
    while page is not None and page not in visited:
        trunk.add(page)
        visited.add(page)
        targets = edges.get(page, [])
        page = targets[0] if targets else None
    return trunk


def build_story_data(
    pages: Dict[int, str],
    nodes: Set[int],
    edges: Dict[int, List[int]],
    start_page: int = 2,
    title: str = "The Cave of Time",
) -> dict:
    terminal_pages = {p for p in nodes if p not in edges}
    trunk_pages = detect_trunk(edges, start=start_page)

    story_pages: Dict[str, dict] = {}
    for page_num in sorted(nodes):
        text = pages.get(page_num, "")
        targets = edges.get(page_num, [])
        is_terminal = (page_num in terminal_pages) or bool(
            TERMINAL_RE.search(text)
        )

        choices = []
        for target in targets:
            label = extract_choice_text(text, target)
            if label is None:
                # Continuation page — no explicit "If you" phrasing
                if len(targets) == 1:
                    label = "Continue..."
                else:
                    label = f"Turn to page {target}"
            choices.append({"text": label, "target": target})

        story_pages[str(page_num)] = {
            "id": page_num,
            "text": text,
            "choices": choices,
            "isTerminal": is_terminal,
            "isTrunk": page_num in trunk_pages,
        }

    return {
        "title": title,
        "startPage": start_page,
        "pages": story_pages,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate docs/story-data.json from pipeline outputs."
    )
    parser.add_argument(
        "--pages-dir", type=Path, default=Path("output/cot-pages-ocr-v2")
    )
    parser.add_argument(
        "--graph", type=Path, default=Path("output/cot-story-graph.mmd")
    )
    parser.add_argument("--output", type=Path, default=Path("docs/story-data.json"))
    parser.add_argument("--start-page", type=int, default=2)
    parser.add_argument("--title", default="The Cave of Time")
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    if not args.pages_dir.exists():
        raise FileNotFoundError(f"Pages directory not found: {args.pages_dir}")
    if not args.graph.exists():
        raise FileNotFoundError(f"Graph file not found: {args.graph}")

    print(f"Reading pages from: {args.pages_dir}")
    pages = parse_pages(args.pages_dir)
    print(f"  Loaded {len(pages)} page files.")

    print(f"Reading graph from: {args.graph}")
    nodes, edges = parse_graph(args.graph)
    print(f"  Nodes: {len(nodes)}, Edge sources: {len(edges)}")

    story_data = build_story_data(
        pages, nodes, edges, start_page=args.start_page, title=args.title
    )

    terminal_count = sum(
        1 for p in story_data["pages"].values() if p["isTerminal"]
    )
    trunk_count = sum(
        1 for p in story_data["pages"].values() if p["isTrunk"]
    )
    print(f"  Terminal pages: {terminal_count}")
    print(f"  Trunk pages: {trunk_count}")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(story_data, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"Written: {args.output}  ({args.output.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
