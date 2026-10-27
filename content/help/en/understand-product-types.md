## Three kinds of products on the site

Every item on Meteor Store is called a "product," but they reach you in different ways. Knowing which kind you are dealing with before you purchase will save you a lot of confusion.

Here is how the three categories work.

## Web apps (open directly in the browser)

These products are pure web applications — there is nothing to download or install. After purchase (or after gaining access through Meteor Pass), open [My Products](/en/apps) and click the product entry. The app opens right in your current browser.

Before rendering the app, the server checks that your account is authorized for that product.

A subset of products currently support in-browser access, such as Tollow, Chakra Visualizer, and WebGL Fluid Simulation. If a product detail page shows a "Free Trial" section, it is a web app.

## Downloadable apps (install on your computer)

These products are distributed as installer packages, usually a `.dmg` file for macOS. After purchase, go to the product detail page and pick the right download for your system in the download section.

The download endpoint verifies your account authorization on the server side, then issues a short-lived download link (valid for 5 minutes). Your browser fetches the package directly from the storage service through that link. The installer file itself has no public URL.

If you see a "cannot be opened because the developer cannot be verified" warning after downloading on macOS, follow Apple's official steps — see [What if a downloaded app will not open on macOS?](/en/docs/macos-cannot-open-app) in the help center. **Do not turn off Gatekeeper or run commands that bypass system security checks.**

## Software activation codes

After downloading and installing XNook or XIsland, use a software activation code in the app. Purchased codes and codes granted directly by an administrator appear in [Account Center](/en/account), with the app name, 1 month / 1 year / Lifetime term, and status.

Use **XNook → Settings → License** or **XIsland → Settings → Software License**. First activation requires an internet connection. Individual app purchases currently provide lifetime access; the 1 month and 1 year options come from Meteor Pass. See the [purchase guide](/en/docs/buy-product-or-meteor-pass) and [software activation code guide](/en/docs/use-license-key).

## How to tell which kind a product is

Open the product detail page and check:

- If the page includes an embedded "Free Trial" section — it is a web app.
- If the page has a "Download" section at the bottom listing `.dmg` versions and checksums — it is a downloadable app.
- If neither of the above is present and the description mentions a "license key" or activation in third-party software — it is likely a license key product.

When in doubt, read the product description carefully on the detail page, or [send feedback](/en/feedback) to ask the store owner directly.
