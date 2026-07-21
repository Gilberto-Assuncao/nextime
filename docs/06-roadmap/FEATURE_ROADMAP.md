# NEXTIME --- FEATURE ROADMAP

Version: 1.0 Status: Active Last Updated: 2026-07-21

# Purpose

This document tracks the implementation status of every major functional
module in NEXTIME.

  Module               Status        Target Sprint   Dependencies
  -------------------- ------------- --------------- --------------------
  Authentication       Completed     3.7             Supabase
  Multi-Tenancy        Completed     3.7             Authentication
  Company Management   Completed     3.8             Multi-Tenancy
  Teams                Completed     3.9             Company Management (browser-verified 2026-07-21 after fixing missing grants + PGRST201 ambiguous embeds)
  Workforce            Completed     3.6, 5.2        Teams (browser-verified 2026-07-21 with real Supabase data)
  Time Tracking        Completed     4.2, 5.4        Workforce (browser-verified 2026-07-21 with real Supabase data; entry persistence/manual-entry save still TODO-stubbed, read side only)
  Timesheets           Completed     4.3, 5.5        Time Tracking (browser-verified 2026-07-21 with real Supabase data; Submit/Approve/Reject and entry edits still TODO-stubbed, read side only)
  Employees            Completed     3.6, 5.6        Workforce (browser-verified 2026-07-21 with real Supabase data; invitation form still TODO-stubbed, read side only; seed.sql gained 3 employee_records rows to support this)
  Projects & Clients   Completed     4.0, 5.7-5.8    Companies (browser-verified 2026-07-21 with real Supabase data; found and worked around an RLS gap where a project's client company isn't readable unless the caller is also a member — see DATABASE_ARCHITECTURE.md; project creation form still TODO-stubbed, read side only)
  Sites (ex-Chantiers) In Progress   4.1, site-rename Projects (table renamed chantiers->sites 2026-07-21; 4.1 UI work unverified)
  Dashboard (aggregates) Completed    5.9             Workforce, Time Tracking, Timesheets, Projects (browser-verified 2026-07-21; KPIs/weekly chart/team activity/recent timesheets all real — Sprint 5 mock-data migration is now complete)
  Approvals            Planned       5.x+            Timesheets
  Reports              Planned       5.x+            Projects
  Notifications        Planned       5.x+            Authentication
  Weather Intelligence         Planned  6.x   Sites (prioritized 2026-07-21, moved out of Future Ideas — see FUTURE_IDEAS.md)
  Live Operations Map          Planned  6.x   Time Tracking write persistence, Sites (prioritized 2026-07-21; needs a geolocation-consent design before build — see FUTURE_IDEAS.md)
  Team/Site Hours Divergence Reporting  Planned  6.x  Workforce, Timesheets (prioritized 2026-07-21 — see FUTURE_IDEAS.md)
  Multi-language (incl. Eastern Europe) Planned  6.x  localization_settings (prioritized 2026-07-21; needs an i18n framework installed — see FUTURE_IDEAS.md)
  Configurable Schedules & Punctuality Reminders  Planned  6.x  Company Settings, Notifications (prioritized 2026-07-21; needs a scheduled/background job — see FUTURE_IDEAS.md)
  Manager/Accountant Roster & Compliance Reports  Planned  6.x  Reports, Roles (prioritized 2026-07-21 — see FUTURE_IDEAS.md)
  Billing              Planned       6.x             Companies
  Public API           Planned       6.x             Core Modules
  Mobile               Planned       6.x             API
  AI Assistant         Planned       Future          Core Platform
  Integrations         Planned       Future          API
  Finance              Future        Future          Billing
  Marketplace          Future        Future          Finance

------------------------------------------------------------------------

# Status Definitions

-   **Completed** --- Delivered and validated.
-   **In Progress** --- Active Sprint.
-   **Unverified** --- A specification exists and may have shipped, but no matching commit/as-built review confirms it yet.
-   **Planned** --- Approved for future development.
-   **Future** --- Visionary feature, not yet scheduled.

------------------------------------------------------------------------

# Prioritization

Features are prioritized according to:

1.  Business value
2.  Customer impact
3.  Technical dependencies
4.  Delivery risk
5.  Engineering effort

------------------------------------------------------------------------

# Review

Review this document after every Sprint Review and update module status
accordingly.

------------------------------------------------------------------------

# Goal

Provide a single source of truth for the implementation progress of all
functional areas in NEXTIME.
