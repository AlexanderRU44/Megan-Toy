// ====== ГЕОЛОКАЦИЯ (С ПОДДЕРЖКОЙ I18N) ======

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
                    const geoObj = {
                        country: data.country || 'Неизвестно',
                        city: data.city || 'Неизвестно',
                        region: data.region || 'Неизвестно',
                        isp: data.org || 'Неизвестно',
                        timezone: data.timezone || 'Неизвестно',
                        ip: data.ip || 'Неизвестно',
                        location: data.loc || 'Неизвестно',
                        postal: data.postal || 'Неизвестно'
                    };
                    localStorage.setItem('megan_geo_data', JSON.stringify(geoObj));
                    resolve(geoObj);
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
        const lang = getCurrentLanguage();
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=${lang === 'ru' ? 'ru' : 'en'}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.address) {
            const address = data.address;
            const cityData = {
                city: address.city || address.town || address.village || address.hamlet || 'Неизвестно',
                region: address.state || address.region || 'Неизвестно',
                country: address.country || 'Неизвестно',
                full: data.display_name || 'Неизвестно'
            };
            return cityData;
        }
        return null;
    } catch (error) {
        console.error('Ошибка обратного геокодинга:', error);
        return null;
    }
}

// ====== ПОЛУЧЕНИЕ УЛИЦЫ ПО КООРДИНАТАМ ======
async function getStreetFromCoords(lat, lon) {
    try {
        const lang = getCurrentLanguage();
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=18&addressdetails=1&accept-language=${lang === 'ru' ? 'ru' : 'en'}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.address) {
            const address = data.address;
            return {
                street: address.road || address.street || address.pedestrian || 'Неизвестно',
                house: address.house_number || '',
                city: address.city || address.town || address.village || 'Неизвестно',
                region: address.state || address.region || 'Неизвестно',
                country: address.country || 'Неизвестно',
                postcode: address.postcode || '',
                full: data.display_name || 'Неизвестно'
            };
        }
        return null;
    } catch (error) {
        console.error('Ошибка получения улицы:', error);
        return null;
    }
}

// ====== ГЛАВНАЯ ФУНКЦИЯ ПОКАЗА МЕСТОПОЛОЖЕНИЯ ======
function showFullLocation() {
    console.log('📍 Нажата кнопка местоположения');
    
    showNotification(
        '📍',
        t('geo.title'),
        `<div style="text-align: center;">${t('geo.loading')}</div>`,
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
    let streetData = null;
    let done = 0;
    const total = 4;
    
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
        
        let geoObj = { city: 'Неизвестно', country: 'Неизвестно' };
        
        if (gpsData && !gpsData.error) {
            gpsAvailable = true;
            hasData = true;
            message += `${t('geo.gps_accurate')}:\n\n`;
            message += `${t('geo.coords')}: ${gpsData.lat}, ${gpsData.lon}\n`;
            message += `${t('geo.accuracy')}: ${gpsData.accuracy} ${t('geo.unknown')}\n`;
            
            geoObj.lat = gpsData.lat;
            geoObj.lon = gpsData.lon;
            geoObj.accuracy = gpsData.accuracy;
            
            if (streetData) {
                let streetFull = streetData.street;
                if (streetData.house) {
                    streetFull += `, ${streetData.house}`;
                }
                message += `\n📍 Улица: ${streetFull}\n`;
                if (streetData.postcode) {
                    message += `📮 Почтовый индекс: ${streetData.postcode}\n`;
                }
                geoObj.street = streetFull;
                geoObj.postcode = streetData.postcode;
            }
            
            if (cityData) {
                message += `\n🏙️ ${t('geo.city')}: ${cityData.city}\n`;
                message += `🗺️ ${t('geo.region')}: ${cityData.region}\n`;
                message += `🌍 ${t('geo.country')}: ${cityData.country}\n`;
                geoObj.city = cityData.city;
                geoObj.region = cityData.region;
                geoObj.country = cityData.country;
            }
            
            message += `\n🗺️ ${t('geo.map')}: https://www.google.com/maps?q=${gpsData.lat},${gpsData.lon}\n\n`;
            message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        } else if (gpsData && gpsData.error) {
            message += `${t('geo.gps_unavailable')}: ${gpsData.message}\n\n`;
        }
        
        if (ipData && ipData.country !== 'Неизвестно') {
            message += `${t('geo.ip_approx')}:\n`;
            message += `${t('geo.country')}: ${ipData.country}\n`;
            message += `${t('geo.city')}: ${ipData.city}\n`;
            if (ipData.region && ipData.region !== 'Неизвестно') {
                message += `${t('geo.region')}: ${ipData.region}\n`;
            }
            if (ipData.isp && ipData.isp !== 'Неизвестно') {
                message += `${t('geo.isp')}: ${ipData.isp}\n`;
            }
            message += `${t('geo.ip')}: ${ipData.ip}\n`;
            hasData = true;
            
            if (!geoObj.city || geoObj.city === 'Неизвестно') {
                geoObj.city = ipData.city || 'Неизвестно';
                geoObj.country = ipData.country || 'Неизвестно';
                geoObj.region = ipData.region || 'Неизвестно';
                geoObj.isp = ipData.isp || 'Неизвестно';
                geoObj.ip = ipData.ip || 'Неизвестно';
            }
        }
        
        if (!hasData) {
            message = `❌ ${t('geo.unknown')}`;
        }
        
        if (gpsAvailable) {
            message += `\n\n${t('geo.gps_accurate')}`;
        } else if (ipData && ipData.country !== 'Неизвестно') {
            message += `\n\n${t('geo.ip_approx')}`;
        }
        
        localStorage.setItem('megan_geo_data', JSON.stringify(geoObj));
        
        const resultBtn = document.getElementById('notifMainBtn');
        if (resultBtn) {
            resultBtn.style.display = 'block';
            resultBtn.innerText = t('greeting.btn');
            resultBtn.onclick = closeNotification;
        }
        
        document.getElementById('notifIcon').innerText = '📍';
        document.getElementById('notifTitle').innerText = t('geo.title');
        document.getElementById('notifText').innerHTML = message.replace(/\n/g, '<br>');
    }
    
    getGeoData().then(data => {
        ipData = data;
        finish();
    });
    
    getGPSLocation().then(data => {
        gpsData = data;
        if (gpsData && !gpsData.error) {
            Promise.all([
                getCityFromCoords(gpsData.lat, gpsData.lon),
                getStreetFromCoords(gpsData.lat, gpsData.lon)
            ]).then(([city, street]) => {
                cityData = city;
                streetData = street;
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
        getGPSLocation().then(gps => {
            if (gps && !gps.error) {
                Promise.all([
                    getCityFromCoords(gps.lat, gps.lon),
                    getStreetFromCoords(gps.lat, gps.lon)
                ]).then(([cityData, streetData]) => {
                    let result = '';
                    let geoObj = { city: 'Неизвестно', country: 'Неизвестно', lat: gps.lat, lon: gps.lon };
                    
                    let parts = [];
                    
                    if (streetData && streetData.street !== 'Неизвестно') {
                        let streetFull = streetData.street;
                        if (streetData.house) {
                            streetFull += `, ${streetData.house}`;
                        }
                        parts.push(`Улица: ${streetFull}`);
                        geoObj.street = streetFull;
                        if (streetData.postcode) {
                            parts.push(`Почтовый индекс: ${streetData.postcode}`);
                            geoObj.postcode = streetData.postcode;
                        }
                    }
                    
                    if (cityData && cityData.city !== 'Неизвестно') {
                        parts.push(`Город: ${cityData.city}`);
                        parts.push(`Регион: ${cityData.region}`);
                        parts.push(`Страна: ${cityData.country}`);
                        geoObj.city = cityData.city;
                        geoObj.region = cityData.region;
                        geoObj.country = cityData.country;
                    }
                    
                    parts.push(`GPS: ${gps.lat}, ${gps.lon}`);
                    parts.push(`Точность: ${gps.accuracy}м`);
                    
                    result = `[ГЕОЛОКАЦИЯ ПОЛЬЗОВАТЕЛЯ: ${parts.join(' | ')}]`;
                    console.log('✅ Для промта используется GPS с деталями');
                    
                    localStorage.setItem('megan_geo_data', JSON.stringify(geoObj));
                    resolve(result);
                });
                return;
            }
            
            console.log('ℹ️ GPS не доступен, используем IP для промта');
            getGeoData().then(geo => {
                let geoObj = { city: 'Неизвестно', country: 'Неизвестно' };
                if (geo) {
                    const parts = [];
                    if (geo.country && geo.country !== 'Неизвестно') {
                        parts.push(`Страна: ${geo.country}`);
                        geoObj.country = geo.country;
                    }
                    if (geo.city && geo.city !== 'Неизвестно') {
                        parts.push(`Город: ${geo.city}`);
                        geoObj.city = geo.city;
                    }
                    if (geo.region && geo.region !== 'Неизвестно') {
                        parts.push(`Регион: ${geo.region}`);
                        geoObj.region = geo.region;
                    }
                    if (geo.ip && geo.ip !== 'Неизвестно') {
                        parts.push(`IP: ${geo.ip}`);
                        geoObj.ip = geo.ip;
                    }
                    if (geo.isp && geo.isp !== 'Неизвестно') {
                        parts.push(`Провайдер: ${geo.isp}`);
                        geoObj.isp = geo.isp;
                    }
                    if (geo.postal && geo.postal !== 'Неизвестно') {
                        parts.push(`Почтовый индекс: ${geo.postal}`);
                        geoObj.postal = geo.postal;
                    }
                    
                    localStorage.setItem('megan_geo_data', JSON.stringify(geoObj));
                    resolve(`[ГЕОЛОКАЦИЯ ПОЛЬЗОВАТЕЛЯ: ${parts.join(' | ')}]`);
                } else {
                    localStorage.setItem('megan_geo_data', JSON.stringify(geoObj));
                    resolve('[ГЕОЛОКАЦИЯ: Не удалось определить]');
                }
            });
        });
    });
}

// ====== СИНХРОННАЯ ФУНКЦИЯ ПОЛУЧЕНИЯ ГЕО ======
function getGeoInfoSync() {
    try {
        const geoData = localStorage.getItem('megan_geo_data');
        if (geoData) {
            return JSON.parse(geoData);
        }
    } catch(e) {}
    return { city: 'Неизвестно', country: 'Неизвестно' };
}

// Экспорт
window.showFullLocation = showFullLocation;
window.getGeoInfoString = getGeoInfoString;
window.getGeoInfoSync = getGeoInfoSync;
window.getGeoData = getGeoData;
window.getGPSLocation = getGPSLocation;
window.getStreetFromCoords = getStreetFromCoords;

console.log('✅ geo.js загружен');