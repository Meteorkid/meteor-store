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

## License key products

These products give you a license key after purchase. You enter that key wherever the product asks for it. You can find all your license keys on the [Account](/en/account) page.

There is no single activation screen that works for every license-key product. Each product decides where and how to ask for the key — some show an activation window on first launch, some have a field in settings, and some only need the key once during setup.

### License keys and invitation codes are not the same thing

- A **license key** is automatically generated when you purchase a product. You use it to activate that specific product.
- An **invitation code** is a redeemable code created by an admin. It uses the `INV-XXXX-XXXX-XXXX` format. Redeeming it generates the corresponding license key for you.

You enter an invitation code on the [Redeem](/en/redeem) page. You enter a license key inside the application itself.

## How to tell which kind a product is

Open the product detail page and check:

- If the page includes an embedded "Free Trial" section — it is a web app.
- If the page has a "Download" section at the bottom listing `.dmg` versions and checksums — it is a downloadable app.
- If neither of the above is present and the description mentions a "license key" or activation in third-party software — it is likely a license key product.

When in doubt, read the product description carefully on the detail page, or [send feedback](/en/feedback) to ask the store owner directly.
