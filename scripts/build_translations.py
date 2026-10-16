#!/usr/bin/env python3
"""Build static Russian pages from the English pages and a reviewed catalog."""

import argparse
import html
import json
import posixpath
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://utoprey.github.io/koush_lab/"
ROUTES = ["", "news/", "research/", "members/", "publications/", "software/", "contact/", "404.html"]
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


class RussianPage(HTMLParser):
    def __init__(self, route, catalog):
        super().__init__(convert_charrefs=True)
        self.route = route
        self.catalog = catalog
        self.output = []
        self.stack = []
        self.missing = set()

    def translate(self, value):
        if not value.strip():
            return value
        match = re.fullmatch(r"(\s*)(.*?)(\s*)", value, re.S)
        before, text, after = match.groups()
        if text not in self.catalog:
            if re.search(r"[A-Za-z]", text) and "@" not in text:
                self.missing.add(text)
            return value
        return before + self.catalog[text] + after

    def url(self, value, language="ru"):
        if not value or value.startswith("#"):
            return value
        absolute = urlsplit(urljoin(BASE + self.route, value))
        root = urlsplit(BASE)
        if absolute.netloc != root.netloc or not absolute.path.startswith(root.path):
            return value
        path = absolute.path[len(root.path):]
        if path.startswith("ru/"):
            path = path[3:]
        if path == "index.html":
            path = ""
        if path in ROUTES:
            path = ("ru/" if language == "ru" else "") + path
        destination = root.path + path
        if value.startswith(("https://", "http://")):
            return urlunsplit((absolute.scheme, absolute.netloc, destination, absolute.query, absolute.fragment))
        folder = root.path + "ru/" + (self.route if self.route.endswith("/") else "")
        relative = posixpath.relpath(destination, folder)
        if destination.endswith("/"):
            relative = "./" if relative == "." else relative + "/"
        return urlunsplit(("", "", relative, absolute.query, absolute.fragment))

    def start(self, tag, attributes, closed=False):
        attrs = dict(attributes)
        classes = attrs.get("class", "").split()
        original = self.stack[-1][2] if self.stack else False
        in_publication = any("publication" in entry[1].get("class", "").split() for entry in self.stack)
        if in_publication and (tag == "h2" or "publication-authors" in classes or "publication-venue" in classes):
            original = True
            attrs["lang"] = "en"
        if "publication-kind" in classes:
            original = False
            attrs["lang"] = "ru"
        if tag == "html":
            attrs["lang"] = "ru"
        if "data-language" in attrs:
            attrs.pop("aria-current", None)
            if attrs["data-language"] == "ru":
                attrs["aria-current"] = "true"
        for name in ("aria-label", "alt", "title"):
            if name in attrs:
                attrs[name] = self.translate(attrs[name])
        if tag == "meta":
            key = attrs.get("name", attrs.get("property"))
            if key in {"description", "author", "og:title", "og:description", "og:image:alt", "twitter:title", "twitter:description"}:
                attrs["content"] = self.translate(attrs["content"])
            elif key == "og:locale":
                attrs["content"] = "ru_RU"
            elif key == "og:url":
                attrs["content"] = self.url(attrs["content"])
        if not (tag == "link" and attrs.get("rel") == "alternate"):
            for name in ("href", "src"):
                if name in attrs:
                    attrs[name] = self.url(attrs[name], attrs.get("data-language", "ru"))
        rendered = "".join(" " + name + ("" if value is None else '="' + html.escape(value, quote=True) + '"') for name, value in attrs.items())
        self.output.append("<" + tag + rendered + (" />" if closed else ">"))
        if tag not in VOID and not closed:
            self.stack.append((tag, attrs, original))

    def handle_starttag(self, tag, attrs):
        self.start(tag, attrs)

    def handle_startendtag(self, tag, attrs):
        self.start(tag, attrs, True)

    def handle_endtag(self, tag):
        self.output.append("</" + tag + ">")
        if self.stack and self.stack[-1][0] == tag:
            self.stack.pop()

    def structured_data(self, value):
        if isinstance(value, dict):
            result = {key: self.structured_data(item) for key, item in value.items()}
            if result.get("@type") in {"WebPage", "WebSite"}:
                result["inLanguage"] = "ru"
            return result
        if isinstance(value, list):
            return [self.structured_data(item) for item in value]
        if isinstance(value, str):
            return self.url(value) if value.startswith(BASE) else self.catalog.get(value, value)
        return value

    def handle_data(self, value):
        if self.stack and self.stack[-1][0] in {"script", "style"}:
            if self.stack[-1][1].get("type") == "application/ld+json":
                value = json.dumps(self.structured_data(json.loads(value)), ensure_ascii=False)
            self.output.append(value)
        else:
            original = self.stack[-1][2] if self.stack else False
            self.output.append(html.escape(value if original else self.translate(value), quote=False))

    def handle_decl(self, value):
        self.output.append("<!" + value + ">")

    def handle_comment(self, value):
        self.output.append("<!--" + value + "-->")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Report stale generated files without writing them")
    args = parser.parse_args()
    catalog = json.loads((ROOT / "translations/ru.json").read_text())
    rendered = {}
    missing = set()
    for route in ROUTES:
        filename = route + "index.html" if route.endswith("/") or not route else route
        page = RussianPage(route, catalog)
        page.feed((ROOT / filename).read_text())
        page.close()
        missing.update(page.missing)
        rendered[ROOT / "ru" / filename] = "".join(page.output)
    if missing:
        raise SystemExit("Missing Russian translations:\n" + "\n".join(sorted(missing)))
    stale = [str(path.relative_to(ROOT)) for path, text in rendered.items() if not path.exists() or path.read_text() != text]
    if args.check and stale:
        raise SystemExit("Regenerate Russian pages: " + ", ".join(stale))
    if not args.check:
        for path, text in rendered.items():
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
    print(f"Russian pages {'checked' if args.check else 'generated'}: {len(rendered)}")


if __name__ == "__main__":
    main()
