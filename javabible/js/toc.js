/**
 * toc.js — Table of Contents dinámica
 * JavaDevBible
 *
 * - Lee h2/h3 del <main class="topic-content">
 * - Inyecta IDs si faltan
 * - Construye la nav
 * - Scroll spy con IntersectionObserver
 * - Toggle colapsar/expandir
 * - Reutilizable en todos los topics sin cambios
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        const tocNav = document.getElementById('toc-nav');
        const tocToggle = document.getElementById('toc-toggle');
        const content = document.querySelector('main.topic-content');

        if (!tocNav || !content) return;

        const headings = content.querySelectorAll('h2, h3');

        if (headings.length === 0) {
            const sidebar = document.getElementById('toc-sidebar');
            if (sidebar) sidebar.hidden = true;
            return;
        }

        buildToc(headings, tocNav);
        setupToggle(tocNav, tocToggle);
        setupScrollSpy(tocNav);

        // Marca la ToC como inicializada. En mobile, el CSS mantiene la nav
        // colapsada hasta este punto; solo entonces se habilita la variante
        // expandida. Así el primer render nunca muestra el estado expandido
        // ni anima el colapso al cargar (elimina el CLS). En este momento, en
        // mobile, setupToggle() ya ha añadido .toc-collapsed, de modo que
        // habilitar la puerta no dispara ninguna animación.
        const sidebar = document.getElementById('toc-sidebar');
        if (sidebar) sidebar.classList.add('toc-ready');
    }

    /* ── Construir la ToC ──────────────────────────────────── */

    function buildToc(headings, tocNav) {
        const fragment = document.createDocumentFragment();

        headings.forEach(function (heading, index) {
            // Asignar ID si no tiene
            if (!heading.id) {
                heading.id = slugify(heading.textContent) + '-' + index;
            }

            const link = document.createElement('a');
            link.href = '#' + heading.id;
            link.textContent = cleanText(heading.textContent);
            link.className = 'toc-link toc-' + heading.tagName.toLowerCase();
            link.dataset.target = heading.id;

            link.addEventListener('click', function (e) {
                e.preventDefault();
                smoothScrollTo(heading);
                history.pushState(null, '', '#' + heading.id);
            });

            fragment.appendChild(link);
        });

        tocNav.appendChild(fragment);
    }

    /* ── Toggle ────────────────────────────────────────────── */

    function setupToggle(tocNav, tocToggle) {
        if (!tocToggle) return;

        // Mobile: colapsado por defecto
        if (window.matchMedia('(max-width: 900px)').matches) {
            setCollapsed(tocNav, tocToggle, true);
        }

        tocToggle.addEventListener('click', function () {
            const isCollapsed = tocNav.classList.contains('toc-collapsed');
            setCollapsed(tocNav, tocToggle, !isCollapsed);
        });
    }

    function setCollapsed(nav, btn, collapse) {
        if (collapse) {
            nav.classList.add('toc-collapsed');
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-label', 'Expandir tabla de contenidos');
        } else {
            nav.classList.remove('toc-collapsed');
            btn.setAttribute('aria-expanded', 'true');
            btn.setAttribute('aria-label', 'Colapsar tabla de contenidos');
        }
    }

    /* ── Scroll Spy ─────────────────────────────────────────── */

    function setupScrollSpy(tocNav) {
        if (!('IntersectionObserver' in window)) return;

        const links = tocNav.querySelectorAll('.toc-link');
        const targets = [];

        links.forEach(function (link) {
            const el = document.getElementById(link.dataset.target);
            if (el) targets.push({ el: el, link: link });
        });

        let activeLink = null;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                const match = targets.find(function (t) {
                    return t.el === entry.target;
                });
                if (!match) return;

                if (activeLink) activeLink.classList.remove('toc-active');
                match.link.classList.add('toc-active');
                activeLink = match.link;

                // Auto-scroll de la ToC hacia el ítem activo
                const nav = document.getElementById('toc-nav');
                if (nav) {
                    const navRect = nav.getBoundingClientRect();
                    const linkRect = match.link.getBoundingClientRect();
                    if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
                        match.link.scrollIntoView({ block: 'nearest' });
                    }
                }
            });
        }, {
            rootMargin: '-80px 0px -75% 0px',
            threshold: 0
        });

        targets.forEach(function (t) { observer.observe(t.el); });
    }

    /* ── Helpers ─────────────────────────────────────────────── */

    function smoothScrollTo(el) {
        // Compensar header fijo si lo hubiera
        const header = document.querySelector('.topic-header');
        const offset = header ? header.getBoundingClientRect().height : 0;
        const top = el.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });

        // Foco accesible
        el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
    }

    function slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 60); // Evitar IDs absurdamente largos
    }

    function cleanText(text) {
        // Quita numeración tipo "1." o "1.2." del inicio
        return text.trim().replace(/^[\d.]+\s+/, '');
    }

})();