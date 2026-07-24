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
        if (ua.indexOf('iPad') !== -1) {
            deviceType = 'Планшет';
        } else {
            deviceType = 'Телефон';
        }
    } else if (ua.indexOf('Android') !== -1) {
        os = 'Android';
        const match = ua.match(/Android ([0-9.]+)/);
        if (match) osVersion = match[1];
    } else if (ua.indexOf('Linux') !== -1) {
        os = 'Linux';
    }

    // --- ОПРЕДЕЛЕНИЕ ТИПА УСТРОЙСТВА ---
    if (deviceType === 'Компьютер') {
        if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(ua)) {
            if (/iPad|Tablet|PlayBook|Silk|Kindle|KFAPWI|Tab|SM-T/i.test(ua)) {
                deviceType = 'Планшет';
            } else {
                deviceType = 'Телефон';
            }
        } else {
            deviceType = 'Компьютер';
        }
    }

    // --- ОПРЕДЕЛЕНИЕ БРАУЗЕРА ---
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
        browser = 'Internet Explorer';
    } else if (ua.indexOf('YaBrowser') !== -1) {
        browser = 'Яндекс Браузер';
    }

    // --- ДОПОЛНИТЕЛЬНЫЕ ДАННЫЕ ---
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const language = navigator.language || navigator.languages?.[0] || 'ru-RU';
    const platform = navigator.platform || 'Неизвестно';
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Неизвестно';
    const colorDepth = window.screen.colorDepth || 'Неизвестно';

    // ====== ПОДКЛЮЧЕННЫЕ УСТРОЙСТВА ======
    let connectedDevices = [];

    // 1. Проверка микрофона
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
            navigator.mediaDevices.enumerateDevices().then(devices => {
                devices.forEach(device => {
                    if (device.kind === 'audioinput' && device.label) {
                        if (!connectedDevices.some(d => d.type === 'Микрофон')) {
                            connectedDevices.push({ type: 'Микрофон', name: device.label || 'Встроенный микрофон' });
                        }
                    }
                    if (device.kind === 'videoinput' && device.label) {
                        if (!connectedDevices.some(d => d.type === 'Камера')) {
                            connectedDevices.push({ type: 'Камера', name: device.label || 'Веб-камера' });
                        }
                    }
                    if (device.kind === 'audiooutput' && device.label) {
                        if (!connectedDevices.some(d => d.type === 'Динамики')) {
                            connectedDevices.push({ type: 'Динамики', name: device.label || 'Встроенные динамики' });
                        }
                    }
                });
                // Сохраняем в глобальную переменную
                window._connectedDevices = connectedDevices;
            }).catch(() => {});
        } catch(e) {}
    }

    // 2. Проверка Bluetooth
    if (navigator.bluetooth) {
        connectedDevices.push({ type: 'Bluetooth', name: 'Доступен' });
    }

    // 3. Проверка USB
    if (navigator.usb) {
        connectedDevices.push({ type: 'USB', name: 'Доступен' });
    }

    // 4. Проверка батареи
    if (navigator.getBattery) {
        try {
            navigator.getBattery().then(battery => {
                const level = Math.round(battery.level * 100);
                connectedDevices.push({ type: 'Батарея', name: `${level}%` });
                window._batteryLevel = level;
            }).catch(() => {});
        } catch(e) {}
    }

    // 5. Проверка GPS (через геолокацию)
    if (navigator.geolocation) {
        connectedDevices.push({ type: 'GPS', name: 'Доступен' });
    }

    // 6. Проверка акселерометра / гироскопа
    if (window.DeviceOrientationEvent) {
        connectedDevices.push({ type: 'Гироскоп', name: 'Доступен' });
    }

    // 7. Проверка сенсора освещённости
    if (window.DeviceLightEvent) {
        connectedDevices.push({ type: 'Сенсор света', name: 'Доступен' });
    }

    // 8. Проверка NFC
    if ('NDEFReader' in window) {
        connectedDevices.push({ type: 'NFC', name: 'Доступен' });
    }

    // 9. Проверка VR / AR
    if (navigator.xr) {
        connectedDevices.push({ type: 'VR/AR', name: 'Доступен' });
    }

    // 10. Проверка Gamepad
    if (navigator.getGamepads) {
        const gamepads = navigator.getGamepads();
        if (gamepads && gamepads.length > 0) {
            const connected = gamepads.filter(g => g !== null);
            if (connected.length > 0) {
                connectedDevices.push({ type: 'Геймпад', name: `${connected.length} шт.` });
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
        devicesString = 'Не обнаружено';
    }

    // --- ПРОВЕРКА АКТИВНЫХ ПЕРИФЕРИЙНЫХ УСТРОЙСТВ (через Permissions API) ---
    let permissionsString = '';
    if (navigator.permissions) {
        const permissionsList = ['camera', 'microphone', 'geolocation', 'notifications', 'bluetooth'];
        permissionsList.forEach(perm => {
            navigator.permissions.query({ name: perm }).then(result => {
                if (result.state === 'granted') {
                    // Сохраняем в глобальную переменную
                    if (!window._activePermissions) window._activePermissions = [];
                    if (!window._activePermissions.includes(perm)) {
                        window._activePermissions.push(perm);
                    }
                }
            }).catch(() => {});
        });
    }

    // Формируем строку с разрешениями
    let permissionsStringFinal = '';
    if (window._activePermissions && window._activePermissions.length > 0) {
        permissionsStringFinal = 'Доступ разрешён: ' + window._activePermissions.map(p => {
            const map = {
                'camera': '📷 Камера',
                'microphone': '🎤 Микрофон',
                'geolocation': '📍 Геолокация',
                'notifications': '🔔 Уведомления',
                'bluetooth': '📡 Bluetooth'
            };
            return map[p] || p;
        }).join(', ');
    }

    // --- ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ О ПОДКЛЮЧЕННЫХ УСТРОЙСТВАХ ---
    let extraDevices = [];
    
    // Подключенные наушники / аудио
    if (navigator.mediaDevices) {
        try {
            navigator.mediaDevices.enumerateDevices().then(devices => {
                devices.forEach(device => {
                    if (device.kind === 'audiooutput' && device.label && device.label.toLowerCase().includes('headphone')) {
                        if (!extraDevices.some(d => d === 'Наушники')) {
                            extraDevices.push('Наушники');
                        }
                    }
                });
            }).catch(() => {});
        } catch(e) {}
    }

    // --- ФИНАЛЬНАЯ СТРОКА ---
    let fullDevicesString = devicesString;
    if (permissionsStringFinal) {
        fullDevicesString += ` | ${permissionsStringFinal}`;
    }
    if (extraDevices.length > 0) {
        fullDevicesString += ` | ${extraDevices.join(', ')}`;
    }

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
        fullString: `Тип: ${deviceType} | ОС: ${os}${osVersion ? ' ' + osVersion : ''} | Браузер: ${browser} | Экран: ${screenRes} | Язык: ${language}${isTouch ? ' | Сенсорный экран' : ''} | Часовой пояс: ${timezone} | Подключено: ${fullDevicesString}`
    };
}

// Объявляем глобально
window.getDeviceInfo = getDeviceInfo;

console.log('✅ device.js загружен');