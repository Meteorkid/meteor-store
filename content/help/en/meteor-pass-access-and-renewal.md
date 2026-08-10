## What Meteor Pass covers

Meteor Pass is a site-wide membership for Meteor Store. It covers every product currently available in the store and every product added in the future — you won't pay extra when new products launch.

Products that run in the browser open directly on the site. For the rest, the system issues license keys that you can find on your Account page. The Pass gives you a license to use them all; it does not change how each individual product is delivered.

## Plans and pricing

Three plans are available on the homepage pricing section. Pricing is the same for everyone — there are no regional tiers or hidden fees:

| Plan | Price | Original | Duration |
|------|-------|----------|----------|
| Monthly | ¥9 | ¥39 | 1 month |
| Annual | ¥19 | ¥99 | 12 months |
| Lifetime | ¥99 | ¥199 | Forever |

Monthly covers you for a single billing cycle and works well if you are trying things out or only need access for a short window. Annual is the recommended plan — it averages about ¥1.6 per month and saves you 82% compared to paying monthly. Lifetime is a one-time purchase with no expiration or renewal ever.

All plans include the same products. The differences are duration, price, and support priority (Annual and Lifetime users get priority email support; Lifetime users also get a direct line to the store owner).

### What each plan includes

- Every product in the store, licensed for the duration of your plan
- Web apps that open directly in the browser; downloadable and license-key products delivered through the normal channels
- New products added to the store after your purchase — automatically covered
- Email support (priority for Annual and Lifetime; direct-to-maker for Lifetime)

## How Pass validity works

Pass validity is calculated from the moment the Pass is granted — that is, when your payment completes or your invitation code is redeemed. The coverage period starts at that point, not at the start of a calendar month or the date you first use a product.

### Monthly and annual plans

For monthly and annual subscriptions, the system adds the plan's duration to the grant time and clamps the result to the last day of the target month. This prevents a subtle edge case: without clamping, buying a monthly Pass on January 31 would produce a February 28 expiry — but the naive calculation would overflow to March 2 or March 3, giving you two extra days for free every cycle. The clamping makes the expiry date predictable: buy on January 31, and your monthly Pass expires on February 28 (or February 29 in a leap year).

### Lifetime plan

A lifetime Pass has no expiration date. It remains valid permanently and never requires renewal.

## Stacking multiple Passes

If you already have an active Pass and purchase or redeem another one, the new Pass does not overwrite the existing one. Instead, the coverage periods are stacked: the system looks at your current expiration date and the grant time of the new Pass, picks whichever is later, and starts the new duration from there.

Here is a concrete example: you bought an annual Pass that expires on December 31. In November, you redeem an invitation code for a monthly Pass. Since your existing expiry (December 31) is later than the redemption date (November), the new month is added starting from December 31 — giving you coverage through the end of January.

The same logic applies in the other direction. If your existing Pass already expired in October and you buy a new one in November, the new Pass starts from the November purchase date because the November date is later than the October expiry. You never lose time by renewing early.

## Renewal and expiration

Before your monthly or annual Pass expires, the system sends a reminder to your registered email address. If you do not renew before the expiry date, products covered solely by the Pass become inaccessible.

This does not affect products you bought individually. Single-product purchases are permanent and stay with your account regardless of your Pass status. If you paid for a product directly, losing Pass coverage does not take it away.

To renew, simply purchase a new Pass plan from the homepage pricing section. The new coverage stacks on top of your existing expiry as described above.

Lifetime Passes do not expire and do not require renewal.

## Pass and single-product purchases

Single-product purchases take priority over Pass coverage. If you bought a product directly — whether through the store, a free claim, or an invitation code — that product remains yours permanently. The Pass badge next to it on the My Products page only indicates that Pass would have covered it too; it does not mean Pass is the only source of access.

Pass fills in the gaps. Any product you have not purchased individually but is covered by your Pass becomes available through the Pass. On the My Products and Apps pages, Pass-covered products are marked with a "Pass" badge so you can tell them apart from direct purchases.

### Refunds and Pass coverage

If you request a refund for your Meteor Pass, the Pass is revoked and all products you were accessing through the Pass become unavailable. Products you bought individually — whether before, during, or after the Pass period — are completely unaffected. A Pass refund only removes what the Pass itself provided.

For the full refund conditions, time window, and process, see the refund policy article.
