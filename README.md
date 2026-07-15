# Derrick & Michelle — Wedding Website (Next.js)

A Next.js wedding site with a live countdown and an RSVP form backed by an
API route.

## Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

While testing, submitted RSVPs are visible at `http://localhost:3000/api/rsvp`
or in `data/rsvps.json`.

## Before you launch

1. **Edit `app/page.js`**
   - `WEDDING_DATE` at the top — set your real date/time.
   - Names, venue, timeline, travel/registry links, FAQ answers, and the
     "Our Story" paragraphs are placeholder text — search for `[Hotel Name]`,
     `[YVR/Airport Code]`, and similar brackets.

2. **Replace the RSVP storage before deploying**
   `app/api/rsvp/route.js` currently writes to a local JSON file
   (`data/rsvps.json`). That works for `npm run dev` on your machine, but
   **it will not work once deployed to Vercel or any serverless host** —
   serverless filesystems don't persist writes. Swap the `saveLocally`
   function for one of:
   - A database (Supabase/Postgres is the most common pairing with Next.js)
   - Airtable's API (no database setup required)
   - Google Sheets API
   - A form backend like [Formspree](https://formspree.io) that handles
     storage and email notifications for you

3. **Edit `app/globals.css`**
   - Color palette lives in the `:root` variables at the top if you want to
     change the look (currently sage green + gold, botanical theme).

## Deploying to GitHub Pages

This project is already set up for it (`output: 'export'` in
`next.config.js`, plus a `.github/workflows/deploy.yml` that builds and
deploys automatically). GitHub Pages is static-only, so there's no server —
that's why the RSVP form posts to an external endpoint (see above) instead
of a Next.js API route.

1. **Set your repo name in `next.config.js`.**
   Open it and change `REPO_NAME` to match your GitHub repo's name exactly
   (case-sensitive). This is needed because a project site
   (`username.github.io/repo-name`) is served from a subpath, so Next has
   to prefix its asset URLs with it. If your repo is named exactly
   `<your-username>.github.io`, or you're using a custom domain, set
   `REPO_NAME = ''` instead.

2. **Set `RSVP_ENDPOINT` in `app/page.js`** (see above) — otherwise the
   form will only save to each guest's own browser.

3. **Push this project to a new GitHub repo:**
   ```bash
   git init
   git add .
   git commit -m "Wedding website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

4. **Turn on Pages in the repo settings:**
   GitHub.com → your repo → **Settings** → **Pages** (left sidebar) →
   under "Build and deployment", set **Source** to **GitHub Actions**.

5. **Trigger the deploy.**
   Pushing to `main` triggers it automatically. Watch progress under the
   repo's **Actions** tab — the workflow builds the site and publishes the
   `out/` folder. First run usually takes 1–2 minutes.

6. **Find your URL.**
   Once the workflow finishes, it's live at
   `https://<your-username>.github.io/<repo-name>/`
   (shown in Settings → Pages once the first deploy succeeds).

Every future push to `main` redeploys automatically — no manual steps
after the first setup.

### Using a custom domain instead

Add a `public/CNAME` file containing just your domain (e.g.
`ourwedding.com`), set `REPO_NAME = ''` in `next.config.js`, and point your
domain's DNS at GitHub Pages per
[GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Alternative: deploying to Vercel

If you'd rather have a real backend (so the API-route version of this
project works without swapping in an external form service), skip GitHub
Pages and use [Vercel](https://vercel.com) instead — import the repo with
no config needed. That only applies if you're using the version of this
project with `app/api/rsvp/route.js`; this version is set up for GitHub
Pages and doesn't include that route.

## Project structure

```
wedding-next/
├── app/
│   ├── layout.js         # root layout, fonts, metadata
│   ├── page.js            # all page content + countdown/RSVP logic
│   ├── globals.css        # all styling
│   └── api/
│       └── rsvp/
│           └── route.js    # RSVP submission handler
├── data/
│   └── rsvps.json          # local dev storage (see note above)
├── package.json
└── next.config.js
```
