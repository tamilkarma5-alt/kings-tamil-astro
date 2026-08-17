# Kings Tamil Astro – Layout + Nakshatra Letters + Mobile Actions

This version keeps the existing astrology calculation and fixes the requested presentation issues:

- South Indian Rasi and Navamsa charts stay side-by-side on A4 print.
- Fixed row/column sizing, padding and line-height reduce Tamil text overlap.
- Planetary table uses stable column widths and wrapping.
- Nakshatra letters are shown automatically as all four pada syllables, e.g. `சு • சே • சோ • லா`, instead of showing only one syllable.
- The current pada remains available from the existing calculation (`nakshatraLetter`).
- Mobile users get Print, Download PDF and Open actions.
- Download PDF uses html2canvas + jsPDF.
- QR code is not added.

Run `npm install` and then `npm run build` before deployment.
