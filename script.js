// --- STrackerX v0.0.2 Engine ---
const DB_NAME = 'STrackerX_DB';
const DB_VERSION = 2;
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

// Procedural Audio Engine
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

// Complete Official NCERT Curricula
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

let userProfile = null;
let matrixData = {};
let activeClass = "Class 11";
let activeSubject = "Physics";

// App Boot
async function bootApp() {
    await initDB();

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

async function completeOnboarding() {
    const name = document.getElementById('ob-name').value.trim() || 'Learner';
    const handle = document.getElementById('ob-handle').value.trim() || 'operator';
    const track = document.getElementById('ob-track').value;

    userProfile = { name, handle: handle.startsWith('@') ? handle : `@${handle}`, track, streak: 1 };
    await setStorage('stracker_profile', userProfile);

    matrixData = buildTrackData(track, {});
    await setStorage('stracker_matrix', matrixData);

    document.getElementById('onboarding-overlay').style.display = 'none';
    loadUserInterface();
}

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
        // Foundation
        targetClasses = ["Foundation"];
        targetSubjects = ["Science", "Mathematics"];
    }

    const output = { ...existingData };

    targetClasses.forEach(cls => {
        if (!output[cls]) output[cls] = {};
        const sourceClass = (cls === "Foundation") ? OFFICIAL_CHAPTERS.Foundation : OFFICIAL_CHAPTERS[cls];

        targetSubjects.forEach(sub => {
            if (!output[cls][sub]) {
                const chapterNames = sourceClass[sub] || [];
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

function loadUserInterface() {
    document.getElementById('track-badge').textContent = userProfile.track;
    document.getElementById('header-handle').textContent = userProfile.handle;
    document.getElementById('avatar-char').textContent = userProfile.name.charAt(0).toUpperCase();
    document.getElementById('home-greeting').textContent = `Welcome, ${userProfile.name}`;
    document.getElementById('squad-self-name').innerHTML = `<strong>${userProfile.handle}</strong> (You)`;
    document.getElementById('vault-stream-select').value = userProfile.track;

    const availableClasses = Object.keys(matrixData);
    if (!availableClasses.includes(activeClass)) activeClass = availableClasses[0];
    const availableSubs = Object.keys(matrixData[activeClass] || {});
    if (!availableSubs.includes(activeSubject)) activeSubject = availableSubs[0];

    renderClassSelectors();
    renderSubjectTabs();
    renderMatrixView();
    updateProgressAnalytics();
}

function switchTab(viewId) {
    document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(`view-${viewId}`).classList.add('active');
    event.currentTarget.classList.add('active');
    playTick(420);
}

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
                <div class="chapter-title-wrap">
                    <span class="chapter-title">${ch.name}</span>
                    ${ch.isCustom ? '<span class="badge-custom">Custom</span>' : ''}
                    ${ch.isCustom ? `<button class="btn-del-chapter" onclick="deleteCustomChapter('${ch.id}')" title="Delete Chapter">✕</button>` : ''}
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

    setStorage('stracker_matrix', matrixData);
    renderMatrixView();
    updateProgressAnalytics();
}

// Custom Chapter Engine
function toggleAddModal(show) {
    document.getElementById('modal-add-chapter').style.display = show ? 'flex' : 'none';
    if (show) {
        document.getElementById('add-chapter-context-sub').textContent = `Adding to: ${activeClass} → ${activeSubject}`;
        document.getElementById('custom-chapter-input').value = '';
        document.getElementById('custom-chapter-input').focus();
    }
}

function submitCustomChapter() {
    const input = document.getElementById('custom-chapter-input');
    const name = input.value.trim();
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
    setStorage('stracker_matrix', matrixData);

    toggleAddModal(false);
    renderMatrixView();
    updateProgressAnalytics();
    playTick(720);
}

function deleteCustomChapter(id) {
    if (!confirm("Delete this custom chapter?")) return;
    matrixData[activeClass][activeSubject] = matrixData[activeClass][activeSubject].filter(c => c.id !== id);
    setStorage('stracker_matrix', matrixData);
    renderMatrixView();
    updateProgressAnalytics();
}

// Stream Switcher (Non-destructive)
async function handleStreamSwitch(newTrack) {
    if (newTrack === userProfile.track) return;
    userProfile.track = newTrack;
    matrixData = buildTrackData(newTrack, matrixData);
    await setStorage('stracker_profile', userProfile);
    await setStorage('stracker_matrix', matrixData);
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

// Focus Sprint Timer
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

// Backups & Safety-Locked Reset
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

function promptSecureReset() {
    const confirmation = prompt("To permanently delete your account and erase all milestones, type 'DELETE':");
    if (confirmation === 'DELETE') {
        localStorage.clear();
        if (dbInstance) {
            const tx = dbInstance.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).clear();
        }
        alert("Account and local database purged successfully.");
        location.reload();
    }
}

// Launch
bootApp();
