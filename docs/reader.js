/**
 * Cave of Time — Reader
 *
 * Loads story-data.json and drives the interactive reader UI.
 * State is persisted to localStorage so readers can resume.
 */

'use strict';

// ── Constants ──────────────────────────────────────────────────────────────

const STORAGE_KEY = 'cot_reader_state';
const DATA_URL    = 'story-data.json';

// ── State ──────────────────────────────────────────────────────────────────

let storyData   = null;   // full JSON from story-data.json
let currentPage = null;   // current page id (number)
let history     = [];     // ordered list of page ids visited
let decisions   = 0;      // number of branching choices made

// ── DOM refs ───────────────────────────────────────────────────────────────

const $loadingScreen    = document.getElementById('loading-screen');
const $errorScreen      = document.getElementById('error-screen');
const $errorMessage     = document.getElementById('error-message');
const $app              = document.getElementById('app');

const $storyTitle       = document.getElementById('story-title');
const $storyText        = document.getElementById('story-text');
const $pageNumber       = document.getElementById('page-number');
const $choicesSection   = document.getElementById('choices-section');
const $choicesList      = document.getElementById('choices-list');
const $endingSection    = document.getElementById('ending-section');
const $endingPath       = document.getElementById('ending-path');
const $progressBar      = document.getElementById('progress-bar');
const $bookPage         = document.getElementById('book-page');
const $decisionsCount   = document.getElementById('decisions-count');
const $decisionsPlural  = document.getElementById('decisions-plural');

const $pathPanel        = document.getElementById('path-panel');
const $pathList         = document.getElementById('path-list');
const $btnHistory       = document.getElementById('btn-history');
const $btnClosePath     = document.getElementById('btn-close-path');
const $btnRestart       = document.getElementById('btn-restart');
const $btnEndingRestart = document.getElementById('btn-ending-restart');

// ── Initialisation ─────────────────────────────────────────────────────────

async function init() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
    storyData = await res.json();
  } catch (err) {
    showError(`Failed to load story data: ${err.message}`);
    return;
  }

  // Populate title
  $storyTitle.textContent = storyData.title || 'The Cave of Time';
  document.title = `${storyData.title || 'The Cave of Time'} — Choose Your Own Adventure`;

  // Try to restore saved session
  const saved = loadSavedState();
  if (saved && storyData.pages[saved.currentPage]) {
    currentPage = saved.currentPage;
    history     = saved.history;
    decisions   = saved.decisions;
  } else {
    currentPage = storyData.startPage;
    history     = [currentPage];
    decisions   = 0;
  }

  showApp();
  renderPage(currentPage, /* animate */ false);
  bindEvents();
}

// ── Render ─────────────────────────────────────────────────────────────────

function renderPage(pageId, animate = true) {
  const page = storyData.pages[String(pageId)];
  if (!page) {
    showError(`Story data missing for page ${pageId}.`);
    return;
  }

  const doRender = () => {
    $pageNumber.textContent = pageId;
    $storyText.textContent  = page.text;

    // Choices vs ending
    if (page.isTerminal || page.choices.length === 0) {
      renderEnding(page);
    } else {
      renderChoices(page);
    }

    updateProgressBar(page);
    updateDecisionsCounter();
    renderPathPanel();

    // Scroll top of card into view smoothly
    $bookPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (animate) {
    // Exit animation
    $bookPage.classList.add('page-exit');
    setTimeout(() => {
      $bookPage.classList.remove('page-exit');
      $bookPage.classList.add('page-enter');
      doRender();
      // Force reflow then enter animation
      void $bookPage.offsetHeight;
      $bookPage.classList.remove('page-enter');
    }, 200);
  } else {
    doRender();
  }
}

function renderChoices(page) {
  $endingSection.classList.add('hidden');
  $choicesSection.classList.remove('hidden');
  $choicesList.innerHTML = '';

  for (const choice of page.choices) {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.setAttribute('data-target', choice.target);

    const arrow = document.createElement('span');
    arrow.className = 'choice-arrow';
    arrow.textContent = '❧';
    arrow.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'choice-label';
    label.textContent = choice.text;

    const hint = document.createElement('span');
    hint.className = 'choice-page-hint';
    hint.textContent = `→ p.${choice.target}`;
    hint.setAttribute('aria-hidden', 'true');

    btn.appendChild(arrow);
    btn.appendChild(label);
    btn.appendChild(hint);

    btn.addEventListener('click', () => handleChoice(choice.target, page.choices.length > 1));
    $choicesList.appendChild(btn);
  }
}

function renderEnding(page) {
  $choicesSection.classList.add('hidden');
  $endingSection.classList.remove('hidden');

  const pathStr = history.join(' → ');
  $endingPath.innerHTML = `
    <strong>Your path through the story</strong>
    Pages: ${pathStr}<br>
    <em>${decisions} decision${decisions !== 1 ? 's' : ''} made &mdash; ${history.length} pages read</em>
  `;
}

function renderPathPanel() {
  $pathList.innerHTML = '';
  for (let i = 0; i < history.length; i++) {
    const li = document.createElement('li');
    li.textContent = history[i];
    if (i === history.length - 1) li.classList.add('path-current');
    $pathList.appendChild(li);
  }
}

function updateProgressBar(page) {
  // Rough progress: terminal pages count as ~100%, trunk pages as partial
  // We use decisions as a proxy (typical story is 5-15 decisions)
  const maxDecisions = 18;
  if (page.isTerminal) {
    $progressBar.style.width = '100%';
  } else {
    const pct = Math.min(Math.round((decisions / maxDecisions) * 92), 92);
    $progressBar.style.width = `${pct}%`;
  }
}

function updateDecisionsCounter() {
  $decisionsCount.textContent = decisions;
  $decisionsPlural.textContent = decisions === 1 ? '' : 's';
}

// ── Navigation ─────────────────────────────────────────────────────────────

function handleChoice(targetPage, isBranching) {
  currentPage = targetPage;
  history.push(targetPage);
  if (isBranching) decisions++;

  saveState();
  renderPage(targetPage);
}

function restart() {
  currentPage = storyData.startPage;
  history     = [currentPage];
  decisions   = 0;

  saveState();
  $pathPanel.classList.add('hidden');
  renderPage(currentPage);
}

// ── Persistence ────────────────────────────────────────────────────────────

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentPage, history, decisions }));
  } catch (_) {
    // localStorage may be unavailable in some contexts (file://, private browsing)
  }
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function clearState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
}

// ── UI helpers ─────────────────────────────────────────────────────────────

function showApp() {
  $loadingScreen.classList.add('hidden');
  $app.classList.remove('hidden');
}

function showError(msg) {
  $loadingScreen.classList.add('hidden');
  $errorMessage.textContent = msg;
  $errorScreen.classList.remove('hidden');
}

// ── Event binding ──────────────────────────────────────────────────────────

function bindEvents() {
  $btnRestart.addEventListener('click', () => {
    clearState();
    restart();
  });

  $btnEndingRestart.addEventListener('click', () => {
    clearState();
    restart();
  });

  $btnHistory.addEventListener('click', () => {
    renderPathPanel();
    $pathPanel.classList.toggle('hidden');
  });

  $btnClosePath.addEventListener('click', () => {
    $pathPanel.classList.add('hidden');
  });

  // Keyboard: Escape closes path panel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$pathPanel.classList.contains('hidden')) {
      $pathPanel.classList.add('hidden');
    }
  });
}

// ── Boot ───────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);
