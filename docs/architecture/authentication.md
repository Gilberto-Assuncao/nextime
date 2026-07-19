# Authentication foundation

NEXTIME uses the official `@supabase/ssr` cookie-based client pattern. Browser, server, service-role, and request-proxy clients are isolated under `src/infrastructure/supabase`.

- `client.ts` creates the browser client.
- `server.ts` reads and writes Next.js cookies in server code.
- `proxy.ts` refreshes auth claims and propagates cookies; the root `proxy.ts` activates it only when public Supabase variables exist.
- `admin.ts` is server-only and is the only module allowed to read the service-role key. It must never be imported into client code.
- `auth-service.ts` implements the application authentication port for email/password, Google, Microsoft/Azure, Apple, magic link, and sign-out. Provider enablement and callback handling remain deployment tasks.

The session contracts distinguish current user, company, membership, and effective permissions. `SessionProvider` is prepared but intentionally not mounted in the UI during this structural sprint.

Environment values are documented in `.env.example`. Real secrets belong in local or deployment environment configuration and must never be committed.
