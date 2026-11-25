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
    //
    // MIRRORED in mcp/src/main/java/dev/javadevbible/mcp/JavaBibleTools.java.
    // Change both or neither, or the site and the MCP server rank differently.
    const WEIGHT = { title: 10, category: 5, keywords: 3, description: 2 };

    // Bonuses on top of the per-word weights.
    //   wordStart   - the word starts a word in the title ("lazy" in "Lazy
    //                 Loading"), not merely sits inside one ("thread" inside
    //                 "Multithreading"). Separates the page ABOUT a thing from
    //                 pages that mention it.
    //   phraseTitle - a multi-word query appears verbatim in the title.
    //   phraseText  - ...or verbatim in keywords/description.
    //   titlePrefix - the title begins with the whole query.
    const BONUS = { wordStart: 4, phraseTitle: 12, phraseText: 4, titlePrefix: 6 };

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
        bindEvents();
        loadIndex().then(runQueryFromUrl);
    });

    /**
     * Topic pages send Ctrl+K, "/" and their "Search" link here as
     * index.html?q=<term>. An empty q only focuses the box; a term is also
     * searched, once the index has arrived.
     */
    function runQueryFromUrl() {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('q')) return;

        const query = (params.get('q') || '').trim();
        input.value = query;
        input.focus();
        if (query.length >= MIN_QUERY) search(query);
    }

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
            items[activeIndex].setAttribute('aria-selected', 'false');
        }

        activeIndex = (activeIndex + delta + items.length) % items.length;

        const active = items[activeIndex];
        active.classList.add('is-active');
        // Without this a screen reader announces every option as "not
        // selected", including the one the arrow keys just landed on.
        active.setAttribute('aria-selected', 'true');
        active.scrollIntoView({ block: 'nearest' });
        input.setAttribute('aria-activedescendant', active.id);
    }

    // ── Search ──────────────────────────────────────────────────────────────

    /**
     * Multi-word search. The query is split on whitespace and EVERY word must
     * match some field of an entry: "jpa lazy" finds pages about JPA that also
     * mention lazy loading. The previous version searched for the whole string
     * as one substring, so any two-word query whose words did not sit side by
     * side in the index returned nothing at all.
     */
    function search(query) {
        const tokens = tokenize(query);
        const phrase = tokens.join(' ');

        currentResults = index
            .map(function (item) {
                return { item: item, score: scoreOf(item, tokens, phrase) };
            })
            .filter(function (hit) { return hit.score > 0; })
            .sort(function (a, b) {
                // Ties are broken alphabetically so the order never depends on
                // where an entry happens to sit in the JSON file.
                return (b.score - a.score) ||
                       lower(a.item.title).localeCompare(lower(b.item.title));
            })
            .map(function (hit) { return hit.item; });

        render(currentResults, tokens);
    }

    /**
     * Lower-cases and splits on whitespace. One-character words are dropped
     * when there are others: in "spring boot 4" the "4" matched almost nothing
     * and, because every word must match, it hid every Spring Boot page.
     */
    function tokenize(query) {
        const words = query.toLowerCase().split(/\s+/).filter(Boolean);
        const longer = words.filter(function (w) { return w.length > 1; });
        return longer.length > 0 ? longer : words;
    }

    /**
     * The forms of a word worth looking for: the word itself and, for a plural
     * longer than three letters, its singular. Without it "threads" did not
     * match the title "Multithreading". Deliberately naive — no stemming
     * library, no dependency — and only ever widens recall by one form.
     */
    function forms(token) {
        return (token.length > 3 && token.charAt(token.length - 1) === 's')
            ? [token, token.slice(0, -1)]
            : [token];
    }

    function has(field, fs) {
        for (let i = 0; i < fs.length; i++) {
            if (field.indexOf(fs[i]) !== -1) return true;
        }
        return false;
    }

    function scoreOf(item, tokens, phrase) {
        const title    = lower(item.title);
        const category = lower(item.category);
        const keywords = lower(item.keywords);
        const desc     = lower(item.description);
        let total = 0;

        for (let i = 0; i < tokens.length; i++) {
            const fs = forms(tokens[i]);
            let s = 0;
            if (has(title, fs)) {
                s += WEIGHT.title;
                if (fs.some(function (f) { return startsWord(title, f); })) s += BONUS.wordStart;
            }
            if (has(category, fs)) s += WEIGHT.category;
            if (has(keywords, fs)) s += WEIGHT.keywords;
            if (has(desc, fs))     s += WEIGHT.description;

            if (s === 0) return 0;      // every word must match somewhere
            total += s;
        }

        if (tokens.length > 1) {
            if (title.indexOf(phrase) !== -1) {
                total += BONUS.phraseTitle;
            } else if (keywords.indexOf(phrase) !== -1 || desc.indexOf(phrase) !== -1) {
                total += BONUS.phraseText;
            }
        }
        if (title.indexOf(phrase) === 0) total += BONUS.titlePrefix;

        return total;
    }

    /** True if `needle` occurs in `haystack` at the start of a word. */
    function startsWord(haystack, needle) {
        let at = haystack.indexOf(needle);
        while (at !== -1) {
            if (at === 0 || !/[a-z0-9]/.test(haystack.charAt(at - 1))) return true;
            at = haystack.indexOf(needle, at + 1);
        }
        return false;
    }

    function lower(field) {
        return typeof field === 'string' ? field.toLowerCase() : '';
    }

    // ── Render ──────────────────────────────────────────────────────────────

    function render(results, tokens) {
        const query = tokens.join(' ');
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
            panel.appendChild(resultLink(result, tokens, i));
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
    function resultLink(result, tokens, position) {
        const link = document.createElement('a');
        link.className = 'search-result-item';
        link.href = result.url;
        link.id   = 'search-result-' + position;
        link.setAttribute('role', 'option');
        link.setAttribute('aria-selected', 'false');

        const title = document.createElement('span');
        title.className = 'search-result-title';
        appendHighlighted(title, result.title, tokens);

        const category = document.createElement('span');
        category.className = 'search-result-category';
        category.textContent = result.category || '';

        const excerpt = document.createElement('span');
        excerpt.className = 'search-result-excerpt';
        appendHighlighted(excerpt, result.description || '', tokens);

        link.appendChild(title);
        link.appendChild(category);
        link.appendChild(excerpt);
        return link;
    }

    /**
     * Appends `text` to `parent`, wrapping every occurrence of any query word
     * in <mark>. Text nodes are created via createTextNode, so the source
     * string is data and can never become markup — which is why there is no
     * escapeHtml() anywhere in this file. There is nothing to escape.
     */
    function appendHighlighted(parent, text, tokens) {
        if (!text) return;

        if (!tokens || tokens.length === 0) {
            parent.appendChild(document.createTextNode(text));
            return;
        }

        const haystack = text.toLowerCase();
        const marks = [];
        tokens.forEach(function (t) {
            forms(t).forEach(function (f) { if (marks.indexOf(f) === -1) marks.push(f); });
        });
        let cursor = 0;

        for (;;) {
            // Earliest match of any word from the cursor; on a tie the longer
            // word wins, so "spring" is marked whole rather than as "s"+"pring".
            let hit = -1;
            let len = 0;
            marks.forEach(function (t) {
                const at = haystack.indexOf(t, cursor);
                if (at !== -1 && (hit === -1 || at < hit || (at === hit && t.length > len))) {
                    hit = at;
                    len = t.length;
                }
            });
            if (hit === -1) break;

            if (hit > cursor) {
                parent.appendChild(
                    document.createTextNode(text.slice(cursor, hit))
                );
            }

            const mark = document.createElement('mark');
            mark.textContent = text.slice(hit, hit + len);
            parent.appendChild(mark);

            cursor = hit + len;
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
