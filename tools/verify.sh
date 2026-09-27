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
#   6. Missing meta description — topic page with no <meta name="description">
#   7. Hand-written counts    — "N topics" / "N categories" that disagree with disk
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
  if [[ "$(head -c 3 "$f" | od -An -tx1 | tr -d ' \n')" == "efbbbf" ]]; then
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

for doc in "$SITE_ROOT/index.html" "$REPO_ROOT/README.md" "$REPO_ROOT/CLAUDE.md"; do
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
