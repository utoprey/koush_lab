# Koush Lab

The Neuroimaging and Cognitive Neuroscience Laboratory website at Skoltech.

**Live site:** https://utoprey.github.io/koush_lab/

A static bilingual academic website using HTML, CSS, and vanilla JavaScript. English is the default; Russian pages live under `/ru/`. All pages are committed as HTML; no installation or build step is required. Content and navigation also work without JavaScript.

## Pages

| Page | File | Public path |
| --- | --- | --- |
| Home | `index.html` | `/koush_lab/` |
| News & Talks | `news/index.html` | `/koush_lab/news/` |
| Research | `research/index.html` | `/koush_lab/research/` |
| Members | `members/index.html` | `/koush_lab/members/` |
| Publications | `publications/index.html` | `/koush_lab/publications/` |
| Software | `software/index.html` | `/koush_lab/software/` |
| Contact | `contact/index.html` | `/koush_lab/contact/` |

The academic directory structure takes inspiration from the user's [MIP Lab members reference](https://mip.postech.ac.kr/members/). Koush Lab uses its own deep blue and teal palette, paired-signal mark, and wordmark. Team details belong to Koush Lab; no degrees or employment history were inferred from the reference.

## Local preview

From the repository root:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/ or http://127.0.0.1:4173/members/.

## Editing

- Edit English content in the relevant page's `index.html`.
- Add or update matching strings in `translations/ru.json`, then run `python3 scripts/build_translations.py`. Commit the generated `ru/` pages too.
- Run `python3 scripts/build_translations.py --check` to detect stale translations or missing catalog entries. The generator uses only the Python standard library.
- `assets/language.js`: restores an explicitly chosen Russian language on return to the home page. Direct page URLs retain their language.
- `assets/site.js`: language-choice storage, localized menu and publication counts, mobile navigation, and legacy links.
- `assets/styles.css`: shared typography, responsive layouts, navigation, and print styles.
- `assets/team/`: optimized portraits. Originals are preserved in `images/`.
- `assets/social-card-v3.png`: sharing image.
- `assets/favicon.svg`: site icon.
- `CONTENT_SOURCES.md`: sources for publication and profile details.

English navigation and footers are plain HTML shared across seven files. Russian pages and the Russian 404 page are generated from those sources; do not edit `ru/` directly. Update all pages when changing their links. Home-page links use paths such as `members/`; child pages use `../members/`. Each page has its own canonical URL and an `aria-current="page"` navigation link.

For a new team member, copy an `article.member-profile` into the appropriate group in `members/index.html`. Use a real supplied photo or an initials placeholder. Keep research interests and roles verified; do not infer degrees, enrollment years, or promotions.

To add a publication, copy an `article.publication` in `publications/index.html`, set `data-year`, and update the initial count in `#publication-status`. Add a filter button for a new year. Verify DOI, authors, venue, and dates against the publisher. Distinguish conference year from proceedings publication year.

News is grouped by year in `news/index.html`. Its `#talks` section lists talks and outreach with speaker links, event dates, and programmes or recordings; keep these separate from publication news. Home features two talks, and member profiles link to their relevant entries. Home includes three selected updates; update those separately when adding recent news. Preserve the Google Search Console verification tag. Add new public pages to `sitemap.xml`.

When updating CSS or JavaScript, change their query version consistently across all pages to avoid stale browser caches.

## Languages

EN / RU links appear on every page and keep the current section anchor. Links within each language stay in that language, including without JavaScript. An explicit choice is stored in `localStorage` when available; a returning visitor who selected RU is taken to the Russian home page. Browser locale does not override the English default. Storage being unavailable does not break switching.

Translate page text, metadata, alt text, and accessibility labels in `translations/ru.json`. Scientific publication titles, author lists, and venue names remain in their original form, marked as English where appropriate. Profiles and news use Russian names and descriptions. Shared portraits, fonts, scripts, and styles are not duplicated.

When adding a route, update `ROUTES` in the generator, add English/Russian `hreflang` links and the `page-route` meta tag, and add both URLs to `sitemap.xml`. Language-switch destinations are ordinary links; the shared script preserves the current query and hash.

## Publishing and checks

GitHub Pages deploys automatically from the root of `main`. Commit and push reviewed changes, then verify the build and public URLs.

Before publishing, run the translation freshness check, verify EN / RU switching, and check all pages in both languages at desktop and mobile widths, keyboard navigation, publication filters, images, relative links, and browser errors. Content should remain readable without JavaScript. The members page should use two columns on desktop and one on narrow screens.

## Fonts and assets

Lato is bundled locally under the SIL Open Font License. Cyrillic WOFF2 subsets (300, 400, 700) come from the full Lato fonts in Google Fonts and are loaded only for Cyrillic characters; see `assets/OFL-Lato.txt`. The site uses no external font or icon CDN. The paired-signal mark is an original SVG. Original portraits remain the property of their respective owners.
