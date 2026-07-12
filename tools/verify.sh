#!/usr/bin/env bash
#
# verify.sh — Integrity checker for JavaDev Bible
#
# A static site with 90 hand-maintained pages has no compiler and no type
# system. Nothing catches a rename that silently orphans eight inbound links,
# or a deleted page still listed in the search index as a 404 waiting to
# happen. This script is the missing compiler: it fails loudly, before the
# commit, on the four classes of drift this project has actually suffered.
#
#   1. Broken internal links  — <a href> or <link href> pointing at a dead file
#   2. Search index drift     — search-index.json out of sync with disk
#   3. UTF-8 BOM              — forbidden by CLAUDE.md, present anyway
#   4. Debug leftovers        — console.log shipped to production
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
      sed -n '2,25p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
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

header() { [[ $QUIET -eq 0 ]] && printf '\n%s%s%s\n' "$BOLD" "$1" "$RESET"; return 0; }
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

# ─── Summary ──────────────────────────────────────────────────────────────────

printf '\n'
if [[ "$CHECKS_FAILED" -eq 0 ]]; then
  printf '%s%s✓ 4/4 checks passed.%s\n' "$BOLD" "$GREEN" "$RESET"
  exit 0
else
  printf '%s%s✗ %d of 4 checks failed.%s\n' \
    "$BOLD" "$RED" "$CHECKS_FAILED" "$RESET"
  exit 1
fi
