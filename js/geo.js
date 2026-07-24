// ====== ГЕОЛОКАЦИЯ (через ipinfo.io) ======

// Функция для получения геоданных
async function getGeoData() {
    try {
        // Используем ipinfo.io - бесплатный сервис без CORS проблем
        const response = await fetch('https://ipinfo.io/json');
        const data = await response.json();
        
        if (data && data.ip) {
            return {
                country: data.country || 'Неизвестно',
                city: data.city || 'Неизвестно',
                region: data.region || 'Неизвестно',
                isp: data.org || 'Неизвестно',
                timezone: data.timezone || 'Неизвестно',
                ip: data.ip || 'Неизвестно',
                location: data.loc || 'Неизвестно', // Широта/Долгота
                isHosting: false,
                isProxy: false,
                isMobile: false
            };
        } else {
            // Если первый не сработал, пробуем запасной вариант
            return await getGeoDataFallback();
        }
    } catch (error) {
        console.error('Ошибка получения геоданных:', error);
        return await getGeoDataFallback();
    }
}

// Функция-запасной вариант (через ip-api.com с HTTPS)
async function getGeoDataFallback() {
    try {
        const response = await fetch('https://ip-api.com/json/?fields=status,country,city,region,isp,timezone,hosting,proxy,mobile,query');
        const data = await response.json();
        
        if (data && data.status === 'success') {
            return {
                country: data.country || 'Неизвестно',
                city: data.city || 'Неизвестно',
                region: data.region || 'Неизвестно',
                isp: data.isp || 'Неизвестно',
                timezone: data.timezone || 'Неизвестно',
                ip: data.query || 'Неизвестно',
                isHosting: data.hosting || false,
                isProxy: data.proxy || false,
                isMobile: data.mobile || false
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Ошибка получения геоданных (fallback):', error);
        return null;
    }
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
                'Не удалось определить твоё местоположение.\n\nЭто может быть связано с:\n• Использованием VPN/прокси\n• Блокировкой запросов браузером\n• Ограничениями в твоей стране\n\n📌 Попробуй использовать другой браузер или отключить VPN.',
                null,
                '',
                'Понятно',
                closeNotification
            );
        }
    });
}