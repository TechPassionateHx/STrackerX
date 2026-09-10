# STrackerX — Core Features Specifications

### 1. Dynamic Academic Onboarding
* **Profile Setup:** Local storage of Display Name and unique Username handle (e.g., `@handle`).
* **Adaptive Academic Tracks:**
  * **Foundation Tier:** Class 8, Class 9, Class 10 (Science, Mathematics).
  * **Senior Secondary (Single Year):** Class 11 Only, Class 12 Only (PCM / PCB).
  * **Competitive 2-Year Dual Programs:** JEE (Class 11 + 12 PCM), NEET (Class 11 + 12 PCB).

### 2. Tiered Adaptive Milestone Engine
* **Foundation Milestone Schema (Classes 8–10):** 4 checkpoints per chapter:
  * `Notes` → `Module / Exercises` → `DPPs / Practice` → `Revision`
* **Senior & Competitive Schema (Classes 11, 12, JEE, NEET):** 6 checkpoints per chapter:
  * `Notes` → `Module` → `DPPs` → `Short Notes` → `Revision 1` → `Revision 2`

### 3. Navigation & Matrix Visualizer
* **Context-Aware Navigation:** Single-class view for standalone classes; dynamic Class 11 / Class 12 switcher for 2-year competitive tracks (JEE/NEET).
* **Interactive Milestone Matrix:** Rapid-tap state cycling (Incomplete → Complete) with instantaneous audio feedback.
* **Progress Aggregation:**
  * Chapter-level completion percentage.
  * Subject-level progress meter.
  * Master syllabus completion bar across the entire selected track.

### 4. Focus & Productivity Suite
* **Integrated Focus Sprint Timer:** Built-in 25-minute Pomodoro/sprint timer with Start/Pause/Reset controls.
* **Tactile Audio Synthesizer:** Zero-asset browser `AudioContext` clicks and confetti triggers upon chapter completion.
* **Ambient Motivation Directive:** Dynamic rotating quote widget and procedural study protocol guide.

### 5. Architecture, Storage & Deployment
* **Client-Side Storage Engine:** Dual-layer persistence utilizing `IndexedDB` combined with the `Web Storage API` (`navigator.storage.persist()`).
* **Data Portability:** Zero-login architecture with one-click JSON backup export and restore mechanisms.
* **PWA Enabled:** Web app manifest ready for standalone fullscreen mobile installation.
* **Theme:** Deep Space Neon (obsidian backdrop, frosted glassmorphism, luminous borders, and emerald active states).
 