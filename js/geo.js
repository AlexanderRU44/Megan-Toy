// ====== ГЕОЛОКАЦИЯ (только JSONP - гарантированно работает) ======

// Функция для получения геоданных через JSONP
function getGeoData() {
    return new Promise((resolve) => {
        try {
            // Создаём уникальное имя callback
            const callbackName = 'geoCallback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            
            // Создаём скрипт
            const script = document.createElement('script');
            
            // Добавляем callback в глобальный объект
            window[callbackName] = function(data) {
                // Очищаем после получения данных
                delete window[callbackName];
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
                
                if (data && data.ip) {
                    resolve({
                        country: data.country || 'Неизвестно',
                        city: data.city || 'Неизвестно',
                        region: data.region || 'Неизвестно',
                        isp: data.org || 'Неизвестно',
                        timezone: data.timezone || 'Неизвестно',
                        ip: data.ip || 'Неизвестно',
                        location: data.loc || 'Неизвестно',
                        isHosting: false,
                        isProxy: false,
                        isMobile: false
                    });
                } else {
                    resolve(null);
                }
            };
            
            // Обработка ошибки загрузки скрипта
            script.onerror = function() {
                delete window[callbackName];
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
                resolve(null);
            };
            
            // Используем ipinfo.io с JSONP
            script.src = `https://ipinfo.io/json?callback=${callbackName}`;
            script.async = true;
            
            // Добавляем скрипт в DOM
            document.head.appendChild(script);
            
            // Таймаут на случай долгого ответа (5 секунд)
            setTimeout(() => {
                if (window[callbackName]) {
                    delete window[callbackName];
                    if (script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                    resolve(null);
                }
            }, 5000);
            
        } catch (error) {
            console.error('Ошибка JSONP:', error);
            resolve(null);
        }
    });
}

// Функция для добавления геоданных в промт
function getGeoInfoString() {
    return new Promise((resolve) => {
        getGeoData().then(geo => {
            if (geo) {
                const parts = [];
                if (geo.country && geo.country !== 'Неизвестно') parts.push(`Страна: ${geo.country}`);
                if (geo.city && geo.city !== 'Неизвестно') parts.push(`Город: ${geo.city}`);
                if (geo.region && geo.region !== 'Неизвестно') parts.push(`Регион: ${geo.region}`);
                if (geo.isp && geo.isp !== 'Неизвестно') parts.push(`Провайдер: ${geo.isp}`);
                if (geo.timezone && geo.timezone !== 'Неизвестно') parts.push(`Часовой пояс: ${geo.timezone}`);
                if (geo.ip && geo.ip !== 'Неизвестно') parts.push(`IP: ${geo.ip}`);
                
                const result = `[ГЕОЛОКАЦИЯ ПОЛЬЗОВАТЕЛЯ: ${parts.join(' | ')}]`;
                resolve(result);
            } else {
                resolve('[ГЕОЛОКАЦИЯ: Не удалось определить]');
            }
        });
    });
}

// Функция для отображения геоданных в уведомлении
function showGeoInfo() {
    getGeoData().then(geo => {
        if (geo && geo.country !== 'Неизвестно') {
            let message = `📍 Твои геоданные:\n\n`;
            message += `🌍 Страна: ${geo.country}\n`;
            message += `🏙️ Город: ${geo.city}\n`;
            message += `🗺️ Регион: ${geo.region}\n`;
            message += `📡 Провайдер: ${geo.isp}\n`;
            message += `🕐 Часовой пояс: ${geo.timezone}\n`;
            message += `🔢 IP: ${geo.ip}\n`;
            
            if (geo.location && geo.location !== 'Неизвестно') {
                message += `📍 Координаты: ${geo.location}\n`;
            }
            
            showNotification(
                '📍',
                'Твоё местоположение',
                message,
                null,
                '',
                'Понятно',
                closeNotification
            );
        } else {
            showNotification(
                '🌐',
                'Геолокация недоступна',
                'Не удалось определить твоё местоположение.\n\nПроверь:\n• Интернет-соединение\n• Отключи VPN/прокси\n• Обнови страницу (Ctrl+F5)',
                null,
                '',
                'Понятно',
                closeNotification
            );
        }
    });
}

// Тестовая функция
function testGeo() {
    console.log('🧪 Проверка геолокации...');
    getGeoData().then(geo => {
        if (geo) {
            console.log('✅ Успешно! Твои данные:', geo);
        } else {
            console.log('❌ Не удалось получить данные');
        }
    });
}

// Запускаем тест при загрузке
if (typeof window !== 'undefined') {
    setTimeout(testGeo, 2000);
}