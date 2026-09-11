// --- STrackerX v0.3.0 Engine ---
const SUPABASE_URL = "https://hndzaifthicnvaahhrxf.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_5fOfHVlm1U4DbVhSkyn1zQ_a6ss3Jwm"; 


let supabaseClient = null;
if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function usernameToInternalEmail(username) {
    const sanitized = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    return `${sanitized}@strackerx.com`;
}

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

const MOTIVATIONAL_QUOTES = [
    "Small disciplines repeated with consistency every day lead to great achievements.",
    "Action cures anxiety. Open the book and take the first step.",
    "The secret of getting ahead is getting started.",
    "Hard work beats talent when talent doesn't work hard.",
    "Focus on the process, and the score will take care of itself.",
    "Your future is created by what you do today, not tomorrow.",
    "Discipline is choosing between what you want now and what you want most.",
    "Don't count the days, make the days count.",
    "One solved problem at a time is how ranks are secured.",
    "Consistency creates momentum. Protect your streak.",
    "Clear execution beats raw ambition every single time.",
    "Quiet effort now brings unmistakable results later.",
    "Deep focus is a superpower in a distracted world.",
    "Tough concepts yield to relentless repetition.",
    "You don't need motivation when you build iron habits."
];

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
        ],
        "English Core": [
            "The Portrait of a Lady", "A Photograph", "We're Not Afraid to Die", "Discovering Tut",
            "The Laburnum Top", "The Voice of the Rain", "Childhood", "The Adventure", "Silk Road", "Father to Son"
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
        ],
        "English Core": [
            "The Last Lesson", "Lost Spring", "Deep Water", "The Rattrap", "Indigo", "Poets and Pancakes",
            "The Interview", "Going Places", "My Mother at Sixty-Six", "Keeping Quiet", "A Thing of Beauty", "A Roadside Stand", "Aunt Jennifer's Tigers"
        ]
    },
    "Class 10": {
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
        ],
        "Social Science": [
            "Rise of Nationalism in Europe", "Nationalism in India", "The Making of a Global World", "Print Culture",
            "Resources and Development", "Forest and Wildlife Resources", "Water Resources", "Agriculture", "Minerals and Energy Resources",
            "Power Sharing", "Federalism", "Gender, Religion and Caste", "Political Parties", "Outcomes of Democracy",
            "Development", "Sectors of the Indian Economy", "Money and Credit", "Globalisation"
        ],
        "English": [
            "A Letter to God", "Nelson Mandela: Long Walk to Freedom", "Two Stories about Flying", "From the Diary of Anne Frank",
            "Glimpses of India", "Mijbil the Otter", "Madam Rides the Bus", "The Sermon at Benares", "The Proposal"
        ],
        "Hindi / Sanskrit": [
            "Surdas ke Pad", "Ram-Lakshman-Parshuram Samvad", "Netaji ka Chashma", "Balgoppin Bhagat", "Lakhnavi Andaz",
            "Mata ka Anchal", "Sana Sana Hath Jodi", "Main Kyon Likhta Hoon"
        ]
    },
    "Class 9": {
        "Science": [
            "Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules", "Structure of the Atom",
            "The Fundamental Unit of Life", "Tissues", "Motion", "Force and Laws of Motion",
            "Gravitation", "Work and Energy", "Sound", "Improvement in Food Resources"
        ],
        "Mathematics": [
            "Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables",
            "Introduction to Euclid's Geometry", "Lines and Angles", "Triangles", "Quadrilaterals",
            "Circles", "Heron's Formula", "Surface Areas and Volumes", "Statistics"
        ],
        "Social Science": [
            "The French Revolution", "Socialism in Europe & Russian Revolution", "Nazism and the Rise of Hitler",
            "India - Size and Location", "Physical Features of India", "Drainage", "Climate", "Natural Vegetation",
            "What is Democracy?", "Constitutional Design", "Electoral Politics", "Working of Institutions",
            "The Story of Village Palampur", "People as Resource", "Poverty as a Challenge"
        ],
        "English": [
            "The Fun They Had", "The Sound of Music", "The Little Girl", "A Truly Beautiful Mind",
            "The Snake and the Mirror", "My Childhood", "Reach for the Top", "Kathmandu", "If I Were You"
        ],
        "Hindi / Sanskrit": [
            "Do Bailon ki Katha", "Lhasa ki Aur", "Upbhoktavad ki Sanskriti", "Sanwale Sapnon ki Yaad",
            "Kabir ki Sakhiyan", "Vaakh", "Raskhan ke Savaiye"
        ]
    },
    "Class 8": {
        "Science": ["Crop Production", "Microorganisms", "Coal and Petroleum", "Combustion and Flame", "Cell - Structure and Functions", "Force and Pressure", "Friction", "Sound", "Light"],
        "Mathematics": ["Rational Numbers", "Linear Equations in One Variable", "Understanding Quadrilaterals", "Data Handling", "Squares and Square Roots", "Cubes and Cube Roots", "Comparing Quantities", "Algebraic Expressions", "Mensuration"]
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

function getMilestonesForClass(className) {
    if (["Class 11", "Class 12"].includes(className)) {
        return MILESTONES_SENIOR;
    }
    return MILESTONES_FOUNDATION;
}

let userProfile = null;
let matrixData = {};
let activeClass = "Class 11";
let activeSubject = "Physics";
let currentUserSession = null;
let authMode = 'login';
let activeSquadCode = null;
let realtimeSquadChannel = null;
let realtimePingChannel = null;
let pingCooldownTimer = null;
let pingCooldownRemaining = 0;

function buildTrackData(track, existingData) {
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
        targetSubjects = ["Physics", "Chemistry", "Mathematics", "English Core"];
    } else if (track === "Class 11 PCB") {
        targetClasses = ["Class 11"];
        targetSubjects = ["Physics", "Chemistry", "Biology", "English Core"];
    } else if (track === "Class 12 PCM") {
        targetClasses = ["Class 12"];
        targetSubjects = ["Physics", "Chemistry", "Mathematics", "English Core"];
    } else if (track === "Class 12 PCB") {
        targetClasses = ["Class 12"];
        targetSubjects = ["Physics", "Chemistry", "Biology", "English Core"];
    } else if (track === "Class 10") {
        targetClasses = ["Class 10"];
        targetSubjects = ["Science", "Mathematics", "Social Science", "English", "Hindi / Sanskrit"];
    } else if (track === "Class 9") {
        targetClasses = ["Class 9"];
        targetSubjects = ["Science", "Mathematics", "Social Science", "English", "Hindi / Sanskrit"];
    } else {
        targetClasses = ["Class 8"];
        targetSubjects = ["Science", "Mathematics"];
    }

    const output = existingData && typeof existingData === 'object' ? { ...existingData } : {};

    targetClasses.forEach(cls => {
        if (!output[cls]) output[cls] = {};
        const sourceClass = OFFICIAL_CHAPTERS[cls] || {};
        const milestonesList = getMilestonesForClass(cls);

        targetSubjects.forEach(sub => {
            if (!output[cls][sub]) {
                const chapterNames = sourceClass[sub] || [];
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

async function bootApp() {
    const savedTheme = getSyncStorage('stracker_theme', 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);

    rotateMotivation();
    initPersistentTimer();

    if (supabaseClient) {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            currentUserSession = session;
        } catch (e) {
            console.warn("Auth check offline:", e);
        }
    }

    userProfile = getSyncStorage('stracker_profile', null);
    activeSquadCode = getSyncStorage('stracker_active_squad', null);

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
        checkAndRenderSocial();
        if (activeSquadCode) {
            setupSquadRealtime(activeSquadCode);
            fetchSquadPings(activeSquadCode);
        }
    }
}

function rotateMotivation() {
    const quoteEl = document.getElementById('directive-quote');
    if (quoteEl) {
        const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
        quoteEl.textContent = `"${MOTIVATIONAL_QUOTES[randomIndex]}"`;
    }
}

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
            userProfile = { name, handle, track, streak: 0, last_study_date: null, activity_history: [] };
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
                .update({ syllabus_data: initialMatrix, activity_history: [] })
                .eq('id', userId);
        }

        userProfile = { id: userId, name, handle, track, streak: 0, last_study_date: null, activity_history: [] };
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
                streak: profile.streak || 0,
                last_study_date: profile.last_study_date || null,
                activity_history: profile.activity_history || []
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
        localStorage.removeItem('stracker_active_squad');
        localStorage.removeItem('stracker_timer_state');
        location.reload();
    }
}

async function syncMatrixToCloud() {
    if (!supabaseClient || !userProfile?.id) return;
    try {
        await supabaseClient
            .from('profiles')
            .update({ 
                syllabus_data: matrixData,
                activity_history: userProfile.activity_history || [],
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
    const homeStreak = document.getElementById('home-streak');

    if (trackBadge) trackBadge.textContent = userProfile.track || 'TRACK';
    if (headerHandle) headerHandle.textContent = userProfile.handle || '@user';
    if (avatarChar) avatarChar.textContent = (userProfile.name || 'U').charAt(0).toUpperCase();
    if (greeting) greeting.textContent = `Welcome, ${userProfile.name}`;
    if (vaultSelect) vaultSelect.value = userProfile.track;
    if (homeStreak) homeStreak.textContent = `${userProfile.streak || 0} Day Streak`;

    const vName = document.getElementById('vault-user-name');
    const vHandle = document.getElementById('vault-user-handle');
    const vAvatar = document.getElementById('vault-avatar-char');
    const vStreak = document.getElementById('vault-stat-streak');
    const vSquad = document.getElementById('vault-stat-squad');

    if (vName) vName.textContent = userProfile.name;
    if (vHandle) vHandle.textContent = userProfile.handle;
    if (vAvatar) vAvatar.textContent = (userProfile.name || 'U').charAt(0).toUpperCase();
    if (vStreak) vStreak.textContent = `${userProfile.streak || 0} 🔥`;
    if (vSquad) vSquad.textContent = activeSquadCode ? `#${activeSquadCode}` : 'NONE';

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
    renderSquadView();
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

    if (viewId === 'friends') {
        checkAndRenderSocial();
    } else if (viewId === 'squad') {
        renderSquadView();
    }

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

function promptDeleteCurrentClass() {
    const classes = Object.keys(matrixData);
    if (classes.length <= 1) {
        alert("You must keep at least one class in your matrix.");
        return;
    }

    if (confirm(`Permanently remove all chapter records for ${activeClass}?`)) {
        delete matrixData[activeClass];
        const remainingClasses = Object.keys(matrixData);
        activeClass = remainingClasses[0];
        activeSubject = Object.keys(matrixData[activeClass] || {})[0] || '';

        setSyncStorage('stracker_matrix', matrixData);
        loadUserInterface();
        syncMatrixToCloud();
        playTick(300);
    }
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
    const milestonesList = getMilestonesForClass(activeClass);

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
        grid.className = `milestones-grid ${milestonesList.length === 4 ? 'four-cols' : ''}`;

        milestonesList.forEach(m => {
            const isDone = !!ch.milestones[m.key];
            const chip = document.createElement('div');
            chip.className = `chip ${isDone ? 'done' : ''}`;
            chip.textContent = m.label;
            chip.onclick = () => toggleMilestone(ch.id, m.key, m.label, ch.name);
            grid.appendChild(chip);
        });

        card.appendChild(grid);
        container.appendChild(card);
    });
}

function toggleMilestone(chapterId, key, label, chapterName) {
    const chapters = matrixData[activeClass]?.[activeSubject] || [];
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    const turningOn = !chapter.milestones[key];
    chapter.milestones[key] = turningOn;

    if (!userProfile.activity_history) userProfile.activity_history = [];

    if (turningOn) {
        userProfile.activity_history.push({
            chapterId,
            key,
            desc: `Cleared ${label} in ${chapterName}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    } else {
        userProfile.activity_history = userProfile.activity_history.filter(
            a => !(a.chapterId === chapterId && a.key === key)
        );
    }
    setSyncStorage('stracker_profile', userProfile);

    const milestonesList = getMilestonesForClass(activeClass);
    const isCompletedNow = milestonesList.every(m => chapter.milestones[m.key]);

    if (isCompletedNow) {
        playTick(880);
        if (typeof confetti === 'function') confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
    } else {
        playTick(turningOn ? 620 : 250);
    }

    setSyncStorage('stracker_matrix', matrixData);
    renderMatrixView();
    updateProgressAnalytics();
    syncMatrixToCloud();

    // If inside a squad, refresh squad view so own activity updates
    if (activeSquadCode) {
        fetchAndDisplaySquad(activeSquadCode);
    }
}

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

    const milestonesList = getMilestonesForClass(activeClass);
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
    const vaultMilestones = document.getElementById('vault-stat-milestones');

    if (pctEl) pctEl.textContent = `${pct}%`;
    if (fillEl) fillEl.style.width = `${pct}%`;
    if (homeStat) homeStat.textContent = `${pct}% Cleared`;
    if (taskCount) taskCount.textContent = `${completedTasks}/${totalTasks} Tasks`;
    if (chCount) chCount.textContent = `${totalChapters} Chapters`;
    if (vaultMilestones) vaultMilestones.textContent = completedTasks;
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setSyncStorage('stracker_theme', next);
    playTick(500);
}

// 5. Persistent Timestamp-Based Pomodoro Engine
let sprintDuration = 25 * 60; // 25 min in seconds
let timerInterval = null;

function initPersistentTimer() {
    const state = getSyncStorage('stracker_timer_state', null);
    const btn = document.getElementById('btn-timer-toggle');

    if (state && state.isRunning) {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const remaining = state.totalDuration - elapsed;

        if (remaining > 0) {
            renderTimerSeconds(remaining);
            if (btn) btn.textContent = 'PAUSE';
            runTimerLoop();
        } else {
            // Sprint completed while user was away or refreshing
            renderTimerSeconds(0);
            recordSprintStreak();
            clearTimerState();
        }
    } else if (state && !state.isRunning) {
        renderTimerSeconds(state.remainingSeconds);
        if (btn) btn.textContent = 'START SPRINT';
    } else {
        renderTimerSeconds(sprintDuration);
    }
}

function renderTimerSeconds(seconds) {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    const display = document.getElementById('timer-display');
    if (display) display.textContent = `${min}:${sec}`;
}

function runTimerLoop() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const state = getSyncStorage('stracker_timer_state', null);
        if (!state || !state.isRunning) {
            clearInterval(timerInterval);
            return;
        }

        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const remaining = state.totalDuration - elapsed;

        if (remaining > 0) {
            renderTimerSeconds(remaining);
        } else {
            clearInterval(timerInterval);
            renderTimerSeconds(0);
            const btn = document.getElementById('btn-timer-toggle');
            if (btn) btn.textContent = 'START SPRINT';
            playTick(880);
            if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
            recordSprintStreak();
            clearTimerState();
            alert('🎯 Focus Sprint Completed! Study streak updated.');
        }
    }, 1000);
}

function toggleTimer() {
    const btn = document.getElementById('btn-timer-toggle');
    const state = getSyncStorage('stracker_timer_state', null);

    if (state && state.isRunning) {
        // Pause timer: record remaining seconds
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const remaining = Math.max(0, state.totalDuration - elapsed);
        clearInterval(timerInterval);
        setSyncStorage('stracker_timer_state', { isRunning: false, remainingSeconds: remaining });
        if (btn) btn.textContent = 'START SPRINT';
        playTick(350);
    } else {
        // Start or Resume timer
        const currentRemaining = (state && state.remainingSeconds) ? state.remainingSeconds : sprintDuration;
        const newState = {
            isRunning: true,
            startTime: Date.now(),
            totalDuration: currentRemaining
        };
        setSyncStorage('stracker_timer_state', newState);
        if (btn) btn.textContent = 'PAUSE';
        playTick(600);
        runTimerLoop();
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    clearTimerState();
    renderTimerSeconds(sprintDuration);
    const btn = document.getElementById('btn-timer-toggle');
    if (btn) btn.textContent = 'START SPRINT';
    playTick(300);
}

function clearTimerState() {
    localStorage.removeItem('stracker_timer_state');
}

function recordSprintStreak() {
    const todayStr = new Date().toISOString().slice(0, 10);
    const lastDate = userProfile.last_study_date;

    if (lastDate !== todayStr) {
        if (!lastDate) {
            userProfile.streak = 1;
        } else {
            const last = new Date(lastDate);
            const today = new Date(todayStr);
            const diffDays = Math.round((today - last) / (1000 * 3600 * 24));

            if (diffDays === 1) {
                userProfile.streak = (userProfile.streak || 0) + 1;
            } else if (diffDays > 1) {
                userProfile.streak = 1;
            }
        }
        userProfile.last_study_date = todayStr;
        setSyncStorage('stracker_profile', userProfile);

        const homeStreak = document.getElementById('home-streak');
        if (homeStreak) homeStreak.textContent = `${userProfile.streak} Day Streak`;

        if (supabaseClient && userProfile?.id) {
            supabaseClient
                .from('profiles')
                .update({ streak: userProfile.streak, last_study_date: todayStr })
                .eq('id', userProfile.id)
                .then(() => {});
        }
    }
}

function toggleModal(id, show) {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? 'flex' : 'none';
    if (show) playTick(350);
}

// Social Infrastructure: Peers & Activity Feeds
async function checkAndRenderSocial() {
    if (!supabaseClient || !userProfile?.id) return;

    try {
        const { data: requests } = await supabaseClient
            .from('friendships')
            .select(`
                id,
                sender_id,
                profiles:sender_id(username, full_name)
            `)
            .eq('receiver_id', userProfile.id)
            .eq('status', 'pending');

        const reqContainer = document.getElementById('incoming-requests-container');
        if (reqContainer) {
            if (requests && requests.length > 0) {
                reqContainer.innerHTML = '';
                requests.forEach(r => {
                    const card = document.createElement('div');
                    card.className = 'squad-card glass-panel';
                    card.innerHTML = `
                        <div class="user-meta">
                            <p>${r.profiles?.full_name || 'Student'}</p>
                            <span>${r.profiles?.username || ''}</span>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button type="button" class="btn-primary" onclick="respondFriendRequest('${r.id}', 'accepted')">✔</button>
                            <button type="button" class="btn-ghost" onclick="respondFriendRequest('${r.id}', 'declined')">✖</button>
                        </div>
                    `;
                    reqContainer.appendChild(card);
                });
            } else {
                reqContainer.innerHTML = '<p class="subtext" style="padding: 10px;">No pending requests.</p>';
            }
        }

        const { data: sentAccepted } = await supabaseClient
            .from('friendships')
            .select(`id, receiver:receiver_id(id, username, full_name, activity_history)`)
            .eq('sender_id', userProfile.id)
            .eq('status', 'accepted');

        const { data: receivedAccepted } = await supabaseClient
            .from('friendships')
            .select(`id, sender:sender_id(id, username, full_name, activity_history)`)
            .eq('receiver_id', userProfile.id)
            .eq('status', 'accepted');

        const friendsList = [];
        if (sentAccepted) {
            sentAccepted.forEach(item => { if (item.receiver) friendsList.push(item.receiver); });
        }
        if (receivedAccepted) {
            receivedAccepted.forEach(item => { if (item.sender) friendsList.push(item.sender); });
        }

        const friendsContainer = document.getElementById('friends-list-container');
        const homePeerStatus = document.getElementById('home-peer-status');
        const homeFriendsStat = document.getElementById('home-friends-stat');

        if (friendsContainer) {
            if (homeFriendsStat) homeFriendsStat.textContent = `${friendsList.length} Connected`;

            if (friendsList.length > 0) {
                friendsContainer.innerHTML = '';
                friendsList.forEach(fr => {
                    const actList = fr.activity_history || [];
                    const lastAct = actList.length > 0 ? actList[actList.length - 1] : null;
                    const actHtml = lastAct 
                        ? `<div class="friend-activity-text">⚡ ${lastAct.desc} <span style="color:#666;">(${lastAct.timestamp})</span></div>`
                        : `<div class="friend-activity-text" style="color:#777;">Reviewing concepts</div>`;

                    const card = document.createElement('div');
                    card.className = 'squad-card glass-panel';
                    card.innerHTML = `
                        <div class="user-meta">
                            <p>${fr.full_name}</p>
                            <span>${fr.username}</span>
                            ${actHtml}
                        </div>
                        <span class="badge-tag">ACTIVE</span>
                    `;
                    friendsContainer.appendChild(card);
                });
                if (homePeerStatus) homePeerStatus.textContent = `${friendsList.length} friend(s) connected. Keep pushing forward!`;
            } else {
                friendsContainer.innerHTML = `
                    <div class="squad-card glass-panel">
                        <div class="user-meta">
                            <p>No friends added yet.</p>
                            <span>Share your username with peers to study together.</span>
                        </div>
                    </div>
                `;
            }
        }
    } catch (e) {
        console.warn("Social render error:", e);
    }
}

async function respondFriendRequest(requestId, newStatus) {
    if (!supabaseClient) return;
    await supabaseClient
        .from('friendships')
        .update({ status: newStatus })
        .eq('id', requestId);

    checkAndRenderSocial();
}

async function handleAddFriend() {
    const input = document.getElementById('add-friend-input');
    let targetUsername = input ? input.value.trim() : '';
    if (!targetUsername) return;
    targetUsername = targetUsername.startsWith('@') ? targetUsername : `@${targetUsername}`;

    if (!supabaseClient) {
        alert("Supabase is not initialized.");
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
            alert("Friend request already sent or error occurred.");
        } else {
            alert(`Friend request sent to ${targetUsername}!`);
            if (input) input.value = '';
        }
    } catch (e) {
        alert("Error sending request.");
    }
}

// Dedicated Squad Command Center & Realtime Synchronization
function renderSquadView() {
    const activePanel = document.getElementById('squad-active-panel');
    const joinPanel = document.getElementById('squad-join-panel');
    const statusBadge = document.getElementById('squad-status-badge');
    const codeHeader = document.getElementById('squad-active-code');

    if (activeSquadCode) {
        if (activePanel) activePanel.style.display = 'block';
        if (joinPanel) joinPanel.style.display = 'none';
        if (statusBadge) {
            statusBadge.textContent = 'LIVE SYNC';
            statusBadge.style.color = 'var(--accent, #00ffb2)';
        }
        if (codeHeader) codeHeader.textContent = `#${activeSquadCode}`;
        fetchAndDisplaySquad(activeSquadCode);
    } else {
        if (activePanel) activePanel.style.display = 'none';
        if (joinPanel) joinPanel.style.display = 'block';
        if (statusBadge) {
            statusBadge.textContent = 'OFFLINE';
            statusBadge.style.color = '#777';
        }
    }
}

function setupSquadRealtime(code) {
    if (!supabaseClient || !code) return;

    if (realtimeSquadChannel) realtimeSquadChannel.unsubscribe();
    if (realtimePingChannel) realtimePingChannel.unsubscribe();

    // 1. Listen for member joins, leaves, and activity updates
    realtimeSquadChannel = supabaseClient
        .channel(`room_${code}`)
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'squad_rooms',
            filter: `room_code=eq.${code}`
        }, payload => {
            if (payload.eventType === 'DELETE') {
                handleLeaveSquad(true);
            } else if (payload.new && payload.new.members) {
                const stillIn = payload.new.members.find(m => m.id === userProfile.id);
                if (!stillIn) {
                    handleLeaveSquad(true);
                } else {
                    renderRosterWithLiveWork(payload.new.members);
                }
            }
        })
        .subscribe();

    // 2. Listen for tactical quick-pings
    realtimePingChannel = supabaseClient
        .channel(`pings_${code}`)
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'squad_pings',
            filter: `room_code=eq.${code}`
        }, payload => {
            if (payload.new) {
                appendPingToFeed(payload.new);
                playTick(550);
            }
        })
        .subscribe();
}

async function handleCreateSquad() {
    if (!supabaseClient || !userProfile?.id) {
        alert("Sign in to create a squad room.");
        return;
    }

    const rawCode = `SQUAD-${Math.floor(1000 + Math.random() * 9000)}`;
    const { error } = await supabaseClient.from('squad_rooms').insert({
        room_code: rawCode,
        created_by: userProfile.id,
        members: [{ id: userProfile.id, handle: userProfile.handle, name: userProfile.name }]
    });

    if (error) {
        alert("Error creating room: " + error.message);
        return;
    }

    activeSquadCode = rawCode;
    setSyncStorage('stracker_active_squad', activeSquadCode);
    setupSquadRealtime(rawCode);
    renderSquadView();
    fetchSquadPings(rawCode);
    loadUserInterface();
    alert(`Squad created: #${rawCode}\nShare this code with your peers!`);
}

async function handleJoinSquad() {
    const input = document.getElementById('join-squad-input');
    joinSquadByCode(input ? input.value : '');
}

async function handleJoinDedicatedSquad() {
    const input = document.getElementById('dedicated-join-input');
    joinSquadByCode(input ? input.value : '');
}

async function joinSquadByCode(rawInput) {
    let code = (rawInput || '').trim().toUpperCase();
    code = code.replace(/^#/, '');

    if (!code) {
        alert("Please enter a room code.");
        return;
    }

    if (!supabaseClient || !userProfile?.id) return;

    const { data: squad, error } = await supabaseClient
        .from('squad_rooms')
        .select('*')
        .eq('room_code', code)
        .single();

    if (error || !squad) {
        alert(`Squad "${code}" not found. Verify the code.`);
        return;
    }

    let members = squad.members || [];
    if (!members.find(m => m.id === userProfile.id)) {
        members.push({ id: userProfile.id, handle: userProfile.handle, name: userProfile.name });
        await supabaseClient
            .from('squad_rooms')
            .update({ members })
            .eq('room_code', code);
    }

    activeSquadCode = code;
    setSyncStorage('stracker_active_squad', activeSquadCode);
    setupSquadRealtime(code);
    renderSquadView();
    fetchSquadPings(code);
    loadUserInterface();
    alert(`Joined Squad: #${code}!`);
}

async function fetchAndDisplaySquad(code) {
    if (!supabaseClient || !code) return;
    const { data: squad } = await supabaseClient
        .from('squad_rooms')
        .select('*')
        .eq('room_code', code)
        .single();

    if (squad && squad.members) {
        renderRosterWithLiveWork(squad.members);
    }
}

// 4. Live Activity Sharing of All Squad Members
async function renderRosterWithLiveWork(members) {
    const rosterBar = document.getElementById('squad-live-roster');
    if (!rosterBar) return;

    rosterBar.innerHTML = '';

    // Fetch latest activity for all squad members in parallel
    const memberIds = members.map(m => m.id);
    let memberActivities = {};

    if (supabaseClient && memberIds.length > 0) {
        const { data: profiles } = await supabaseClient
            .from('profiles')
            .select('id, activity_history')
            .in('id', memberIds);

        if (profiles) {
            profiles.forEach(p => {
                const hist = p.activity_history || [];
                memberActivities[p.id] = hist.length > 0 ? hist[hist.length - 1] : null;
            });
        }
    }

    members.forEach(m => {
        const isSelf = m.id === userProfile?.id;
        const row = document.createElement('div');
        row.className = `squad-member-row ${isSelf ? 'self' : ''}`;

        let act = memberActivities[m.id];
        if (isSelf && userProfile?.activity_history && userProfile.activity_history.length > 0) {
            act = userProfile.activity_history[userProfile.activity_history.length - 1];
        }

        const actText = act 
            ? `⚡ ${act.desc}` 
            : `Reviewing concepts`;

        row.innerHTML = `
            <div class="squad-member-info">
                <span style="color: ${isSelf ? 'var(--accent, #00ffb2)' : '#777'};">●</span>
                <div>
                    <strong style="font-size: 0.85rem;">${m.name} ${isSelf ? '<span class="badge-tag" style="font-size: 0.55rem; padding: 1px 4px;">YOU</span>' : ''}</strong>
                    <div class="subtext" style="font-size: 0.72rem;">${m.handle}</div>
                </div>
            </div>
            <div class="squad-member-activity" title="${actText}">${actText}</div>
        `;
        rosterBar.appendChild(row);
    });
}

async function handleLeaveSquad(silent = false) {
    if (!activeSquadCode) return;

    if (!silent && !confirm("Are you sure you want to leave this squad?")) return;

    const leavingCode = activeSquadCode;

    if (supabaseClient && userProfile?.id) {
        const { data: squad } = await supabaseClient
            .from('squad_rooms')
            .select('*')
            .eq('room_code', leavingCode)
            .single();

        if (squad) {
            const updatedMembers = (squad.members || []).filter(m => m.id !== userProfile.id);
            if (updatedMembers.length === 0) {
                await supabaseClient.from('squad_rooms').delete().eq('room_code', leavingCode);
            } else {
                await supabaseClient.from('squad_rooms').update({ members: updatedMembers }).eq('room_code', leavingCode);
            }
        }
    }

    if (realtimeSquadChannel) realtimeSquadChannel.unsubscribe();
    if (realtimePingChannel) realtimePingChannel.unsubscribe();

    activeSquadCode = null;
    localStorage.removeItem('stracker_active_squad');
    renderSquadView();
    loadUserInterface();

    if (!silent) alert("You have left the squad room.");
}

// 3-Second Rate-Limited Tactical Pings
async function sendQuickPing(msg) {
    if (pingCooldownRemaining > 0) return;
    if (!activeSquadCode || !supabaseClient || !userProfile?.id) return;

    startPingCooldown(3);

    await supabaseClient.from('squad_pings').insert({
        room_code: activeSquadCode,
        user_id: userProfile.id,
        sender_name: userProfile.name,
        sender_handle: userProfile.handle,
        message: msg
    });

    playTick(650);
}

function startPingCooldown(durationSec) {
    pingCooldownRemaining = durationSec;
    const bar = document.getElementById('ping-cooldown-bar');
    const secEl = document.getElementById('cooldown-seconds');
    const buttons = document.querySelectorAll('.ping-btn');

    buttons.forEach(b => b.setAttribute('disabled', 'true'));
    if (bar) bar.style.display = 'block';
    if (secEl) secEl.textContent = pingCooldownRemaining;

    clearInterval(pingCooldownTimer);
    pingCooldownTimer = setInterval(() => {
        pingCooldownRemaining--;
        if (secEl) secEl.textContent = pingCooldownRemaining;

        if (pingCooldownRemaining <= 0) {
            clearInterval(pingCooldownTimer);
            if (bar) bar.style.display = 'none';
            buttons.forEach(b => b.removeAttribute('disabled'));
        }
    }, 1000);
}

async function fetchSquadPings(code) {
    if (!supabaseClient || !code) return;
    const { data: pings } = await supabaseClient
        .from('squad_pings')
        .select('*')
        .eq('room_code', code)
        .order('created_at', { ascending: true })
        .limit(25);

    const feed = document.getElementById('squad-pings-feed');
    if (!feed) return;

    if (pings && pings.length > 0) {
        feed.innerHTML = '';
        pings.forEach(p => appendPingToFeed(p));
    } else {
        feed.innerHTML = '<p class="subtext">No directives sent yet. Broadcast one below.</p>';
    }
}

// 3. Render Tactical Feed with Clear Sender Identification
function appendPingToFeed(ping) {
    const feed = document.getElementById('squad-pings-feed');
    if (!feed) return;

    if (feed.querySelector('.subtext')) {
        feed.innerHTML = '';
    }

    const isSelf = ping.user_id === userProfile?.id || ping.sender_handle === userProfile?.handle;
    const item = document.createElement('div');
    item.className = `ping-card ${isSelf ? 'is-self' : ''}`;
    const timeStr = new Date(ping.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    item.innerHTML = `
        <div style="flex: 1;">
            <div class="ping-meta">
                <span class="ping-sender">${ping.sender_name}</span>
                <span class="ping-handle">${ping.sender_handle}</span>
                ${isSelf ? '<span class="badge-tag" style="font-size: 0.55rem; padding: 1px 4px; border-color: #ffaa00; color: #ffaa00; background: rgba(255,170,0,0.1);">YOU</span>' : ''}
            </div>
            <div class="ping-msg">${ping.message}</div>
        </div>
        <span class="ping-time">${timeStr}</span>
    `;
    feed.appendChild(item);
    feed.scrollTop = feed.scrollHeight;
}

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
    const confirmation = prompt("To permanently delete your account and erase all cloud & local records, type 'DELETE':");
    if (confirmation === 'DELETE') {
        try {
            if (supabaseClient && userProfile?.id) {
                await supabaseClient.rpc('delete_current_user');
                await supabaseClient.auth.signOut();
            }
        } catch (err) {
            console.warn("Cascade wipe error:", err);
        }

        try { 
            localStorage.clear(); 
        } catch(e){}

        alert("Account and cloud records permanently deleted.");
        location.reload();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    bootApp();
});
