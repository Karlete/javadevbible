# JavaDev Bible

A static reference covering the Java ecosystem — 94 topics across 13 categories, written for junior and senior developers on the same page.

**[Read it here →](https://karlete.github.io/javadevbible/javabible/index.html)**

---

## What this is

Ninety-four hand-written HTML pages. No framework, no build step, no backend, no dependencies. Clone it, open `index.html`, and it works — on a plane, on a laptop with no network, in a directory on a USB stick.

Every code example is drawn from a single running e-commerce domain (`Customer`, `Order`, `OrderItem`, `Product`, `Invoice`) rather than the usual disconnected `Foo`/`Bar` snippets, so the examples read like one coherent codebase across all 94 pages. Every page opens by explaining what the thing *is* and what problem it exists to solve, before showing how to use it. Every page ends with interview questions split by seniority.

The baseline is Spring Boot 4.x and Java 17–25. Java 25 is the current LTS.

---

## What it covers

| Category | Topics |
|---|---|
| Java Fundamentals | Variables, OOP, Collections, Lambdas & Streams, Generics, Optional… |
| Advanced Java | Multithreading, Virtual Threads, JVM Internals, Garbage Collection, Design Patterns… |
| Spring Framework | Core (IoC/DI), Boot, MVC, REST, Data JPA, Security |
| Jakarta EE | CDI, EJB, JPA, JAX-RS, Servlets, Transactions |
| Databases & Persistence | SQL, JDBC, Connection Pooling, Entity Relationships, Transactions, ORMs |
| Security & Authentication | Auth vs Authz, HTTPS/TLS, Password Hashing, JWT, OAuth 2.0 |
| Build Tools | Maven, Gradle, Dependency Management, Lifecycle, Scopes |
| Web Concepts | HTTP, REST Principles, CORS, WebSockets, Sessions & Cookies |
| Application Servers | Tomcat, Servlet Containers, WAR vs JAR, Deployment Descriptors |
| Java Versions | JDK/JRE/JVM, Version History (Java 8 → 25), Compatibility |
| Tools & Ecosystem | IDEs, Git, CI/CD, Logging, Testing, Jackson, Code Quality |
| Best Practices | SOLID, Clean Code, Error Handling, Performance, Security |
| **AI & Java** *(new)* | LLM Integration, RAG & Embeddings, Tool Calling & MCP, Testing AI Systems |

---

## The interesting part: there is no compiler

A static site of this size has no type system, no linker, and no test suite. Nothing stops a rename from silently orphaning eight inbound links, or a deleted page from lingering in the search index as a 404 waiting for a visitor.

I learned this the way everyone does. During a content restructure I renamed and deleted pages, and did not update the references to them. The result, discovered later:

- **22 broken internal links** — the "Related Topics" section pointing at files that no longer existed
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
  ✓ index and disk agree (94 pages)

3. UTF-8 BOM
  ✓ no BOM in any HTML file

4. Debug leftovers
  ✓ no console.log / debug / warn in js/

5. Dead CSS class
  ✓ no class="comparison-table" in topics/

6. Meta description
  ✓ every topic page has a <meta name="description">

✓ 6/6 checks passed.
```

[`tools/verify.sh`](tools/verify.sh) walks every `href` in every page and resolves it against the filesystem; diffs the search index against what is on disk, in both directions; catches the UTF-8 BOM that Windows editors reintroduce silently; fails on any `console.log` in production JS; catches a dead CSS class that styled nothing for months; and flags any topic page missing a meta description.

It is **pure bash — no Node, no npm, no `package.json`**. Adding a dependency to check a project whose defining constraint is *zero dependencies* would have missed the point. It runs on every push via [GitHub Actions](.github/workflows/verify.yml) and blocks the merge if the site's internal references do not hold together.

It knows what it does not cover: referential integrity, not behaviour. That gap is deliberate, and I check it by hand.

---

## MCP server — use this Bible from Claude Desktop or Claude Code

The `mcp/` directory contains a Spring Boot MCP server that exposes the Bible's content to any MCP-compatible AI assistant. Add it to Claude Desktop and ask Java questions backed by 94 topic pages — no API key, no cloud service, no port.

**Three tools are exposed:**

| Tool | What it does |
|---|---|
| `search_topics` | Search across all 94 pages by keyword or concept |
| `get_topic_content` | Read the full content of a specific topic page |
| `list_categories` | List all 13 categories and their topics |

**Setup:**

```bash
# 1. Build the JAR (requires Java 17+, no Maven install needed)
cd mcp
./mvnw clean package -DskipTests
# → mcp/target/javadevbible-mcp-1.0.0.jar
```

Open your Claude Desktop config file:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add this entry with your actual paths:

```json
{
  "mcpServers": {
    "javadevbible": {
      "command": "java",
      "args": ["-jar", "/absolute/path/to/mcp/target/javadevbible-mcp-1.0.0.jar"],
      "env": {
        "JAVABIBLE_ROOT": "/absolute/path/to/javabible"
      }
    }
  }
}
```

Restart Claude Desktop. Then ask: *"What does JavaDevBible say about virtual threads?"*

For Claude Code:
```bash
claude mcp add javadevbible \
  --command java \
  --args "-jar,/absolute/path/to/mcp/target/javadevbible-mcp-1.0.0.jar" \
  --env "JAVABIBLE_ROOT=/absolute/path/to/javabible"
```

See [`mcp/README.md`](mcp/README.md) for troubleshooting.

---

## Decisions, and what they cost

**No framework.** Ninety-four pages of prose and code samples have no client-side state to manage. React would have added a build step, a dependency tree, and a hydration cost to solve a problem this project does not have. The trade-off is real: there are no components, so the page template is duplicated ninety-four times, and a structural change means touching ninety-four files. I accepted that, and `verify.sh` is part of how I live with it.

**No i18n.** I built a Spanish translation layer — a 1,000-line dictionary and a language toggle — and then deleted it. Translating 94 pages doubles the maintenance cost of every future content change, and the audience for this content reads English. One well-maintained language beats two half-maintained ones. The commit that removes it is [`5839d62`](https://github.com/karlete/javadevbible/commit/5839d62).

**Search results are real anchors.** They were `<div onclick="location.href=...">`, which is not focusable, not openable in a new tab, and not announced as a link by a screen reader. They are `<a href>` now, built with `createElement` and `textContent` rather than `innerHTML`, so index content cannot be interpreted as markup — there is nothing left to escape.

**Motion is opt-out.** The hero runs an animated gradient, a particle canvas, a pulse, a typing effect and a blinking cursor. Under `prefers-reduced-motion`, all five stop — including the `requestAnimationFrame` loop, which would otherwise keep burning CPU to paint a canvas the CSS has already hidden.

**A meta description on every page, but no SEO strategy.** This project does not chase search rankings — a personal portfolio with no backlinks and no domain authority is not going to outrank Baeldung, and trying would be effort spent on the wrong problem. The meta description exists because Lighthouse scores it and because a shared link should preview cleanly.

**No chatbot widget.** Embedding an AI widget in a public static site requires an API key in the client — which is an API key published to the world. Instead, the MCP server exposes the content for anyone to query with their own model and their own key. The static site stays strictly static; the AI integration lives in a separate, opt-in layer.

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
bash tools/verify.sh --full   # do not truncate long failure lists
```

---

## Layout

```
javabible/
├── index.html              category navigation and search
├── topics/{category}/      94 topic pages across 13 categories
├── css/                    main, syntax-highlighting, toc
├── js/                     search, navigation, toc, hero-effects
└── data/
    └── search-index.json   verified in CI against disk, both directions

mcp/                        MCP server — exposes content to AI assistants
├── pom.xml
├── README.md               setup and troubleshooting
└── src/

tools/verify.sh             integrity checker — 6 checks, pure bash
.github/workflows/          runs it on every push
CLAUDE.md                   the conventions every page must satisfy
```

---

## License

[MIT](LICENSE). Take it, fork it, use it.

**Karlete** — [@karlete](https://github.com/karlete)
