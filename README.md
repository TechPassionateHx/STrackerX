# STrackerX ⚡

A high-performance, cloud-synchronized study and syllabus tracker built for competitive aspirants and school students. STrackerX turns syllabus completion into a structured execution roadmap, combining granular milestone matrices, verified Pomodoro focus streaks, and collaborative squad study rooms.

---

## Features

* **Username-First Cloud Sync:** Onboard instantly using a unique handle (`@username`) without email verification delays, fully synced with cloud persistence.
* **Dual-Tier Milestone Tracking:**
  * **Senior Stream (Classes 11 & 12):** Notes → Coaching Module → DPPs → Short Notes → Revision 1 → Revision 2 (6 milestones).
  * **Foundation Stream (Classes 8–10):** Notes → Exercises → Practice → Revision (4 milestones).
* **Multi-Grade Curricula:** Pre-loaded NCERT matrices for Physics, Chemistry, Mathematics, Biology, English Core, Social Science (History, Civics, Geography, Economics), and Language electives (Hindi/Sanskrit) across Classes 8 through 12.
* **Custom Chapter Injection:** Add or remove custom chapters to any subject without losing track state.
* **Focus Sprint Engine:** Built-in 25-minute Pomodoro timer featuring Web Audio synthesized alerts and confetti celebrations.
* **Verified Study Streaks:** Streaks calculate and advance only upon completing a verified 25-minute focus sprint.
* **Dynamic Directives:** Over 15 motivational focus quotes that rotate automatically across app sessions.
* **Social Study Circles & Squads:**
  * Connect with peers via handle search.
  * Dedicated incoming friend request inbox with Accept and Decline controls.
  * Real-time squad study rooms (`#SQUAD-XXXX`) with live participant rosters and membership controls.
* **Data Control & Portability:** Export or restore `.json` state snapshots anytime, alongside an instant cloud account purge tool.

---

## Tech Stack

* **Frontend:** Vanilla HTML5, Modern CSS3 (Glassmorphism, Dark/Light Themes), Vanilla JavaScript (ES6+).
* **Backend:** Supabase (PostgreSQL, Row Level Security, Auth, RPC Functions).
* **Audio & Effects:** Web Audio API, Canvas Confetti.
* **Hosting:** GitHub Pages via GitHub Actions CI/CD.

---

## Project Structure

```text
STrackerX/
├── index.html       # Application layouts, views, and modal markup
├── style.css        # Glassmorphic UI styling and theme variables
├── script.js        # Cloud sync, milestone matrices, and app logic
├── CHANGELOG.md     # Full version history and release notes
└── README.md        # Project documentation
'''text

##LICENSE

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0).
