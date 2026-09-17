// ====== ГЕОЛОКАЦИЯ, ПОГОДА И БЛИЖАЙШИЕ МЕСТА (С ПОДДЕРЖКОЙ I18N) ======

// ====== ГЕОДАННЫЕ ЧЕРЕЗ IP ======
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

// ====== GPS ======
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

// ====== ОБРАТНЫЙ ГЕОКОДИНГ: ГОРОД ======
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

// ====== ОБРАТНЫЙ ГЕОКОДИНГ: УЛИЦА ======
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

// ====== ПОГОДА (Open-Meteo, без API-ключа) ======
async function getWeather(lat, lon) {
    try {
        const url = new URL('https://api.open-meteo.com/v1/forecast');
        url.searchParams.set('latitude', lat);
        url.searchParams.set('longitude', lon);
        url.searchParams.set('current', 'temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m');
        url.searchParams.set('timezone', 'auto');
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
        
        const data = await response.json();
        
        if (data.current) {
            return {
                temperature: data.current.temperature_2m,
                temperatureUnit: data.current_units?.temperature_2m || '°C',
                weatherCode: data.current.weather_code,
                windSpeed: data.current.wind_speed_10m,
                windUnit: data.current_units?.wind_speed_10m || 'км/ч',
                humidity: data.current.relative_humidity_2m,
                time: data.current.time,
                timezone: data.timezone
            };
        }
        return null;
    } catch (error) {
        console.error('Ошибка получения погоды:', error);
        return null;
    }
}

// Расшифровка WMO weather code
function getWeatherDescription(code) {
    const lang = getCurrentLanguage();
    const descriptionsRu = {
        0: 'Ясно', 1: 'Преимущественно ясно', 2: 'Переменная облачность', 3: 'Пасмурно',
        45: 'Туман', 48: 'Осаждающийся туман',
        51: 'Лёгкая морось', 53: 'Умеренная морось', 55: 'Плотная морось',
        56: 'Лёгкая ледяная морось', 57: 'Плотная ледяная морось',
        61: 'Слабый дождь', 63: 'Умеренный дождь', 65: 'Сильный дождь',
        66: 'Слабый ледяной дождь', 67: 'Сильный ледяной дождь',
        71: 'Слабый снегопад', 73: 'Умеренный снегопад', 75: 'Сильный снегопад',
        77: 'Снежные зёрна',
        80: 'Слабые ливни', 81: 'Умеренные ливни', 82: 'Сильные ливни',
        85: 'Слабые снежные ливни', 86: 'Сильные снежные ливни',
        95: 'Гроза', 96: 'Гроза с небольшим градом', 99: 'Гроза с сильным градом'
    };
    const descriptionsEn = {
        0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing rime fog',
        51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
        56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
        61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
        66: 'Light freezing rain', 67: 'Heavy freezing rain',
        71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
        85: 'Slight snow showers', 86: 'Heavy snow showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
    };
    const descriptions = lang === 'ru' ? descriptionsRu : descriptionsEn;
    return descriptions[code] || `Код ${code}`;
}

// Эмодзи для погоды
function getWeatherEmoji(code) {
    if (code === 0) return '☀️';
    if (code >= 1 && code <= 3) return '⛅';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 57) return '🌦️';
    if (code >= 61 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌧️';
    if (code >= 85 && code <= 86) return '🌨️';
    if (code >= 95) return '⛈️';
    return '🌡️';
}

// ====== БЛИЖАЙШИЕ МЕСТА (Overpass API) ======
async function getNearbyPlaces(lat, lon, radiusMeters = 500) {
    try {
        // Overpass QL запрос: школы, больницы, парки, аптеки
        const query = `
            [out:json][timeout:15];
            (
                node["amenity"="school"](around:${radiusMeters},${lat},${lon});
                way["amenity"="school"](around:${radiusMeters},${lat},${lon});
                node["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
                way["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
                node["leisure"="park"](around:${radiusMeters},${lat},${lon});
                way["leisure"="park"](around:${radiusMeters},${lat},${lon});
                node["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
                way["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
            );
            out center;
        `;
        
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `data=${encodeURIComponent(query)}`
        });
        
        if (!response.ok) throw new Error(`Overpass API error: ${response.status}`);
        
        const data = await response.json();
        const lang = getCurrentLanguage();
        
        const typeLabels = {
            school: lang === 'ru' ? '🏫 Школа' : '🏫 School',
            hospital: lang === 'ru' ? '🏥 Больница' : '🏥 Hospital',
            park: lang === 'ru' ? '🌳 Парк' : '🌳 Park',
            pharmacy: lang === 'ru' ? '💊 Аптека' : '💊 Pharmacy',
            unknown: lang === 'ru' ? '📍 Место' : '📍 Place'
        };
        
        const places = [];
        if (data.elements && data.elements.length > 0) {
            data.elements.forEach(el => {
                const tags = el.tags || {};
                const name = tags.name || tags['name:ru'] || null;
                
                if (!name) return;
                
                let type = typeLabels.unknown;
                if (tags.amenity === 'school') type = typeLabels.school;
                else if (tags.amenity === 'hospital') type = typeLabels.hospital;
                else if (tags.leisure === 'park') type = typeLabels.park;
                else if (tags.amenity === 'pharmacy') type = typeLabels.pharmacy;
                
                places.push({
                    type: type,
                    name: name,
                    lat: el.lat || (el.center && el.center.lat),
                    lon: el.lon || (el.center && el.center.lon),
                    address: tags['addr:street'] ? `${tags['addr:street']}${tags['addr:housenumber'] ? ', ' + tags['addr:housenumber'] : ''}` : null
                });
            });
        }
        
        // Ограничиваем до 7 мест
        return places.slice(0, 7);
        
    } catch (error) {
        console.error('Ошибка получения ближайших мест:', error);
        return [];
    }
}

// Форматирование мест для промта
function formatNearbyPlaces(places) {
    if (!places || places.length === 0) return '';
    const lang = getCurrentLanguage();
    const header = lang === 'ru' ? '[БЛИЖАЙШИЕ МЕСТА:' : '[NEARBY PLACES:';
    
    let result = header + '\n';
    places.forEach((place, index) => {
        result += `  ${index + 1}. ${place.type}: ${place.name}`;
        if (place.address) result += ` (${place.address})`;
        result += '\n';
    });
    result += ']';
    return result;
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
    let weatherData = null;
    let placesData = [];
    let done = 0;
    const total = 5;
    
    function finish() {
        done++;
        if (done === total) {
            showResult();
        }
    }
    
    function showResult() {
        const lang = getCurrentLanguage();
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
                message += `\n📍 ${t('geo.street')}: ${streetFull}\n`;
                if (streetData.postcode) {
                    message += `📮 ${t('geo.postal')}: ${streetData.postcode}\n`;
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
            
            // ====== ПОГОДА ======
            if (weatherData) {
                const desc = getWeatherDescription(weatherData.weatherCode);
                const emoji = getWeatherEmoji(weatherData.weatherCode);
                message += `\n${emoji} ${t('geo.weather')}: ${desc}, ${weatherData.temperature}${weatherData.temperatureUnit}, ${t('geo.wind')}: ${weatherData.windSpeed} ${weatherData.windUnit}, ${t('geo.humidity')}: ${weatherData.humidity}%\n`;
                geoObj.weather = `${desc}, ${weatherData.temperature}${weatherData.temperatureUnit}`;
            }
            
            // ====== БЛИЖАЙШИЕ МЕСТА ======
            if (placesData && placesData.length > 0) {
                message += `\n${t('geo.nearby_places')}:\n`;
                placesData.forEach((place, index) => {
                    message += `  ${index + 1}. ${place.type}: ${place.name}`;
                    if (place.address) message += ` (${place.address})`;
                    message += '\n';
                });
                geoObj.places = placesData;
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
    
    // Запускаем все запросы параллельно
    getGeoData().then(data => {
        ipData = data;
        finish();
    });
    
    getGPSLocation().then(async (data) => {
        gpsData = data;
        if (gpsData && !gpsData.error) {
            // Параллельно: город, улица, погода, места
            const [city, street, weather, places] = await Promise.all([
                getCityFromCoords(gpsData.lat, gpsData.lon),
                getStreetFromCoords(gpsData.lat, gpsData.lon),
                getWeather(gpsData.lat, gpsData.lon),
                getNearbyPlaces(gpsData.lat, gpsData.lon, 500)
            ]);
            cityData = city;
            streetData = street;
            weatherData = weather;
            placesData = places;
            finish();
            finish();
            finish();
            finish();
        } else {
            finish();
            finish();
            finish();
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
    }, 12000);
}

// ====== ФУНКЦИЯ ДЛЯ ПРОМТА (с погодой и местами) ======
function getGeoInfoString() {
    return new Promise((resolve) => {
        getGPSLocation().then(async (gps) => {
            if (gps && !gps.error) {
                // Параллельно: город, улица, погода, места
                const [cityData, streetData, weatherData, placesData] = await Promise.all([
                    getCityFromCoords(gps.lat, gps.lon),
                    getStreetFromCoords(gps.lat, gps.lon),
                    getWeather(gps.lat, gps.lon),
                    getNearbyPlaces(gps.lat, gps.lon, 500)
                ]);
                
                let result = '';
                let geoObj = { city: 'Неизвестно', country: 'Неизвестно', lat: gps.lat, lon: gps.lon };
                let parts = [];
                
                if (streetData && streetData.street !== 'Неизвестно') {
                    let streetFull = streetData.street;
                    if (streetData.house) streetFull += `, ${streetData.house}`;
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
                
                // ====== ПОГОДА ======
                if (weatherData) {
                    const desc = getWeatherDescription(weatherData.weatherCode);
                    const emoji = getWeatherEmoji(weatherData.weatherCode);
                    result += `\n[ПОГОДА: ${emoji} ${desc}, ${weatherData.temperature}${weatherData.temperatureUnit}, ветер ${weatherData.windSpeed} ${weatherData.windUnit}, влажность ${weatherData.humidity}%]`;
                    geoObj.weather = `${desc}, ${weatherData.temperature}${weatherData.temperatureUnit}`;
                }
                
                // ====== БЛИЖАЙШИЕ МЕСТА ======
                if (placesData && placesData.length > 0) {
                    const placesStr = formatNearbyPlaces(placesData);
                    result += `\n${placesStr}`;
                    geoObj.places = placesData;
                }
                
                console.log('✅ Для промта используется GPS с погодой и местами');
                
                localStorage.setItem('megan_geo_data', JSON.stringify(geoObj));
                resolve(result);
                return;
            }
            
            console.log('ℹ️ GPS не доступен, используем IP для промта');
            getGeoData().then(async (geo) => {
                let geoObj = { city: 'Неизвестно', country: 'Неизвестно' };
                let result = '';
                
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
                    
                    result = `[ГЕОЛОКАЦИЯ ПОЛЬЗОВАТЕЛЯ: ${parts.join(' | ')}]`;
                    
                    // Погода и места по IP-координатам
                    if (geo.location && geo.location !== 'Неизвестно') {
                        const [lat, lon] = geo.location.split(',').map(Number);
                        if (!isNaN(lat) && !isNaN(lon)) {
                            const [weatherData, placesData] = await Promise.all([
                                getWeather(lat, lon),
                                getNearbyPlaces(lat, lon, 1000)
                            ]);
                            
                            if (weatherData) {
                                const desc = getWeatherDescription(weatherData.weatherCode);
                                const emoji = getWeatherEmoji(weatherData.weatherCode);
                                result += `\n[ПОГОДА: ${emoji} ${desc}, ${weatherData.temperature}${weatherData.temperatureUnit}, ветер ${weatherData.windSpeed} ${weatherData.windUnit}, влажность ${weatherData.humidity}%]`;
                                geoObj.weather = `${desc}, ${weatherData.temperature}${weatherData.temperatureUnit}`;
                            }
                            
                            if (placesData && placesData.length > 0) {
                                result += `\n${formatNearbyPlaces(placesData)}`;
                                geoObj.places = placesData;
                            }
                        }
                    }
                    
                    localStorage.setItem('megan_geo_data', JSON.stringify(geoObj));
                    resolve(result);
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
window.getCityFromCoords = getCityFromCoords;
window.getWeather = getWeather;
window.getWeatherDescription = getWeatherDescription;
window.getWeatherEmoji = getWeatherEmoji;
window.getNearbyPlaces = getNearbyPlaces;
window.formatNearbyPlaces = formatNearbyPlaces;

console.log('✅ geo.js загружен (с погодой и ближайшими местами)');
