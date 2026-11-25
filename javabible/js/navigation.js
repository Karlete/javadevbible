/* ==========================================================================
   JavaDev Bible — site-wide navigation helpers
   ==========================================================================

   Loaded on every page (index and all topic pages). Each helper exits quietly
   when the elements it needs are absent.

   - Light/dark theme button in the page's dark band (stored choice wins
     over the OS preference)
   - Copy button on every <pre><code> block
   - "Show all answers" for interview questions (<details class="qa">),
     and every answer opened while printing
   - Search from any page: Ctrl/Cmd + K or "/" focuses the search box on the
     index; on a topic page they go to the index with the box focused (and
     pre-filled with the selected text, if any). Topic pages also get a
     visible "Search" link next to "Back to Index".

   Removed on 2026-11-23 because no page used them: collapsible sections,
   the back-to-top button, and a global sharePage() that fell back to alert().
   ========================================================================== */

(function () {
    'use strict';

    // ── Theme ───────────────────────────────────────────────────────────────
    // The stored choice is applied immediately, not on DOMContentLoaded, so it
    // lands as early as a script at the end of <body> can. A reader whose
    // choice differs from the OS may still see one frame in the OS theme on a
    // slow first load; avoiding that entirely would need a script in <head>.
    // No stored choice = follow the operating system (CSS color-scheme).

    const THEME_KEY = 'javadevbible-theme';
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    function storedTheme() {
        try {
            const value = localStorage.getItem(THEME_KEY);
            return value === 'light' || value === 'dark' ? value : null;
        } catch (e) {
            return null;    // storage disabled (privacy mode, file://): follow the OS
        }
    }

    function effectiveTheme() {
        return storedTheme() || (systemDark.matches ? 'dark' : 'light');
    }

    const initialTheme = storedTheme();
    if (initialTheme) document.documentElement.dataset.theme = initialTheme;

    function initializeThemeToggle() {
        const band = document.querySelector('.hero-section, .topic-header');
        if (!band) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'theme-toggle';
        const icon = document.createElement('span');
        icon.className = 'theme-toggle-icon';
        icon.setAttribute('aria-hidden', 'true');
        const label = document.createElement('span');
        button.appendChild(icon);
        button.appendChild(label);

        // The button names the theme it switches TO, the convention readers
        // expect from a single toggle.
        function render() {
            const dark = effectiveTheme() === 'dark';
            icon.textContent = dark ? '☀' : '☾';    // ☀ / ☾
            label.textContent = dark ? 'Light' : 'Dark';
            button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
        }

        button.addEventListener('click', function () {
            const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
            document.documentElement.dataset.theme = next;
            try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* not persisted */ }
            render();
        });

        // While no choice is stored, keep the label right if the OS switches
        // (e.g. automatic dark mode at sunset).
        systemDark.addEventListener('change', function () {
            if (!storedTheme()) render();
        });

        render();
        band.appendChild(button);
    }

    const COPY_RESET_MS = 2000;

    document.addEventListener('DOMContentLoaded', function () {
        initializeThemeToggle();
        initializeCopyButtons();
        initializeInterviewAnswers();
    });

    // ── Interview answers (<details class="qa">) ────────────────────────────

    function initializeInterviewAnswers() {
        const all = document.querySelectorAll('details.qa');
        if (!all.length) return;

        // One "Show all answers" button per section that holds questions, for
        // reading straight through instead of practising one at a time.
        document.querySelectorAll('.content-section').forEach(function (section) {
            const items = section.querySelectorAll('details.qa');
            const heading = section.querySelector('h2');
            if (!items.length || !heading) return;

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'qa-toggle-all';
            heading.after(button);

            function sync() {
                const allOpen = Array.prototype.every.call(items, function (d) { return d.open; });
                button.textContent = allOpen ? 'Hide all answers' : 'Show all answers';
                button.setAttribute('aria-pressed', String(allOpen));
            }

            button.addEventListener('click', function () {
                const open = button.getAttribute('aria-pressed') !== 'true';
                items.forEach(function (d) { d.open = open; });
                sync();
            });
            // 'toggle' does not bubble; listen on each item so the label stays
            // right when answers are opened one by one.
            items.forEach(function (d) { d.addEventListener('toggle', sync); });
            sync();
        });

        // A printed page has no way to click: open every answer for printing
        // and restore what the reader had open afterwards.
        let openBeforePrint = null;
        window.addEventListener('beforeprint', function () {
            openBeforePrint = Array.prototype.map.call(all, function (d) { return d.open; });
            all.forEach(function (d) { d.open = true; });
        });
        window.addEventListener('afterprint', function () {
            if (!openBeforePrint) return;
            all.forEach(function (d, i) { d.open = openBeforePrint[i]; });
            openBeforePrint = null;
        });
    }

    // In-page anchors are left to the browser on purpose. This file used to
    // intercept every a[href^="#"], scroll with JS and update the URL with
    // history.pushState — but pushState does not update :target, so CSS that
    // marks the destination (.category-card:target) never matched. Native
    // navigation sets :target, and main.css already gives it smooth scrolling
    // (html { scroll-behavior: smooth }) that prefers-reduced-motion turns off.

    // ── Copy buttons ────────────────────────────────────────────────────────

    function initializeCopyButtons() {
        if (!navigator.clipboard) return;   // insecure context (file://, plain http on a LAN IP)

        document.querySelectorAll('pre > code').forEach(function (codeBlock) {
            const pre = codeBlock.parentElement;

            // Inside a .code-file the button goes in the file header, where it
            // never covers code. On a bare <pre> it floats top-right
            // (syntax-highlighting.css makes every <pre> position: relative).
            const figure = pre.parentElement;
            const caption = figure && figure.classList.contains('code-file')
                ? figure.querySelector(':scope > figcaption')
                : null;

            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
            (caption || pre).appendChild(copyBtn);

            let resetTimer = null;

            copyBtn.addEventListener('click', function () {
                navigator.clipboard.writeText(copyableText(codeBlock)).then(function () {
                    show(copyBtn, 'Copied!', 'copied');
                }, function () {
                    show(copyBtn, 'Failed', 'failed');
                });
            });

            function show(btn, text, cls) {
                clearTimeout(resetTimer);
                btn.classList.remove('copied', 'failed');
                btn.textContent = text;
                btn.classList.add(cls);
                resetTimer = setTimeout(function () {
                    btn.textContent = 'Copy';
                    btn.classList.remove(cls);
                }, COPY_RESET_MS);
            }
        });
    }

    // In a diff, copy the code as it ends up: drop the removed (.line-del)
    // lines together with their line break, so no blank line is left behind.
    function copyableText(codeBlock) {
        if (!codeBlock.querySelector('.line-del')) return codeBlock.textContent;

        const clone = codeBlock.cloneNode(true);
        clone.querySelectorAll('.line-del').forEach(function (line) {
            const next = line.nextSibling;
            if (next && next.nodeType === Node.TEXT_NODE) {
                next.textContent = next.textContent.replace(/^\n/, '');
            }
            line.remove();
        });
        return clone.textContent;
    }

    // ── Keyboard shortcuts ──────────────────────────────────────────────────
    // Escape is deliberately not handled here: search.js owns the results panel
    // and closes it through its own state (data-open). Writing an inline
    // display:none from this file once overrode that state and left search dead
    // until the next page load.

    // On topic pages the index is reached through the breadcrumb's first link,
    // so no page has to hard-code its depth.
    function searchPageUrl(query) {
        const home = document.querySelector('.topic-header .breadcrumb a');
        if (!home) return null;
        const url = new URL(home.href);
        url.hash = '';
        url.search = '?q=' + encodeURIComponent(query || '');
        return url.href;
    }

    // Selected text becomes the query: select "HikariCP", press Ctrl+K, and
    // the index opens with it already searched. Long selections are ignored:
    // they are a paragraph being copied, not a term being looked up.
    function selectedTerm() {
        const text = String(window.getSelection ? window.getSelection() : '').trim();
        return text.length > 0 && text.length <= 60 && !/[\r\n]/.test(text) ? text : '';
    }

    function initializeSearchLink() {
        const back = document.querySelector('.topic-header .back-btn');
        const href = searchPageUrl('');
        if (!back || !href) return;

        const link = document.createElement('a');
        link.className = 'header-search-link';
        link.href = href;
        link.appendChild(document.createTextNode('Search'));
        const hint = document.createElement('kbd');
        hint.textContent = '/';
        hint.setAttribute('aria-hidden', 'true');
        link.appendChild(hint);
        link.setAttribute('aria-label', 'Search all topics (shortcut: slash or Control K)');
        back.insertAdjacentElement('afterend', link);
    }

    document.addEventListener('DOMContentLoaded', initializeSearchLink);

    function isTyping(target) {
        return target instanceof HTMLElement &&
            (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
    }

    document.addEventListener('keydown', function (e) {
        const ctrlK = (e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'k';
        const slash = e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !isTyping(e.target);
        if (!ctrlK && !slash) return;

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            if (slash && e.target === searchInput) return;
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
            return;
        }

        const url = searchPageUrl(selectedTerm());
        if (!url) return;   // a page with neither box nor breadcrumb: leave the browser shortcut alone
        e.preventDefault();
        window.location.href = url;
    });
}());
