# SignUpLogin

Applies [Standards](../Standards.md) unless noted below.

**Sign up/login with**
- [x] Input field for email
- [x] Input field for password
- [x] Need to verify email
- [x] Ability to switch between sign up/login — Shared email field is preserved when switching either way

**Sign up flow**
- [x] Error handling
- [x] Sign up and then show a welcome page before continuing to create a member profile
- [x] Verification code — Enter a code instead of clicking an email link; `000000` is an error for testing, any other 6 digits succeed
- [x] Verification resend — Re-send the code or go back to try a different email
- [x] Existing user tries sign up — Recognised email shows inline “Email already in use”; user can switch to log in (email is kept)
- [x] Sign up welcome screen — Option to close/skip; dashboard then prompts profile completion

**Login flow**
- [x] Returning user
- [x] Error handling
- [x] Login enter details and land on dashboard
- [x] Login with username or email
- [x] Password recovery — Forgot password and reset password flow
