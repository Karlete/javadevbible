/* ==========================================================================
   JavaDev Bible — client-side search
   ==========================================================================

   Design notes, since the choices here are deliberate:

   - Results are real <a> elements, not <div onclick>. Anchors are focusable,
     openable in a new tab, announced as links by screen readers, and work
     without JavaScript's help once rendered. A div with a click handler is
     none of those things.

   - Nothing is built with innerHTML from index data. Every node is created
     with createElement and filled with textContent. Escaping is not a step
     that can be forgotten, because there is no string concatenation to escape.

   - No inline styles. Presentation lives in main.css.

   - No silent fallback. If the index fails to load, the search box says so.
     The previous version quietly rebuilt a degraded index from the DOM, which
     meant a broken deploy looked like a working one.
   ========================================================================== */

(function () {
    'use strict';

    const INDEX_URL   = 'data/search-index.json';
    const MIN_QUERY   = 2;      // below this, searching is noise
    const DEBOUNCE_MS = 200;
    const MAX_RESULTS = 10;

    // Field weights. Title matches matter most; a description match is a weak
    // signal that the page is merely adjacent to what the user meant.
    const WEIGHT = { title: 10, category: 5, keywords: 3, description: 2 };

    let index          = [];
    let indexError     = null;  // set if the fetch failed; surfaced to the user
    let debounceTimer  = null;
    let activeIndex    = -1;    // keyboard-highlighted result, -1 = none
    let currentResults = [];

    let input;
    let button;
    let panel;

    // ── Boot ────────────────────────────────────────────────────────────────

    document.addEventListener('DOMContentLoaded', function () {
        input  = document.getElementById('searchInput');
        button = document.getElementById('searchBtn');
        panel  = document.getElementById('searchResults');

        // Search only exists on the index page. Every other page loads this
        // script through the same <script> tag and must exit quietly.
        if (!input || !panel) return;

        applyAriaContract();
        loadIndex();
        bindEvents();
    });

    /**
     * Wires up the ARIA combobox pattern. The markup declares the structure;
     * this declares the behaviour contract to assistive technology.
     */
    function applyAriaContract() {
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('aria-controls', 'searchResults');
        input.setAttribute('aria-autocomplete', 'list');
        panel.setAttribute('role', 'listbox');
    }

    // ── Index ───────────────────────────────────────────────────────────────

    async function loadIndex() {
        try {
            const response = await fetch(INDEX_URL);
            if (!response.ok) {
                throw new Error(response.status + ' ' + response.statusText);
            }
            index = await response.json();
        } catch (error) {
            // Deliberately kept: a search box that silently returns nothing is
            // worse than one that admits it is broken.
            indexError = error;
            index = [];
        }
    }

    // ── Events ──────────────────────────────────────────────────────────────

    function bindEvents() {
        input.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            const query = input.value.trim();

            if (query.length < MIN_QUERY) {
                close();
                return;
            }
            debounceTimer = setTimeout(function () { search(query); }, DEBOUNCE_MS);
        });

        input.addEventListener('keydown', onKeyDown);

        if (button) {
            button.addEventListener('click', function () {
                const query = input.value.trim();
                if (query.length >= MIN_QUERY) search(query);
            });
        }

        // Click outside dismisses the panel.
        document.addEventListener('click', function (event) {
            if (!panel.contains(event.target) &&
                event.target !== input &&
                event.target !== button) {
                close();
            }
        });
    }

    /**
     * Arrow keys move a highlight through the results; Enter follows it; Escape
     * dismisses. Without this, the results panel is reachable but not usable
     * from the keyboard.
     */
    function onKeyDown(event) {
        const isOpen = panel.hasChildNodes() && panel.dataset.open === 'true';

        switch (event.key) {
            case 'ArrowDown':
                if (!isOpen) return;
                event.preventDefault();
                move(1);
                break;

            case 'ArrowUp':
                if (!isOpen) return;
                event.preventDefault();
                move(-1);
                break;

            case 'Enter':
                if (isOpen && activeIndex >= 0) {
                    event.preventDefault();
                    const link = panel.querySelectorAll('.search-result-item')[activeIndex];
                    if (link) link.click();
                } else {
                    const query = input.value.trim();
                    if (query.length >= MIN_QUERY) search(query);
                }
                break;

            case 'Escape':
                close();
                input.blur();
                break;
        }
    }

    function move(delta) {
        const items = panel.querySelectorAll('.search-result-item');
        if (items.length === 0) return;

        if (activeIndex >= 0 && items[activeIndex]) {
            items[activeIndex].classList.remove('is-active');
        }

        activeIndex = (activeIndex + delta + items.length) % items.length;

        const active = items[activeIndex];
        active.classList.add('is-active');
        active.scrollIntoView({ block: 'nearest' });
        input.setAttribute('aria-activedescendant', active.id);
    }

    // ── Search ──────────────────────────────────────────────────────────────

    function search(query) {
        const needle = query.toLowerCase();

        currentResults = index
            .map(function (item) {
                return { item: item, score: scoreOf(item, needle) };
            })
            .filter(function (hit) { return hit.score > 0; })
            .sort(function (a, b) { return b.score - a.score; })
            .map(function (hit) { return hit.item; });

        render(currentResults, query);
    }

    function scoreOf(item, needle) {
        let score = 0;
        if (contains(item.title,       needle)) score += WEIGHT.title;
        if (contains(item.category,    needle)) score += WEIGHT.category;
        if (contains(item.keywords,    needle)) score += WEIGHT.keywords;
        if (contains(item.description, needle)) score += WEIGHT.description;
        return score;
    }

    function contains(field, needle) {
        return typeof field === 'string' &&
               field.toLowerCase().indexOf(needle) !== -1;
    }

    // ── Render ──────────────────────────────────────────────────────────────

    function render(results, query) {
        panel.textContent = '';   // clear without innerHTML
        activeIndex = -1;
        input.removeAttribute('aria-activedescendant');

        if (indexError) {
            panel.appendChild(
                message('Search is unavailable — the index could not be loaded.')
            );
            open();
            return;
        }

        if (results.length === 0) {
            panel.appendChild(
                message('No results for “' + query + '”. Try a different term, ' +
                        'or browse the categories below.')
            );
            open();
            return;
        }

        const shown = results.slice(0, MAX_RESULTS);

        shown.forEach(function (result, i) {
            panel.appendChild(resultLink(result, query, i));
        });

        if (results.length > shown.length) {
            const more = document.createElement('p');
            more.className = 'search-result-more';
            more.textContent = '+' + (results.length - shown.length) +
                               ' more result(s). Refine your search to narrow them down.';
            panel.appendChild(more);
        }

        open();
    }

    /**
     * Builds one result as a real anchor. Every piece of text goes in via
     * textContent or via a <mark> node — never as an HTML string — so index
     * content can never be interpreted as markup.
     */
    function resultLink(result, query, position) {
        const link = document.createElement('a');
        link.className = 'search-result-item';
        link.href = result.url;
        link.id   = 'search-result-' + position;
        link.setAttribute('role', 'option');
        link.setAttribute('aria-selected', 'false');

        const title = document.createElement('span');
        title.className = 'search-result-title';
        appendHighlighted(title, result.title, query);

        const category = document.createElement('span');
        category.className = 'search-result-category';
        category.textContent = result.category || '';

        const excerpt = document.createElement('span');
        excerpt.className = 'search-result-excerpt';
        appendHighlighted(excerpt, result.description || '', query);

        link.appendChild(title);
        link.appendChild(category);
        link.appendChild(excerpt);
        return link;
    }

    /**
     * Splits `text` on the query and appends the parts to `parent`, wrapping
     * matches in <mark>. Text nodes are created via createTextNode, so the
     * source string is data and can never become markup — which is why there
     * is no escapeHtml() anywhere in this file. There is nothing to escape.
     */
    function appendHighlighted(parent, text, query) {
        if (!text) return;

        if (!query) {
            parent.appendChild(document.createTextNode(text));
            return;
        }

        const haystack = text.toLowerCase();
        const needle   = query.toLowerCase();
        let cursor = 0;

        for (;;) {
            const hit = haystack.indexOf(needle, cursor);
            if (hit === -1) break;

            if (hit > cursor) {
                parent.appendChild(
                    document.createTextNode(text.slice(cursor, hit))
                );
            }

            const mark = document.createElement('mark');
            mark.textContent = text.slice(hit, hit + needle.length);
            parent.appendChild(mark);

            cursor = hit + needle.length;
        }

        if (cursor < text.length) {
            parent.appendChild(document.createTextNode(text.slice(cursor)));
        }
    }

    function message(text) {
        const p = document.createElement('p');
        p.className = 'search-message';
        p.textContent = text;
        return p;
    }

    // ── Panel state ─────────────────────────────────────────────────────────

    function open() {
        panel.dataset.open = 'true';
        input.setAttribute('aria-expanded', 'true');
    }

    function close() {
        panel.textContent = '';
        panel.dataset.open = 'false';
        input.setAttribute('aria-expanded', 'false');
        input.removeAttribute('aria-activedescendant');
        activeIndex = -1;
    }
}());
