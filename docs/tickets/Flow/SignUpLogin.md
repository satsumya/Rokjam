# ROKJ-3: Sign up/login

Applies [Standards](../Standards.md) unless noted below.

**Sign up/login with**
- [x] Input field for email
- [x] Input field for password
- [x] Need to verify email
- [x] Ability to switch between sign up/login
**Sign up flow**
- [x] Error handling
- [x] Sign up and then show a welcome page before continuing to create a member profile
**Login flow**
- [x] Returning user
- [x] Error handling
- [x] Login enter details and land on dashboard

**Review updates**
- [x] Verification code — Let’s have users enter a code instead of clicking a link in an email. For testing purposes please make code: 000000 an error and every other number combination successfully verify
- [x] Verification resend — If a user hasn’t received the code we’ll need a way for them to re-send the email or go back to try a different email
- [x] Scenario for existing user attempts to sign up instead of login — If an email is recognised for an existing user and they try and sign up we could just log them in or redirect them to login
- [x] Sign up welcome screen — Needs an option to close. If they don’t want to jump straight into the member profile take them to the dashboard. Dashboard should then show prompts to create member profile or directly add some details from the dashboard
- [x] Login with username or email — Ensure existing users can use their username or email in the input field
- [x] Password recovery for existing users — There needs to be an option to reset your password or recover your password
