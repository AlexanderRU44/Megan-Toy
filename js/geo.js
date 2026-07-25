// ====== ГЕОЛОКАЦИЯ (С ПОДДЕРЖКОЙ I18N) ======

// Получение данных о местоположении
async function getGeoData() {
    try {
        // Сначала пробуем получить GPS
        const gpsData = await getGPSData();
        if (gpsData) {
            return gpsData;
        }
        
        // Если GPS недоступен, используем IP
        const ipData = await getIPData();
        return ipData;
    } catch(e) {
        console.log('❌ Ошибка получения геоданных:', e);
        return null;
    }
}

// Получение GPS через браузер
function getGPSData() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(null);
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Обратный геокодинг через Nominatim
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=ru`
                    );
                    const data = await response.json();
                    
                    if (data && data.address) {
                        const city = data.address.city || data.address.town || data.address.village || 'Неизвестно';
                        const country = data.address.country || 'Неизвестно';
                        resolve({
                            lat: latitude,
                            lon: longitude,
                            city: city,
                            country: country,
                            source: 'gps'
                        });
                    } else {
                        resolve({
                            lat: latitude,
                            lon: longitude,
                            city: 'Неизвестно',
                            country: 'Неизвестно',
                            source: 'gps'
                        });
                    }
                } catch(e) {
                    console.log('Ошибка геокодинга:', e);
                    resolve({
                        lat: latitude,
                        lon: longitude,
                        city: 'Неизвестно',
                        country: 'Неизвестно',
                        source: 'gps'
                    });
                }
            },
            () => resolve(null),
            { timeout: 5000, enableHighAccuracy: true }
        );
    });
}

// Получение данных по IP через ipinfo.io
async function getIPData() {
    try {
        const response = await fetch('https://ipinfo.io/json?token=YOUR_TOKEN');
        const data = await response.json();
        
        if (data) {
            const [lat, lon] = (data.loc || '0,0').split(',').map(Number);
            return {
                lat: lat || 0,
                lon: lon || 0,
                city: data.city || 'Неизвестно',
                country: data.country || 'Неизвестно',
                region: data.region || 'Неизвестно',
                source: 'ip'
            };
        }
        return null;
    } catch(e) {
        console.log('❌ Ошибка IP-геолокации:', e);
        return null;
    }
}

// Получение строки с геоданными для промта (С ПЕРЕВОДОМ)
async function getGeoInfoString() {
    try {
        const geo = await getGeoData();
        const lang = getCurrentLanguage();
        const unknown = lang === 'ru' ? 'не определено' : 'unknown';
        
        if (geo && (geo.city || geo.country)) {
            const city = geo.city || unknown;
            const country = geo.country || unknown;
            const locationLabel = lang === 'ru' ? '📍 Местоположение' : '📍 Location';
            
            if (geo.lat && geo.lon && geo.lat !== 0 && geo.lon !== 0) {
                return `${locationLabel}: ${city}, ${country} (GPS: ${geo.lat}, ${geo.lon})`;
            }
            return `${locationLabel}: ${city}, ${country}`;
        }
        
        return `📍 ${lang === 'ru' ? 'Местоположение' : 'Location'}: ${unknown}`;
    } catch(e) {
        console.log('❌ Ошибка получения гео-строки:', e);
        return '';
    }
}

// Сохранение геоданных в localStorage
async function saveGeoData() {
    const geo = await getGeoData();
    if (geo) {
        localStorage.setItem('megan_geo_data', JSON.stringify(geo));
        console.log('💾 Геоданные сохранены');
    }
}

// Экспорт функций
window.getGeoData = getGeoData;
window.getGeoInfoString = getGeoInfoString;
window.saveGeoData = saveGeoData;