# PawTheory

Vite + React blog. Everything dynamic (posts, categories, authors, subscribers, messages) lives in Supabase and is managed from `/admin`. Without a `.env` the site falls back to the static content in `src/data.js` (read-only demo; forms do not store anything).

## Setup (in order)
1. Create a project at supabase.com.
2. SQL Editor: run `supabase/schema.sql` (tables, RLS, `covers` bucket, seed categories and authors). It is idempotent.
3. Authentication > Users: add the admin user (email + password). In Authentication settings, turn off "Allow new users to sign up".
4. Copy `.env.example` to `.env`; fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Project Settings > API).
5. `npm install && npm run dev`, open `/admin`, log in.
6. Optional: on an empty Dashboard click "Import sample articles" to load the demo posts.

**Existing project?** Run only the block between `MIGRATION for EXISTING projects` and `END MIGRATION` at the bottom of `supabase/schema.sql`. It adds the new tables, policies and seed data without touching posts.

## Admin pages (`/admin`, not linked from the public site)
- Dashboard: counts, recent posts, messages and subscribers; sample import.
- Posts / New post: draft or published, cover upload, preview. Category and author are selects.
- Categories: add, edit, delete (blocked while posts use it), reorder with up/down. Drives navbar, home tiles, filters, category pages and footer.
- Authors: add, edit, delete, avatar upload (`covers/authors/`). Shown on About and post cards. Renaming an author updates their posts.
- Subscribers: search, delete, Export CSV. Filled by the Home newsletter form.
- Messages: inbox of Contact form submissions, read/unread, delete; unread count in the sidebar.

Subscribers and messages are insert-only for anonymous visitors; only the logged-in admin can read them (RLS).
