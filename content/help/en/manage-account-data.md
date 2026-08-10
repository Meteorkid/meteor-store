## What you will accomplish

Perform three account management actions from the Account Center: change your password, export your personal data, and delete your account.

## When to use this

- You want to switch to a stronger password.
- You need to download all the data you have generated on Meteor Store.
- You have decided to stop using this account and want to permanently remove it.

All actions require you to be signed in. If you are not, the system will redirect you to the login page.

## Changing your password

### Step 1: Find the password section

Scroll down on your [Account](/en/account) page to the "Change password" section.

### Step 2: Fill in old and new passwords

- **Current password**: Enter the password you currently use.
- **New password**: Enter the new password you want to set, minimum 8 characters.

Both fields must be filled before you can submit.

### Step 3: Submit and confirm

Click the "Change password" button to submit. A green "Changed" indicator will appear next to the button on success.

Changing your password does not sign you out — your current session remains active.

## Exporting your data

### How to export

Find the "Data rights" section on your Account page and click the "Export data" link. Your browser will download a JSON file named `meteor-store-data.json`.

The file includes:

- Your basic account information (email, display name, avatar URL, bio).
- Your order records and license keys.
- Your blog posts (including drafts and published articles).

### Export rate limit

The export endpoint is rate-limited to 3 requests per hour. This prevents data export from being abused as a bulk scraping mechanism. If you need more exports, please try again later.

### Your data rights

The exported data belongs to you. You may import it into other services, archive it for backup, or use it for any personal purpose consistent with the Meteor Store Terms of Service.

## Deleting your account

### Important: deletion is irreversible

Once your account is deleted, your personal data will be removed from the system. This action cannot be undone. Before proceeding, confirm that:

- You have exported and saved any data you need.
- You have no blog posts pending review (whether published posts are retained depends on the content moderation policy).
- You understand that purchased license keys and order records will no longer be associated with your account.

### Deletion steps

Scroll to the bottom of the Account page to find the red-highlighted "Delete account" section. Complete the two-step verification:

1. **Current password**: Enter your account password.
2. **Confirmation**: Type the word `DELETE` in uppercase in the confirmation box (must match exactly, case-sensitive).

Once both conditions are met, the red "Delete my account" button becomes enabled. Click it to verify your password and execute deletion.

### What happens after deletion

- Your account and profile information will be removed.
- You will be redirected to the homepage.
- You will no longer receive any emails from Meteor Store.
- The handling of your previously published comments and approved blog posts depends on the content policy — they may be retained without author attribution, or removed entirely.

## Next step

If you have additional questions about data privacy, [contact technical support](/en/docs/technical-support). For refund inquiries, see the [Refund Policy](/en/docs/refund-policy).
