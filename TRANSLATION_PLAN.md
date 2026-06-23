# JavaDev Bible — Spanish Translation Plan

**Goal:** Full EN → ES translation using a custom i18n engine. No Google Translate, no external dependencies. High-quality, hand-written technical Spanish.

---

## Architecture

### How it works

1. Every translatable HTML element gets a `data-i18n="key"` attribute
2. `js/i18n.js` is included on every page — it injects the language toggle button and swaps text client-side
3. Spanish strings live embedded directly in `js/i18n.js` as a `var ES = {...}` object (no fetch/XHR, so it works on `file://` with no server). `i18n/es.json` is a non-authoritative reference copy and is **not** loaded at runtime — it drifts out of sync and should not be trusted as the source of truth
4. Language preference is saved in `localStorage` key `javabible-lang`
5. Code blocks (`<pre><code>`) are **never** tagged — always stay in English
6. Missing keys fail gracefully: `applySpanish()` skips any `data-i18n` element whose key isn't in `ES`, leaving the English text in place

### Key conventions

| Attribute | Used on | Example |
|---|---|---|
| `data-i18n="key"` | Any element with visible text | `<h2 data-i18n="intro.title">Welcome</h2>` |
| `data-i18n-placeholder="key"` | `<input>` elements | `<input data-i18n-placeholder="search.placeholder">` |
| `data-i18n-title="key"` | `<html>` element | Sets `document.title` |
| `data-i18n-root="."` | `<html>` element | Path prefix to reach site root |

### Path depth values for `data-i18n-root`

| Page location | Value |
|---|---|
| `javabible/index.html` | `"."` |
| `javabible/topics/{cat}/{page}.html` | `"../.."` |

### Adding i18n to a new topic page

1. Update `<html>` opening tag:
   ```html
   <html lang="en" data-i18n-root="../.." data-i18n-title="topic.{slug}.page-title">
   ```
2. Tag the header chrome:
   ```html
   <a href="..." data-i18n="nav.home">Home</a>
   <a href="..." data-i18n="nav.{category}">{Category Name}</a>
   <p class="topic-subtitle" data-i18n="topic.{slug}.subtitle">...</p>
   <a ... class="back-btn" data-i18n="nav.back-to-index">&larr; Back to Index</a>
   ```
3. Tag section headings and paragraphs — skip `<pre><code>` always
4. Add Spanish strings to `i18n/es.json`
5. Add `<script src="../../js/i18n.js"></script>` before closing `</body>`

---

## Session Tracker

| Session | Scope | Files | Status |
|---------|-------|-------|--------|
| **1** | Infrastructure + `index.html` | `js/i18n.js`, `i18n/es.json`, `index.html` | ✅ Done |
| **2** | Fundamentals (13 pages) | `topics/fundamentals/*.html` | ✅ Done (2026-06-23) |
| **3** | Advanced Java (8 pages) | `topics/advanced/*.html` | ⬜ Todo |
| **4** | Jakarta EE (12 pages) | `topics/jakarta-ee/*.html` | ⬜ Todo |
| **5** | Spring Framework (9 pages) | `topics/spring/*.html` | ⬜ Todo |
| **6** | Build Tools + Java Versions (13 pages) | `topics/build-tools/*.html`, `topics/java-versions/*.html` | ⬜ Todo |
| **7** | Web Concepts + App Servers (14 pages) | `topics/web-concepts/*.html`, `topics/servers/*.html` | ⬜ Todo |
| **8** | Databases + Security + Tools + Best Practices (23 pages) | remaining `topics/**/*.html` | ⬜ Todo |

---

## Shared UI Keys (used on every page)

These keys are in `es.json` from Session 1 and should not be re-added:

```
nav.home               → "Inicio"
nav.back-to-index      → "← Volver al Índice"
nav.fundamentals       → "Fundamentos de Java"
nav.advanced           → "Conceptos Avanzados de Java"
nav.jakarta            → "Jakarta EE y Java Empresarial"
nav.spring             → "Framework Spring"
nav.build-tools        → "Herramientas de Construcción"
nav.web-concepts       → "Conceptos Web y Arquitectura"
nav.servers            → "Servidores de Aplicaciones"
nav.databases          → "Bases de Datos y Persistencia"
nav.security           → "Seguridad y Autenticación"
nav.java-versions      → "Versiones de Java"
nav.tools              → "Herramientas y Ecosistema"
nav.best-practices     → "Buenas Prácticas"
footer.copyright       → "© 2026 JavaDev Bible - Base de Conocimiento Integral para Desarrolladores Java"
footer.built           → "Construido con HTML, CSS y JavaScript puro por Claude y Sanprieto"
```

---

## Key Naming Conventions

- `page.*` — page-level meta (title, etc.)
- `hero.*` — homepage hero section
- `search.*` — search UI
- `intro.*` — homepage intro section
- `cat.{id}.*` — category cards on homepage
- `link.{slug}` — topic link text (reused across homepage + breadcrumbs)
- `nav.*` — navigation chrome (shared across all pages)
- `footer.*` — footer text (shared)
- `topic.{slug}.*` — topic page content (section titles, paragraphs, etc.)
