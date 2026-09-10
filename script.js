// --- STrackerX v0.1.0 Cloud Engine ---
const SUPABASE_URL = "https://hndzaifthicnvaahhrxf.supabase.co"; // <-- Paste your Project URL here
const SUPABASE_ANON_KEY = "sb_publishable_5fOfHVlm1U4DbVhSkyn1zQ_a6ss3Jwm"; // <-- Paste your anon/publishable key here

// Initialize Supabase Client safely
let supabaseClient = null;
if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Convert username to internal email for Supabase Auth
function usernameToInternalEmail(username) {
    const sanitized = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    return `${sanitized}@strackerx.local`;
}

// Safe LocalStorage helpers
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
}

// Web Audio synthesizer for tactile taps
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
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
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

// App Global State
let userProfile = null;
let matrixData = {};
let activeClass = "Class 11";
let activeSubject = "Physics";
let currentUserSession = null;
let authMode = 'login';

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
                    milestonesList.forEach(m => { mObj[m.key] = false; });
                    return { id: `ch_${cls}_${sub}_${i}`, name, isCustom: false, milestones: mObj };
                });
            }
        });
    });

    return output;
}

// App Boot
async function bootApp() {
    const savedTheme = getSyncStorage('stracker_theme', 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (supabaseClient) {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            currentUserSession = session;
        } catch (e) {
            console.warn("Auth check offline:", e);
        }
    }

    userProfile = getSyncStorage('stracker_profile', null);

    if (!currentUserSession && !userProfile) {
        const overlay = document.getElementById('auth-overlay');
        if (overlay) overlay.style.display = 'flex';
    } else {
        matrixData = getSyncStorage('stracker_matrix', null);
        if (!matrixData || Object.keys(matrixData).length === 0) {
            matrixData = buildTrackData(userProfile?.track || 'JEE', {});
            setSyncStorage('stracker_matrix', matrixData);
        }
        loadUserInterface();
    }
}

// Authentication Engine
function setAuthMode(mode) {
    authMode = mode;
    const loginTab = document.getElementById('tab-login');
    const signupTab = document.getElementById('tab-signup');
    const extraFields = document.getElementById('signup-extra-fields');
    const title = document.getElementById('auth-title');
    const submitBtn = document.getElementById('auth-submit-btn');

    if (mode === 'signup') {
        if (signupTab) signupTab.classList.add('active');
        if (loginTab) loginTab.classList.remove('active');
        if (extraFields) extraFields.style.display = 'flex';
        if (title) title.textContent = 'Create STrackerX Account';
        if (submitBtn) submitBtn.textContent = 'Register & Launch';
    } else {
        if (loginTab) loginTab.classList.add('active');
        if (signupTab) signupTab.classList.remove('active');
        if (extraFields) extraFields.style.display = 'none';
        if (title) title.textContent = 'Sign In to STrackerX';
        if (submitBtn) submitBtn.textContent = 'Log In';
    }
}

async function handleAuthSubmit() {
    const usernameInput = document.getElementById('auth-username')?.value.trim();
    const password = document.getElementById('auth-password')?.value.trim();
    const errorEl = document.getElementById('auth-error-msg');
    if (errorEl) errorEl.style.display = 'none';

    if (!usernameInput || !password) {
        if (errorEl) {
            errorEl.textContent = 'Please enter both username and password.';
            errorEl.style.display = 'block';
        }
        return;
    }

    const cleanUsername = usernameInput.replace(/^@/, '').toLowerCase();
    const internalEmail = usernameToInternalEmail(cleanUsername);

    if (authMode === 'signup') {
        const nameInput = document.getElementById('auth-name');
        const trackInput = document.getElementById('auth-track');
        const name = nameInput?.value.trim() || cleanUsername;
        const handle = `@${cleanUsername}`;
        const track = trackInput ? trackInput.value : 'JEE';
        const initialMatrix = buildTrackData(track, {});

        if (!supabaseClient) {
            userProfile = { name, handle, track, streak: 1 };
            matrixData = initialMatrix;
            setSyncStorage('stracker_profile', userProfile);
            setSyncStorage('stracker_matrix', matrixData);
            document.getElementById('auth-overlay').style.display = 'none';
            loadUserInterface();
            return;
        }

        const { data: authData, error: authError } = await supabaseClient.auth.signUp({
            email: internalEmail,
            password: password,
            options: {
                data: {
                    username: handle,
                    full_name: name,
                    track: track
                }
            }
        });

        if (authError) {
            if (errorEl) {
                errorEl.textContent = authError.message;
                errorEl.style.display = 'block';
            }
            return;
        }

        const userId = authData.user?.id;

        if (userId) {
            await supabaseClient
                .from('profiles')
                .update({ syllabus_data: initialMatrix })
                .eq('id', userId);
        }

        userProfile = { id: userId, name, handle, track, streak: 1 };
        matrixData = initialMatrix;
        setSyncStorage('stracker_profile', userProfile);
        setSyncStorage('stracker_matrix', matrixData);

        const overlay = document.getElementById('auth-overlay');
        if (overlay) overlay.style.display = 'none';
        loadUserInterface();
    } else {
        if (!supabaseClient) return;

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: internalEmail,
            password: password
        });

        if (error) {
            if (errorEl) {
                errorEl.textContent = "Invalid username or password.";
                errorEl.style.display = 'block';
            }
            return;
        }

        const userId = data.user.id;
        const { data: profile } = await supabaseClient.from('profiles').select('*').eq('id', userId).single();

        if (profile) {
            userProfile = {
                id: profile.id,
                name: profile.full_name,
                handle: profile.username,
                track: profile.track,
                streak: profile.streak || 1
            };
            matrixData = profile.syllabus_data || buildTrackData(profile.track, {});
            setSyncStorage('stracker_profile', userProfile);
            setSyncStorage('stracker_matrix', matrixData);
        }

        const overlay = document.getElementById('auth-overlay');
        if (overlay) overlay.style.display = 'none';
        loadUserInterface();
    }
}

function handleSignOut() {
    if (confirm("Sign out of STrackerX?")) {
        if (supabaseClient) supabaseClient.auth.signOut();
        localStorage.removeItem('stracker_profile');
        location.reload();
    }
}

// Background Cloud Sync
async function syncMatrixToCloud() {
    if (!supabaseClient || !userProfile?.id) return;
    try {
        await supabaseClient
            .from('profiles')
            .update({ 
                syllabus_data: matrixData,
                updated_at: new Date().toISOString()
            })
            .eq('id', userProfile.id);
    } catch (e) {
        console.warn('Sync error:', e);
    }
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
        btn.type = 'button';
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
        btn.type = 'button';
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
                    ${ch.isCustom ? `<button type="button" class="btn-del-chapter" onclick="deleteCustomChapter('${ch.id}')" title="Delete">✕</button>` : ''}
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
    syncMatrixToCloud();
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

    const isFoundation = ['Class 8', 'Class 9', 'Class 10'].includes(userProfile?.track);
    const milestonesList = isFoundation ? MILESTONES_FOUNDATION : MILESTONES_SENIOR;

    const mObj = {};
    milestonesList.forEach(m => { mObj[m.key] = false; });

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
    syncMatrixToCloud();
    playTick(720);
}

function deleteCustomChapter(id) {
    if (!confirm("Delete this custom chapter?")) return;
    matrixData[activeClass][activeSubject] = matrixData[activeClass][activeSubject].filter(c => c.id !== id);
    setSyncStorage('stracker_matrix', matrixData);
    renderMatrixView();
    updateProgressAnalytics();
    syncMatrixToCloud();
}

function handleStreamSwitch(newTrack) {
    if (newTrack === userProfile.track) return;
    userProfile.track = newTrack;
    matrixData = buildTrackData(newTrack, matrixData);
    setSyncStorage('stracker_profile', userProfile);
    setSyncStorage('stracker_matrix', matrixData);
    loadUserInterface();
    syncMatrixToCloud();
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

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setSyncStorage('stracker_theme', next);
    playTick(500);
}

// Sprint Timer
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

function toggleModal(id, show) {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? 'flex' : 'none';
    if (show) playTick(350);
}

// Friends & Squad Functions
async function handleAddFriend() {
    const input = document.getElementById('add-friend-input');
    let targetUsername = input ? input.value.trim() : '';
    if (!targetUsername) return;
    targetUsername = targetUsername.startsWith('@') ? targetUsername : `@${targetUsername}`;

    if (!supabaseClient) {
        alert("Supabase client is not connected.");
        return;
    }

    try {
        const { data: friend, error } = await supabaseClient
            .from('profiles')
            .select('id, username')
            .eq('username', targetUsername)
            .single();

        if (error || !friend) {
            alert(`User ${targetUsername} not found.`);
            return;
        }

        if (friend.id === userProfile.id) {
            alert("You cannot add yourself.");
            return;
        }

        const { error: reqError } = await supabaseClient
            .from('friendships')
            .insert({
                sender_id: userProfile.id,
                receiver_id: friend.id,
                status: 'pending'
            });

        if (reqError) {
            alert("Friend request already sent or an error occurred.");
        } else {
            alert(`Friend request sent to ${targetUsername}!`);
            if (input) input.value = '';
        }
    } catch (e) {
        alert("Error sending request.");
    }
}

function handleCreateSquad() {
    const randomID = Math.floor(1000 + Math.random() * 9000);
    const code = `#SQUAD-${randomID}`;
    alert(`Squad Room Created: ${code}\nShare this code with your peers.`);
}

function handleJoinSquad() {
    const input = document.getElementById('join-squad-input');
    const code = input ? input.value.trim() : '';
    if (!code) {
        alert("Please enter a room code.");
        return;
    }
    alert(`Connected to Squad: ${code}`);
}

// In-App Cloud Feedback
async function submitFeedback() {
    const typeSelect = document.getElementById('report-type');
    const bodyInput = document.getElementById('report-body');

    const category = typeSelect ? typeSelect.value : 'general';
    const message = bodyInput ? bodyInput.value.trim() : '';

    if (!message) {
        alert("Please enter your message.");
        return;
    }

    if (supabaseClient) {
        await supabaseClient.from('feedback_reports').insert({
            user_id: userProfile?.id || null,
            category,
            message
        });
    }

    if (bodyInput) bodyInput.value = '';
    toggleModal('modal-feedback', false);
    playTick(750);
    alert("Feedback received! Thank you for supporting STrackerX.");
}

// Backups & Complete Account Purge
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
                syncMatrixToCloud();
                location.reload();
            }
        } catch (err) {
            alert("Corrupted backup file.");
        }
    };
    reader.readAsText(file);
}

async function promptSecureReset() {
    const confirmation = prompt("To permanently delete your account and erase all cloud & local milestones, type 'DELETE':");
    if (confirmation === 'DELETE') {
        try {
            if (supabaseClient && userProfile?.id) {
                await supabaseClient
                    .from('profiles')
                    .delete()
                    .eq('id', userProfile.id);

                await supabaseClient.auth.signOut();
            }
        } catch (err) {
            console.warn("Cloud wipe error:", err);
        }

        try { localStorage.clear(); } catch(e){}

        alert("Account and cloud records deleted successfully.");
        location.reload();
    }
}

// Start app once DOM content is ready
document.addEventListener('DOMContentLoaded', () => {
    bootApp();
});
