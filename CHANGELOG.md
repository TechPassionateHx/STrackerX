# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-09-11

### Added
- **Dedicated Squad Command Screen**: Introduced an isolated Squad room tab with real-time participation indicators, session synchronization, and room exit management.
- **Tactical Quick-Pings**: Built a low-distraction broadcast system allowing students to send preset academic status directives without open free-text chat.
- **Rate-Limiting Cooldown Engine**: Applied a 3-second hardware cooldown timer disabling consecutive transmissions to prevent notification spamming.
- **Activity Feed & Undo Support**: Implemented a transactional history stack for milestone toggles; untoggling an action rolls peer activity back to the previous verified milestone.
- **Self Analytics in Profile**: Enhanced the Vault profile view with streak counts, milestone totals, and current squad membership data.
- **Class Stream Deletion**: Added granular stream management enabling users to prune entire unused grade levels from their syllabus matrix.

### Fixed
- **Ghost Squad Roster State**: Integrated Supabase Realtime subscriptions to immediately remove exited members across all connected client viewports and drop empty rooms.
- **Friend Activity Desynchronization**: Resolved activity logging inconsistencies across study circles by standardizing the `activity_history` JSON structure.


## [0.2.0] - 2026-09-10

### Added
- **Multi-Grade Curricula & Language Expansion**: Introduced complete Class 9 matrices, integrated English Core for Classes 11–12, and added Social Science, English, and Hindi/Sanskrit electives for Classes 9–10.
- **Social Management Hub**: Built an active friend-request inbox allowing real-time request reviews with instant Accept (✔) and Decline (✖) operations.
- **Bidirectional Study Circles**: Reworked relational database logic so accepted study peers render accurately on both sender and receiver profiles.
- **Squad Room Architecture**: Interactive squad generator producing `#SQUAD-XXXX` room tokens with participant roster synchronizations, membership tracking, and exit routines.
- **Pomodoro Streak Engine**: Linked streak calculations directly to 25-minute Pomodoro completions, persisting timestamped daily streaks to database profiles.
- **Milestone Victory Celebrations**: Restored high-frequency chime cues and particle confetti when finishing every milestone across a chapter.
- **Dynamic Directive System**: Automated quote rotation on app boot with 15+ curated focus directives.
- **Clean Cascade Account Purge**: Implemented the `delete_current_user` RPC executing securely at the Postgres engine level to wipe `auth.users` without leaving orphan credentials.

### Fixed
- **Milestone Tier State Lock**: Resolved schema constraint bug where viewing foundation tiers permanently downgraded Senior Classes (11 & 12) from 6 milestones to 4.
- **Squad Code Parsing**: Sanitized squad room search inputs to seamlessly parse IDs regardless of leading `#` symbols.
- **Cross-User Data Permissions**: Configured PostgreSQL Row Level Security (RLS) policies allowing mutual data visibility across friends and active squad participants.


## [0.1.0] - 2026-09-10

### Added
- **Username-Only Authentication**: Streamlined onboarding accepting handle-based signups (`@username`) without email validation overhead, backed by internal auth routing.
- **Supabase Cloud Synchronization**: Full migration from purely local storage to real-time cloud persistence for user profiles, track metadata, and milestone matrices.
- **Automated Database Triggers**: Configured PostgreSQL trigger (`handle_new_user`) executing on `auth.users` to automatically populate `public.profiles`.
- **Social Infrastructure**: Initial friend connection pipeline enabling handle-based requests (`public.friendships`) and squad room code generation.
- **In-App Cloud Reporting**: Direct user feedback and bug reporting modal linked to the `public.feedback_reports` database.
- **Danger Zone Purge**: Full account lifecycle feature to permanently erase cloud records (`profiles` cascade) and wipe client state on demand.

### Changed
- Refactored core syllabus management to hydrate from Supabase cloud states on boot with local fallback.
- Updated authentication UI modal to support both seamless login and registration flows via a single interactive overlay.
- Adjusted network calls to execute with silent fallback to preserve offline functionality.

### Security
- Activated PostgreSQL Row Level Security (RLS) policies on all public tables (`profiles`, `friendships`, `feedback_reports`).
- Hardened access control so write, update, and delete mutations are strictly limited to the authenticated `auth.uid()`.


## [0.0.2] - 2026-09-10

### Added
- **Official NCERT Curricula:** Complete Class 11 and Class 12 chapter databases across Physics, Chemistry, Mathematics, and Biology.
- **Custom Chapter Engine:** Add and delete bespoke chapters per subject with distinct `Custom` tags.
- **Dynamic Stream Switcher:** Seamlessly change between JEE, NEET, PCM, and PCB directly in Vault settings without losing existing milestone progress.
- **Safety-Locked Reset:** Two-step account purge mechanism requiring confirmation text before clearing storage.
- **Web Deployment:** Configured for one-click deployment via GitHub Pages.

 

## [0.0.1] - 2026-09-10

### Added
- **Social Hub & App Shell:** Central command center featuring live greetings, streak indicators, and squad activity feed previews.
- **Adaptive Academic Onboarding:** Profile initialization supporting custom display names, unique `@handle` generation, and tiered academic streams (Classes 8–10 Foundation, Senior Secondary, JEE, and NEET).
- **Milestone Matrix Engine:** 
  - Dynamic milestone allocation (4 checkpoints for Foundation, 6 checkpoints for Senior/Competitive).
  - Rapid-tap state toggling with procedural Web Audio synthesis cues.
  - Granular progress aggregation across chapter, subject, and global tracks.
- **Persistent Storage:** Dual-layer storage engine powered by IndexedDB with `localStorage` fallback and persistent storage permissions.
- **Sprint Suite:** Built-in 25-minute Pomodoro focus timer with confetti celebrations on completion.
- **Deep Space Neon Design System:** Dark/light mode switcher with glassmorphism surface panels, luminous borders, and responsive mobile-first navigation.
- **Vault Controls:** One-click JSON backup export and import engine alongside full local database purge utilities.


