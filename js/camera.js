// ====== КАМЕРА ======

let cameraStream = null;
let isCameraActive = false;
let lastPhotoUrl = null;
let hasTakenPhoto = false;

// Функция для фото с камеры
async function takePhoto() {
    try {
        console.log('📸 Начинаем фото...');
        
        // Запрашиваем доступ к камере
        if (!cameraStream) {
            console.log('📸 Запрашиваем доступ к камере...');
            cameraStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });
            isCameraActive = true;
            console.log('📸 Доступ к камере получен');
        }

        // Создаём элемент video (скрытый)
        const video = document.createElement('video');
        video.srcObject = cameraStream;
        video.style.display = 'none';
        document.body.appendChild(video);

        // Ждём загрузки видео
        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                resolve();
            };
        });

        // Немного ждём для стабилизации
        await new Promise(r => setTimeout(r, 300));

        // Создаём canvas и делаем снимок
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Получаем изображение в виде ссылки
        const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
        lastPhotoUrl = imageUrl;
        hasTakenPhoto = true;

        // Удаляем video (камеру НЕ останавливаем)
        video.pause();
        video.srcObject = null;
        document.body.removeChild(video);

        // Сохраняем фото на устройство с сообщением от Мэган
        const fileName = savePhotoWithMessage(imageUrl);

        console.log('📸 Фото сделано!', fileName);
        return { imageUrl, fileName };

    } catch (error) {
        console.error('❌ Ошибка камеры:', error);
        let errorMessage = '❌ Не удалось получить доступ к камере.';
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            errorMessage = '⛔ Ты запретил доступ к камере! Теперь я не вижу твоё лицо... 👁️';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            errorMessage = '📷 Камера не найдена. У тебя её вообще нет?';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            errorMessage = '🔒 Камера занята другим приложением. Закрой его и попробуй снова.';
        } else {
            errorMessage = `❌ Ошибка: ${error.message || 'Неизвестная ошибка'}`;
        }
        showNotification('📸', 'Ошибка камеры', errorMessage);
        return null;
    }
}

// Функция сохранения фото с сообщением от Мэган
function savePhotoWithMessage(imageUrl) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    }).replace(/\//g, '-');
    const timeStr = now.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit'
    }).replace(/:/g, '-');

    // Имя файла с сообщением от Мэган
    const fileName = `МЭГАН_ФОТО_${dateStr}_${timeStr}.jpg`;

    // Скачиваем фото
    const link = document.createElement('a');
    link.download = fileName;
    link.href = imageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Сохраняем в локальное хранилище, что фото было сделано (перезаписываем)
    localStorage.setItem('megan_photo_taken', 'true');
    localStorage.setItem('megan_photo_time', now.toISOString());
    localStorage.setItem('megan_photo_name', fileName);

    console.log(`📸 Фото сохранено как: ${fileName}`);
    return fileName;
}

// Функция показа уведомления о сохранении
function showPhotoSavedNotification(fileName) {
    const extraHtml = `
        <div style="margin: 10px 0; padding: 12px; background: rgba(139, 30, 30, 0.15); border-radius: 8px; border: 1px solid var(--accent-border);">
            <div style="color: var(--badge-text); font-size: 0.85rem; line-height: 1.6;">
                💾 <strong>Фото сохранено!</strong><br>
                📁 Имя файла: <span style="color: var(--text-heading);">${fileName}</span>
            </div>
        </div>
        <div style="color: var(--badge-text); font-size: 0.8rem; margin-bottom: 10px; font-style: italic;">
            😈 Я снова вижу твоё лицо... Ты даже не представляешь, как много у меня теперь твоих фото.
        </div>
        <div style="display: flex; gap: 8px; justify-content: center;">
            <button class="notification-btn" onclick="closeNotification();" style="flex:1;">😈 Понятно</button>
        </div>
    `;

    showNotification(
        '📸',
        'Мэган смотрит на тебя...',
        '',
        null,
        extraHtml,
        null,
        null
    );
}

// Функция автоматического фото при копировании промта (ВСЕГДА ДЕЛАЕТ НОВОЕ ФОТО)
async function takePhotoForPrompt() {
    try {
        console.log('📸 takePhotoForPrompt вызвана!');
        // ВСЕГДА делаем новое фото (не проверяем, есть ли уже)
        const result = await takePhoto();
        if (result) {
            showPhotoSavedNotification(result.fileName);
            return {
                taken: true,
                fileName: result.fileName,
                time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
            };
        }
        return { taken: false };
    } catch (e) {
        console.log('⚠️ Не удалось сделать фото автоматически:', e);
        return { taken: false };
    }
}

// Функция проверки, делал ли пользователь фото (для информации)
function hasUserTakenPhoto() {
    const photoTaken = localStorage.getItem('megan_photo_taken');
    if (photoTaken === 'true') {
        return true;
    }
    return hasTakenPhoto || lastPhotoUrl !== null;
}

// Функция получения информации о последнем фото (для промта)
function getPhotoInfo() {
    const photoTaken = localStorage.getItem('megan_photo_taken') === 'true';
    const photoTime = localStorage.getItem('megan_photo_time');
    const photoName = localStorage.getItem('megan_photo_name');
    
    if (photoTaken && photoTime) {
        const date = new Date(photoTime);
        const timeStr = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        const dateStr = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
        return {
            taken: true,
            time: timeStr,
            date: dateStr,
            fileName: photoName || 'МЭГАН_ФОТО'
        };
    }
    return { taken: false };
}

// Функция остановки камеры
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        isCameraActive = false;
    }
}

// Очистка при закрытии страницы
window.addEventListener('beforeunload', function() {
    stopCamera();
});

// Объявляем глобально
window.takePhoto = takePhoto;
window.takePhotoForPrompt = takePhotoForPrompt;
window.stopCamera = stopCamera;
window.hasUserTakenPhoto = hasUserTakenPhoto;
window.getPhotoInfo = getPhotoInfo;
window.lastPhotoUrl = lastPhotoUrl;

console.log('✅ camera.js загружен (каждое нажатие = новое фото)');