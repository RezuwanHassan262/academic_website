#!/usr/bin/env python3
"""
fetch_scholar.py

Method two of scripts/scholarScraper.js: fetches Google Scholar metrics through
the `scholarly` package, which handles Scholar's quirks far better than a raw
HTTP request can.

Contract with the Node caller:
  * stdout carries exactly one JSON object on success and nothing else, so the
    caller can JSON.parse the trimmed stdout directly.
  * everything diagnostic goes to stderr.
  * exit 0 = success, 1 = the fetch failed, 2 = `scholarly` is not installed.
    Keep these distinct; in six months the CI log is the only diagnostic.

Usage:  python3 scripts/fetch_scholar.py
"""

import json
import os
import sys
from datetime import datetime

# The profile is identified here and nowhere else in this file. Keep it in step
# with SCHOLAR_AUTHOR_ID at the top of scripts/scholarScraper.js.
SCHOLAR_AUTHOR_ID = "ZUrWZhQAAAAJ"


def warn(message):
    print(message, file=sys.stderr)


try:
    from scholarly import scholarly, ProxyGenerator
except ImportError:
    warn("the `scholarly` package is not installed — install it with: pip install scholarly")
    sys.exit(2)


def configure_proxy():
    """Route through ScraperAPI when a key is available.

    A broken proxy must not prevent an unproxied attempt, so every failure here
    is a warning rather than a fatal error.
    """
    key = os.environ.get("SCRAPERAPI_KEY")
    if not key:
        return
    try:
        pg = ProxyGenerator()
        if pg.ScraperAPI(key):
            scholarly.use_proxy(pg)
            warn("ScraperAPI proxy configured")
        else:
            warn("ScraperAPI rejected the key; continuing without a proxy")
    except Exception as exc:  # noqa: BLE001 - a proxy problem is never fatal here
        warn("could not configure the ScraperAPI proxy (%s); continuing without one" % exc)


def main():
    configure_proxy()

    try:
        author = scholarly.search_author_id(SCHOLAR_AUTHOR_ID)
        author = scholarly.fill(author, sections=["basics", "indices", "counts"])
    except Exception as exc:  # noqa: BLE001 - reported to the caller via exit 1
        warn("fetch failed for author id %s: %s" % (SCHOLAR_AUTHOR_ID, exc))
        sys.exit(1)

    # Google's second column is always "current year minus five". This method
    # computes it rather than reading it, which is why it can disagree with the
    # other two methods for a few days each January - the component's fallback
    # chain is what absorbs that.
    since_year = str(datetime.now().year - 5)

    payload = {
        "citations": author.get("citedby", 0) or 0,
        "citationsSince": author.get("citedby5y", 0) or 0,
        "hIndex": author.get("hindex", 0) or 0,
        "hIndexSince": author.get("hindex5y", 0) or 0,
        "i10Index": author.get("i10index", 0) or 0,
        "i10IndexSince": author.get("i10index5y", 0) or 0,
        "sinceYear": since_year,
    }

    print(json.dumps(payload))
    sys.exit(0)


if __name__ == "__main__":
    main()
