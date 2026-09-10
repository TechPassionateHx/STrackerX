// --- Database & Storage Driver ---
const DB_NAME = 'STrackerX_DB';
const DB_VERSION = 1;
const STORE_NAME = 'app_state';
let dbInstance = null;

async function initDB() {
    if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist();
    }
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        req.onsuccess = (e) => {
            dbInstance = e.target.result;
            resolve();
        };
        req.onerror = () => reject(req.error);
    });
}

async function getStorage(key, fallback) {
    if (!dbInstance) return JSON.parse(localStorage.getItem(key)) ?? fallback;
    return new Promise((resolve) => {
        const tx = dbInstance.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result !== undefined ? req.result : (JSON.parse(localStorage.getItem(key)) ?? fallback));
        req.onerror = () => resolve(JSON.parse(localStorage.getItem(key)) ?? fallback);
    });
}

async function setStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
    if (!dbInstance) return;
    const tx = dbInstance.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(val, key);
}

// Audio Feedback
let audioCtx;
function playTick(freq = 480) {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
}

// Preloaded Curricula
const CURRICULA = {
    "JEE": {
        "Class 11": {
            "Physics": ["Units and Measurements", "Motion in a Plane", "Laws of Motion", "Work, Energy & Power", "Rotational Motion", "Gravitation", "Thermodynamics", "Oscillations & Waves"],
            "Chemistry": ["Mole Concept", "Atomic Structure", "Periodic Table", "Chemical Bonding", "Thermodynamics", "Equilibrium", "Organic Basics", "Hydrocarbons"],
            "Mathematics": ["Sets & Relations", "Trigonometry", "Quadratic Equations", "Permutations & Combinations", "Binomial Theorem", "Sequences & Series", "Straight Lines", "Conic Sections"]
        },
        "Class 12": {
            "Physics": ["Electrostatics", "Current Electricity", "Moving Charges & Magnetism", "Electromagnetic Induction", "AC Circuits", "Ray Optics", "Wave Optics", "Modern Physics"],
            "Chemistry": ["Solutions", "Electrochemistry", "Chemical Kinetics", "Coordination Compounds", "Haloalkanes & Arenes", "Alcohols & Phenols", "Aldehydes & Ketones", "Amines"],
            "Mathematics": ["Relations & Functions", "Matrices & Determinants", "Continuity & Differentiability", "Application of Derivatives", "Integrals", "Differential Equations", "Vectors & 3D"]
        }
    },
    "NEET": {
        "Class 11": {
            "Physics": ["Units & Measurement", "Laws of Motion", "Work & Energy", "Gravitation", "Thermodynamics", "Waves"],
            "Chemistry": ["Atomic Structure", "Chemical Bonding", "Thermodynamics", "Equilibrium", "Organic Chemistry Basics"],
            "Biology": ["Diversity in Living World", "Cell Structure", "Plant Physiology", "Human Physiology"]
        },
        "Class 12": {
            "Physics": ["Electrostatics", "Current Electricity", "Magnetic Effects", "Optics", "Semiconductors"],
            "Chemistry": ["Solutions", "Electrochemistry", "Coordination Compounds", "Biomolecules"],
            "Biology": ["Reproduction", "Genetics and Evolution", "Biology in Human Welfare", "Biotechnology", "Ecology"]
        }
    },
    "Foundation": {
        "Science": ["Matter in Our Surroundings", "Atoms and Molecules", "Cell: The Unit of Life", "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy"],
        "Mathematics": ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations", "Lines and Angles", "Triangles", "Quadrilaterals", "Probability"]
    }
};

// Milestone Schemas
const MILESTONES_FOUNDATION = [
    { key: "notes", label: "Notes" },
    { key: "module", label: "Exercises" },
    { key: "dpps", label: "Practice" },
    { key: "rev", label: "Revision" }
];

const MILESTONES_SENIOR = [
    { key: "notes", label: "Notes" },
    { key: "module", label: "Module" },
    { key: "dpps", label: "DPPs" },
    { key: "snotes", label: "S-Notes" },
    { key: "rev1", label: "Rev 1" },
    { key: "rev2", label: "Rev 2" }
];

// App State
let userProfile = null;
let matrixData = {};
let activeClass = "Class 11";
let activeSubject = "Physics";

// App Boot Engine
async function bootApp() {
    await initDB();

    // Theme initialization
    const savedTheme = await getStorage('stracker_theme', 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);

    userProfile = await getStorage('stracker_profile', null);
    if (!userProfile) {
        document.getElementById('onboarding-overlay').style.display = 'flex';
    } else {
        matrixData = await getStorage('stracker_matrix', null);
        loadUserInterface();
    }
}

// Onboarding Submission
async function completeOnboarding() {
    const name = document.getElementById('ob-name').value.trim() || 'Learner';
    const handle = document.getElementById('ob-handle').value.trim() || 'operator';
    const track = document.getElementById('ob-track').value;

    userProfile = { name, handle: handle.startsWith('@') ? handle : `@${handle}`, track, streak: 1 };
    await setStorage('stracker_profile', userProfile);

    matrixData = buildInitialTrackData(track);
    await setStorage('stracker_matrix', matrixData);

    document.getElementById('onboarding-overlay').style.display = 'none';
    loadUserInterface();
}

function buildInitialTrackData(track) {
    const isFoundation = ['Class 8', 'Class 9', 'Class 10'].includes(track);
    const milestonesList = isFoundation ? MILESTONES_FOUNDATION : MILESTONES_SENIOR;

    let targetCurriculum = CURRICULA["JEE"];
    if (track === "NEET") targetCurriculum = CURRICULA["NEET"];
    if (isFoundation) targetCurriculum = { "General": CURRICULA["Foundation"] };

    const schema = {};
    Object.keys(targetCurriculum).forEach(cls => {
        schema[cls] = {};
        Object.keys(targetCurriculum[cls]).forEach(sub => {
            schema[cls][sub] = targetCurriculum[cls][sub].map((name, i) => {
                const mObj = {};
                milestonesList.forEach(m => mObj[m.key] = false);
                return { id: `ch_${cls}_${sub}_${i}`, name, milestones: mObj };
            });
        });
    });
    return schema;
}

function loadUserInterface() {
    document.getElementById('track-badge').textContent = userProfile.track;
    document.getElementById('header-handle').textContent = userProfile.handle;
    document.getElementById('avatar-char').textContent = userProfile.name.charAt(0).toUpperCase();
    document.getElementById('home-greeting').textContent = `Welcome, ${userProfile.name}`;
    document.getElementById('squad-self-name').innerHTML = `<strong>${userProfile.handle}</strong> (You)`;

    // Class and Subject resolution
    const availableClasses = Object.keys(matrixData);
    activeClass = availableClasses[0];
    const availableSubs = Object.keys(matrixData[activeClass] || {});
    activeSubject = availableSubs[0];

    renderClassSelectors();
    renderSubjectTabs();
    renderMatrixView();
    updateProgressAnalytics();
}

// Navigation Tab Switcher
function switchTab(viewId) {
    document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(`view-${viewId}`).classList.add('active');
    event.currentTarget.classList.add('active');
    playTick(420);
}

// Matrix Render Engine
function renderClassSelectors() {
    const container = document.getElementById('class-selector');
    const classes = Object.keys(matrixData);

    if (classes.length <= 1) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';
    container.innerHTML = '';
    classes.forEach(cls => {
        const btn = document.createElement('button');
        btn.className = `class-btn ${cls === activeClass ? 'active' : ''}`;
        btn.textContent = cls;
        btn.onclick = () => {
            activeClass = cls;
            renderClassSelectors();
            renderSubjectTabs();
            renderMatrixView();
            playTick(350);
        };
        container.appendChild(btn);
    });
}

function renderSubjectTabs() {
    const container = document.getElementById('subject-tabs');
    container.innerHTML = '';
    const subjects = Object.keys(matrixData[activeClass] || {});
    
    if (!subjects.includes(activeSubject)) {
        activeSubject = subjects[0] || '';
    }

    subjects.forEach(sub => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${sub === activeSubject ? 'active' : ''}`;
        btn.textContent = sub;
        btn.onclick = () => {
            activeSubject = sub;
            renderSubjectTabs();
            renderMatrixView();
            playTick(350);
        };
        container.appendChild(btn);
    });
}

function renderMatrixView() {
    const container = document.getElementById('matrix-container');
    container.innerHTML = '';
    document.getElementById('matrix-active-label').textContent = `${activeClass} — ${activeSubject}`;

    const chapters = matrixData[activeClass]?.[activeSubject] || [];
    const isFoundation = ['Class 8', 'Class 9', 'Class 10'].includes(userProfile.track);
    const milestonesList = isFoundation ? MILESTONES_FOUNDATION : MILESTONES_SENIOR;

    chapters.forEach(ch => {
        const card = document.createElement('div');
        card.className = 'chapter-card';

        const total = milestonesList.length;
        const doneCount = milestonesList.filter(m => ch.milestones[m.key]).length;
        const pct = Math.round((doneCount / total) * 100);

        card.innerHTML = `
            <div class="chapter-header">
                <span class="chapter-title">${ch.name}</span>
                <span class="chapter-pct">${pct}%</span>
            </div>
        `;

        const grid = document.createElement('div');
        grid.className = `milestones-grid ${isFoundation ? 'four-cols' : ''}`;

        milestonesList.forEach(m => {
            const isDone = !!ch.milestones[m.key];
            const chip = document.createElement('div');
            chip.className = `chip ${isDone ? 'done' : ''}`;
            chip.textContent = m.label;
            chip.onclick = () => toggleMilestone(ch.id, m.key);
            grid.appendChild(chip);
        });

        card.appendChild(grid);
        container.appendChild(card);
    });
}

function toggleMilestone(chapterId, key) {
    const chapters = matrixData[activeClass]?.[activeSubject] || [];
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    chapter.milestones[key] = !chapter.milestones[key];
    playTick(chapter.milestones[key] ? 620 : 250);

    setStorage('stracker_matrix', matrixData);
    renderMatrixView();
    updateProgressAnalytics();
}

function updateProgressAnalytics() {
    let totalTasks = 0;
    let completedTasks = 0;
    let totalChapters = 0;

    Object.values(matrixData).forEach(subjects => {
        Object.values(subjects).forEach(chapters => {
            chapters.forEach(ch => {
                totalChapters++;
                Object.values(ch.milestones).forEach(isDone => {
                    totalTasks++;
                    if (isDone) completedTasks++;
                });
            });
        });
    });

    const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    document.getElementById('matrix-pct').textContent = `${pct}%`;
    document.getElementById('matrix-fill').style.width = `${pct}%`;
    document.getElementById('home-matrix-stat').textContent = `${pct}% Cleared`;
    document.getElementById('matrix-milestone-count').textContent = `${completedTasks}/${totalTasks} Tasks`;
    document.getElementById('matrix-chapter-count').textContent = `${totalChapters} Chapters`;
}

// Theme Engine
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setStorage('stracker_theme', next);
    playTick(500);
}

// Sprint Timer Engine
let sprintTime = 25 * 60;
let timerId = null;

function updateTimerDisplay() {
    const min = String(Math.floor(sprintTime / 60)).padStart(2, '0');
    const sec = String(sprintTime % 60).padStart(2, '0');
    document.getElementById('timer-display').textContent = `${min}:${sec}`;
}

function toggleTimer() {
    const btn = document.getElementById('btn-timer-toggle');
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        btn.textContent = 'RESUME';
    } else {
        btn.textContent = 'PAUSE';
        timerId = setInterval(() => {
            if (sprintTime > 0) {
                sprintTime--;
                updateTimerDisplay();
            } else {
                clearInterval(timerId);
                timerId = null;
                btn.textContent = 'START SPRINT';
                playTick(880);
                if (typeof confetti === 'function') confetti();
                alert('Focus Sprint Cleared! Take a 5-minute break.');
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    sprintTime = 25 * 60;
    updateTimerDisplay();
    document.getElementById('btn-timer-toggle').textContent = 'START SPRINT';
}

// Vault Backups
function exportDataBackup() {
    const blob = new Blob([JSON.stringify({ userProfile, matrixData }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strackerx_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importDataBackup(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (data.userProfile && data.matrixData) {
                userProfile = data.userProfile;
                matrixData = data.matrixData;
                await setStorage('stracker_profile', userProfile);
                await setStorage('stracker_matrix', matrixData);
                location.reload();
            }
        } catch (err) {
            alert("Corrupted configuration file.");
        }
    };
    reader.readAsText(file);
}

function hardReset() {
    if (confirm("Purge local database? All progress will be reset.")) {
        localStorage.clear();
        if (dbInstance) {
            const tx = dbInstance.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).clear();
        }
        location.reload();
    }
}

// Ignition
bootApp();
 