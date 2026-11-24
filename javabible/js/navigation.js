/* ==========================================================================
   JavaDev Bible — site-wide navigation helpers
   ==========================================================================

   Loaded on every page (index and all topic pages). Each helper exits quietly
   when the elements it needs are absent.

   - Copy button on every <pre><code> block
   - "Show all answers" for interview questions (<details class="qa">),
     and every answer opened while printing
   - Ctrl/Cmd + K focuses the search box on the index page

   Removed on 2026-11-23 because no page used them: collapsible sections,
   the back-to-top button, and a global sharePage() that fell back to alert().
   ========================================================================== */

(function () {
    'use strict';

    const COPY_RESET_MS = 2000;

    document.addEventListener('DOMContentLoaded', function () {
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

    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            const searchInput = document.getElementById('searchInput');
            if (!searchInput) return;   // topic pages have no search box: leave the browser shortcut alone
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    });
}());
