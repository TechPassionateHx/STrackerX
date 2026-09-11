# STrackerX ⚡

A high-performance, cloud-synchronized study and syllabus tracker built for competitive aspirants and school students. STrackerX turns syllabus completion into a structured execution roadmap, combining granular milestone matrices, verified Pomodoro focus streaks, and collaborative squad study rooms.

---

## Features (v1.0.0 — Production Release)

* **Tasky Strategic Co-Pilot:** Intelligent spaced-repetition and prerequisite recommendation engine that scans chapter completion timestamps to prescribe targeted study directives.
* **Prerequisite Dependency Logic:** Curriculum-aware priority graphs ensure foundational topics (such as GOC and Vectors) are completed before advanced topics are recommended.
* **Weighted Milestone Analytics:** Progress reflects true academic effort using weighted allocations (e.g., Coaching Modules & DPPs account for 50% of chapter progress).
* **Live Study Circle Feed:** Real-time activity ticker on the Hub screen displaying recent milestone completions by connected peers.
* **Username-First Cloud Sync:** Onboard instantly using a unique handle (`@username`) without email verification delays, fully backed by Supabase PostgreSQL.
* **Dual-Tier Milestone Tracking:**
  * **Senior Stream (Classes 11 & 12):** Notes → Coaching Module → DPPs → Short Notes → Revision 1 → Revision 2 (6 milestones).
  * **Foundation Stream (Classes 8–10):** Notes → Exercises → Practice → Revision (4 milestones).
* **Multi-Grade Curricula:** Pre-loaded NCERT matrices for Physics, Chemistry, Mathematics, Biology, English Core, Social Science, and Language electives across Classes 8 through 12.
* **Stream & Class Management:** Prune unused classes or add custom topics to any subject without losing track state.
* **Tactical Squad Rooms & Realtime Presence:**
  * Join or create shared rooms (`#SQUAD-XXXX`) with live participant rosters.
  * Real-time sync reflects member arrivals, departures, and active study updates across viewports immediately.
* **Anti-Distraction Quick-Pings:** Broadcast predefined academic status directives to your squad with a strict 3-second cooldown rate limiter (no unstructured free-text chat).
* **Persistent Sprint Timer:** Unix timestamp-based Pomodoro engine that preserves active 25-minute focus sprints across page refreshes and tab switches.
* **Verified Study Streaks:** Streaks advance only upon completing verified 25-minute focus sprints.
* **Self Profile Analytics:** Track day streaks, total milestones cleared, and active squad status directly in the Vault.
* **Data Sovereignty:** Export or restore `.json` state snapshots anytime, alongside an instant cloud account purge tool.

---

## Tech Stack

* **Frontend:** Vanilla HTML5, Modern CSS3 (Glassmorphism, Dark/Light Themes), Vanilla JavaScript (ES6+).
* **Backend:** Supabase (PostgreSQL, Realtime replication, Row Level Security, Auth, RPC Functions).
* **Audio & Effects:** Web Audio API, Canvas Confetti.
* **Hosting:** GitHub Pages via GitHub Actions CI/CD.

---

## Project Structure

```text
STrackerX/
├── index.html       # View layouts, modals, and interface markup
├── style.css        # Adaptive dark/light theme variables and styling
├── script.js        # Supabase sync, Tasky engine, and milestone logic
├── CHANGELOG.md     # Full version history and release notes
└── README.md        # Project documentation
```

## LICENCE 
This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0).
