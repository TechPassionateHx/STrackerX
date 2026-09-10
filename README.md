# STrackerX ⚡

A high-performance, cloud-synced study tracker engineered for competitive aspirants and school students. STrackerX turns syllabus completion into a structured execution roadmap, combining granular milestone matrices, verified Pomodoro focus streaks, and collaborative squad study rooms.

---

## Features

* **Username-First Cloud Sync:** Onboard instantly using a unique handle (`@username`) without waiting for email verification codes, backed by Supabase PostgreSQL.
* **Dual-Tier Milestone Tracking:**
  * **Senior Stream (Classes 11 & 12):** Notes -> Coaching Module -> DPPs -> Short Notes -> Revision 1 -> Revision 2 (6 milestones).
  * **Foundation Stream (Classes 8–10):** Notes -> Exercises -> Practice -> Revision (4 milestones).
* **Multi-Grade Curricula:** Pre-loaded NCERT matrices for Physics, Chemistry, Mathematics, Biology, English Core, Social Science (History, Civics, Geography, Economics), and Language electives (Hindi/Sanskrit) across Classes 8 through 12.
* **Custom Chapters:** Add or remove custom topics to any subject matrix without breaking syllabus persistence.
* **Focus Sprint Engine:** Integrated 25-minute Pomodoro timer featuring custom Web Audio synthesizers and victory confetti on completion.
* **Verified Study Streaks:** Streaks only advance upon successfully finishing a full 25-minute focus sprint.
* **Dynamic Directives:** Over 15 motivational focus quotes that rotate dynamically on each session boot.
* **Social Hub & Study Squads:**
  * Connect with peers via handle searches.
  * Dedicated incoming friend requests inbox with Accept and Decline actions.
  * Real-time squad rooms (`#SQUAD-XXXX`) with live participant rosters and membership controls.
* **Data Sovereignty:** Full `.json` export and import routines, alongside a complete cloud account deletion cascade.

---

## Tech Stack

* **Frontend:** Vanilla HTML5, Modern CSS3 (Glassmorphism, Dark/Light Themes), Vanilla JavaScript (ES6+).
* **Backend & Storage:** Supabase (PostgreSQL, Row Level Security, Auth, RPC Functions).
* **Audio & Effects:** Web Audio API, Canvas Confetti.
* **Deployment:** GitHub Pages via automated GitHub Actions CI/CD workflows.

---

## Project Structure

STrackerX/
├── index.html       # View layouts, modals, and interface markup
├── style.css        # Adaptive dark/light theme variables and styling
├── script.js        # Supabase synchronization, milestone logic, and audio
├── CHANGELOG.md     # Documented release milestones
└── README.md        # Project documentation

---

## Setup & Configuration

### 1. Supabase Backend Setup
1. Create a project at https://supabase.com.
2. Go to Authentication -> Providers -> Email and turn Confirm email OFF.
3. Open the SQL Editor and run the following commands to create the squad room table and cascade deletion RPC:

-- Account Purge RPC Function
create or replace function public.delete_current_user()
returns void as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$ language plpgsql security definer;

-- Squad Rooms Table
create table if not exists public.squad_rooms (
  room_code text primary key,
  created_by uuid references public.profiles(id) on delete cascade,
  members jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.squad_rooms enable row level security;
create policy "Anyone can read squads" on public.squad_rooms for select using (true);
create policy "Authenticated users can create squads" on public.squad_rooms for insert with check (auth.uid() is not null);
create policy "Authenticated users can update squads" on public.squad_rooms for update using (auth.uid() is not null);

### 2. Connect Credentials
In script.js, replace the configuration keys at the top with your project's credentials:

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

### 3. Deploy
Push the project to your GitHub repository on the main branch. Enable GitHub Pages in repository settings under Settings -> Pages to serve the site live.

---

## Version Roadmap

* **v0.0.1 – v0.0.2:** Local-storage foundation, base milestone matrices, and initial sprint timer.
* **v0.1.0:** Supabase PostgreSQL integration, username-first authentication, and cloud synchronization.
* **v0.2.0:** Multi-grade expansion (Class 9, English, SST, Languages), milestone tier separation fixes, bidirectional friend requests, active squad rooms, and verified Pomodoro streaks.

---

## License

CC-BY-NC-4.0
