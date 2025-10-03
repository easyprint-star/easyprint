
EasyPrintServices — Updated (responsive nav + Resend API sample)
---------------------------------------------------------------

What I changed:
- Added a responsive top navigation (hamburger at the far right on mobile).
- Added `main-updates.js` which toggles the mobile menu, collapses menu on link click,
  and handles AJAX form submit to `/api/send`.
- Updated HTML pages to include responsive meta tag, ensured images have `alt` attributes,
  and adjusted forms to be handled via AJAX by default.
- Added `/api/send.js` — a Vercel serverless function that forwards form submissions to Resend.
  It expects an environment variable `RESEND_API_KEY` with your Resend API key. Also change the `to` email address in the function.
- Appended responsive CSS to `style.css` for the nav and general image responsiveness.
- Updated `package.json` and `vercel.json` with suggested entries for deployment.

Deployment notes:
1. Set `RESEND_API_KEY` in Vercel Environment Variables.
2. Change the email recipients in `api/send.js` to your desired email(s).
3. Run `npm install` locally (if you want to run server functions locally) or deploy to Vercel directly.
4. If using Vercel, `vercel dev` will pick up `api/send.js` as an endpoint at `/api/send`.

If you want, I can further:
- Improve the styling of the menu (colors/animations) to match your brand.
- Add server-side validation, logging, or saving orders to a database.
- Run accessibility tests and fix any remaining issues.

