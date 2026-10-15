# Koush Lab

The Neuroimaging and Cognitive Neuroscience Laboratory website at Skoltech.

**Live site:** https://utoprey.github.io/koush_lab/

A static English-language website using HTML, CSS, and vanilla JavaScript. No package installation or build step is required. Content and navigation also work without JavaScript; JavaScript adds the mobile menu, publication filters, and current-section indicator.

## Local preview

From the repository root:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/.

## Editing

- `index.html`: research, publications, software, team, news, contacts, and search metadata.
- `assets/styles.css`: responsive layouts, typography, print styles, and reduced-motion support.
- `assets/site.js`: navigation and publication filters.
- `assets/team/`: optimized portraits served by the website. Originals are preserved in `images/`.
- `assets/brain-network.svg`: original conceptual illustration, not an experimental measurement.
- `assets/social-card.png`: image used when sharing the site.
- `assets/favicon.svg`: site icon.
- `CONTENT_SOURCES.md`: sources used to verify publication details and new profile content.

To add a publication, copy an `article.publication`, set its `data-year`, and update the initial count in `#publication-status`. For a new year, add a matching filter button. Verify DOI links, author lists, venue names, and dates against the publisher. Distinguish a workshop's conference year from its proceedings publication year.

For team changes, edit the relevant `article.member` and group count. Use a real supplied portrait or an initials placeholder. Do not infer enrollment years or promotions. Links opening in a new tab must include `rel="noopener noreferrer"`.

News uses `<time datetime="YYYY-MM">`. Older entries live in `details.news-archive`. Update `sitemap.xml` when content changes. Preserve the canonical URL and Google Search Console verification tag.

## Publishing

GitHub Pages deploys automatically from the root of `main`. Commit and push reviewed changes, then verify the Pages build and live URL. Home-page asset paths are relative so the project works under `/koush_lab/`.

Before publishing, check mobile and desktop layouts, menu keyboard interaction, year filters, archive expansion, images, anchors, and external links. There should be no missing assets or JavaScript console errors. Content should remain readable without JavaScript.

## Fonts and assets

Manrope is bundled locally under the SIL Open Font License; see `assets/OFL-Manrope.txt`. No external font or icon CDN is required. Interface icons and the network illustration are SVG. Original portraits remain the property of their respective owners.
