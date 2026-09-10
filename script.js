// --- STrackerX v0.1.0 Engine (Step 1 Unified Build) ---

// Synchronous Fast Storage with Background IndexedDB Mirror
const DB_NAME = 'STrackerX_DB';
const STORE_NAME = 'app_state';
let dbInstance = null;

// Initialize IndexedDB in background without blocking execution
(function initBackgroundDB() {
    try {
        if (!window.indexedDB) return;
        const req = indexedDB.open(DB_NAME, 2);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        req.onsuccess = (e) => {
            dbInstance = e.target.result;
        };
    } catch (e) {
        // Fallback silently
    }
})();

function getSyncStorage(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        return fallback;
    }
}

function setSyncStorage(key, val) {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
    try {
        if (dbInstance) {
            const tx = dbInstance.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).put(val, key);
        }
    } catch (e) {}
}

// Procedural Audio Engine
let audioCtx = null;
function playTick(freq = 480) {
    try {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioClass) return;
        if (!audioCtx) audioCtx = new AudioClass();
        if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
}

// NCERT Curricula Database
const OFFICIAL_CHAPTERS = {
    "Class 11": {
        "Physics": [
            "Units and Measurements", "Motion in a Straight Line", "Motion in a Plane", 
            "Laws of Motion", "Work, Energy and Power", "System of Particles and Rotational Motion", 
            "Gravitation", "Mechanical Properties of Solids", "Mechanical Properties of Fluids", 
            "Thermal Properties of Matter", "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves"
        ],
        "Chemistry": [
            "Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements and Periodicity in Properties", 
            "Chemical Bonding and Molecular Structure", "Thermodynamics", "Equilibrium", 
            "Redox Reactions", "Organic Chemistry: Some Basic Principles and Techniques", "Hydrocarbons"
        ],
        "Mathematics": [
            "Sets", "Relations and Functions", "Trigonometric Functions", 
            "Complex Numbers and Quadratic Equations", "Linear Inequalities", "Permutations and Combinations", 
            "Binomial Theorem", "Sequences and Series", "Straight Lines", "Conic Sections", 
            "Introduction to Three Dimensional Geometry", "Limits and Derivatives", "Statistics", "Probability"
        ],
        "Biology": [
            "The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom", 
            "Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Structural Organisation in Animals", 
            "Cell: The Unit of Life", "Biomolecules", "Cell Cycle and Cell Division", 
            "Photosynthesis in Higher Plants", "Respiration in Plants", "Plant Growth and Development", 
            "Breathing and Exchange of Gases", "Body Fluids and Circulation", "Excretory Products and their Elimination", 
            "Locomotion and Movement", "Neural Control and Coordination", "Chemical Coordination and Integration"
        ]
    },
    "Class 12": {
        "Physics": [
            "Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity", 
            "Moving Charges and Magnetism", "Magnetism and Matter", "Electromagnetic Induction", 
            "Alternating Current", "Electromagnetic Waves", "Ray Optics and Optical Instruments", 
            "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms", "Nuclei", 
            "Semiconductor Electronics: Materials, Devices and Simple Circuits"
        ],
        "Chemistry": [
            "Solutions", "Electrochemistry", "Chemical Kinetics", "The d- and f-Block Elements", 
            "Coordination Compounds", "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", 
            "Aldehydes, Ketones and Carboxylic Acids", "Amines", "Biomolecules"
        ],
        "Mathematics": [
            "Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", 
            "Continuity and Differentiability", "Application of Derivatives", "Integrals", 
            "Application of Integrals", "Differential Equations", "Vector Algebra", 
            "Three Dimensional Geometry", "Linear Programming", "Probability"
        ],
        "Biology": [
            "Sexual Reproduction in Flowering Plants", "Human Reproduction", "Reproductive Health", 
            "Principles of Inheritance and Variation", "Molecular Basis of Inheritance", "Evolution", 
            "Human Health and Disease", "Microbes in Human Welfare", 
            "Biotechnology: Principles and Processes", "Biotechnology and its Applications", 
            "Organisms and Populations", "Ecosystem", "Biodiversity and Conservation"
        ]
    },
    "Foundation": {
        "Science": [
            "Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-metals", 
            "Carbon and its Compounds", "Life Processes", "Control and Coordination", 
            "How do Organisms Reproduce?", "Heredity", "Light – Reflection and Refraction", 
            "The Human Eye and the Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Our Environment"
        ],
        "Mathematics": [
            "Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", 
            "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", 
            "Introduction to Trigonometry", "Some Applications of Trigonometry", "Circles", 
            "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability"
        ]
    }
};

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
let currentSquadCode = null;

function buildTrackData(track, existingData) {
    const isFoundation = ['Class 8', 'Class 9', 'Class 10'].includes(track);
    const milestonesList = isFoundation ? MILESTONES_FOUNDATION : MILESTONES_SENIOR;

    let targetClasses = [];
    let targetSubjects = [];

    if (track === "JEE") {
        targetClasses = ["Class 11", "Class 12"];
        targetSubjects = ["Physics", "Chemistry", "Mathematics"];
    } else if (track === "NEET") {
        targetClasses = ["Class 11", "Class 12"];
        targetSubjects = ["Physics", "Chemistry", "Biology"];
    } else if (track === "Class 11 PCM") {
        targetClasses = ["Class 11"];
        targetSubjects = ["Physics", "Chemistry", "Mathematics"];
    } else if (track === "Class 11 PCB") {
        targetClasses = ["Class 11"];
        targetSubjects = ["Physics", "Chemistry", "Biology"];
    } else if (track === "Class 12 PCM") {
        targetClasses = ["Class 12"];
        targetSubjects = ["Physics", "Chemistry", "Mathematics"];
    } else if (track === "Class 12 PCB") {
        targetClasses = ["Class 12"];
        targetSubjects = ["Physics", "Chemistry", "Biology"];
    } else {
        targetClasses = ["Foundation"];
        targetSubjects = ["Science", "Mathematics"];
    }

    const output = existingData && typeof existingData === 'object' ? { ...existingData } : {};

    targetClasses.forEach(cls => {
        if (!output[cls]) output[cls] = {};
        const sourceClass = (cls === "Foundation") ? OFFICIAL_CHAPTERS.Foundation : OFFICIAL_CHAPTERS[cls];

        targetSubjects.forEach(sub => {
            if (!output[cls][sub]) {
                const chapterNames = (sourceClass && sourceClass[sub]) ? sourceClass[sub] : [];
                output[cls][sub] = chapterNames.map((name, i) => {
                    const mObj = {};
                    milestonesList.forEach(m => mObj[m.key] = false);
                    return { id: `ch_${cls}_${sub}_${i}`, name, isCustom: false, milestones: mObj };
                });
            }
        });
    });

    return output;
}

// Instant Boot Sequence
function bootApp() {
    const savedTheme = getSyncStorage('stracker_theme', 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);

    userProfile = getSyncStorage('stracker_profile', null);

    if (!userProfile) {
        const overlay = document.getElementById('onboarding-overlay');
        if (overlay) overlay.style.display = 'flex';
    } else {
        matrixData = getSyncStorage('stracker_matrix', null);
        if (!matrixData || Object.keys(matrixData).length === 0) {
            matrixData = buildTrackData(userProfile.track, {});
            setSyncStorage('stracker_matrix', matrixData);
        }
        loadUserInterface();
    }
}

function completeOnboarding() {
    const nameInput = document.getElementById('ob-name');
    const handleInput = document.getElementById('ob-handle');
    const trackSelect = document.getElementById('ob-track');

    const name = (nameInput && nameInput.value.trim()) || 'Learner';
    const rawHandle = (handleInput && handleInput.value.trim()) || 'operator';
    const handle = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle}`;
    const track = trackSelect ? trackSelect.value : 'JEE';

    userProfile = { name, handle, track, streak: 1 };
    setSyncStorage('stracker_profile', userProfile);

    matrixData = buildTrackData(track, {});
    setSyncStorage('stracker_matrix', matrixData);

    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) overlay.style.display = 'none';

    loadUserInterface();
    playTick(600);
}

function loadUserInterface() {
    if (!userProfile) return;

    const trackBadge = document.getElementById('track-badge');
    const headerHandle = document.getElementById('header-handle');
    const avatarChar = document.getElementById('avatar-char');
    const greeting = document.getElementById('home-greeting');
    const vaultSelect = document.getElementById('vault-stream-select');

    if (trackBadge) trackBadge.textContent = userProfile.track || 'TRACK';
    if (headerHandle) headerHandle.textContent = userProfile.handle || '@user';
    if (avatarChar) avatarChar.textContent = (userProfile.name || 'U').charAt(0).toUpperCase();
    if (greeting) greeting.textContent = `Welcome, ${userProfile.name}`;
    if (vaultSelect) vaultSelect.value = userProfile.track;

    const availableClasses = Object.keys(matrixData);
    if (availableClasses.length > 0) {
        if (!availableClasses.includes(activeClass)) activeClass = availableClasses[0];
        const availableSubs = Object.keys(matrixData[activeClass] || {});
        if (availableSubs.length > 0 && !availableSubs.includes(activeSubject)) {
            activeSubject = availableSubs[0];
        }
    }

    renderClassSelectors();
    renderSubjectTabs();
    renderMatrixView();
    updateProgressAnalytics();
    updateSquadDisplay();
}

function switchTab(viewId) {
    document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const targetScreen = document.getElementById(`view-${viewId}`);
    if (targetScreen) targetScreen.classList.add('active');

    document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
        const attr = btn.getAttribute('onclick') || '';
        if (attr.includes(viewId)) {
            btn.classList.add('active');
        }
    });

    playTick(420);
}

function renderClassSelectors() {
    const container = document.getElementById('class-selector');
    if (!container) return;

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
    if (!container) return;

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
    const label = document.getElementById('matrix-active-label');
    if (!container) return;

    container.innerHTML = '';
    if (label) label.textContent = `${activeClass} — ${activeSubject}`;

    const chapters = matrixData[activeClass]?.[activeSubject] || [];
    const isFoundation = ['Class 8', 'Class 9', 'Class 10'].includes(userProfile ? userProfile.track : '');
    const milestonesList = isFoundation ? MILESTONES_FOUNDATION : MILESTONES_SENIOR;

    chapters.forEach(ch => {
        const card = document.createElement('div');
        card.className = 'chapter-card';

        const total = milestonesList.length;
        const doneCount = milestonesList.filter(m => ch.milestones[m.key]).length;
        const pct = Math.round((doneCount / total) * 100);

        card.innerHTML = `
            <div class="chapter-header">
                <div class="chapter-title-wrap">
                    <span class="chapter-title">${ch.name}</span>
                    ${ch.isCustom ? '<span class="badge-custom">Custom</span>' : ''}
                    ${ch.isCustom ? `<button class="btn-del-chapter" onclick="deleteCustomChapter('${ch.id}')" title="Delete">✕</button>` : ''}
                </div>
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

    setSyncStorage('stracker_matrix', matrixData);
    renderMatrixView();
    updateProgressAnalytics();
}

// Custom Chapter Logic
function toggleAddModal(show) {
    const modal = document.getElementById('modal-add-chapter');
    if (!modal) return;
    modal.style.display = show ? 'flex' : 'none';
    if (show) {
        const sub = document.getElementById('add-chapter-context-sub');
        if (sub) sub.textContent = `Targeting: ${activeClass} → ${activeSubject}`;
        const input = document.getElementById('custom-chapter-input');
        if (input) {
            input.value = '';
            input.focus();
        }
    }
}

function submitCustomChapter() {
    const input = document.getElementById('custom-chapter-input');
    const name = input ? input.value.trim() : '';
    if (!name) return;

    const isFoundation = ['Class 8', 'Class 9', 'Class 10'].includes(userProfile.track);
    const milestonesList = isFoundation ? MILESTONES_FOUNDATION : MILESTONES_SENIOR;

    const mObj = {};
    milestonesList.forEach(m => mObj[m.key] = false);

    const newChapter = {
        id: `custom_${Date.now()}`,
        name,
        isCustom: true,
        milestones: mObj
    };

    if (!matrixData[activeClass]) matrixData[activeClass] = {};
    if (!matrixData[activeClass][activeSubject]) matrixData[activeClass][activeSubject] = [];

    matrixData[activeClass][activeSubject].push(newChapter);
    setSyncStorage('stracker_matrix', matrixData);

    toggleAddModal(false);
    renderMatrixView();
    updateProgressAnalytics();
    playTick(720);
}

function deleteCustomChapter(id) {
    if (!confirm("Delete this custom chapter?")) return;
    matrixData[activeClass][activeSubject] = matrixData[activeClass][activeSubject].filter(c => c.id !== id);
    setSyncStorage('stracker_matrix', matrixData);
    renderMatrixView();
    updateProgressAnalytics();
}

// Stream Switcher
function handleStreamSwitch(newTrack) {
    if (newTrack === userProfile.track) return;
    userProfile.track = newTrack;
    matrixData = buildTrackData(newTrack, matrixData);
    setSyncStorage('stracker_profile', userProfile);
    setSyncStorage('stracker_matrix', matrixData);
    loadUserInterface();
    playTick(500);
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
    
    const pctEl = document.getElementById('matrix-pct');
    const fillEl = document.getElementById('matrix-fill');
    const homeStat = document.getElementById('home-matrix-stat');
    const taskCount = document.getElementById('matrix-milestone-count');
    const chCount = document.getElementById('matrix-chapter-count');

    if (pctEl) pctEl.textContent = `${pct}%`;
    if (fillEl) fillEl.style.width = `${pct}%`;
    if (homeStat) homeStat.textContent = `${pct}% Cleared`;
    if (taskCount) taskCount.textContent = `${completedTasks}/${totalTasks} Tasks`;
    if (chCount) chCount.textContent = `${totalChapters} Chapters`;
}

// Theme Engine
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setSyncStorage('stracker_theme', next);
    playTick(500);
}

// Focus Sprint Timer
let sprintTime = 25 * 60;
let timerId = null;

function updateTimerDisplay() {
    const min = String(Math.floor(sprintTime / 60)).padStart(2, '0');
    const sec = String(sprintTime % 60).padStart(2, '0');
    const display = document.getElementById('timer-display');
    if (display) display.textContent = `${min}:${sec}`;
}

function toggleTimer() {
    const btn = document.getElementById('btn-timer-toggle');
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        if (btn) btn.textContent = 'START SPRINT';
    } else {
        if (btn) btn.textContent = 'PAUSE';
        playTick(600);
        timerId = setInterval(() => {
            if (sprintTime > 0) {
                sprintTime--;
                updateTimerDisplay();
            } else {
                clearInterval(timerId);
                timerId = null;
                if (btn) btn.textContent = 'START SPRINT';
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
    const btn = document.getElementById('btn-timer-toggle');
    if (btn) btn.textContent = 'START SPRINT';
}

// Modal Handlers
function toggleModal(id, show) {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? 'flex' : 'none';
    if (show) playTick(350);
}

// Squad Management Engine
function handleCreateSquad() {
    const randomID = Math.floor(1000 + Math.random() * 9000);
    currentSquadCode = `#SQUAD-${randomID}`;
    setSyncStorage('stracker_squad', currentSquadCode);
    updateSquadDisplay();
    playTick(600);
    alert(`Squad created! Your Room Code is: ${currentSquadCode}`);
}

function handleJoinSquad() {
    const input = document.getElementById('join-squad-input');
    const code = input ? input.value.trim() : '';
    if (!code) {
        alert("Please enter a valid Squad Code.");
        return;
    }
    currentSquadCode = code.startsWith('#') ? code : `#${code}`;
    setSyncStorage('stracker_squad', currentSquadCode);
    updateSquadDisplay();
    playTick(600);
    alert(`Connected to Squad: ${currentSquadCode}`);
}

function leaveSquad() {
    if (confirm("Disconnect from this squad?")) {
        currentSquadCode = null;
        localStorage.removeItem('stracker_squad');
        updateSquadDisplay();
    }
}

function updateSquadDisplay() {
    const savedSquad = getSyncStorage('stracker_squad', null);
    currentSquadCode = savedSquad;

    const homeStat = document.getElementById('home-squad-stat');
    const activeView = document.getElementById('squad-active-view');
    const actionsBox = document.querySelector('.squad-actions-box');
    const homeEmpty = document.getElementById('home-squad-empty');
    const roomLabel = document.getElementById('current-room-code');

    if (currentSquadCode) {
        if (homeStat) homeStat.textContent = currentSquadCode;
        if (roomLabel) roomLabel.textContent = currentSquadCode;
        if (activeView) activeView.style.display = 'block';
        if (actionsBox) actionsBox.style.display = 'none';
        if (homeEmpty) {
            homeEmpty.innerHTML = `
                <p>Connected to <strong>${currentSquadCode}</strong>. Real-time peer sync will activate once cloud auth is connected.</p>
                <button class="btn-ghost" onclick="switchTab('squad')">Open Squad Arena</button>
            `;
        }
    } else {
        if (homeStat) homeStat.textContent = 'Not in a squad';
        if (activeView) activeView.style.display = 'none';
        if (actionsBox) actionsBox.style.display = 'flex';
        if (homeEmpty) {
            homeEmpty.innerHTML = `
                <p>No squad active. Create a squad or enter a team code to link real-time study sprint activity.</p>
                <button class="btn-primary" onclick="switchTab('squad')">Initialize Squad Connection</button>
            `;
        }
    }
}

// Feedback & Reporting Engine
function submitFeedback() {
    const typeSelect = document.getElementById('report-type');
    const bodyInput = document.getElementById('report-body');

    const type = typeSelect ? typeSelect.value : 'general';
    const body = bodyInput ? bodyInput.value.trim() : '';

    if (!body) {
        alert("Please enter a description for your feedback.");
        return;
    }

    const feedbackPayload = {
        id: `fb_${Date.now()}`,
        user: userProfile ? userProfile.handle : 'anonymous',
        type,
        body,
        timestamp: new Date().toISOString()
    };

    const existingFeedback = getSyncStorage('stracker_feedback_queue', []);
    existingFeedback.push(feedbackPayload);
    setSyncStorage('stracker_feedback_queue', existingFeedback);

    if (bodyInput) bodyInput.value = '';
    toggleModal('modal-feedback', false);
    playTick(750);
    alert("Feedback received! Thank you for helping refine STrackerX.");
}

// Backups & Reset
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
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (data.userProfile && data.matrixData) {
                userProfile = data.userProfile;
                matrixData = data.matrixData;
                setSyncStorage('stracker_profile', userProfile);
                setSyncStorage('stracker_matrix', matrixData);
                location.reload();
            }
        } catch (err) {
            alert("Corrupted backup file.");
        }
    };
    reader.readAsText(file);
}

function promptSecureReset() {
    const confirmation = prompt("To permanently delete your account and erase all milestones, type 'DELETE':");
    if (confirmation === 'DELETE') {
        try { localStorage.clear(); } catch(e){}
        try {
            if (dbInstance) {
                const tx = dbInstance.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).clear();
            }
        } catch(e){}
        alert("Account purged successfully.");
        location.reload();
    }
}

// Ignition
bootApp();
