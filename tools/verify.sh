#!/usr/bin/env bash
#
# verify.sh — Integrity checker for JavaDev Bible
#
# A static site of hand-maintained pages has no compiler and no type
# system. Nothing catches a rename that silently orphans eight inbound links,
# or a deleted page still listed in the search index as a 404 waiting to
# happen. This script is the missing compiler: it fails loudly, before the
# commit, on the classes of drift this project has actually suffered.
#
#   1. Broken internal links  — <a href> or <link href> pointing at a dead file
#   2. Search index drift     — search-index.json out of sync with disk
#   3. UTF-8 BOM              — forbidden by CLAUDE.md, present anyway
#   4. Debug leftovers        — console.log shipped to production
#   5. Dead CSS class         — class="comparison-table", defined in no stylesheet
#   6. Meta description       — missing, or outside 70–160 characters
#   7. Hand-written counts    — "N topics" / "N categories" that disagree with disk
#   8. Code blocks            — unbalanced <span>, malformed close tags, raw tags
#                               inside <pre> (an unescaped <pid> silently vanishes)
#   9. Undefined CSS classes  — class="x" that no stylesheet defines
#  10. Forbidden markup       — inline style="", side-by-side ASCII box diagrams
#  11. Index cards            — every topic page is listed on index.html
#  12. SEO head               — self-referencing canonical, Open Graph, og:image on disk,
#                               <title> format and length, JSON-LD breadcrumb,
#                               Search Console verification file at the repo root
#  13. Sitemap                — sitemap.xml lists exactly the pages on disk, with <lastmod>
#                               (regenerate with tools/sitemap.sh)
#  14. Field injection        — @Autowired on a field outside test code / ❌ examples
#  15. Interview questions    — every page has junior and senior <details class="qa">
#                               questions, and none left in the old <p><strong>Q: form
#
# Usage:
#   bash tools/verify.sh            run all checks
#   bash tools/verify.sh --quiet    failures only (for CI)
#   bash tools/verify.sh --full     do not truncate long failure lists
#
# Exit codes:
#   0  all checks passed
#   1  at least one check failed
#
# Dependencies: bash, grep, sed, find, sort, comm, od. Nothing else.
# No node, no npm, no package.json. Consistent with the project's zero-build rule.

set -uo pipefail

# ─── Configuration ────────────────────────────────────────────────────────────

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_ROOT="$REPO_ROOT/javabible"
TOPICS_DIR="$SITE_ROOT/topics"
SEARCH_INDEX="$SITE_ROOT/data/search-index.json"
JS_DIR="$SITE_ROOT/js"

MAX_SHOWN=15          # cap per-check output; --full lifts this

QUIET=0
FULL=0
for arg in "$@"; do
  case "$arg" in
    --quiet) QUIET=1 ;;
    --full)  FULL=1; MAX_SHOWN=100000 ;;
    -h|--help)
      sed -n '2,/^$/p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
      exit 0 ;;
  esac
done

# ─── Output helpers ───────────────────────────────────────────────────────────

if [[ -t 1 ]]; then
  RED=$'\033[0;31m'; GREEN=$'\033[0;32m'; DIM=$'\033[2m'
  BOLD=$'\033[1m';  RESET=$'\033[0m'
else
  RED=''; GREEN=''; DIM=''; BOLD=''; RESET=''
fi

CHECKS_FAILED=0       # counts CHECKS, not individual findings
CHECKS_RUN=0          # incremented by header(), so the summary never hard-codes a total

header() {
  CHECKS_RUN=$((CHECKS_RUN + 1))
  [[ $QUIET -eq 0 ]] && printf '\n%s%s%s\n' "$BOLD" "$1" "$RESET"
  return 0
}
pass()   { [[ $QUIET -eq 0 ]] && printf '  %s✓%s %s\n' "$GREEN" "$RESET" "$1"; return 0; }
fail()   { printf '  %s✗%s %s\n' "$RED" "$RESET" "$1"; CHECKS_FAILED=$((CHECKS_FAILED + 1)); }
item()   { printf '      %s\n' "$1"; }
hint()   { printf '      %s%s%s\n' "$DIM" "$1" "$RESET"; }

# ─── Fork-free text helpers ───────────────────────────────────────────────────
# Per-page loops used to pipe every field through grep | sed | wc. On Windows
# (Git Bash) each of those is a process spawn, and 95 pages × ~10 spawns made a
# run take minutes. These read and measure with bash builtins only.

# Whole file into FILE_CONTENT, no subshell.
slurp() { FILE_CONTENT=''; IFS= read -r -d '' FILE_CONTENT < "$1" || true; }

# First capture group of regex $2 in FILE_CONTENT, into MATCH ('' if none).
first_match() {
  MATCH=''
  if [[ "$FILE_CONTENT" =~ $1 ]]; then MATCH="${BASH_REMATCH[1]}"; fi
}

# Visible length of $1: UTF-8 characters, each &entity; counted as one. Into CHARLEN.
charlen() {
  local LC_ALL=C.UTF-8
  local s="$1"
  local ent='(.*)&[a-zA-Z#0-9]+;(.*)'
  while [[ "$s" =~ $ent ]]; do s="${BASH_REMATCH[1]}x${BASH_REMATCH[2]}"; done
  CHARLEN=${#s}
}

# Print at most MAX_SHOWN lines of a findings list, then summarise the rest.
show_capped() {
  local n=0 total
  total=$(printf '%s\n' "$1" | grep -c . || true)
  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    n=$((n + 1))
    if [[ $n -gt $MAX_SHOWN ]]; then
      hint "... and $((total - MAX_SHOWN)) more (run with --full to see all)"
      break
    fi
    item "$line"
  done <<< "$1"
}

# ─── Sanity ───────────────────────────────────────────────────────────────────

if [[ ! -d "$TOPICS_DIR" ]]; then
  printf '%sFATAL%s: %s not found.\n' "$RED" "$RESET" "$TOPICS_DIR" >&2
  exit 1
fi

if [[ $QUIET -eq 0 ]]; then
  printf '%sJavaDev Bible — integrity check%s\n' "$BOLD" "$RESET"
  printf '%s%s%s\n' "$DIM" "$SITE_ROOT" "$RESET"
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# ─── Check 1: Internal links resolve ──────────────────────────────────────────
#
# Every href in every HTML file, minus external/anchor/protocol links, resolved
# relative to the linking file. A link that does not resolve is a 404 the site
# serves to itself.

header "1. Internal links"

LINKS_TOTAL=0
: > "$TMP/broken.txt"

while IFS= read -r -d '' html_file; do
  file_dir="$(dirname "$html_file")"

  while IFS= read -r href; do
    [[ -z "$href" ]] && continue

    case "$href" in
      http://*|https://*|//*|mailto:*|tel:*|data:*|javascript:*|\#*) continue ;;
    esac

    target="${href%%\#*}"          # strip fragment: page.html#x → page.html
    [[ -z "$target" ]] && continue

    LINKS_TOTAL=$((LINKS_TOTAL + 1))

    if [[ ! -e "$file_dir/$target" ]]; then
      line_no="$(grep -n -F -- "\"$href\"" "$html_file" | head -1 | cut -d: -f1)"
      printf '%s:%s  →  %s\n' "${html_file#"$REPO_ROOT/"}" "${line_no:-?}" "$href" \
        >> "$TMP/broken.txt"
    fi
  done < <(grep -o 'href="[^"]*"' "$html_file" 2>/dev/null | sed 's/^href="//; s/"$//')

done < <(find "$SITE_ROOT" -name '*.html' -print0)

BROKEN_N=$(grep -c . "$TMP/broken.txt" || true)

if [[ "$BROKEN_N" -eq 0 ]]; then
  pass "$LINKS_TOTAL links checked, all resolve"
else
  fail "$BROKEN_N broken link(s) out of $LINKS_TOTAL"
  show_capped "$(cat "$TMP/broken.txt")"
fi

# ─── Check 2: Search index ↔ disk ─────────────────────────────────────────────
#
# The search box is the feature a visitor is most likely to exercise. An entry
# pointing at a deleted file is a 404 delivered by the site's own navigation.
# A page absent from the index is content nobody can reach.

header "2. Search index"

if [[ ! -f "$SEARCH_INDEX" ]]; then
  fail "search-index.json not found"
  hint "expected at: ${SEARCH_INDEX#"$REPO_ROOT/"}"
else
  # Extract "url" values without a JSON parser. Safe because we own the file's
  # shape: a flat array, one "url": "..." per entry, no nesting.
  grep -o '"url"[[:space:]]*:[[:space:]]*"[^"]*"' "$SEARCH_INDEX" \
    | sed 's/.*"\([^"]*\)"$/\1/' | sort -u > "$TMP/index.txt"

  find "$TOPICS_DIR" -name '*.html' \
    | sed "s|^$SITE_ROOT/||" | sort -u > "$TMP/disk.txt"

  INDEX_N=$(grep -c . "$TMP/index.txt" || true)
  DISK_N=$(grep -c . "$TMP/disk.txt"  || true)

  comm -23 "$TMP/index.txt" "$TMP/disk.txt" > "$TMP/ghosts.txt"    # indexed, absent
  comm -13 "$TMP/index.txt" "$TMP/disk.txt" > "$TMP/missing.txt"   # present, unindexed

  GHOST_N=$(grep -c . "$TMP/ghosts.txt"  || true)
  MISS_N=$(grep -c . "$TMP/missing.txt" || true)

  if [[ "$GHOST_N" -eq 0 && "$MISS_N" -eq 0 ]]; then
    pass "index and disk agree ($DISK_N pages)"
  else
    fail "index out of sync — $INDEX_N entries vs $DISK_N pages on disk"
    if [[ "$GHOST_N" -gt 0 ]]; then
      hint "$GHOST_N entr(ies) point at files that do not exist:"
      show_capped "$(sed 's/^/  ghost:   /' "$TMP/ghosts.txt")"
    fi
    if [[ "$MISS_N" -gt 0 ]]; then
      hint "$MISS_N page(s) on disk are not in the index:"
      show_capped "$(sed 's/^/  missing: /' "$TMP/missing.txt")"
    fi
  fi
fi

# ─── Check 3: UTF-8 BOM ───────────────────────────────────────────────────────
#
# CLAUDE.md forbids the BOM. It is invisible in an editor and breaks some
# tooling. Its presence in some files but not others is exactly the kind of
# silent inconsistency this script exists to surface.

header "3. UTF-8 BOM"

: > "$TMP/bom.txt"
while IFS= read -r -d '' f; do
  # Byte-level read of the first 3 bytes with builtins (LC_ALL=C: bytes, not chars).
  bom=''
  LC_ALL=C IFS= read -r -n 3 bom < "$f" || true
  if [[ "$bom" == $'\xef\xbb\xbf' ]]; then
    printf '%s\n' "${f#"$REPO_ROOT/"}" >> "$TMP/bom.txt"
  fi
done < <(find "$SITE_ROOT" -name '*.html' -print0)

BOM_N=$(grep -c . "$TMP/bom.txt" || true)

if [[ "$BOM_N" -eq 0 ]]; then
  pass "no BOM in any HTML file"
else
  fail "$BOM_N file(s) start with a UTF-8 BOM"
  show_capped "$(cat "$TMP/bom.txt")"
  hint "fix all: find javabible -name '*.html' -exec sed -i '1s/^\xEF\xBB\xBF//' {} +"
fi

# ─── Check 4: Debug leftovers ─────────────────────────────────────────────────
#
# The browser console on a portfolio site should be empty. It is among the first
# things a reviewer opens.

header "4. Debug leftovers"

CONSOLE_HITS="$(grep -rn 'console\.\(log\|debug\|warn\)' "$JS_DIR" 2>/dev/null || true)"
CONSOLE_N=$(printf '%s' "$CONSOLE_HITS" | grep -c . || true)

if [[ "$CONSOLE_N" -eq 0 ]]; then
  pass "no console.log / debug / warn in js/"
else
  fail "$CONSOLE_N console statement(s) in shipped JS"
  show_capped "$(printf '%s\n' "$CONSOLE_HITS" | sed "s|^$REPO_ROOT/||")"
fi

# ─── Check 5: Dead CSS class ──────────────────────────────────────────────────
#
# CLAUDE.md forbids class="comparison-table". The class is defined in no
# stylesheet, so it styles nothing — a table wearing it renders identically to a
# bare <table>, which is why 38 pages carried it undetected. The convention
# existed; nothing enforced it, so it drifted into a lie. This check ends that:
# the correct markup is a bare <table>, which main.css styles globally.

header "5. Dead CSS class"

DEAD_CLASS_HITS="$(grep -rn 'class="comparison-table"' "$TOPICS_DIR" 2>/dev/null || true)"
DEAD_CLASS_N=$(printf '%s' "$DEAD_CLASS_HITS" | grep -c . || true)

if [[ "$DEAD_CLASS_N" -eq 0 ]]; then
  pass 'no class="comparison-table" in topics/'
else
  fail "$DEAD_CLASS_N use(s) of class=\"comparison-table\" (defined in no CSS)"
  show_capped "$(printf '%s\n' "$DEAD_CLASS_HITS" | sed "s|^$REPO_ROOT/||")"
  hint 'fix: replace <table class="comparison-table"> with a bare <table>'
fi

# ─── Check 6: Meta description coverage ───────────────────────────────────────
#
# Every topic page needs a <meta name="description"> for SEO. Lighthouse flags
# its absence ("Document does not have a meta description"), and without one the
# search engine invents the result snippet from arbitrary body text. All 90
# pages once lacked it — a template gap nothing caught, exactly like
# comparison-table. This check ends that: the description belongs in the <head>,
# right after the <title>.

header "6. Meta description"

NO_DESC="$(grep -rL 'name="description"' --include='*.html' "$TOPICS_DIR" 2>/dev/null || true)"
NO_DESC_N=$(printf '%s' "$NO_DESC" | grep -c . || true)

if [[ "$NO_DESC_N" -eq 0 ]]; then
  pass 'every topic page has a <meta name="description">'
else
  fail "$NO_DESC_N topic page(s) with no <meta name=\"description\">"
  show_capped "$(printf '%s\n' "$NO_DESC" | sed "s|^$REPO_ROOT/||")"
  hint 'fix: add <meta name="description" content="..."> after the <title>'
fi

# Length. Google truncates snippets beyond ~160 characters; under 70 is either a
# stub or — as happened on eleven pages — a sentence cut off mid-word. Entities
# (&amp;) are counted as one character; multi-byte UTF-8 (—, é) is counted as one.
: > "$TMP/desclen.txt"
RX_DESC='<meta name="description" content="([^"]*)"'
while IFS= read -r -d '' f; do
  slurp "$f"; first_match "$RX_DESC"
  [[ -z "$MATCH" ]] && continue
  charlen "$MATCH"
  if [[ "$CHARLEN" -lt 70 || "$CHARLEN" -gt 160 ]]; then
    printf '%s  →  %s chars\n' "${f#"$REPO_ROOT/"}" "$CHARLEN" >> "$TMP/desclen.txt"
  fi
done < <(find "$SITE_ROOT" -name '*.html' -print0)

DESCLEN_N=$(grep -c . "$TMP/desclen.txt" || true)
if [[ "$DESCLEN_N" -eq 0 ]]; then
  pass 'every meta description is 70–160 characters'
else
  fail "$DESCLEN_N meta description(s) outside 70–160 characters"
  show_capped "$(cat "$TMP/desclen.txt")"
  hint 'fix: rewrite it as one complete sentence of 120–160 characters'
fi

# ─── Check 7: Hand-written counts match disk ──────────────────────────────────
#
# "94 topics" and "13 categories" are typed by hand into the hero, the meta
# description, README.md and CLAUDE.md. Nothing updated them when pages were
# added, so they drifted: the meta description said 90 while 94 existed, and
# the hero said "94+" when the real number carried no "+". This check reads
# every "<N> topic..." and "<N> categor..." claim and compares it with disk.
# Numbers written as words ("ninety") are invisible to it, so the docs must
# not use them for current state.

header "7. Hand-written counts"

TOPIC_N=$(find "$TOPICS_DIR" -name '*.html' | grep -c . || true)
CAT_N=$(find "$TOPICS_DIR" -mindepth 1 -maxdepth 1 -type d | grep -c . || true)
CARD_N=$(grep -c 'class="category-card" id="' "$SITE_ROOT/index.html" || true)

: > "$TMP/counts.txt"

# Every category folder needs a card on the index, and every card needs an id,
# or the breadcrumb anchors (index.html#<category>) land at the top of the page.
if [[ "$CARD_N" -ne "$CAT_N" ]]; then
  printf 'javabible/index.html  →  %s category card(s) with an id, %s category folder(s) on disk\n' \
    "$CARD_N" "$CAT_N" >> "$TMP/counts.txt"
fi

for doc in "$SITE_ROOT/index.html" "$REPO_ROOT/README.md" "$REPO_ROOT/CLAUDE.md" "$REPO_ROOT/mcp/README.md"; do
  [[ -f "$doc" ]] || continue
  while IFS=: read -r line_no claim; do
    n="${claim%%[!0-9]*}"                  # leading digits only: "94+ topic" → 94
    case "$claim" in
      *[Tt]opic*) expected="$TOPIC_N" ;;
      *)          expected="$CAT_N"   ;;
    esac
    # A "+" is a claim the site cannot keep: the count is exact, so say it exactly.
    if [[ "$claim" == *+* || "$n" -ne "$expected" ]]; then
      printf '%s:%s  →  "%s" (disk: %s)\n' \
        "${doc#"$REPO_ROOT/"}" "$line_no" "$claim" "$expected" >> "$TMP/counts.txt"
    fi
  done < <(grep -noiE '[0-9]+\+?[[:space:]]+(in-depth[[:space:]]+)?(topic|categor)' "$doc" || true)
done

COUNTS_N=$(grep -c . "$TMP/counts.txt" || true)

if [[ "$COUNTS_N" -eq 0 ]]; then
  pass "every stated count matches disk ($TOPIC_N topics, $CAT_N categories)"
else
  fail "$COUNTS_N stated count(s) disagree with disk"
  show_capped "$(cat "$TMP/counts.txt")"
  hint 'fix: state the exact number, or rephrase without one'
fi

# ─── Check 8: Code blocks are well-formed ─────────────────────────────────────
#
# Code is hand-highlighted HTML. Three failures were found on live pages, all
# invisible to the eye in the source and obvious on screen:
#   - "<pid>" written raw inside <pre>: the browser parsed it as a tag and the
#     text vanished from a jmap command line
#   - "</span&gt;": a mistyped close tag that ate the next XML element
#   - an unclosed <span class="comment"> that painted a whole config block grey
# Per <pre> block: <span> opens must equal closes, no "</tag&gt;", and the only
# tags allowed inside are the inline ones highlighting uses.

header "8. Code blocks"

awk '
  FNR == 1 { inpre = 0 }
  /<pre[ >]/ && !inpre { inpre = 1; buf = ""; start = FNR }
  inpre { buf = buf $0 "\n" }
  inpre && /<\/pre>/ {
    inpre = 0
    body = buf
    sub(/^[^<]*<pre[^>]*>/, "", body)
    sub(/<\/pre>.*$/, "", body)
    opens  = gsub(/<span[ >]/, "&", body)
    closes = gsub(/<\/span>/, "&", body)
    if (opens != closes)
      printf "%s:%d  →  %d <span> vs %d </span>\n", FILENAME, start, opens, closes
    if (body ~ /<\/[a-zA-Z]+&gt;/)
      printf "%s:%d  →  malformed close tag (</tag&gt;)\n", FILENAME, start
    tmp = body
    while (match(tmp, /<[a-zA-Z][a-zA-Z0-9]*/)) {
      tag = substr(tmp, RSTART + 1, RLENGTH - 1)
      if (tag !~ /^(span|code|mark|b|strong|em|i|a|br)$/)
        printf "%s:%d  →  raw <%s> inside <pre> (escape it as &lt;%s&gt;)\n", FILENAME, start, tag, tag
      tmp = substr(tmp, RSTART + RLENGTH)
    }
  }
' $(find "$TOPICS_DIR" -name '*.html' | sort) 2>/dev/null \
  | sed "s|^$REPO_ROOT/||" > "$TMP/pre.txt"

PRE_N=$(grep -c . "$TMP/pre.txt" || true)
if [[ "$PRE_N" -eq 0 ]]; then
  pass "every <pre> block is balanced and escaped"
else
  fail "$PRE_N malformed code block(s)"
  show_capped "$(cat "$TMP/pre.txt")"
fi

# ─── Check 9: Every CSS class used is defined ─────────────────────────────────
#
# The comparison-table lesson, generalised. A class no stylesheet defines does
# nothing, and the next person to copy the markup assumes it does. Three were
# found: best-practices (48 pages), row-highlight and attribute.

header "9. Undefined CSS classes"

grep -rhoE '\.[a-zA-Z][a-zA-Z0-9_-]*' "$SITE_ROOT/css" | sed 's/^\.//' | sort -u > "$TMP/defined.txt"
CLASS_SOURCES=("$SITE_ROOT")
[[ -f "$REPO_ROOT/404.html" ]] && CLASS_SOURCES+=("$REPO_ROOT/404.html")
grep -rhoE 'class="[^"]*"' --include='*.html' "${CLASS_SOURCES[@]}" \
  | sed 's/^class="//; s/"$//' | tr ' ' '\n' | grep . \
  | grep -v '[.]' | sort -u > "$TMP/used.txt"
# (grep -v '[.]': a "class" containing a dot is a Java class name inside an
# escaped XML sample, e.g. class="ch.qos.logback.core.ConsoleAppender" — text, not markup.)
comm -23 "$TMP/used.txt" "$TMP/defined.txt" > "$TMP/undefined.txt"

: > "$TMP/undefined-where.txt"
while IFS= read -r cls; do
  where="$(grep -rlE "class=\"([^\"]* )?$cls( [^\"]*)?\"" --include='*.html' "$SITE_ROOT" | head -1)"
  n="$(grep -rlE "class=\"([^\"]* )?$cls( [^\"]*)?\"" --include='*.html' "$SITE_ROOT" | grep -c . || true)"
  printf '%s  (%s file(s), e.g. %s)\n' "$cls" "$n" "${where#"$REPO_ROOT/"}" >> "$TMP/undefined-where.txt"
done < "$TMP/undefined.txt"

UNDEF_N=$(grep -c . "$TMP/undefined.txt" || true)
if [[ "$UNDEF_N" -eq 0 ]]; then
  pass "every class used in HTML is defined in css/"
else
  fail "$UNDEF_N class(es) used but defined in no stylesheet"
  show_capped "$(cat "$TMP/undefined-where.txt")"
  hint 'fix: define it in main.css, or remove it from the markup'
fi

# ─── Check 10: Forbidden markup ───────────────────────────────────────────────
#
# Two CLAUDE.md prohibitions that are greppable:
#   - inline style="..." on topic pages (presentation belongs in main.css)
#   - ASCII box diagrams with boxes side by side: two TOP corners (┌) on one
#     line. They break at 320px; a vertical diagram or a directory tree is fine.
#     Only ┌ is checked on purpose: └──┘ └──┘ on its own is an underline brace
#     annotating the parts of a single line above it (JWT segments, URL parts),
#     not a box — the first version of this check flagged three of those in CI.
#
# LC_ALL=C.UTF-8 makes grep treat ┌ as ONE character everywhere. Under the C
# locale (Git Bash's default) [^┐] is byte-wise, also excludes the bytes of ─,
# and the pattern silently never matched locally while it did match in CI.

header "10. Forbidden markup"

grep -rn 'style="' --include='*.html' "$TOPICS_DIR" 2>/dev/null \
  | sed "s|^$REPO_ROOT/||" | cut -c1-140 > "$TMP/forbidden.txt" || true
LC_ALL=C.UTF-8 grep -rnE '┌[^┌┐]*┐.*┌' --include='*.html' "$TOPICS_DIR" 2>/dev/null \
  | sed "s|^$REPO_ROOT/||" | cut -c1-140 | sed 's/^/side-by-side boxes: /' >> "$TMP/forbidden.txt" || true

FORBID_N=$(grep -c . "$TMP/forbidden.txt" || true)
if [[ "$FORBID_N" -eq 0 ]]; then
  pass "no inline styles and no side-by-side box diagrams in topics/"
else
  fail "$FORBID_N forbidden construct(s)"
  show_capped "$(cat "$TMP/forbidden.txt")"
  hint 'fix: a named class in main.css; a multi-column diagram becomes a <table>'
fi

# ─── Check 11: Every page is listed on the index ──────────────────────────────
#
# Check 7 counts category cards; it never checked what is inside them. A page
# missing from its card is reachable only through search.

header "11. Index cards"

grep -o 'href="topics/[^"#]*"' "$SITE_ROOT/index.html" | sed 's/^href="//; s/"$//' | sort -u > "$TMP/cards.txt"
comm -13 "$TMP/cards.txt" "$TMP/disk.txt" > "$TMP/uncarded.txt"
comm -23 "$TMP/cards.txt" "$TMP/disk.txt" | sed 's/^/dead: /' >> "$TMP/uncarded.txt"

UNCARD_N=$(grep -c . "$TMP/uncarded.txt" || true)
if [[ "$UNCARD_N" -eq 0 ]]; then
  pass "every topic page is linked from a category card"
else
  fail "$UNCARD_N page(s) missing from, or dead in, the index cards"
  show_capped "$(cat "$TMP/uncarded.txt")"
fi

# ─── Check 12: Canonical URL ──────────────────────────────────────────────────
#
# Each page declares its own absolute URL. A canonical copied from another page
# with the template tells search engines to drop this one as a duplicate.

header "12. SEO head"

CANON_BASE='https://karlete.github.io/javadevbible/javabible/'
: > "$TMP/canon.txt"
RX_CANON='<link rel="canonical" href="([^"]*)"'
RX_OGIMG='<meta property="og:image" content="([^"]*)"'
RX_TITLE='<title>([^<]*)</title>'
while IFS= read -r -d '' f; do
  rel="${f#"$SITE_ROOT/"}"
  slurp "$f"

  first_match "$RX_CANON"; canon="$MATCH"
  if [[ -z "$canon" ]]; then
    printf '%s  →  no <link rel="canonical">\n' "$rel" >> "$TMP/canon.txt"
  elif [[ "$canon" != "$CANON_BASE$rel" ]]; then
    printf '%s  →  canonical is %s\n' "$rel" "$canon" >> "$TMP/canon.txt"
  elif [[ "$FILE_CONTENT" != *'property="og:title"'* ]]; then
    printf '%s  →  no Open Graph tags\n' "$rel" >> "$TMP/canon.txt"
  fi

  # og:image must be a file that exists in the repo, not just a URL.
  first_match "$RX_OGIMG"
  if [[ -n "$MATCH" && ! -f "$SITE_ROOT/${MATCH#"$CANON_BASE"}" ]]; then
    printf '%s  →  og:image %s does not exist on disk\n' "$rel" "$MATCH" >> "$TMP/canon.txt"
  fi

  # <title>: "<something> - JavaDev Bible" on topic pages, at most 70 characters
  # (Google cuts titles at roughly 60–70).
  first_match "$RX_TITLE"; title="$MATCH"
  charlen "$title"
  if [[ "$CHARLEN" -gt 70 ]]; then
    printf '%s  →  <title> is %s chars (max 70)\n' "$rel" "$CHARLEN" >> "$TMP/canon.txt"
  fi
  if [[ "$rel" == topics/* && "$title" != *' - JavaDev Bible' ]]; then
    printf '%s  →  <title> does not end with " - JavaDev Bible"\n' "$rel" >> "$TMP/canon.txt"
  fi

  # Structured data: topic pages carry a BreadcrumbList whose last item is the page itself.
  if [[ "$rel" == topics/* ]]; then
    if [[ "$FILE_CONTENT" != *'"@type": "BreadcrumbList"'* ]]; then
      printf '%s  →  no JSON-LD BreadcrumbList\n' "$rel" >> "$TMP/canon.txt"
    elif [[ "$FILE_CONTENT" != *"\"item\": \"$CANON_BASE$rel\""* ]]; then
      printf '%s  →  JSON-LD breadcrumb does not end at this page\n' "$rel" >> "$TMP/canon.txt"
    fi
  fi
done < <(find "$SITE_ROOT" -name '*.html' -not -path '*/features/*' -print0)

# Google Search Console verifies ownership through this file. Deleting it
# silently un-verifies the property; nothing else would notice.
GSC_FILE="$(find "$REPO_ROOT" -maxdepth 1 -name 'google*.html' | head -1)"
if [[ -z "$GSC_FILE" ]]; then
  printf 'google*.html  →  Search Console verification file missing from the repo root\n' >> "$TMP/canon.txt"
fi

CANON_N=$(grep -c . "$TMP/canon.txt" || true)
if [[ "$CANON_N" -eq 0 ]]; then
  pass "canonical, Open Graph, titles, JSON-LD breadcrumbs and Search Console file all in place"
else
  fail "$CANON_N SEO problem(s) in <head> or the repo root"
  show_capped "$(cat "$TMP/canon.txt")"
  hint 'fix: copy the <head> block from topics/databases/relationships.html and adjust the URLs'
fi

# ─── Check 13: Sitemap ↔ disk ─────────────────────────────────────────────────

header "13. Sitemap"

SITEMAP="$SITE_ROOT/sitemap.xml"
if [[ ! -f "$SITEMAP" ]]; then
  fail "sitemap.xml not found"
else
  grep -o '<loc>[^<]*</loc>' "$SITEMAP" | sed "s|<loc>$CANON_BASE||; s|</loc>||" | sort -u > "$TMP/sitemap.txt"
  { printf 'index.html\nabout.html\n'; cat "$TMP/disk.txt"; } | sort -u > "$TMP/pages.txt"
  { comm -23 "$TMP/sitemap.txt" "$TMP/pages.txt" | sed 's/^/ghost:   /'
    comm -13 "$TMP/sitemap.txt" "$TMP/pages.txt" | sed 's/^/missing: /'
    grep '<loc>' "$SITEMAP" | grep -v '<lastmod>' | sed 's/.*<loc>\([^<]*\)<\/loc>.*/no lastmod: \1/'
    # Root sitemap index: what "sitemap.xml" in Search Console resolves to.
    if ! grep -q "<loc>${CANON_BASE}sitemap.xml</loc>" "$REPO_ROOT/sitemap.xml" 2>/dev/null; then
      printf 'sitemap.xml (repo root): missing, or not pointing at javabible/sitemap.xml\n'
    fi; } > "$TMP/sitemap-diff.txt"
  SM_N=$(grep -c . "$TMP/sitemap-diff.txt" || true)
  if [[ "$SM_N" -eq 0 ]]; then
    pass "sitemap.xml lists exactly the $(grep -c . "$TMP/pages.txt") pages on disk"
  else
    fail "sitemap.xml out of sync ($SM_N difference(s))"
    show_capped "$(cat "$TMP/sitemap-diff.txt")"
    hint "fix: add/remove the <url><loc>${CANON_BASE}...</loc></url> line"
  fi
fi

# ─── Check 14: Field injection in sample code ─────────────────────────────────
#
# CLAUDE.md: constructor injection always. Allowed: test classes (Spring's
# TestContext injects fields; it is the documented idiom) and blocks that show
# field injection on purpose as the ❌ example.

header "14. Field injection"

awk '
  FNR == 1 { inpre = 0 }
  /<pre[ >]/ && !inpre { inpre = 1; buf = ""; start = FNR }
  inpre { buf = buf $0 "\n" }
  inpre && /<\/pre>/ {
    inpre = 0
    if (buf ~ /@Autowired<\/span> *<span class="keyword">(private|protected)/ &&
        buf !~ /@(Test|SpringBootTest|WebMvcTest|DataJpaTest|ParameterizedTest)/ &&
        buf !~ /❌/)
      printf "%s:%d\n", FILENAME, start
  }
' $(find "$TOPICS_DIR" -name '*.html' | sort) 2>/dev/null \
  | sed "s|^$REPO_ROOT/||" > "$TMP/fieldinj.txt"

FI_N=$(grep -c . "$TMP/fieldinj.txt" || true)
if [[ "$FI_N" -eq 0 ]]; then
  pass "no @Autowired field injection outside tests and ❌ examples"
else
  fail "$FI_N code block(s) with @Autowired field injection"
  show_capped "$(cat "$TMP/fieldinj.txt")"
  hint 'fix: a final field + a single constructor (no @Autowired needed since Spring 4.3)'
fi

# ─── Check 15: Interview questions ────────────────────────────────────────────
#
# CLAUDE.md: every page ends with Junior and Senior interview questions, each a
# <details class="qa"> (collapsed answer). The 596 questions were converted
# from <p><strong>Q: …</strong><br> on 2026-11-24; this keeps the old form
# from coming back through copy-paste, and a page from losing a level.
#
# QA_MIN is the per-level minimum CLAUDE.md asks for (3 junior + 3 senior).
# It was 1 while ten pages had only 2 in a level; raised on 2026-11-25 once
# they were filled in.

header "15. Interview questions"

QA_MIN=3

grep -rln '<p><strong>Q:' --include='*.html' "$TOPICS_DIR" 2>/dev/null \
  | sed "s|^$REPO_ROOT/||; s|$| → old <p><strong>Q: format|" > "$TMP/qa.txt" || true

awk -v min="$QA_MIN" '
  function report() {
    if (prev != "" && (j < min || s < min))
      printf "%s → junior %d, senior %d (minimum %d each)\n", prev, j, s, min
  }
  FNR == 1 { report(); prev = FILENAME; j = 0; s = 0; lvl = "" }
  /info-box-title">(🎓|&#x1F393;)/ { lvl = "j" }
  /info-box-title">(🔥|&#x1F525;)/ { lvl = "s" }
  /<details class="qa">/ { if (lvl == "j") j++; else if (lvl == "s") s++ }
  END { report() }
' $(find "$TOPICS_DIR" -name '*.html' | sort) 2>/dev/null \
  | sed "s|^$REPO_ROOT/||" >> "$TMP/qa.txt"

QA_N=$(grep -c . "$TMP/qa.txt" || true)
if [[ "$QA_N" -eq 0 ]]; then
  pass "every page has junior and senior questions as <details class=\"qa\">"
else
  fail "$QA_N page(s) with missing or old-format interview questions"
  show_capped "$(cat "$TMP/qa.txt")"
  hint 'fix: copy the <details class="qa"> markup from topics/databases/relationships.html'
fi

# ─── Summary ──────────────────────────────────────────────────────────────────

printf '\n'
if [[ "$CHECKS_FAILED" -eq 0 ]]; then
  printf '%s%s✓ %d/%d checks passed.%s\n' "$BOLD" "$GREEN" "$CHECKS_RUN" "$CHECKS_RUN" "$RESET"
  exit 0
else
  printf '%s%s✗ %d of %d checks failed.%s\n' \
    "$BOLD" "$RED" "$CHECKS_FAILED" "$CHECKS_RUN" "$RESET"
  exit 1
fi
