# Basic22

Basic22 is a minimal, ad-free, friends-only social media MVP. It uses a dark British Racing Green visual style, Supabase Auth/Postgres/Storage, and a chronological feed with no recommendation algorithm.

## What is included

- Landing page with Create account and Sign in actions
- Supabase email/password auth
- Protected app routes
- Friends-only chronological home feed
- Text posts with optional single image upload through Supabase Storage
- Users can delete their own posts
- Likes, comments, and comment lists
- Friend search by username, display name, or email
- Friend requests with accept/reject flow
- Direct messages between accepted friends only
- Settings for display name, username, profile photo, short about text, theme toggle, and logout
- Supabase SQL migration with RLS policies

## What is intentionally excluded

- Ads
- Algorithmic timelines
- Shorts, reels, or video feeds
- Trending, public explore, or recommendation pages
- Public influencer-style profile pages
- Follower/following counts
- Groups
- Donation buttons
- Stripe
- Cloudflare R2

## Tech stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Cloudflare Workers deployment target through OpenNext

## Install dependencies

Use a local Node.js installation with npm available.

```bash
npm install
```

## Environment variables

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not expose a Supabase service role key to the frontend.

## Supabase setup

Apply the SQL migrations in `supabase/migrations`.

With the Supabase CLI:

```bash
supabase db push
```

Or paste the migration SQL into the Supabase SQL editor for the target project.

The migration creates:

- `profiles`
- `friendships`
- `posts`
- `post_likes`
- `post_comments`
- `direct_messages`
- Private `post-images` Supabase Storage bucket
- Private `profile-images` Supabase Storage bucket
- Row Level Security policies for profiles, friendships, posts, likes, comments, direct messages, post image access, and profile image access

Manual Supabase checks after applying the migration:

- Confirm email/password auth is enabled in Supabase Auth.
- Confirm your site URL and redirect URLs match your local and deployed app URLs.
- Confirm the private `post-images` bucket exists.
- Confirm the private `profile-images` bucket exists.
- Confirm RLS is enabled on all public tables listed above.

## Run locally

```bash
npm run dev
```

Open the local URL shown in the terminal.

## Check the app

```bash
npm run typecheck
npm run lint
```

## Deploy to Cloudflare Workers

Set the same Supabase environment variables in Cloudflare Workers:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Build and deploy with the OpenNext Cloudflare adapter:

```bash
npm run deploy
```

For a local Workers preview:

```bash
npm run preview
```

For local Workers development variables, copy `.dev.vars.example` to `.dev.vars` and keep real values out of git. Keep Supabase as the backend for auth, database, and image storage in this MVP. Cloudflare R2 is intentionally not implemented.

## Product rules

The feed must remain friends-only and chronological. Do not add public discovery, recommendation algorithms, engagement ranking, ads, groups, donation flows, Stripe, or Cloudflare R2 in this first version.
