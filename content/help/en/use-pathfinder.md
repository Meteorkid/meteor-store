## What is Pathfinder?

Pathfinder is a free information and learning-path hub for university students, available at `/pathfinder`. It brings together four kinds of content:

- beginner-friendly open-source projects
- student competitions and challenges
- internships and official recruiting portals
- AI updates from first-party sources

It is more than a news feed. Verified items with clear learning value are tagged by difficulty, direction, time commitment, and practical requirements, then used to build an actionable four-to-eight-week path.

## Browsing the trusted catalog

Use the Pathfinder sub-navigation to switch between Discover, Opportunities, Directions, and My Path. Browsing does not require an account.

Discover highlights editor picks, approaching deadlines, new opportunities, and AI updates. Opportunities supports filters for item type, technical direction, difficulty, and remote status; deadline filters appear when the catalog contains normalized deadlines. Search and filters are reflected in the URL, so the current view can be shared.

Each card shows:

- publisher or organisation
- item type, direction, and difficulty
- original source and trust level
- last verification time
- a known deadline or a note to verify it on the original site

The detail page adds eligibility, prerequisites, expected effort, expected outcome, and the official source link. Pathfinder stores facts and a short summary rather than copying the original page. Always re-check the source before applying, submitting, or contributing.

## Building a path around a real opportunity

Select “Build a path from this” on any eligible open-source project, competition, or internship, or open My Path directly. The form asks about:

- your goal and technical direction
- study year and current foundation
- weekly time and preferred duration
- device, network, and budget
- practical constraints such as fragmented time, weak foundations, or no mentor

Pathfinder first removes expired or incompatible items, then ranks the remaining catalog by goal fit, difficulty progression, source trust, freshness, and return on effort. The core process is deterministic and requires no AI provider or API key.

If you select “no foundation” and the catalog has no verified beginner bridge for that direction, Pathfinder stops with a clear explanation instead of skipping Python or programming prerequisites and inventing an advanced contribution path. Opportunities with complex institution or graduation-date rules remain discoverable but require a manual check and are not scheduled automatically. Known foreign-currency costs are considered only after you explicitly accept that kind of expense.

## Reading the result

A path runs for four to eight weeks and normally moves through preparation, practice, real action, delivery, and review. Every week includes:

- a clear objective
- one or more concrete tasks
- estimated time
- a referenced catalog item
- verifiable evidence, such as a commit, portfolio link, application package, or mock-interview record
- an alternative action if the original resource becomes unavailable

When a competition or internship has a deadline, the schedule works backwards from it. If the remaining time is unrealistic, Pathfinder shows a warning rather than promising an outcome. AI updates provide context but never count as completed learning work.

## Progress and privacy

The first version stores the path and checked tasks only in the current browser:

- no registration or sign-in is required
- your profile and progress are not written to the Meteor Store database
- clearing browser data also removes the saved path
- cross-device sync is not currently available

If a catalog item expires or is withdrawn, the saved path remains available and prompts you to regenerate it.

## How information is updated

Pathfinder prioritises official APIs, RSS feeds, and first-party pages. Automatically collected entries normally enter a moderation queue and become public only after their source, eligibility, and freshness are checked. Only stable, explicitly configured official feeds may be auto-published.

Every public item retains its original link and last verification time. Application requirements, costs, eligibility, and deadlines can change without notice, so the publisher’s page is always authoritative.

## Frequently asked questions

### Do I need my own API key?

No. The core path is generated from the trusted catalog with deterministic rules.

### Do I need to sign in?

No. Browsing, filtering, generating a path, and tracking local progress all work anonymously.

### Why can’t some AI updates be added to a path?

Popularity is not the same as learning value. Only reviewed items with a concrete action and outcome can become path tasks.

### Why is a competition or role missing?

The first version prioritises trust and actionability over total volume. Items without a confirmed source, eligibility, or deadline are not published automatically.
