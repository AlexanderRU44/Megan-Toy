// ====== ГЕОЛОКАЦИЯ (с обходом CORS) ======

// Функция для получения геоданных
async function getGeoData() {
    try {
        // Пробуем несколько API для надёжности
        const apis = [
            'https://ipinfo.io/json',
            'https://ip-api.com/json/?fields=status,country,city,region,isp,timezone,hosting,proxy,mobile,query',
            'https://api.ipify.org?format=json' // только для IP
        ];
        
        let lastError = null;
        
        for (const api of apis) {
            try {
                const response = await fetch(api, {
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (!response.ok) continue;
                
                const data = await response.json();
                
                // Проверяем ipinfo.io
                if (data.ip && data.country) {
                    return {
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
                    };
                }
                
                // Проверяем ip-api.com
                if (data.status === 'success' && data.country) {
                    return {
                        country: data.country || 'Неизвестно',
                        city: data.city || 'Неизвестно',
                        region: data.region || 'Неизвестно',
                        isp: data.isp || 'Неизвестно',
                        timezone: data.timezone || 'Неизвестно',
                        ip: data.query || 'Неизвестно',
                        location: `${data.lat || '0'}, ${data.lon || '0'}`,
                        isHosting: data.hosting || false,
                        isProxy: data.proxy || false,
                        isMobile: data.mobile || false
                    };
                }
                
                // Проверяем api.ipify.org (только IP)
                if (data.ip) {
                    // Если есть только IP, пытаемся получить остальное через другой запрос
                    return await getGeoDataFromIP(data.ip);
                }
                
            } catch (e) {
                lastError = e;
                console.log(`API ${api} не работает:`, e.message);
            }
        }
        
        // Если ничего не сработало, пробуем через JSONP (обход CORS)
        return await getGeoDataJSONP();
        
    } catch (error) {
        console.error('Ошибка получения геоданных:', error);
        return await getGeoDataJSONP();
    }
}

// Функция для получения геоданных по IP (если есть только IP)
async function getGeoDataFromIP(ip) {
    try {
        const response = await fetch(`https://ip-api.com/json/${ip}?fields=status,country,city,region,isp,timezone`);
        const data = await response.json();
        
        if (data.status === 'success') {
            return {
                country: data.country || 'Неизвестно',
                city: data.city || 'Неизвестно',
                region: data.region || 'Неизвестно',
                isp: data.isp || 'Неизвестно',
                timezone: data.timezone || 'Неизвестно',
                ip: ip || 'Неизвестно',
                location: `${data.lat || '0'}, ${data.lon || '0'}`,
                isHosting: false,
                isProxy: false,
                isMobile: false
            };
        }
        return null;
    } catch {
        return null;
    }
}

// Функция через JSONP (обход CORS)
function getGeoDataJSONP() {
    return new Promise((resolve) => {
        try {
            const script = document.createElement('script');
            const callbackName = 'geoCallback_' + Date.now();
            
            // Добавляем callback в глобальный объект
            window[callbackName] = function(data) {
                delete window[callbackName];
                document.body.removeChild(script);
                
                if (data && data.country) {
                    resolve({
                        country: data.country || 'Неизвестно',
                        city: data.city || 'Неизвестно',
                        region: data.region || 'Неизвестно',
                        isp: data.isp || 'Неизвестно',
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
            
            // Используем ipinfo.io с JSONP
            script.src = `https://ipinfo.io/json?callback=${callbackName}`;
            script.onerror = function() {
                delete window[callbackName];
                document.body.removeChild(script);
                resolve(null);
            };
            
            document.body.appendChild(script);
            
            // Таймаут на случай долгого ответа
            setTimeout(() => {
                if (window[callbackName]) {
                    delete window[callbackName];
                    if (document.body.contains(script)) {
                        document.body.removeChild(script);
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
                'Не удалось определить твоё местоположение.\n\nЭто может быть связано с:\n• Использованием VPN/прокси\n• Блокировкой запросов браузером\n• Ограничениями в твоей стране\n\n📌 Попробуй использовать другой браузер или отключить VPN.\n\n🔧 Техническая информация:\nВсе API сервисы временно недоступны.',
                null,
                '',
                'Понятно',
                closeNotification
            );
        }
    });
}

// Функция для проверки работоспособности (для отладки)
function testGeoAPI() {
    console.log('🧪 Тестируем геолокацию...');
    getGeoData().then(geo => {
        if (geo) {
            console.log('✅ Геолокация работает:', geo);
        } else {
            console.log('❌ Геолокация не работает');
        }
    });
}

// Запускаем тест при загрузке
if (typeof window !== 'undefined') {
    setTimeout(testGeoAPI, 1000);
}