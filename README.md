# JavaDev Bible

A static reference covering the Java ecosystem — 90 topics across 12 categories, written for junior and senior developers on the same page.

**[Read it here →](https://karlete.github.io/javadevbible/javabible/index.html)**

---

## What this is

Ninety hand-written HTML pages. No framework, no build step, no backend, no dependencies. Clone it, open `index.html`, and it works — on a plane, on a laptop with no network, in a directory on a USB stick.

Every code example is drawn from a single running e-commerce domain (`Customer`, `Order`, `OrderItem`, `Product`, `Invoice`) rather than the usual disconnected `Foo`/`Bar` snippets, so the examples read like one coherent codebase across all 90 pages. Every page opens by explaining what the thing *is* and what problem it exists to solve, before showing how to use it. Every page ends with interview questions split by seniority.

---

## The interesting part: there is no compiler

A static site of this size has no type system, no linker, and no test suite. Nothing stops a rename from silently orphaning eight inbound links, or a deleted page from lingering in the search index as a 404 waiting for a visitor.

I learned this the way everyone does. During a content restructure I renamed and deleted pages, and did not update the references to them. The result, discovered later:

- **22 broken internal links** — the "Related Topics" section of the site pointing at files that no longer existed
- **16 search index entries** resolving to deleted pages — a 404 delivered by the site's own search box
- **11 pages absent from the index** — content nobody could find
- A `PROJECT_STATUS.md` confidently declaring *"95/95 pages, 100% complete"* while 90 existed

The failure was not the broken links. The failure was that **nothing checked**.

So I wrote the missing compiler:

```bash
$ bash tools/verify.sh

JavaDev Bible — integrity check

1. Internal links
  ✓ 1334 links checked, all resolve

2. Search index
  ✓ index and disk agree (90 pages)

3. UTF-8 BOM
  ✓ no BOM in any HTML file

4. Debug leftovers
  ✓ no console.log / debug / warn in js/

✓ 4/4 checks passed.
```

[`tools/verify.sh`](tools/verify.sh) walks every `href` in every page and resolves it against the filesystem; diffs the search index against what is actually on disk, in both directions; catches the UTF-8 BOM that Windows editors keep reintroducing; and fails on any `console.log` that reaches production.

It is **pure bash — no Node, no npm, no `package.json`**. Adding a dependency to check a project whose defining constraint is *zero dependencies* would have missed the point. It runs on every push via [GitHub Actions](.github/workflows/verify.yml) and blocks the merge if the site's internal references do not hold together.

It knows what it does not cover: referential integrity, not behaviour. Verifying that the search box actually *works* would need a headless browser, and that dependency is not worth its cost at this scale. That gap is deliberate, and I check it by hand.

---

## Decisions, and what they cost

**No framework.** Ninety pages of prose and code samples have no client-side state to manage. React would have added a build step, a dependency tree, and a hydration cost to solve a problem this project does not have. The trade-off is real: there are no components, so the page template is duplicated ninety times, and a structural change means touching ninety files. I accepted that, and `verify.sh` is part of how I live with it.

**No i18n.** I built a Spanish translation layer — a 1,000-line dictionary and a language toggle — and then deleted it. Translating 90 pages doubles the maintenance cost of every future content change, and the audience for this content reads English. One well-maintained language beats two half-maintained ones. The commit that removes it is [`5839d62`](https://github.com/karlete/javadevbible/commit/5839d62).

**Search results are real anchors.** They were `<div onclick="location.href=...">`, which is not focusable, not openable in a new tab, and not announced as a link by a screen reader. They are `<a href>` now, built with `createElement` and `textContent` rather than `innerHTML`, so index content cannot be interpreted as markup — there is nothing left to escape.

**Motion is opt-out.** The hero runs an animated gradient, a particle canvas, a pulse, a typing effect and a blinking cursor. Under `prefers-reduced-motion`, all five stop — including the `requestAnimationFrame` loop, which would otherwise keep burning CPU to paint a canvas the CSS has already hidden.

---

## Running it

```bash
git clone https://github.com/karlete/javadevbible.git
cd javadevbible/javabible
python -m http.server 8000
```

Then open `http://localhost:8000`.

A server is needed because the search index is loaded with `fetch`, which `file://` blocks. Everything else works from the filesystem directly.

To run the integrity checks:

```bash
bash tools/verify.sh          # human-readable
bash tools/verify.sh --quiet  # failures only, for CI
```

---

## Layout

```
javabible/
├── index.html              category navigation and search
├── topics/{category}/      90 topic pages across 12 categories
├── css/                    main, syntax-highlighting, toc
├── js/                     search, navigation, toc, hero-effects
└── data/
    └── search-index.json   generated from disk, verified in CI

tools/verify.sh             integrity checker
.github/workflows/          runs it on every push
CLAUDE.md                   the conventions every page must satisfy
```

---

## License

[MIT](LICENSE). Take it, fork it, use it.

**Karlete** — [@karlete](https://github.com/karlete)
