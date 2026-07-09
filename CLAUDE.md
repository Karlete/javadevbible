# CLAUDE.md

This file gives Claude Code (and any other Claude instance working in this repo) the context it needs to work on JavaDevBible correctly on the first try. Read this before editing anything.

## Project identity

- **Name:** JavaDevBible
- **Live URL:** https://karlete.github.io/javadevbible/javabible/index.html
- **Repository:** https://github.com/karlete/javadevbible
- **What it is:** A comprehensive static HTML educational reference site covering Java, from fundamentals through advanced ecosystem topics, targeting both junior and senior developers simultaneously in the same page.
- **Deploy:** GitHub Pages, branch `main`, folder `/javabible/`.

## Stack — non-negotiable

100% static. **Do not** introduce:
- Any JS framework (React, Vue, etc.)
- A backend of any kind
- A build step or bundler (no webpack, no vite)
- A CMS
- Login, user accounts, or comments

The stack is HTML5 + CSS3 + Vanilla JavaScript + JSON, and it stays that way.

## Repository structure

```
/javabible/
├── index.html                    ← category navigation + instant search
├── topics/{category}/{topic}.html ← individual topic pages
├── css/                           ← main.css, syntax-highlighting.css, toc.css
├── js/                            ← i18n.js, navigation.js, search.js, hero-effects.js, toc.js
└── *.json                         ← search index
/README.md
/CONTRIBUTING.md
/PROJECT_STATUS.md
/QUICK_START.md
```

### Categories (12) and their folder names

| Category | Folder | Index anchor |
|---|---|---|
| Java Fundamentals | `fundamentals` | `#fundamentals` ✅ |
| Advanced Java | `advanced` | `#advanced` ✅ |
| Build Tools | `build-tools` | *(no anchor id yet — see Known Issues)* |
| Spring Framework | `spring` | `#spring` ✅ |
| Jakarta EE | `jakarta-ee` | `#jakarta-ee` ✅ |
| Web Concepts | `web-concepts` | *(no anchor id yet)* |
| Databases & Persistence | `databases` | *(no anchor id yet)* |
| Security & Authentication | `security` | *(no anchor id yet)* |
| Application Servers & Deployment | `servers` | *(no anchor id yet)* |
| Java Versions & Compatibility | `java-versions` | *(no anchor id yet)* |
| Tools & Ecosystem | `tools` | *(no anchor id yet)* |
| Best Practices | `best-practices` | `#bestpractices` ✅ |

## Known issues — check before assuming a fix is needed elsewhere

- **`index.html` is missing `id` attributes** on the `category-card` divs for Databases, Security, Servers, Java Versions, Tools, Build Tools, and Web Concepts. Every topic page's breadcrumb links to `../../index.html#<category>` — for the categories above, that anchor currently doesn't exist, so the link works but doesn't scroll to the right place. **Fix:** add the matching `id="databases"`, `id="security"`, `id="servers"`, `id="versions"`, `id="tools"`, `id="build-tools"`, `id="web-concepts"` to each `category-card` div in `index.html`. One-file, low-risk fix — do this the next time `index.html` is touched for any reason, or proactively if asked.
- Mobile search results (`#searchResults`) have had a z-index / stacking-context bug reported. Root cause not yet isolated — needs `css/main.css` (specifically `.hero-section`, `.overlay`, `#hero-particles`, `.search-container`, `.search-results`) and possibly `js/search.js` in hand before attempting a fix. Don't guess a `z-index: 9999 !important` patch without seeing the actual stacking context.

## Non-negotiable template conventions

Every topic page follows this structure. Deviating from it is a defect, not a style choice.

### Required page structure, in order
1. **Section 0** — "What is X — and why does it exist?" Always includes: a plain-language explanation, the concrete problem it solves, and a **before/after code comparison** (a naive/legacy/manual approach vs. the correct modern one), with comments explaining *why* the after-version is better, not just what changed.
2. Body sections specific to the topic.
3. **Best Practices** section, formatted as `✅ Do` / `❌ Don't` lists — never a single flat bullet list, never called "Summary."
4. **Interview Questions**, split explicitly into `🎓 Junior level` and `🔥 Senior level`, using `info-box note` and `info-box important` respectively. 3 junior + 3 senior is the norm. Every page must have this section.
5. **Related Topics** — links to every sibling page in the same category (not just 2–3), using the *exact* filenames as they appear in `index.html`, plus meaningful cross-category links where genuinely relevant (e.g., a Security page linking to a JWT-storage detail on another Security page; a JPA page linking to Transactions).

### Explicitly forbidden, anywhere on any page
- Analogies (restaurant, apartment building, moving boxes, etc.) — if you catch yourself reframing a request into an analogy, that's the signal to write the literal technical explanation instead.
- Emojis in body prose (icons in headers like `🎓`/`🔥`/`✅`/`❌` and `related-icon` spans are fine and expected).
- A section literally titled "Summary."
- ASCII-art box diagrams with side-by-side columns (`┌──┐` style) — they break at 320px viewport width. A **vertical** ASCII tree (directory structure) is fine since it just needs horizontal scroll, not layout integrity. Multi-column diagrams → convert to an HTML `<table>` instead.
- Toy domain models: no `User` with just `name`/`age`, no generic `Employee`/`Department`. All examples use the site's established **e-commerce domain**: `Customer`, `Product`, `Order`, `OrderItem`, `Invoice`, `ShippingAddress`. (Exception: illustrating a pure language mechanic like polymorphism with `Animal`/`Dog` is acceptable — that's not a business-domain model.)

### Required HTML/document conventions
- No BOM at the start of the file.
- `<html lang="en" data-i18n-root="../.." data-i18n-title="topic.<slug>.page-title">`
- `<link rel="stylesheet" href="../../css/toc.css">` in addition to `main.css` and `syntax-highlighting.css`.
- TOC sidebar (`<aside class="toc-sidebar" id="toc-sidebar">…</aside>`) — copy the exact markup block from an existing gold-standard page (see below), don't hand-roll it.
- `data-i18n="..."` attributes on breadcrumb links, `<h1>`, subtitle `<p>`, back-button, and footer copyright — every static text node that should be translatable.
- Scripts at the end of `<body>`: `js/i18n.js`, `js/navigation.js`, `js/toc.js` (topic pages) — `index.html` additionally loads `js/search.js` and `js/hero-effects.js`.
- Tables use `class="comparison-table"` — not `info-table`, not unstyled `<table>`.
- No inline `style="..."` attributes on content elements — use existing CSS classes; if a new visual treatment is genuinely needed (e.g., highlighting a table row), propose a small named class to add to `main.css` rather than inlining styles.

### Required Java/Spring conventions in every code sample
- Spring Boot 3.x / Java 17–21 baseline (Java 25 LTS content is being folded in as of the Java Versions & Compatibility topic — check the most recently completed pages in that category before assuming which baseline a new page should target).
- `jakarta.*` namespace, never `javax.*`, unless the code is explicitly illustrating pre-Jakarta-EE-9 legacy behavior.
- **Constructor injection always.** Never `@Autowired` field injection. Never `@Autowired` on a single constructor (unnecessary since Spring 4.3).
- `record` for all DTOs.
- `ProblemDetail` (RFC 9457) for all error responses — never a hand-rolled `ApiError`/`ErrorResponse` class.
- `LAZY` fetch as the default on every JPA association (`@ManyToOne`, `@OneToOne` default to EAGER — override explicitly). Cross-reference `topics/databases/relationships.html` when EAGER is tempting.
- `@MockitoBean`, not `@MockBean` (renamed in Spring Boot 3.4+).
- `AutoConfiguration.imports`, not `spring.factories` (replaced since Boot 2.7).
- `spring.forward-headers-strategy=native` (or `framework`, context-dependent) behind a reverse proxy — and always flag the security risk of trusting `X-Forwarded-*` headers on a server reachable outside the trusted proxy.
- No Lombok `@Data` on JPA entities.
- No cursing, no filler — every code comment should teach something, not restate the line above it.

## Workflow — how we actually build pages here

1. **One file at a time.** The person pastes or uploads the current file (or says "let's create X from scratch"). Never assume a file's contents, existence, or that a linked/related file is correct — view it if it's available, ask if it isn't.
2. **Structured delivery format**, in this order:
   - **Entendido** — brief restatement of the task
   - **Análisis** — real technical diagnosis of the current file: what's wrong, what's outdated, what's missing, cross-checked against this document's conventions
   - **Propuesta** — the rewritten file (or the specific diff), with reasoning
   - **Plan de implementación** — concrete next steps, which files are touched
   - **Auto-revisión crítica** — an honest, specific list of this response's own limitations, unverified claims, or deliberate scope choices. This is not boilerplate; each point should be genuinely useful to the person reviewing the work.
3. **Confirm topic ordering before writing pages.** When starting a new category/topic, propose the page order explicitly (general concept before specific implementation; foundational concept before the mechanism built on it) and get confirmation before writing.
4. **Verify currency for anything version-, date-, or release-specific.** Java's ecosystem moves fast — LTS status, JEP numbers, deprecation/removal timelines, and library defaults (e.g., Spring Boot's fat-jar mechanism, Oracle JDK licensing terms) should be checked against current sources rather than assumed from training data, especially for anything that could have changed in the last 12–18 months.
5. **Flag cross-page consistency issues proactively** — if a fix, a renamed link, or a corrected fact on the current page implies another already-completed page needs the same fix, say so explicitly rather than leaving it implicit.

## Reference files — read these before building a new page in an unfamiliar section

- **`topics/databases/relationships.html`** — the established gold-standard template for structure, tone, and depth.
- **`topics/jakarta-ee/transactions.html`** — gold standard for a topic with heavy propagation/lifecycle nuance.
- Any of the completed **Security & Authentication** or **Application Servers & Deployment** pages — these are the most recently built and reflect the current template most precisely (TOC, i18n, Do/Don't, Junior/Senior interview questions).

## What "done" looks like for a single page

A page is not done until it has: Section 0 with before/after, no forbidden elements, TOC + i18n wiring, e-commerce-domain examples throughout, a Best Practices Do/Don't section, 3+3 Interview Questions, a complete Related Topics block with correct filenames, and an honest auto-critique was given to the person requesting the work. If any of these is missing, the page is a draft, not a finished deliverable.
