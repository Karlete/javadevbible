#!/usr/bin/env bash
#
# assets.sh — stamp every stylesheet and script reference with ?v=<checksum>.
#
# GitHub Pages lets browsers cache CSS and JS for about ten minutes, and some
# keep them far longer. After a deploy that changes main.css, a returning
# reader would get the new HTML with the old stylesheet: classes the page
# uses are missing and the layout breaks until the cache expires. A query
# string that changes whenever the file's bytes change makes the browser
# fetch the new copy; an unchanged file keeps its URL and stays cached.
#
# Run it after editing anything in javabible/css/ or javabible/js/, then
# commit the touched pages with the asset:
#
#   bash tools/assets.sh
#
# verify.sh check 17 fails if any reference carries a stale or missing ?v=.
# The checksum is the CRC from POSIX cksum, in hex. .gitattributes forces LF,
# so a Windows checkout and CI compute the same value.
#
# Dependencies: bash, cksum, find, sed. Nothing else — same rule as verify.sh.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_ROOT="$REPO_ROOT/javabible"

# One sed expression per asset: any reference to css/main.css, with or
# without an old ?v=, becomes css/main.css?v=<crc>.
SED_ARGS=()
while IFS= read -r -d '' asset; do
  rel="${asset#"$SITE_ROOT/"}"                       # css/main.css
  crc="$(cksum < "$asset" | cut -d' ' -f1)"
  ver="$(printf '%08x' "$crc")"
  esc="${rel//./\\.}"
  SED_ARGS+=(-e "s#\\(\"[^\"]*\\)${esc}\\(?v=[0-9a-f]*\\)\\{0,1\\}\"#\\1${rel}?v=${ver}\"#g")
  printf '%-32s %s\n' "$rel" "$ver"
done < <(find "$SITE_ROOT/css" "$SITE_ROOT/js" -type f \( -name '*.css' -o -name '*.js' \) -print0 | sort -z)

CHANGED=0
while IFS= read -r -d '' page; do
  before="$(cat "$page")"
  sed -i "${SED_ARGS[@]}" "$page"
  if [[ "$before" != "$(cat "$page")" ]]; then CHANGED=$((CHANGED + 1)); fi
done < <(find "$SITE_ROOT" -name '*.html' -not -path '*/features/*' -print0; printf '%s\0' "$REPO_ROOT/404.html")

printf 'updated %d page(s)\n' "$CHANGED"
