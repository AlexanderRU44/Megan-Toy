// ====== ГЕОЛОКАЦИЯ (с приоритетом GPS для отображения) ======

// Функция для получения геоданных через IP
function getGeoData() {
    return new Promise((resolve) => {
        try {
            const callbackName = 'geoCallback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            const script = document.createElement('script');
            
            window[callbackName] = function(data) {
                delete window[callbackName];
                if (script.parentNode) script.parentNode.removeChild(script);
                
                if (data && data.ip) {
                    resolve({
                        country: data.country || 'Неизвестно',
                        city: data.city || 'Неизвестно',
                        region: data.region || 'Неизвестно',
                        isp: data.org || 'Неизвестно',
                        timezone: data.timezone || 'Неизвестно',
                        ip: data.ip || 'Неизвестно',
                        location: data.loc || 'Неизвестно'
                    });
                } else {
                    resolve(null);
                }
            };
            
            script.onerror = function() {
                delete window[callbackName];
                if (script.parentNode) script.parentNode.removeChild(script);
                resolve(null);
            };
            
            script.src = `https://ipinfo.io/json?callback=${callbackName}`;
            script.async = true;
            document.head.appendChild(script);
            
            setTimeout(() => {
                if (window[callbackName]) {
                    delete window[callbackName];
                    if (script.parentNode) script.parentNode.removeChild(script);
                    resolve(null);
                }
            }, 5000);
            
        } catch (error) {
            console.error('Ошибка JSONP:', error);
            resolve(null);
        }
    });
}

// Функция для получения GPS
function getGPSLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve({ error: true, message: 'GPS не поддерживается' });
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    error: false
                });
            },
            (error) => {
                let message = '';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        message = '⛔ Доступ к GPS запрещён';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = '📡 GPS сигнал недоступен';
                        break;
                    case error.TIMEOUT:
                        message = '⏳ Превышено время ожидания GPS';
                        break;
                    default:
                        message = '❌ Ошибка GPS';
                }
                resolve({ error: true, message: message });
            },
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 60000
            }
        );
    });
}

// Обратный геокодинг - получение города по координатам
async function getCityFromCoords(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ru`);
        const data = await response.json();
        if (data && data.address) {
            const address = data.address;
            return {
                city: address.city || address.town || address.village || address.hamlet || 'Неизвестно',
                region: address.state || address.region || 'Неизвестно',
                country: address.country || 'Неизвестно',
                full: data.display_name || 'Неизвестно'
            };
        }
        return null;
    } catch (error) {
        console.error('Ошибка обратного геокодинга:', error);
        return null;
    }
}

// ====== ГЛАВНАЯ ФУНКЦИЯ ======
function showFullLocation() {
    console.log('📍 Нажата кнопка местоположения');
    
    showNotification(
        '📍',
        'Определение местоположения...',
        '<div style="text-align: center;">⏳ Подожди, я смотрю где ты...</div>',
        null,
        '',
        null,
        null
    );
    
    const btn = document.getElementById('notifMainBtn');
    if (btn) btn.style.display = 'none';
    
    let ipData = null;
    let gpsData = null;
    let cityData = null;
    let done = 0;
    const total = 3;
    
    function finish() {
        done++;
        if (done === total) {
            showResult();
        }
    }
    
    function showResult() {
        let message = '';
        let hasData = false;
        let gpsAvailable = false;
        
        if (gpsData && !gpsData.error) {
            gpsAvailable = true;
            hasData = true;
            message += `✅ ТВОЁ РЕАЛЬНОЕ МЕСТОПОЛОЖЕНИЕ (GPS):\n\n`;
            message += `📍 Координаты: ${gpsData.lat}, ${gpsData.lon}\n`;
            message += `🎯 Точность: ${gpsData.accuracy} метров\n`;
            
            if (cityData) {
                message += `\n🏙️ Город: ${cityData.city}\n`;
                message += `🗺️ Регион: ${cityData.region}\n`;
                message += `🌍 Страна: ${cityData.country}\n`;
            }
            
            message += `\n🗺️ Карта: https://www.google.com/maps?q=${gpsData.lat},${gpsData.lon}\n\n`;
            message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        } else if (gpsData && gpsData.error) {
            message += `📡 GPS: ${gpsData.message}\n\n`;
        }
        
        if (ipData && ipData.country !== 'Неизвестно') {
            message += `⚠️ IP-геолокация (приблизительно, может отличаться):\n`;
            message += `🌍 Страна: ${ipData.country}\n`;
            message += `🏙️ Город по IP: ${ipData.city}\n`;
            if (ipData.region && ipData.region !== 'Неизвестно') {
                message += `🗺️ Регион по IP: ${ipData.region}\n`;
            }
            if (ipData.isp && ipData.isp !== 'Неизвестно') {
                message += `📡 Провайдер: ${ipData.isp}\n`;
            }
            message += `🔢 IP: ${ipData.ip}\n`;
            hasData = true;
        }
        
        if (!hasData) {
            message = `❌ Не удалось определить местоположение.\n\nПроверь интернет и попробуй ещё раз.`;
        }
        
        if (gpsAvailable) {
            message += `\n\n✅ Определено по GPS (ТОЧНО)`;
        } else if (ipData && ipData.country !== 'Неизвестно') {
            message += `\n\nℹ️ Определено по IP-адресу (ПРИБЛИЗИТЕЛЬНО)`;
        }
        
        const resultBtn = document.getElementById('notifMainBtn');
        if (resultBtn) {
            resultBtn.style.display = 'block';
            resultBtn.innerText = 'Понятно';
            resultBtn.onclick = closeNotification;
        }
        
        document.getElementById('notifIcon').innerText = '📍';
        document.getElementById('notifTitle').innerText = 'Твоё местоположение';
        document.getElementById('notifText').innerHTML = message.replace(/\n/g, '<br>');
    }
    
    getGeoData().then(data => {
        ipData = data;
        finish();
    });
    
    getGPSLocation().then(data => {
        gpsData = data;
        if (gpsData && !gpsData.error) {
            getCityFromCoords(gpsData.lat, gpsData.lon).then(city => {
                cityData = city;
                finish();
            });
        } else {
            finish();
        }
    });
    
    setTimeout(() => {
        if (done < total) {
            if (!gpsData) {
                gpsData = { error: true, message: '⏳ Время ожидания истекло' };
            }
            if (!ipData) {
                ipData = null;
            }
            done = total;
            showResult();
        }
    }, 10000);
}

// ====== ФУНКЦИЯ ДЛЯ ПРОМТА (с реальным городом из GPS) ======
function getGeoInfoString() {
    return new Promise((resolve) => {
        // Сначала пытаемся получить GPS
        getGPSLocation().then(gps => {
            if (gps && !gps.error) {
                // Если GPS есть — получаем город по координатам
                getCityFromCoords(gps.lat, gps.lon).then(cityData => {
                    let result = '';
                    if (cityData && cityData.city !== 'Неизвестно') {
                        // Используем реальный город из GPS
                        result = `[ГЕОЛОКАЦИЯ ПОЛЬЗОВАТЕЛЯ: Город: ${cityData.city}, Регион: ${cityData.region}, Страна: ${cityData.country} | GPS: ${gps.lat}, ${gps.lon} | Точность: ${gps.accuracy}м]`;
                        console.log('✅ Для промта используется GPS с городом:', cityData.city);
                    } else {
                        // Если город не определился — только координаты
                        result = `[ГЕОЛОКАЦИЯ ПОЛЬЗОВАТЕЛЯ: GPS: ${gps.lat}, ${gps.lon} | Точность: ${gps.accuracy}м]`;
                        console.log('✅ Для промта используется GPS (без города)');
                    }
                    resolve(result);
                });
                return;
            }
            
            // Если GPS нет — используем IP
            console.log('ℹ️ GPS не доступен, используем IP для промта');
            getGeoData().then(geo => {
                if (geo) {
                    const parts = [];
                    if (geo.country && geo.country !== 'Неизвестно') parts.push(`Страна: ${geo.country}`);
                    if (geo.city && geo.city !== 'Неизвестно') parts.push(`Город: ${geo.city}`);
                    if (geo.region && geo.region !== 'Неизвестно') parts.push(`Регион: ${geo.region}`);
                    if (geo.ip && geo.ip !== 'Неизвестно') parts.push(`IP: ${geo.ip}`);
                    resolve(`[ГЕОЛОКАЦИЯ ПОЛЬЗОВАТЕЛЯ: ${parts.join(' | ')}]`);
                } else {
                    resolve('[ГЕОЛОКАЦИЯ: Не удалось определить]');
                }
            });
        });
    });
}

// Объявляем глобально
window.showFullLocation = showFullLocation;
window.getGeoInfoString = getGeoInfoString;
window.getGeoData = getGeoData;
window.getGPSLocation = getGPSLocation;

console.log('✅ geo.js загружен');
console.log('✅ showFullLocation доступна:', typeof showFullLocation === 'function');