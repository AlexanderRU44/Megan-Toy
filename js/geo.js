// ====== ГЕОЛОКАЦИЯ ======

// Функция для получения геоданных
async function getGeoData() {
    try {
        // Используем бесплатный API ip-api.com
        const response = await fetch('https://ip-api.com/json/?fields=status,country,city,region,isp,timezone,hosting,proxy,mobile,query');
        const data = await response.json();
        
        if (data.status === 'success') {
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
        console.error('Ошибка получения геоданных:', error);
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
                
                // Определяем тип подключения
                if (geo.isHosting) parts.push('⚠️ Обнаружен хостинг/сервер');
                if (geo.isProxy) parts.push('⚠️ Обнаружен прокси/VPN');
                if (geo.isMobile) parts.push('📱 Мобильное подключение');
                
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
        if (geo) {
            let message = `📍 Твои геоданные:\n\n`;
            message += `🌍 Страна: ${geo.country}\n`;
            message += `🏙️ Город: ${geo.city}\n`;
            message += `🗺️ Регион: ${geo.region}\n`;
            message += `📡 Провайдер: ${geo.isp}\n`;
            message += `🕐 Часовой пояс: ${geo.timezone}\n`;
            message += `🔢 IP: ${geo.ip}\n\n`;
            
            if (geo.isHosting) message += '⚠️ Ты используешь хостинг/сервер\n';
            if (geo.isProxy) message += '⚠️ Ты используешь прокси/VPN\n';
            if (geo.isMobile) message += '📱 Ты с мобильного устройства\n';
            
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
                '❌',
                'Ошибка геолокации',
                'Не удалось определить твоё местоположение. Возможно, ты слишком хорошо прячешься... 👻',
                null,
                '',
                'Понятно',
                closeNotification
            );
        }
    });
}