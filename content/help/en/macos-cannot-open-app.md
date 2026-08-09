## Identify the warning first

macOS uses Gatekeeper to check apps downloaded from the internet. These checks cover the developer signature, Apple notarization status, and whether the file has been modified. Distribution outside the App Store does not by itself mean an app cannot be opened, and different warnings require different responses.

Continue with the steps below only if you downloaded the app from an official Meteor Store product page, the filename is what you expected, and the warning says that the developer cannot be verified or Apple cannot check the app for malicious software.

## Use Open Anyway

1. Try to open the app once in Finder, then dismiss the security warning.
2. Open System Settings from the Apple menu.
3. Select Privacy & Security and scroll down to the Security section.
4. Find the app that was blocked and click Open Anyway. This button is available for a limited time after you try to open the app.
5. Check the app name again. If you are certain the file came from a trusted source, authenticate when prompted and click Open.

macOS saves the app as an exception to your security settings, so you can open it normally in the future. See Apple’s complete guidance in [Safely open apps on your Mac](https://support.apple.com/en-us/102445).

## Stop if macOS reports damage

If macOS says the app will damage your computer, says the app is damaged, or moves it to the Trash, do not override the warning or disable system security checks. Delete the file and download it again from the official product page.

If the same warning appears after a fresh download, note the product name, download time, macOS version, and exact error message, then [contact technical support](/en/docs/technical-support). We will check the package instead of asking you to weaken your Mac’s security.

## If Open Anyway is missing

- Make sure you have tried to open the app before checking Privacy & Security again.
- A Mac managed by a school or company might block manual exceptions. Contact the device administrator in that case.
- Do not follow instructions that disable Gatekeeper or run terminal commands intended to bypass macOS security.
