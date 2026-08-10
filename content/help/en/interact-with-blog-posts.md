## Interaction features overview

Beneath every blog post, you'll find a row of interaction buttons. These features let readers express appreciation, join the discussion, and help maintain community standards.

All interaction features require login. If you don't have an account yet, register and verify your email first. Reading articles does not require login — only active interactions do.

Here is how each of the four features works.

## Liking a post

The like button (typically a thumbs-up or similar icon) lets you show appreciation for the article's content. Click once to like, click again to unlike.

- The like count is public — everyone can see how many likes an article has received.
- Each user can like a given article only once.
- Like requests are rate-limited (30 per minute per user+IP). Normal usage won't trigger this; rapid toggling within seconds may be briefly restricted.
- Like count and status are fetched by the page's stats component on load, without a page refresh.

## Commenting

At the bottom of each article, the comments section lets you submit text. Comments are not immediately public — they go through admin review first.

- Click the comment box to start typing. Plain text only; Markdown and HTML are not supported in comments.
- After submission, your comment enters a "pending" state. It is invisible to other readers.
- Once an admin approves it, the comment appears publicly in the list below the article, showing your nickname and submission time.
- If the admin rejects it, the comment is not published. The system does not send individual rejection notifications.
- The visible comment list only includes approved comments. The comment count also only counts approved ones.

Comments are publicly visible. Do not include personal email addresses, order numbers, license keys, or other sensitive information.

## Bookmarking

The bookmark button (a heart icon) lets you save articles to a personal list for later reference.

- Click the heart once to bookmark; the icon fills in. Click again to remove the bookmark.
- Bookmarked articles are collected on the "My Favorites" page, accessible from the user menu in the navigation bar.
- The favorites list is ordered by when you bookmarked each article — most recently bookmarked first.
- Favorite counts on the listing page are fetched in a batch query, not one request per article, so list loading speed is not affected by the number of favorites.
- Like likes, bookmark toggling is rate-limited at 30 per minute per user+IP.
- Favorite status and count are fetched on page load without a refresh.

If an article you bookmarked is later deleted or taken down by its author, the bookmark record is preserved but the article will no longer appear in your favorites list.

## Reporting

If you find a comment or a reader-submitted post with inappropriate content, use the report feature to notify the admin.

- Report buttons appear next to every comment and in the header of reader-submitted article pages.
- When reporting, you must select a reason: Spam, Abuse/Harassment, NSFW, Illegal, or Other.
- The "Other" option allows you to add a text description with more context.
- After submission, the admin reviews the report and decides how to handle the reported content.
- Report submissions have a stricter rate limit (5 per minute per user+IP) because reports require manual admin review.

A few important points:

- Reporting does not automatically delete a comment or unpublish a post. It only notifies the admin. The admin manually decides what action to take after reviewing.
- The same content can be reported multiple times by the same user (for example, if new violations appear).
- The store owner's original articles are not subject to the report flow — those are maintained directly by the owner. For issues with owner articles, consider submitting a correction via GitHub.
- Reporting is one-way; the system does not notify you of the outcome.

If you are unsure whether a piece of content violates any rules, you can submit a report anyway — the admin will make the judgment. False or malicious reports may be ignored.
