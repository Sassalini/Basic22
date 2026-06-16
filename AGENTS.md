# Away Project Instructions

Away is a calm, ad-free, friends-only social media platform.

## Product rules

Do not add:
- Ads
- Algorithmic feeds
- Shorts/reels
- Trending pages
- Public explore pages
- Donation buttons
- Groups
- Influencer-style profile pages
- Follower/following counts
- Engagement ranking
- Stripe
- Cloudflare R2

The feed must be:
- Friends-only
- Chronological
- No recommendation algorithm

The app should feel:
- Calm
- Minimal
- Private
- British Racing Green
- Dark by default

## Stack

- Next.js
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Storage for initial image uploads
- Cloudflare Pages deployment target

## Design

Use a dark British Racing Green style:
- Background: #03110D or similar
- Panels: #08251B or similar
- Accent: #004225
- Accent hover: #0B7A46
- Text: #F3F7F4
- Muted text: #9CAFA5
- Borders: subtle dark green

Avoid dopamine-heavy social media UI patterns.

## Engineering rules

- Keep components simple and readable.
- Use TypeScript where possible.
- Use Supabase RLS for privacy.
- Never trust client-side checks alone.
- Run lint/typecheck before finishing.
- Update README when setup steps change.
