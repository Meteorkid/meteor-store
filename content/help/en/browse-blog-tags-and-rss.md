## Getting to the blog

Click "Blog" in the top navigation bar to open the blog listing page. This page shows every published article on the site — both the store owner's original posts and reader submissions — merged into a single feed ordered by publication date, newest first.

At the top of the blog homepage are two channel tabs: "Products & Tech" and "Humanities." Click a channel tab to see the sections that belong to it.

## The six blog sections

The Meteor Store blog is organized into six thematic sections, each with its own dedicated page, color theme, and RSS feed:

- **Product Updates** — Version releases, new features, and the thinking behind them.
- **Tech Notes** — Implementation details, architectural trade-offs, and real debugging stories.
- **Behind the Scenes** — The daily work and decision-making of a solo developer.
- **Emotions** — Relationships, loneliness, and self-doubt — personal writing that doesn't aim for conclusions.
- **Literature** — Essays, reflections, and reading notes.
- **Debate** — One question argued from both sides; the conclusion is left to the reader.

Section ordering and color theming are fixed. Each section has a distinct visual identity. Click a section name or card to enter its dedicated page, showing only articles from that section.

## The tag system

Each article can carry multiple tags. Tags are chosen by the author and provide thematic information beyond what the section alone conveys — for example, an article in the "Tech Notes" section might also be tagged with "Rust" and "performance."

On the blog listing page or any section page, clicking a tag beneath an article's excerpt takes you to that tag's aggregation page. The tag page lists every article that carries that tag, ordered by publication date. If a tag has many articles, start with the ones at the top.

Tags are global — they don't belong to any single section. The same tag can appear on articles across multiple sections.

## Subscribing via RSS

If you use an RSS reader to follow content, the Meteor Store blog offers RSS feeds at two levels of granularity:

- **Site-wide feed** — `/blog/feed.xml` — Every public article on the blog, across all sections.
- **Section feeds** — `/blog/section/{slug}/feed.xml` — For example, `/blog/section/tech/feed.xml` includes only articles from the Tech Notes section.

Add one or more feed URLs to your RSS reader. The feed updates automatically whenever a new article is published — including reader submissions that pass review.

RSS entry points appear in the footer on every page, as well as through the `◉ RSS` button on the blog listing page and section pages. Article pages also include RSS auto-discovery tags in the `<head>`, allowing RSS readers to detect feeds automatically.

## The anatomy of an article page

When you open an article, you'll see:

- **Title and publication date**.
- **Section label** — The section the article belongs to. Click it to jump to that section's listing page.
- **Body content** — Rendered from Markdown with consistent typography across the site.
- **Tag list** — Tags associated with the article; each is clickable.
- **Interaction area** — Like, comment, bookmark, and report buttons. These require login. See the related help article for details on each.
- **Author signature** — The store owner's articles end with a handwritten-style signature ("Meteor"). Reader submissions end with the author's avatar, nickname, and bio.

If you spot an issue with an article's content, use the report feature to notify the admin. Note that the store owner's own articles do not go through the report flow — for those, consider submitting a correction via GitHub.
