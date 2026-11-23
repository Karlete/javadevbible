/* ==========================================================================
   JavaDev Bible — site-wide navigation helpers
   ==========================================================================

   Loaded on every page (index and all topic pages). Each helper exits quietly
   when the elements it needs are absent.

   - Copy button on every <pre><code> block
   - Smooth scrolling for in-page anchors (toc.js handles its own links)
   - Ctrl/Cmd + K focuses the search box on the index page

   Removed on 2026-11-23 because no page used them: collapsible sections,
   the back-to-top button, and a global sharePage() that fell back to alert().
   ========================================================================== */

(function () {
    'use strict';

    const COPY_RESET_MS = 2000;

    // Checked once: someone who asked the OS to reduce motion gets instant
    // jumps instead of animated scrolling.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('DOMContentLoaded', function () {
        initializeSmoothScrolling();
        initializeCopyButtons();
    });

    // ── In-page anchors ─────────────────────────────────────────────────────

    function initializeSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = targetId && document.getElementById(targetId);
                if (!targetElement) return;

                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: reduceMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
                history.pushState(null, '', '#' + targetId);
            });
        });
    }

    // ── Copy buttons ────────────────────────────────────────────────────────

    function initializeCopyButtons() {
        if (!navigator.clipboard) return;   // insecure context (file://, plain http on a LAN IP)

        document.querySelectorAll('pre > code').forEach(function (codeBlock) {
            const pre = codeBlock.parentElement;

            // The button is positioned against the <pre>; syntax-highlighting.css
            // makes every <pre> position: relative, so nothing is written inline.
            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
            pre.appendChild(copyBtn);

            let resetTimer = null;

            copyBtn.addEventListener('click', function () {
                navigator.clipboard.writeText(codeBlock.textContent).then(function () {
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
