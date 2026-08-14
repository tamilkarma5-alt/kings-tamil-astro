# Kings Tamil Astro

Professional Tamil astrology report UI for Vercel/Next.js.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Current version

- Tamil birth-details form
- One-page report preview
- Report ID
- Generated date/time
- PDF generation
- QR code in PDF
- Kings Tamil Astro branding
- Responsive mobile UI

## Important next integration

The current preview intentionally uses sample astrology values. For real calculations, connect a Swiss Ephemeris-based engine.

A current option is `@swisseph/browser`, which runs Swiss Ephemeris calculations in WebAssembly in the browser and includes the Moshier ephemeris. Another option is the `sweph` Node binding. Check the license requirements before commercial deployment.

Replace:

- `sample.rasi`
- `sample.nakshatra`
- `sample.pada`
- `sample.lagna`

with the real calculation result.

Also replace `siteUrl` with the final Kings Tamil Astro website URL before production.
