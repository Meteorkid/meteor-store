## What is the online trial

The online trial is a no-login-required way to try web apps before you commit. Click the "Free Trial" button on a product detail page and the trial opens in an embedded panel on the same page, or takes you to a dedicated trial page.

The trial route is `/apps/{product id}/trial`, and it does **no authorization check** — anyone can open it, whether logged in or not, whether they have purchased anything or not. The trial exists so you can experience what the app actually does before deciding to pay.

## Differences between trial and full access

### How you get there

- **Trial** — Click the "Free Trial" button on the product detail page, or visit `/apps/{product id}/trial` directly. No login, no purchase, no license key required.
- **Full access** — Open the product from the [My Products](/en/apps) page. The server checks your account authorization; without it, access is denied (you will see a 404 or be redirected to purchase).

### Page environment

- **Trial** — The trial page is a standalone environment without the site-wide navigation bar or footer. You focus on the app itself.
- **Full access** — The full page includes the standard navigation bar and footer, giving you the same browsing experience as the rest of the site.

### Feature completeness

- **Trial** — The trial runs the exact same application code as the full version. Features and interface are identical. The trial is not a stripped-down demo — it shows you the real thing.
- **Full access** — Features and interface match the trial. The difference is not in what the app can do, but in access control and data ownership.

### Data persistence

- **Trial** — Data created during a trial session is **not saved to your account**. Closing the browser tab or refreshing the page may cause trial data to be lost. Do not enter sensitive information or start work you intend to keep in the trial environment.
- **Full access** — In the full version, app data is associated with your logged-in account. How data is stored and persisted depends on the individual app — some store data locally in the browser, others on the server. Check the app's own documentation for details.

## Moving from trial to full access

If you like what you see in the trial, two ways to get full access:

1. **Buy the individual product** — Pick a paid tier or claim the ¥0 free tier on the product detail page. After purchase or claiming, open the full version from the My Products page.
2. **Get Meteor Pass** — If several products interest you, a Pass (monthly / annual / lifetime) is usually cheaper than buying them one by one. Pass covers every product in the store. Once you have it, go to My Products and open the full version.

## Which products have a trial

Not every product supports online trial. Only web apps — the ones showing a "Free Trial" section on their product detail page — have this feature. Downloadable apps and license key products do not have an online trial; they either need local installation or activation in third-party software, so they cannot be tried directly in the browser.

## Common questions

### Do I need to log in to try?

No. The trial is intentionally login-free — you can learn what a product does without creating an account.

### Does trial data transfer to the full version?

Generally no. The trial environment is temporary and there is no data sync between the trial session and your account. Use the trial for exploration only; start real work in the full version.

### Are trial features the same as the full version?

The code is identical. The trial does not deliberately remove features — but as noted above, data does not persist.
