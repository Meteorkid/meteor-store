## What you will accomplish

Learn how to sign in to Meteor Store, and how to recover or reset your password when you have forgotten it.

## Signing in

### How to sign in

Click the "Login" button in the top bar from any page to open the login page. The form starts in login mode by default, with two fields:

- **Email**: Enter the email address you registered with.
- **Password**: Enter your account password. Click the eye icon on the right to toggle visibility.

Fill in both fields and click "Log in."

### Common login errors

**Email not registered**

The system cannot find an account matching this email. Double-check the spelling, or make sure you are not confusing login with registration. If you do not have an account yet, click "Register now" below.

**Wrong password**

Confirm the password is correct (passwords are case-sensitive). If you cannot remember it, use the "Forgot password?" feature instead of repeatedly guessing — the login endpoint has rate limiting.

**Email not verified**

If you registered but have not yet clicked the verification link in your inbox, the login page will tell you the email is unverified. Find the verification email and complete verification first, then sign in.

**Re-login after verification**

The system does not sign you in automatically after email verification. You need to return to the login page and enter your email and password manually. If you navigate back from the verification page, the login page will show a green message confirming that verification was completed.

## Recovering your password

### Step 1: Request a reset

Click the "Forgot password?" link below the password field on the login page. You will be taken to the password recovery page. Enter your registered email address and submit.

If the email exists in our system you will see a "sent" confirmation. For privacy reasons the system does not reveal whether an email exists — if you receive nothing, double-check the spelling and your spam folder.

### Step 2: Find the reset email

The system will send an email containing a reset link. The link has a limited validity window, so act on it promptly.

### Step 3: Set a new password

Clicking the link in the email opens the Meteor Store reset password page in your browser. Enter a new password and confirm it (minimum 8 characters, maximum 200), then submit.

If the reset succeeds, the page will tell you to return to the login page and sign in with your new password.

### What if the reset link is invalid

If the reset link has expired, been used, or is otherwise invalid, the page will show an error. Click the "Request again" button to return to the password recovery page and submit a new request.

## Security notes

- Do not save your password on shared computers or share it with anyone.
- If you receive a password reset email you did not request, someone may have mistyped your email or attempted to access your account. As long as the link in the email was not clicked, your account is safe. No action is required, but you may change your password after signing in if you are concerned.
- Meteor Store will never ask for your password via email, text message, or in-app message. Any communication requesting your password is fraudulent.

## Next step

After signing in, check your [Account](/en/account) to confirm your profile details and email verification status.
