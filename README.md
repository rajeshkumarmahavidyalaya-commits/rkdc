# Rajesh Kumar Mahavidyalaya — website

The public website of Rajesh Kumar Mahavidyalaya, Jaunpur, Uttar Pradesh.
Next.js 15 (App Router), Tailwind CSS v4, TypeScript. Every page is static; there is no
database and no login.

Pages: Home, About, Programmes (and one page per programme), Admissions, Facilities, Contact.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck && npm run lint && npm test
```

## Edit the content

**Everything the site says lives in one file: [`src/lib/site/content.ts`](src/lib/site/content.ts).**
No page types a fact of its own. The file was assembled from public directory listings
(Careers360, CollegeBatch, Collegedunia, Shiksha) because the college had no site to read from, and
where the listings disagreed the comment beside the value says so. An unknown fact is `null`, and the
page that would show it draws nothing instead of a guess.

Please have the principal's office confirm before launch:

| Item | State |
|---|---|
| PIN code | `222132` (Careers360) vs `222001` (CollegeBatch, the district code) |
| Phone | `05452-261186`, from one directory |
| Email, website, office hours | unknown, not shown |
| Principal / leadership | unknown: two listings name a director with different titles, so nobody is named |
| Fees, dates, seats (except B.Ed. 100) | not published; the pages say to call |
| Durations | national norms (UGC / NCTE), not quoted from a listing |
| News | `UPDATES` is empty on purpose, so no news strip is drawn |
| Photographs | none supplied, so none shown |

## Optional: link to the management portal

The college's management system is a separate application. Once it is deployed, set:

| Variable | Example | Effect |
|---|---|---|
| `NEXT_PUBLIC_PORTAL_URL` | `https://portal.example.com` | adds **Apply now** (the portal's public form) and **Portal login** links |
| `NEXT_PUBLIC_SITE_URL` | `https://www.example.com` | the address used in the sitemap and link previews |

Without `NEXT_PUBLIC_PORTAL_URL` no login or online-apply button is shown, and the primary button
reads **How to apply** and goes to the Admissions page.

## Design

Minimal and modern: a quiet sticky header, one filled call-to-action per view, a system serif for
headings and the system sans-serif for text, so no web font is downloaded. Colours are tokens in
`src/app/globals.css`, never hex values in components, with light and dark following the reader's
system setting. Logical spacing utilities (`ms-`, `pe-`, `text-start`) are used throughout, and
`tests/site.test.ts` enforces both.

## Deploy

Import the repository on [Vercel](https://vercel.com/new): framework Next.js, no environment variables
required. `.npmrc` sets `legacy-peer-deps` because a plain `npm install` fails on an npm resolver bug
with this dependency set.

## Not built yet

Faculty and leadership pages, a photo gallery, a notices archive, an enquiry form and translations.
Each needs content from the college first.
