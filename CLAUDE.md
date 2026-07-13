# CLAUDE.md

Context for Claude Code and any other Claude instance working in this repo. Read this before editing anything.

## Project identity

- **Name:** JavaDevBible
- **Live:** https://karlete.github.io/javadevbible/javabible/index.html
- **Repo:** https://github.com/karlete/javadevbible
- **What it is:** A static HTML reference covering Java from fundamentals through the wider ecosystem, written for junior and senior developers on the same page.
- **Deploy:** GitHub Pages, branch `main`, folder `/javabible/`.
- **Scale:** 90 topic pages across 12 categories.

## Stack — non-negotiable

100% static. **Do not** introduce:
- Any JS framework
- A backend of any kind
- A build step or bundler
- A CMS, login, user accounts, or comments
- **Any dependency at all** — including in tooling. `tools/verify.sh` is pure bash for exactly this reason. A `package.json` in a repo whose defining constraint is zero dependencies would be a contradiction.

The stack is HTML5 + CSS3 + Vanilla JavaScript + JSON, and it stays that way.

## Verify before you claim anything is done

```bash
bash tools/verify.sh
```

Four checks: internal links resolve, the search index matches what is on disk (both directions), no UTF-8 BOM, no `console.log` in shipped JS. It exits non-zero on failure and runs in CI on every push.

**Run it after any change that touches a filename, a link, the search index, or `js/`.** It exists because a restructure once left 22 broken links, 16 index entries pointing at deleted files, and 11 pages that no search could reach — none of which anything caught. It is the closest thing this project has to a compiler.

It does **not** verify behaviour. A page can pass all four checks and still be visually broken. Anything touching CSS or JS needs a browser:

```bash
cd javabible && python -m http.server 8000
```

## Repository structure

```
/javabible/
├── index.html                     category navigation + instant search
├── topics/{category}/{topic}.html 90 topic pages
├── css/                           main.css, syntax-highlighting.css, toc.css
├── js/                            search.js, navigation.js, toc.js, hero-effects.js
└── data/search-index.json         must always match topics/ on disk — verify.sh checks this

/tools/verify.sh                   integrity checker
/.github/workflows/verify.yml      runs it on every push
/README.md
/CLAUDE.md
/LICENSE
```

### Categories (12) and their folder names

| Category | Folder | Index anchor |
|---|---|---|
| Java Fundamentals | `fundamentals` | `#fundamentals` |
| Advanced Java | `advanced` | `#advanced` |
| Build Tools | `build-tools` | `#build-tools` |
| Spring Framework | `spring` | `#spring` |
| Jakarta EE | `jakarta-ee` | `#jakarta-ee` |
| Web Concepts | `web-concepts` | `#web-concepts` |
| Databases & Persistence | `databases` | `#databases` |
| Security & Authentication | `security` | `#security` |
| Application Servers & Deployment | `servers` | `#servers` |
| Java Versions & Compatibility | `java-versions` | `#versions` |
| Tools & Ecosystem | `tools` | `#tools` |
| Best Practices | `best-practices` | `#bestpractices` |

> **Unverified:** the `id` attributes on the `category-card` divs in `index.html` were reported missing for several categories, which would make the breadcrumb anchors land at the top of the page instead of the right card. Check with `grep -c 'category-card" id=' javabible/index.html` — it should return 12. If it does not, add the missing `id`s to match the table above. Delete this note once confirmed.

## Non-negotiable template conventions

Every topic page follows this structure. Deviating from it is a defect, not a style choice.

### Required page structure, in order

1. **Section 0** — opens by explaining what the thing *is* and what problem it exists to solve, before any usage. Always includes a **before/after code comparison**: the naive, legacy or manual approach against the correct modern one, with comments explaining *why* the after-version is better, not just what changed. No page may assume prior knowledge of its own subject.

   The `<h2>` does **not** have to be literally "What is X". `"Why Testing Matters — and the Trap Most Test Suites Fall Into"` is a better heading than `"What is Testing"` and satisfies the convention. The requirement is the *content*: what it is, why it exists, before/after.

2. Body sections specific to the topic.

3. **Best Practices** — formatted as `✅ Do` / `❌ Don't` lists. Never a single flat bullet list. Never titled "Summary."

4. **Interview Questions** — split explicitly into `🎓 Junior level` (`info-box note`) and `🔥 Senior level` (`info-box important`). **Minimum 3 + 3; more is fine and often better.** Do not cut a good question to hit a number. Every page must have this section.

5. **Related Topics** — links to sibling pages in the same category, plus meaningful cross-category links where genuinely relevant. Use exact filenames. `verify.sh` will catch a wrong one, but catching it yourself is faster.

### Explicitly forbidden, anywhere on any page

- **Analogies** (restaurant, apartment building, moving boxes). If you catch yourself reframing a request into an analogy, that is the signal to write the literal technical explanation instead.
- **Emojis in body prose.** Header icons (`🎓` `🔥` `✅` `❌`) and `related-icon` spans are expected and fine.
- **A section titled "Summary."**
- **ASCII-art box diagrams with side-by-side columns** (`┌──┐` style) — they break at 320px. A *vertical* ASCII tree (a directory listing) is fine; it only needs horizontal scroll, not layout integrity. Multi-column diagrams become an HTML `<table>`.
- **Toy domain models.** No `User` with `name`/`age`/`email`. No generic `Employee`/`Department`. All business-domain examples use the site's e-commerce domain: `Customer`, `Product`, `Order`, `OrderItem`, `Invoice`, `ShippingAddress`, `order_items`. (Exception: a pure language mechanic like polymorphism may use `Animal`/`Dog` — that is not a business-domain model.)
- **A UTF-8 BOM** at the start of the file. Windows editors add it silently. `verify.sh` catches it.
- **Inline `style="..."`** on content elements. If a new visual treatment is genuinely needed, propose a named class for `main.css` instead.
- **`console.log`** in anything under `js/`.

### Required HTML conventions

- `<html lang="en">`
- Stylesheets: `main.css`, `syntax-highlighting.css`, `toc.css`.
- Scripts at the end of `<body>`: `navigation.js`, `toc.js` on topic pages. `index.html` additionally loads `search.js` and `hero-effects.js`.
- TOC sidebar (`<aside class="toc-sidebar" id="toc-sidebar">`) — copy the exact markup from a reference page below. Do not hand-roll it.
- Tables need **no class**. `main.css` styles `<table>` globally. (A `comparison-table` class was previously mandated here; it was never defined in any stylesheet and did nothing. It has been removed from this document — do not reintroduce it.)

### Required Java/Spring conventions in every code sample

- Spring Boot 3.x / Java 17–21 baseline. Java 25 is the current LTS; check the most recently completed pages in Java Versions & Compatibility before assuming which baseline a new page targets.
- `jakarta.*`, never `javax.*` — unless the code is explicitly illustrating pre-Jakarta-EE-9 legacy behaviour.
- **Constructor injection always.** Never `@Autowired` field injection. Never `@Autowired` on a single constructor (unnecessary since Spring 4.3).
- `record` for all DTOs.
- `ProblemDetail` (RFC 9457) for all error responses. Never a hand-rolled `ApiError` / `ErrorResponse`.
- `LAZY` fetch on every JPA association. `@ManyToOne` and `@OneToOne` default to EAGER — override them explicitly. Cross-reference `topics/databases/relationships.html` when EAGER looks tempting.
- `@MockitoBean`, not `@MockBean` (renamed in Spring Boot 3.4+).
- `AutoConfiguration.imports`, not `spring.factories`.
- No Lombok `@Data` on JPA entities.
- Every code comment must teach something. A comment that restates the line above it is noise.

## Workflow

1. **One file at a time.** The person uploads the current file or asks for a new one. **Never assume a file's contents, its existence, or that a linked file is correct** — read it if it is available, ask if it is not.

2. **Do not ask for confirmation before generating.** Proceed directly with the full rewrite and deliver the complete file.

3. **Delivery format:**
   - **Entendido** — brief restatement of the task
   - **Análisis** — real technical diagnosis: what is wrong, outdated, or missing, cross-checked against this document
   - **Propuesta** — the rewritten file, with reasoning
   - **Plan de implementación** — concrete steps, which files are touched
   - **Auto-revisión crítica** — an honest, specific list of the response's own limitations, unverified claims, and deliberate scope choices. Not boilerplate. Each point must be useful to whoever reviews the work.

4. **Verify currency for anything version-, date- or release-specific.** Java moves fast. LTS status, JEP numbers, deprecation timelines and library defaults should be checked against current sources rather than recalled from training data — particularly anything that could have changed in the last 12–18 months.

5. **Flag cross-file consequences proactively.** If a fix, a renamed link, or a corrected fact implies another completed page needs the same change, say so explicitly. And say so when you *cannot* check, because the related file was not provided.

6. **Run `bash tools/verify.sh` before declaring anything done.**

## Reference files

- **`topics/databases/relationships.html`** — the gold standard for structure, tone and technical depth.
- **`topics/java-versions/version-compatibility.html`** — the structural template.

## What "done" means for a page

Section 0 with a before/after comparison. No forbidden elements. TOC wired up. E-commerce domain throughout. A Do/Don't Best Practices section. Interview questions, at least 3 junior and 3 senior. A complete Related Topics block with filenames that resolve. `verify.sh` green. An honest auto-critique delivered to the person.

Anything less is a draft, not a deliverable.

## A standing warning about this file

Every convention here is a claim about the repository. Claims rot.

The `comparison-table` rule sat in this document for months, was applied to 78 tables, and did nothing — the class was never defined in any stylesheet. An `i18n` section mandated `data-i18n` attributes on every text node in 90 files; the i18n system was deleted. A `PROJECT_STATUS.md` declared 95 pages complete when 90 existed.

**A convention nothing verifies will eventually be a lie.** If you add a rule here, ask whether `verify.sh` can enforce it. If it can, add the check. If it cannot, expect this document to drift from reality and treat every unverified claim in it with suspicion — starting with the ones above.
