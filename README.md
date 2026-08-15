# Kings Tamil Astro — Blue/White Program

This is the actual Next.js program. No AI-generated deity images are used.

The header loads existing Wikimedia Commons images:
- Murugan: Lord Muruga.jpg — public domain.
- Ganesha: Ganesha picture.jpg — CC0.

You can later replace the two URL constants in `app/page.tsx` with local files:
`/murugan.jpg` and `/vinayagar.jpg`.

The current build has:
- A4 one-page print layout
- White + blue palette
- Real image elements instead of drawn/SVG deity icons
- Optional father/mother names
- Optional bold headline
- Optional one-line sentence
- Optional shop name/place/contact
- No QR code
- No `qrcode` package

Important: the sample planet values are intentionally placeholders. The astronomy calculation engine still needs to be connected before this should be treated as a real astrology calculation product.
