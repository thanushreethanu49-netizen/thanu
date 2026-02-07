# Personal Website — Frontend + Node.js Backend

This repository contains a simple, SEO-friendly personal website with an interactive resume, portfolio, and a contact form that sends email notifications.

## Features
- Static frontend (HTML, CSS, JavaScript)
- Responsive interactive resume and portfolio
- Contact form that posts to a Node.js (Express) backend
- Email sending via SMTP (Nodemailer)
- Basic security (Helmet) and rate limiting

## Setup
1. Install dependencies:

```bash
npm install
```

2. Copy env file and set credentials:

```bash
cp server/.env.example server/.env
# Edit server/.env and fill SMTP_* and CONTACT_TO_EMAIL
```

3. Run in development mode:

```bash
npm run dev
```

4. Open http://localhost:3000

## Notes
- You can use an SMTP provider (Gmail with App Passwords, SendGrid SMTP, etc.) for the optional Node.js contact backend.
- For production, use HTTPS and add spam protection (reCAPTCHA) and rate limits.

---

## Deploying the static frontend to GitHub Pages ✅
This project is static in `public/` and can be hosted on GitHub Pages. Two simple options:

1) Use `gh-pages` branch (recommended):
   - Copy the contents of `public/` to a branch called `gh-pages` and enable GitHub Pages from that branch (Settings → Pages).

2) Use the `docs/` folder on `main`:
   - Copy `public/` contents into a `docs/` folder at the repository root and enable GitHub Pages from the `docs` folder.

Note: GitHub Pages hosts static assets only. If you'd like the contact form to send emails, either use the included Node.js backend (deploy it separately to a host like Render, Railway, or Heroku) or use Formspree / Netlify Forms by setting the form's `data-formspree` attribute (the HTML already includes an example attribute).

---

If you'd like, I can:
- Add a production-ready `Dockerfile` for the backend ✅
- Add reCAPTCHA to the contact form ✅
- Add deployment steps for Render/Heroku/Vercel for the full stack ✅

---

Certificates
- I keep certificates and professional achievements on LinkedIn. To show your certificates on the site, add a link to your LinkedIn profile in the Certificates section (`public/index.html`) or in the header links.

Profile image
- To add your real profile photo, place your image file as `public/images/profile.jpg`. The site will automatically load `profile.jpg` and fall back to a placeholder if it's not present.

If you'd prefer certificates hosted directly on the site with file uploads and HOD/admin controls, choose Option B and I can scaffold a secure upload endpoint that stores files on the server and provides an admin UI to manage them.

Happy to continue — pick the next item you want me to implement.
