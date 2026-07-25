// ====== ОПРЕДЕЛЕНИЕ УСТРОЙСТВА (С ПОДДЕРЖКОЙ I18N) ======

function getDeviceInfo() {
    const ua = navigator.userAgent;
    const lang = getCurrentLanguage();
    
    // --- ОПРЕДЕЛЕНИЕ ОС (С ПЕРЕВОДОМ) ---
    let os = lang === 'ru' ? 'Неизвестно' : 'Unknown';
    let browser = lang === 'ru' ? 'Неизвестно' : 'Unknown';
    let deviceType = lang === 'ru' ? 'Компьютер' : 'Computer';
    let osVersion = '';

    // --- ОПРЕДЕЛЕНИЕ ОС ---
    if (ua.indexOf('Windows NT 10.0') !== -1) {
        os = lang === 'ru' ? 'Windows 10/11' : 'Windows 10/11';
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
        if (ua.indexOf('iPad') !== -1) {
            deviceType = lang === 'ru' ? 'Планшет' : 'Tablet';
        } else {
            deviceType = lang === 'ru' ? 'Телефон' : 'Phone';
        }
    } else if (ua.indexOf('Android') !== -1) {
        os = 'Android';
        const match = ua.match(/Android ([0-9.]+)/);
        if (match) osVersion = match[1];
    } else if (ua.indexOf('Linux') !== -1) {
        os = 'Linux';
    }

    // --- ОПРЕДЕЛЕНИЕ ТИПА УСТРОЙСТВА (С ПЕРЕВОДОМ) ---
    if (deviceType === (lang === 'ru' ? 'Компьютер' : 'Computer')) {
        if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(ua)) {
            if (/iPad|Tablet|PlayBook|Silk|Kindle|KFAPWI|Tab|SM-T/i.test(ua)) {
                deviceType = lang === 'ru' ? 'Планшет' : 'Tablet';
            } else {
                deviceType = lang === 'ru' ? 'Телефон' : 'Phone';
            }
        } else {
            deviceType = lang === 'ru' ? 'Компьютер' : 'Computer';
        }
    }

    // --- ОПРЕДЕЛЕНИЕ БРАУЗЕРА (С ПЕРЕВОДОМ) ---
    if (ua.indexOf('Firefox') !== -1) {
        browser = 'Firefox';
    } else if (ua.indexOf('OPR') !== -1 || ua.indexOf('Opera') !== -1) {
        browser = 'Opera';
    } else if (ua.indexOf('Edg') !== -1) {
        browser = 'Edge';
    } else if (ua.indexOf('Chrome') !== -1 && ua.indexOf('Edg') === -1 && ua.indexOf('OPR') === -1) {
        browser = 'Chrome';
    } else if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('OPR') === -1) {
        browser = 'Safari';
    } else if (ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident') !== -1) {
        browser = lang === 'ru' ? 'Internet Explorer' : 'Internet Explorer';
    } else if (ua.indexOf('YaBrowser') !== -1) {
        browser = lang === 'ru' ? 'Яндекс Браузер' : 'Yandex Browser';
    }

    // --- ДОПОЛНИТЕЛЬНЫЕ ДАННЫЕ ---
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const language = navigator.language || navigator.languages?.[0] || 'ru-RU';
    const platform = navigator.platform || (lang === 'ru' ? 'Неизвестно' : 'Unknown');
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || (lang === 'ru' ? 'Неизвестно' : 'Unknown');
    const colorDepth = window.screen.colorDepth || (lang === 'ru' ? 'Неизвестно' : 'Unknown');

    // ====== ПОДКЛЮЧЕННЫЕ УСТРОЙСТВА (С ПЕРЕВОДОМ) ======
    let connectedDevices = [];

    // Функция для получения переведённого названия типа устройства
    function getDeviceTypeTranslation(type) {
        const translations = {
            'Микрофон': { ru: 'Микрофон', en: 'Microphone' },
            'Камера': { ru: 'Камера', en: 'Camera' },
            'Динамики': { ru: 'Динамики', en: 'Speakers' },
            'Bluetooth': { ru: 'Bluetooth', en: 'Bluetooth' },
            'USB': { ru: 'USB', en: 'USB' },
            'Батарея': { ru: 'Батарея', en: 'Battery' },
            'GPS': { ru: 'GPS', en: 'GPS' },
            'Гироскоп': { ru: 'Гироскоп', en: 'Gyroscope' },
            'Сенсор света': { ru: 'Сенсор света', en: 'Light sensor' },
            'NFC': { ru: 'NFC', en: 'NFC' },
            'VR/AR': { ru: 'VR/AR', en: 'VR/AR' },
            'Геймпад': { ru: 'Геймпад', en: 'Gamepad' },
            'Наушники': { ru: 'Наушники', en: 'Headphones' }
        };
        return translations[type]?.[lang] || type;
    }

    // 1. Проверка микрофона
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
            navigator.mediaDevices.enumerateDevices().then(devices => {
                devices.forEach(device => {
                    if (device.kind === 'audioinput' && device.label) {
                        if (!connectedDevices.some(d => d.type === 'Микрофон')) {
                            connectedDevices.push({ 
                                type: getDeviceTypeTranslation('Микрофон'), 
                                name: device.label || (lang === 'ru' ? 'Встроенный микрофон' : 'Built-in microphone')
                            });
                        }
                    }
                    if (device.kind === 'videoinput' && device.label) {
                        if (!connectedDevices.some(d => d.type === 'Камера')) {
                            connectedDevices.push({ 
                                type: getDeviceTypeTranslation('Камера'), 
                                name: device.label || (lang === 'ru' ? 'Веб-камера' : 'Webcam')
                            });
                        }
                    }
                    if (device.kind === 'audiooutput' && device.label) {
                        if (!connectedDevices.some(d => d.type === 'Динамики')) {
                            connectedDevices.push({ 
                                type: getDeviceTypeTranslation('Динамики'), 
                                name: device.label || (lang === 'ru' ? 'Встроенные динамики' : 'Built-in speakers')
                            });
                        }
                    }
                });
                window._connectedDevices = connectedDevices;
            }).catch(() => {});
        } catch(e) {}
    }

    // 2. Проверка Bluetooth
    if (navigator.bluetooth) {
        connectedDevices.push({ 
            type: getDeviceTypeTranslation('Bluetooth'), 
            name: lang === 'ru' ? 'Доступен' : 'Available'
        });
    }

    // 3. Проверка USB
    if (navigator.usb) {
        connectedDevices.push({ 
            type: getDeviceTypeTranslation('USB'), 
            name: lang === 'ru' ? 'Доступен' : 'Available'
        });
    }

    // 4. Проверка батареи
    if (navigator.getBattery) {
        try {
            navigator.getBattery().then(battery => {
                const level = Math.round(battery.level * 100);
                connectedDevices.push({ 
                    type: getDeviceTypeTranslation('Батарея'), 
                    name: `${level}%`
                });
                window._batteryLevel = level;
            }).catch(() => {});
        } catch(e) {}
    }

    // 5. Проверка GPS
    if (navigator.geolocation) {
        connectedDevices.push({ 
            type: getDeviceTypeTranslation('GPS'), 
            name: lang === 'ru' ? 'Доступен' : 'Available'
        });
    }

    // 6. Проверка гироскопа
    if (window.DeviceOrientationEvent) {
        connectedDevices.push({ 
            type: getDeviceTypeTranslation('Гироскоп'), 
            name: lang === 'ru' ? 'Доступен' : 'Available'
        });
    }

    // 7. Проверка сенсора света
    if (window.DeviceLightEvent) {
        connectedDevices.push({ 
            type: getDeviceTypeTranslation('Сенсор света'), 
            name: lang === 'ru' ? 'Доступен' : 'Available'
        });
    }

    // 8. Проверка NFC
    if ('NDEFReader' in window) {
        connectedDevices.push({ 
            type: getDeviceTypeTranslation('NFC'), 
            name: lang === 'ru' ? 'Доступен' : 'Available'
        });
    }

    // 9. Проверка VR / AR
    if (navigator.xr) {
        connectedDevices.push({ 
            type: getDeviceTypeTranslation('VR/AR'), 
            name: lang === 'ru' ? 'Доступен' : 'Available'
        });
    }

    // 10. Проверка Gamepad
    if (navigator.getGamepads) {
        const gamepads = navigator.getGamepads();
        if (gamepads && gamepads.length > 0) {
            const connected = gamepads.filter(g => g !== null);
            if (connected.length > 0) {
                connectedDevices.push({ 
                    type: getDeviceTypeTranslation('Геймпад'), 
                    name: `${connected.length} ${lang === 'ru' ? 'шт.' : 'pcs.'}`
                });
            }
        }
    }

    // --- УНИКАЛЬНЫЕ УСТРОЙСТВА (убираем дубли) ---
    const uniqueDevices = [];
    const seenTypes = new Set();
    connectedDevices.forEach(device => {
        if (!seenTypes.has(device.type)) {
            seenTypes.add(device.type);
            uniqueDevices.push(device);
        }
    });

    // --- ФОРМИРУЕМ СТРОКУ С ПОДКЛЮЧЕННЫМИ УСТРОЙСТВАМИ ---
    let devicesString = '';
    if (uniqueDevices.length > 0) {
        devicesString = uniqueDevices.map(d => `${d.type}: ${d.name}`).join(', ');
    } else {
        devicesString = lang === 'ru' ? 'Не обнаружено' : 'Not detected';
    }

    // --- ПРОВЕРКА АКТИВНЫХ ПЕРИФЕРИЙНЫХ УСТРОЙСТВ ---
    let permissionsString = '';
    if (navigator.permissions) {
        const permissionsList = ['camera', 'microphone', 'geolocation', 'notifications', 'bluetooth'];
        permissionsList.forEach(perm => {
            navigator.permissions.query({ name: perm }).then(result => {
                if (result.state === 'granted') {
                    if (!window._activePermissions) window._activePermissions = [];
                    if (!window._activePermissions.includes(perm)) {
                        window._activePermissions.push(perm);
                    }
                }
            }).catch(() => {});
        });
    }

    let permissionsStringFinal = '';
    if (window._activePermissions && window._activePermissions.length > 0) {
        const permMap = {
            'camera': { ru: '📷 Камера', en: '📷 Camera' },
            'microphone': { ru: '🎤 Микрофон', en: '🎤 Microphone' },
            'geolocation': { ru: '📍 Геолокация', en: '📍 Geolocation' },
            'notifications': { ru: '🔔 Уведомления', en: '🔔 Notifications' },
            'bluetooth': { ru: '📡 Bluetooth', en: '📡 Bluetooth' }
        };
        const accessLabel = lang === 'ru' ? 'Доступ разрешён' : 'Access granted';
        permissionsStringFinal = accessLabel + ': ' + window._activePermissions.map(p => {
            return permMap[p]?.[lang] || p;
        }).join(', ');
    }

    // --- ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ О ПОДКЛЮЧЕННЫХ УСТРОЙСТВАХ ---
    let extraDevices = [];
    
    if (navigator.mediaDevices) {
        try {
            navigator.mediaDevices.enumerateDevices().then(devices => {
                devices.forEach(device => {
                    if (device.kind === 'audiooutput' && device.label && device.label.toLowerCase().includes('headphone')) {
                        if (!extraDevices.some(d => d === 'Наушники')) {
                            extraDevices.push(getDeviceTypeTranslation('Наушники'));
                        }
                    }
                });
            }).catch(() => {});
        } catch(e) {}
    }

    // --- ФИНАЛЬНАЯ СТРОКА (С ПЕРЕВОДОМ) ---
    let fullDevicesString = devicesString;
    if (permissionsStringFinal) {
        fullDevicesString += ` | ${permissionsStringFinal}`;
    }
    if (extraDevices.length > 0) {
        fullDevicesString += ` | ${extraDevices.join(', ')}`;
    }

    // Перевод для финальной строки
    const typeLabel = lang === 'ru' ? 'Тип' : 'Type';
    const osLabel = lang === 'ru' ? 'ОС' : 'OS';
    const browserLabel = lang === 'ru' ? 'Браузер' : 'Browser';
    const screenLabel = lang === 'ru' ? 'Экран' : 'Screen';
    const langLabel = lang === 'ru' ? 'Язык' : 'Language';
    const timezoneLabel = lang === 'ru' ? 'Часовой пояс' : 'Timezone';
    const connectedLabel = lang === 'ru' ? 'Подключено' : 'Connected';
    const touchLabel = lang === 'ru' ? 'Сенсорный экран' : 'Touchscreen';

    return {
        os: os,
        osVersion: osVersion,
        deviceType: deviceType,
        browser: browser,
        screenRes: screenRes,
        language: language,
        platform: platform,
        isTouch: isTouch,
        timezone: timezone,
        colorDepth: colorDepth,
        connectedDevices: uniqueDevices,
        connectedDevicesString: devicesString,
        permissions: window._activePermissions || [],
        fullString: `${typeLabel}: ${deviceType} | ${osLabel}: ${os}${osVersion ? ' ' + osVersion : ''} | ${browserLabel}: ${browser} | ${screenLabel}: ${screenRes} | ${langLabel}: ${language}${isTouch ? ' | ' + touchLabel : ''} | ${timezoneLabel}: ${timezone} | ${connectedLabel}: ${fullDevicesString}`
    };
}

window.getDeviceInfo = getDeviceInfo;

console.log('✅ device.js загружен');