#!/bin/zsh
# Builds the site for the GitHub Pages preview (served from a sub-folder, hidden from search engines).
# Output goes to dist-preview, which is gitignored on main and published on the gh-pages branch.
set -e
cd "$(dirname "$0")/.."
SITE_URL=https://felixgbondatpropnition.github.io SITE_BASE=/intrepid-luxe-preview PUBLIC_NOINDEX=1 npx astro build --outDir dist-preview
printf 'User-agent: *\nDisallow: /\n' > dist-preview/robots.txt
touch dist-preview/.nojekyll
