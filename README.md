# Arnav Jain Portfolio

Cinematic personal portfolio for **Arnav Jain** — Technology × Business × Building.

Live domain: [www.arnavjain.com.au](https://www.arnavjain.com.au/)

## Stack

- Static HTML / CSS / JavaScript
- GSAP + ScrollTrigger (homepage cinematic motion)
- Formspree contact form (no custom backend)

## Run locally

```bash
python3 -m http.server 5500
```

Open `http://127.0.0.1:5500/`

## Main pages

- `/` — cinematic home narrative
- `/work.html` — selected work
- `/work/ajcrm/` — AJCRM case study
- `/global-sync-managing-director.html` — Global Sync role page
- `/journey.html` — timeline
- `/contact.html` — contact form

## Security notes

- CSP + Permissions-Policy meta tags on public pages
- Host headers via `vercel.json` (Vercel) and `_headers` (Netlify)
- External links use `rel="noopener noreferrer"`
- Contact form uses honeypot + field length limits
- Archive `/v2/` is `noindex` and disallowed in `robots.txt`
