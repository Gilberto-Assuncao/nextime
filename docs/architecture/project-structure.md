# NEXTIME Architecture

## Application structure

- `app/` contains App Router routes, layouts, route metadata, and page composition.
- `app/dashboard/` contains authenticated-area UI routes. Route protection is deferred until backend integration.
- Dynamic dashboard resources use folders such as `[employeeId]` and resolve missing records with `notFound()`.

## Component structure

- `components/layout/` contains public landing-page layout elements.
- `components/home/` contains landing-page sections.
- `components/auth/` contains reusable authentication interface elements.
- `components/dashboard/` contains the dashboard shell, navigation, page headers, overview widgets, and temporary module placeholders.
- `components/employees/` contains employee list, filters, cards, forms, badges, and summary views.

## Library structure

- `lib/types/` is the source of shared domain and UI data contracts.
- `lib/mock/` contains typed temporary data used while no backend is connected.
- `lib/config/` contains stable application configuration such as dashboard navigation.
- Mock files must not implement persistence, sessions, or authentication behavior.

## Server and Client Components

- Pages and visual components remain Server Components by default.
- Add `"use client"` only for state, effects, browser APIs, event handlers, or local interactive filtering.
- Keep client boundaries narrow. Server-rendered children may be composed inside client shells.

## Dashboard routes

- `/dashboard` is the executive overview.
- `/dashboard/employees` contains employee management UI.
- `/dashboard/employees/new` contains the invitation form.
- `/dashboard/employees/[employeeId]` contains employee details.
- Unimplemented dashboard modules render a shared `ComingSoonPage` instead of returning 404.

## Future Supabase integration

- Supabase clients will be introduced only in a dedicated backend integration sprint.
- Server-side data access should replace `lib/mock/` imports at page or data-service boundaries.
- Authentication and dashboard route protection will rely on a verified server session.
- Database types should be generated or mapped to domain types without exposing persistence details to visual components.

## Security and data flow

- Never store passwords, tokens, or credentials in `localStorage` or mock files.
- Forms currently prevent external submission and do not persist entered values.
- Future flow: page or server action → validated server data access → typed result → presentational component.
- Client Components receive only the minimum serializable data needed for interaction.
