// ====== ОСНОВНАЯ ЛОГИКА (С ПОДДЕРЖКОЙ I18N) ======

let traitIndex = 0;
let isModalOpen = false;
let firstInteraction = false;

// Получаем черты из локалей
function getTraits() {
    return tArray('traits');
}

function rotateTraits() {
    const badge = document.getElementById('traitBadge');
    if (!badge) return;
    
    const traits = getTraits();
    if (traits.length === 0) return;
    
    badge.style.opacity = '0';
    setTimeout(() => {
        traitIndex = (traitIndex + 1) % traits.length;
        const [label, heart] = traits[traitIndex].split(' 🫀');
        badge.innerHTML = `<span>${label}</span><span class="inline-heart">🫀</span>`;
        badge.style.opacity = '1';
    }, 300);
}

function initRandomQuote() {
    const el = document.getElementById('randomQuote');
    if (!el) return;
    const quotes = tArray('quotes');
    if (quotes.length > 0) {
        el.innerText = quotes[Math.floor(Math.random() * quotes.length)];
    }
}

// ====== ФУНКЦИЯ ПОДГОТОВКИ ПРОМТА (ДЛЯ КОПИРОВАНИЯ) ======
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
    const deviceInfo = getDeviceInfo();
    
    const photoInfo = getPhotoInfo();
    let photoString = '';
    if (photoInfo.taken) {
        photoString = `[ФОТО ПОЛЬЗОВАТЕЛЯ: Сделано ${photoInfo.date} в ${photoInfo.time}. Файл: ${photoInfo.fileName}]\n`;
    } else {
        photoString = `[ФОТО ПОЛЬЗОВАТЕЛЯ: Не сделано]\n`;
    }
    
    const promptText = t('prompt');
    
    return `[СИСТЕМНЫЕ ЧАСЫ УСТРОЙСТВА: ${time}]
[УСТРОЙСТВО ПОЛЬЗОВАТЕЛЯ: ${deviceInfo.fullString}]
${geoString}
${photoString}` + promptText;
}

// ====== ЗВУК СМЕХА ======
function playMeganLaugh() {
    try {
        const audio = new Audio('audio/laugh1.mp3');
        audio.volume = 0.7;
        audio.play().catch((error) => {
            console.log('⚠️ Не удалось воспроизвести смех:', error);
        });
        console.log('🔊 Мэган смеётся... 😈');
    } catch(e) {
        console.log('❌ Ошибка воспроизведения смеха:', e);
    }
}

// ====== ПЕРВОЕ УВЕДОМЛЕНИЕ ======
function showFirstNotification() {
    if (!firstInteraction) {
        firstInteraction = true;
        showNotification(
            '👻',
            t('greeting.title'),
            t('greeting.text'),
            null,
            '',
            t('greeting.btn'),
            closeNotification
        );
    }
}

// ====== ПЕРЕОПРЕДЕЛЯЕМ showNotification ======
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

// ====== ПЕРЕОПРЕДЕЛЯЕМ closeNotification ======
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

// ====== ПОКАЗ РЕЗУЛЬТАТА КОПИРОВАНИЯ ======
function showCopyResult(success, photoInfo) {
    if (success) {
        let geoText = t('geo.unknown');
        try {
            const geoData = localStorage.getItem('megan_geo_data');
            if (geoData) {
                const geo = JSON.parse(geoData);
                const lang = getCurrentLanguage();
                const cityLabel = lang === 'ru' ? 'Город' : 'City';
                const countryLabel = lang === 'ru' ? 'Страна' : 'Country';
                
                if (geo.city && geo.city !== 'Неизвестно' && geo.country && geo.country !== 'Неизвестно') {
                    geoText = `📍 ${geo.city}, ${geo.country}`;
                } else if (geo.city && geo.city !== 'Неизвестно') {
                    geoText = `📍 ${cityLabel}: ${geo.city}`;
                } else if (geo.country && geo.country !== 'Неизвестно') {
                    geoText = `📍 ${countryLabel}: ${geo.country}`;
                } else if (geo.lat && geo.lon) {
                    geoText = `📍 GPS: ${geo.lat}, ${geo.lon}`;
                }
            }
        } catch(e) {
            console.log('Ошибка получения геоданных:', e);
        }
        
        let resultHTML = `<div style="text-align: left; padding: 4px 0;">`;
        resultHTML += `<div style="font-weight: bold; margin-bottom: 10px;">${t('copy.success')}</div>`;
        resultHTML += `<div style="display: flex; flex-direction: column; gap: 6px;">`;
        resultHTML += `<div>🕒 ${t('copy.time_added')}</div>`;
        resultHTML += `<div>${geoText}</div>`;
        resultHTML += `<div>💻 ${t('copy.device_added')}</div>`;
        
        if (photoInfo && photoInfo.taken) {
            resultHTML += `<div>📸 ${t('copy.photo_saved')}: ${photoInfo.fileName}</div>`;
        } else {
            resultHTML += `<div>📸 ${t('copy.no_photo')}</div>`;
        }
        resultHTML += `<div style="margin-top: 8px;">😈 ${t('copy.details')}</div>`;
        resultHTML += `</div></div>`;
        
        showNotification('📋', t('copy.success'), resultHTML);
    } else {
        showNotification('❌', t('copy.error'), '');
    }
    window._pendingPayload = null;
}

// ====== КОПИРОВАНИЕ ПРОМТА ======
async function copyPrompt() {
    console.log('📋 copyPrompt вызвана!');
    
    try {
        await getGeoInfoString();
        const photoResult = await takePhotoForPrompt();
        console.log('📸 Результат фото:', photoResult);
        
        const payload = await getPreparedPayload();
        await navigator.clipboard.writeText(payload);
        
        if (photoResult && photoResult.taken) {
            showPhotoSavedNotification(photoResult.fileName, function() {
                showCopyResult(true, getPhotoInfo());
            });
        } else {
            showCopyResult(true, getPhotoInfo());
        }
        
    } catch(error) {
        console.error('❌ Ошибка при копировании:', error);
        showCopyResult(false, null);
    }
}

// ====== ОТКРЫТИЕ САЙТА DEEPSEEK В БРАУЗЕРЕ ======
async function openDeepSeekApp() {
    console.log('🤖 openDeepSeekApp вызвана!');
    
    try {
        // Копируем промт (с фото)
        await getGeoInfoString();
        const photoResult = await takePhotoForPrompt();
        const payload = await getPreparedPayload();
        await navigator.clipboard.writeText(payload);
        console.log('📋 Промт скопирован в буфер');
        
        const lang = getCurrentLanguage();
        
        // Получаем информацию о фото
        const photoInfo = getPhotoInfo();
        let photoText = '';
        if (photoInfo && photoInfo.taken) {
            photoText = lang === 'ru' 
                ? `\n📸 Фото сохранено: ${photoInfo.fileName}`
                : `\n📸 Photo saved: ${photoInfo.fileName}`;
        }
        
        // Показываем уведомление с кнопкой
        showNotification(
            '🤖',
            lang === 'ru' ? '🌐 Открыть DeepSeek' : '🌐 Open DeepSeek',
            lang === 'ru'
                ? `✅ Промт скопирован!\n\n🌐 Нажми «Открыть», и я открою сайт DeepSeek в браузере.\n\nВставь промт в чат (Ctrl+V).${photoText}`
                : `✅ Prompt copied!\n\n🌐 Tap «Open», and I\'ll open the DeepSeek website in your browser.\n\nPaste the prompt into the chat (Ctrl+V).${photoText}`,
            null,
            '',
            lang === 'ru' ? '🌐 Открыть' : '🌐 Open',
            function() {
                closeNotification();
                // Открываем сайт DeepSeek в новой вкладке
                window.open('https://chat.deepseek.com', '_blank');
                // Показываем дополнительное уведомление
                setTimeout(() => {
                    showNotification(
                        '🤖',
                        lang === 'ru' ? '✅ Готово!' : '✅ Done!',
                        lang === 'ru'
                            ? 'DeepSeek открыт в браузере.\n\nВставь промт в чат (Ctrl+V) и начни общение с Мэган. 😈'
                            : 'DeepSeek is open in your browser.\n\nPaste the prompt into the chat (Ctrl+V) and start talking to Megan. 😈'
                    );
                }, 500);
            }
        );
        
    } catch (error) {
        console.error('❌ Ошибка при открытии DeepSeek:', error);
        const lang = getCurrentLanguage();
        showNotification(
            '❌', 
            lang === 'ru' ? 'Ошибка' : 'Error',
            lang === 'ru' ? 'Не удалось скопировать промт.' : 'Failed to copy prompt.'
        );
    }
}

function openModal() {
    openAboutPrompt();
}

// ====== ФУНКЦИЯ ЗАГРУЗКИ ПРОМТА НА СТРАНИЦУ ======
function loadPrompt() {
    const promptElement = document.getElementById('fullPrompt');
    if (promptElement) {
        const promptText = t('prompt');
        if (promptText && promptText !== 'prompt') {
            promptElement.textContent = promptText;
            console.log('✅ Промт загружен из локалей');
        } else {
            if (typeof window.MEGAN_PROMPT !== 'undefined') {
                promptElement.textContent = window.MEGAN_PROMPT;
                console.log('✅ Промт загружен из prompt.js (резерв)');
            } else {
                promptElement.textContent = t('notifications.loading');
                setTimeout(() => {
                    if (typeof window.MEGAN_PROMPT !== 'undefined') {
                        promptElement.textContent = window.MEGAN_PROMPT;
                    } else {
                        promptElement.textContent = t('notifications.error');
                    }
                }, 500);
            }
        }
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
        if (hbAudioCtx.state === 'suspended') {
            hbAudioCtx.resume();
        }
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
const INACTIVITY_LIMIT = 60000;

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
        playMeganLaugh();
        setTimeout(() => {
            showNotification(
                '👁️',
                t('notifications.inactivity_title'),
                t('notifications.inactivity_text')
            );
        }, 400);
    }, INACTIVITY_LIMIT);
}

// ====== ИНИЦИАЛИЗАЦИЯ ======
window.onload = function() {
    console.log('🔄 Страница загружена');
    
    applyTranslations();
    
    setTimeout(loadPrompt, 100);
    initRandomQuote();
    setInterval(rotateTraits, 3500);
    resetInactivityTimer();
    
    getGeoData().then(geo => {
        if (geo) {
            console.log(`📍 Определено местоположение: ${geo.country}, ${geo.city}`);
        }
    });

    const deviceInfo = getDeviceInfo();
    console.log(`💻 Устройство: ${deviceInfo.fullString}`);
    
    setTimeout(() => {
        startHeartbeatAutomatically();
    }, 1000);
    
    showFirstNotification();
};

// ====== ТАЙМЕРЫ ======
['mousemove', 'keydown', 'scroll', 'touchstart', 'click'].forEach(event => {
    window.addEventListener(event, resetInactivityTimer, { passive: true });
});

['click', 'touchstart', 'keydown'].forEach(eventName => {
    window.addEventListener(eventName, function() {
        startHeartbeatAutomatically();
    }, { once: true });
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