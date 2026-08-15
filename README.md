# Kings Tamil Astro — Final V1

Built around the supplied Astro Vision Tamil Jathagam reference:
- one-page A4 report
- South Indian 4x4 chart with empty 2x2 centre
- South Indian Navamsa chart
- optional father/mother fields
- automatic place geocoding through Nominatim
- sidereal/Lahiri-style calculation
- planetary positions, rasi, nakshatra, pada, tithi, yoga, karana
- Vimshottari dasha balance
- browser Print / Save as PDF

Astrology calculation uses Astronomy Engine (MIT) for astronomical positions; sidereal conversion and traditional chart calculations are implemented in `lib/astro.ts`.

## V2 header/shop changes
- Header follows the supplied reference palette/layout.
- Left/right devotional line-art: Murugan and Vinayagar.
- Main report title is `ஒரு பக்க ஜாதகம்`.
- Optional bold headline and optional shop name/place/contact are printed when supplied.
- QR/scan block removed.
