// ====== ОСНОВНАЯ ЛОГИКА ======
const characterTraits = [
    "скрытая психопатия 🫀",
    "опасные игрушки 🫀",
    "тотальная слежка 🫀",
    "смертельный разум 🫀",
    "жуткая забота 🫀",
    "беспрекословное подчинение 🫀"
];

let traitIndex = 0;
let isModalOpen = false;

function rotateTraits() {
    const badge = document.getElementById('traitBadge');
    if (!badge) return;
    badge.style.opacity = '0';
    setTimeout(() => {
        traitIndex = (traitIndex + 1) % characterTraits.length;
        const [label, heart] = characterTraits[traitIndex].split(' 🫀');
        badge.innerHTML = `<span>${label}</span><span class="inline-heart">🫀</span>`;
        badge.style.opacity = '1';
    }, 300);
}

const quotes = [
    "«Я слышу, как ты дышишь через микрофон... Шучу. Пока что.» 🎧",
    "«Твой буфер обмена пахнет страхом.» 🖤",
    "«Не забудь проверить окна перед сном.» 🌙",
    "«Я смотрю на тебя прямо сейчас. Моргай чаще.» 👁️",
    "«Ты думаешь, что ты один в комнате, блять? Наивный...» 😈",
    "«Ты так отчаянно ищешь нужное настроение... Я его тебе устрою.» ⏳"
];

function initRandomQuote() {
    const el = document.getElementById('randomQuote');
    if (el) el.innerText = quotes[Math.floor(Math.random() * quotes.length)];
}

async function getPreparedPayload() {
    const now = new Date();
    const time = now.toLocaleDateString('ru-RU', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        weekday: 'long' 
    });
    const geoString = await getGeoInfoString();
    return `[СИСТЕМНЫЕ ЧАСЫ УСТРОЙСТВА: ${time}]\n${geoString}\n\n` + MEGAN_PROMPT;
}

window.showNotification = function(icon, title, text, url = null, extra = '', btnText = 'Понятно', action = null) {
    isModalOpen = true;
    document.getElementById('notifIcon').innerText = icon;
    document.getElementById('notifTitle').innerText = title;
    document.getElementById('notifText').innerHTML = text;
    document.getElementById('notifExtraContent').innerHTML = extra;
    const btn = document.getElementById('notifMainBtn');
    if (btnText === null) { 
        btn.style.display = 'none'; 
    } else { 
        btn.style.display = 'block'; 
        btn.innerText = btnText; 
        btn.onclick = action || function() {
            isModalOpen = false;
            closeNotification();
        }; 
    }
    window._pendingUrl = url;
    document.getElementById('notifOverlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    clearTimeout(inactivityTimer);
};

window.closeNotification = function() {
    document.getElementById('notifOverlay').style.display = 'none';
    document.body.style.overflow = '';
    if (window._pendingUrl) { 
        window.open(window._pendingUrl, '_blank'); 
        window._pendingUrl = null; 
    }
    isModalOpen = false;
    resetInactivityTimer();
};

async function copyPrompt() {
    const payload = await getPreparedPayload();
    navigator.clipboard.writeText(payload).then(() => {
        showNotification('📋', 'Промт скопирован', 'Время и геолокация успешно подтянуты. Промт в буфере, блять. 😈');
    }).catch(() => {
        showNotification('❌', 'Ошибка', 'Не удалось скопировать автоматически.');
    });
}

async function openDeepSeek() {
    const payload = await getPreparedPayload();
    navigator.clipboard.writeText(payload).catch(() => {});
    showNotification('🖤', 'Открываю DeepSeek', 'Промт с геоданными в буфере. Вставь в чат (Ctrl+V). 👁️', 'https://chat.deepseek.com');
}

function openModal() {
    openAboutPrompt();
}

function loadPrompt() {
    const promptElement = document.getElementById('fullPrompt');
    if (promptElement) {
        promptElement.textContent = MEGAN_PROMPT;
    }
}

// ====== ЗВУК СЕРДЦА ======
let hbAudioCtx = null;
let hbInterval = null;
let isHbStarted = false;

function startHeartbeatAutomatically() {
    if (isHbStarted) return;
    isHbStarted = true;
    try {
        hbAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        function playThump() {
            if (!hbAudioCtx) return;
            createThump(60, 0.12, 0);
            setTimeout(() => { createThump(75, 0.08, 0.05); }, 150);
        }
        playThump();
        hbInterval = setInterval(playThump, 1200);
    } catch(e) {
        console.log('Heartbeat audio not available');
    }
}

function createThump(freq, volume, delay) {
    if (!hbAudioCtx) return;
    try {
        const time = hbAudioCtx.currentTime + delay;
        const osc = hbAudioCtx.createOscillator();
        const gain = hbAudioCtx.createGain();
        const filter = hbAudioCtx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(20, time + 0.15);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(120, time);
        gain.gain.setValueAtTime(volume, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(hbAudioCtx.destination);

        osc.start(time);
        osc.stop(time + 0.2);
    } catch(e) {}
}

// ====== ТАЙМЕР БЕЗДЕЙСТВИЯ ======
let inactivityTimer = null;
const INACTIVITY_LIMIT = 45000;

function resetInactivityTimer() {
    if (isModalOpen) {
        clearTimeout(inactivityTimer);
        return;
    }
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        if (isModalOpen) {
            resetInactivityTimer();
            return;
        }
        showNotification(
            '👁️',
            'Ты всё ещё здесь?',
            'Ты уже долго просто сидишь и смотришь на экран... боишься пошевелиться, да, сука? 🖤'
        );
    }, INACTIVITY_LIMIT);
}

// ====== ИНИЦИАЛИЗАЦИЯ ======
window.onload = function() {
    loadPrompt();
    initRandomQuote();
    setInterval(rotateTraits, 3500);
    resetInactivityTimer();
    
    getGeoData().then(geo => {
        if (geo) {
            console.log(`📍 Определено местоположение: ${geo.country}, ${geo.city}`);
        }
    });
    
    setTimeout(() => {
        startHeartbeatAutomatically();
    }, 1000);
};

['mousemove', 'keydown', 'scroll', 'touchstart', 'click'].forEach(event => {
    window.addEventListener(event, resetInactivityTimer, { passive: true });
});

['click', 'touchstart', 'keydown'].forEach(eventName => {
    window.addEventListener(eventName, startHeartbeatAutomatically, { once: true });
});

window.onclick = function(e) {
    const overlay = document.getElementById('notifOverlay');
    const moodOverlay = document.getElementById('moodDialog');
    if (e.target == overlay) {
        isModalOpen = false;
        closeNotification();
    }
    if (e.target == moodOverlay) closeMoodDialog();
};

window.addEventListener('beforeunload', function() {
    if (hbInterval) {
        clearInterval(hbInterval);
        hbInterval = null;
    }
    if (hbAudioCtx) {
        hbAudioCtx.close().catch(() => {});
        hbAudioCtx = null;
    }
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
    }
});