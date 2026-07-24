// ====== ОПРЕДЕЛЕНИЕ УСТРОЙСТВА ======

function getDeviceInfo() {
    const ua = navigator.userAgent;
    let os = 'Неизвестно';
    let browser = 'Неизвестно';
    let deviceType = 'Компьютер';
    let osVersion = '';

    // --- ОПРЕДЕЛЕНИЕ ОС ---
    if (ua.indexOf('Windows NT 10.0') !== -1) {
        os = 'Windows 10/11';
        osVersion = '10.0';
    } else if (ua.indexOf('Windows NT 6.3') !== -1) {
        os = 'Windows 8.1';
        osVersion = '6.3';
    } else if (ua.indexOf('Windows NT 6.2') !== -1) {
        os = 'Windows 8';
        osVersion = '6.2';
    } else if (ua.indexOf('Windows NT 6.1') !== -1) {
        os = 'Windows 7';
        osVersion = '6.1';
    } else if (ua.indexOf('Windows NT') !== -1) {
        os = 'Windows';
    } else if (ua.indexOf('Mac OS X') !== -1) {
        os = 'macOS';
        const match = ua.match(/Mac OS X ([0-9_]+)/);
        if (match) osVersion = match[1].replace(/_/g, '.');
    } else if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) {
        os = 'iOS';
        const match = ua.match(/OS ([0-9_]+)/);
        if (match) osVersion = match[1].replace(/_/g, '.');
    } else if (ua.indexOf('Android') !== -1) {
        os = 'Android';
        const match = ua.match(/Android ([0-9.]+)/);
        if (match) osVersion = match[1];
    } else if (ua.indexOf('Linux') !== -1) {
        os = 'Linux';
    }

    // --- ОПРЕДЕЛЕНИЕ ТИПА УСТРОЙСТВА ---
    if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(ua)) {
        if (/iPad|Tablet|PlayBook|Silk|Kindle|KFAPWI/i.test(ua)) {
            deviceType = 'Планшет';
        } else {
            deviceType = 'Телефон';
        }
    } else {
        deviceType = 'Компьютер';
    }

    // --- ОПРЕДЕЛЕНИЕ БРАУЗЕРА ---
    if (ua.indexOf('Firefox') !== -1) {
        browser = 'Firefox';
    } else if (ua.indexOf('OPR') !== -1 || ua.indexOf('Opera') !== -1) {
        browser = 'Opera';
    } else if (ua.indexOf('Edg') !== -1) {
        browser = 'Edge';
    } else if (ua.indexOf('Chrome') !== -1 && ua.indexOf('Edg') === -1) {
        browser = 'Chrome';
    } else if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) {
        browser = 'Safari';
    } else if (ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident') !== -1) {
        browser = 'Internet Explorer';
    }

    // --- ДОПОЛНИТЕЛЬНЫЕ ДАННЫЕ ---
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const language = navigator.language || navigator.languages?.[0] || 'ru-RU';
    const platform = navigator.platform || 'Неизвестно';
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return {
        os: os,
        osVersion: osVersion,
        deviceType: deviceType,
        browser: browser,
        screenRes: screenRes,
        language: language,
        platform: platform,
        isTouch: isTouch,
        fullString: `Устройство: ${deviceType} (${os}${osVersion ? ' ' + osVersion : ''}), Браузер: ${browser}, Экран: ${screenRes}, Язык: ${language}${isTouch ? ', Сенсорный экран' : ''}`
    };
}

// Объявляем глобально
window.getDeviceInfo = getDeviceInfo;

console.log('✅ device.js загружен');