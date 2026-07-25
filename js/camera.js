// ====== КАМЕРА (С ПОДДЕРЖКОЙ I18N) ======

let cameraStream = null;
let isCameraActive = false;
let lastPhotoUrl = null;
let hasTakenPhoto = false;
let photoNotificationActive = false;
let cameraAvailable = true;

// Проверка доступности камеры
async function checkCameraAvailability() {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            console.log('📷 MediaDevices не поддерживается');
            return false;
        }
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        
        if (!hasCamera) {
            console.log('📷 Камера не найдена на устройстве');
            return false;
        }
        
        try {
            const testStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user' } 
            });
            testStream.getTracks().forEach(track => track.stop());
            console.log('📷 Камера доступна и разрешена');
            return true;
        } catch (e) {
            if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
                console.log('📷 Доступ к камере запрещён пользователем');
            } else if (e.name === 'NotFoundError') {
                console.log('📷 Камера не найдена');
            } else {
                console.log('📷 Ошибка доступа к камере:', e.message);
            }
            return false;
        }
    } catch (e) {
        console.log('📷 Ошибка проверки камеры:', e.message);
        return false;
    }
}

// Функция для фото с камеры
async function takePhoto() {
    try {
        console.log('📸 Начинаем фото...');
        
        const available = await checkCameraAvailability();
        if (!available) {
            console.log('📸 Камера недоступна, фото не делаем');
            cameraAvailable = false;
            return null;
        }
        cameraAvailable = true;
        
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

        const video = document.createElement('video');
        video.srcObject = cameraStream;
        video.style.display = 'none';
        document.body.appendChild(video);

        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                resolve();
            };
        });

        await new Promise(r => setTimeout(r, 300));

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
        lastPhotoUrl = imageUrl;
        hasTakenPhoto = true;

        video.pause();
        video.srcObject = null;
        document.body.removeChild(video);

        const fileName = savePhotoWithMessage(imageUrl);

        console.log('📸 Фото сделано!', fileName);
        return { imageUrl, fileName };

    } catch (error) {
        console.error('❌ Ошибка камеры:', error);
        cameraAvailable = false;
        
        const lang = getCurrentLanguage();
        let errorMessage = lang === 'ru' 
            ? '❌ Не удалось получить доступ к камере.'
            : '❌ Failed to access camera.';
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            errorMessage = lang === 'ru' 
                ? '⛔ Ты запретил доступ к камере! Теперь я не вижу твоё лицо... 👁️'
                : '⛔ You denied camera access! Now I can\'t see your face... 👁️';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            errorMessage = lang === 'ru' 
                ? '📷 Камера не найдена. У тебя её вообще нет?'
                : '📷 Camera not found. Do you even have one?';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            errorMessage = lang === 'ru' 
                ? '🔒 Камера занята другим приложением. Закрой его и попробуй снова.'
                : '🔒 Camera is busy with another app. Close it and try again.';
        } else {
            errorMessage = `❌ ${error.message || (lang === 'ru' ? 'Неизвестная ошибка' : 'Unknown error')}`;
        }
        
        showNotification('📸', lang === 'ru' ? 'Ошибка камеры' : 'Camera Error', errorMessage);
        return null;
    }
}

// Функция сохранения фото
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

    const fileName = `МЭГАН_ФОТО_${dateStr}_${timeStr}.jpg`;

    const link = document.createElement('a');
    link.download = fileName;
    link.href = imageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    localStorage.setItem('megan_photo_taken', 'true');
    localStorage.setItem('megan_photo_time', now.toISOString());
    localStorage.setItem('megan_photo_name', fileName);

    console.log(`📸 Фото сохранено как: ${fileName}`);
    return fileName;
}

// ====== ФУНКЦИЯ ПОКАЗА УВЕДОМЛЕНИЯ О СОХРАНЕНИИ ФОТО (С ПЕРЕВОДОМ) ======
function showPhotoSavedNotification(fileName, onCloseCallback) {
    photoNotificationActive = true;
    
    const lang = getCurrentLanguage();
    const title = lang === 'ru' ? 'Мэган смотрит на тебя...' : 'Megan is watching you...';
    const savedText = lang === 'ru' ? '💾 Фото сохранено!' : '💾 Photo saved!';
    const fileNameLabel = lang === 'ru' ? '📁 Имя файла:' : '📁 File name:';
    const creepyText = lang === 'ru' 
        ? '😈 Я снова вижу твоё лицо... Ты даже не представляешь, как много у меня теперь твоих фото.'
        : '😈 I see your face again... You have no idea how many of your photos I have now.';
    const btnText = lang === 'ru' ? '😈 Понятно' : '😈 Got it';
    
    const extraHtml = `
        <div style="margin: 10px 0; padding: 12px; background: rgba(139, 30, 30, 0.15); border-radius: 8px; border: 1px solid var(--accent-border);">
            <div style="color: var(--badge-text); font-size: 0.85rem; line-height: 1.6;">
                ${savedText}<br>
                ${fileNameLabel} <span style="color: var(--text-heading);">${fileName}</span>
            </div>
        </div>
        <div style="color: var(--badge-text); font-size: 0.8rem; margin-bottom: 10px; font-style: italic;">
            ${creepyText}
        </div>
        <div style="display: flex; gap: 8px; justify-content: center;">
            <button class="notification-btn" onclick="closePhotoNotification();" style="flex:1;">${btnText}</button>
        </div>
    `;

    showNotification(
        '📸',
        title,
        '',
        null,
        extraHtml,
        null,
        null
    );
    
    window._photoCloseCallback = onCloseCallback || null;
}

// Функция закрытия уведомления о фото
function closePhotoNotification() {
    photoNotificationActive = false;
    closeNotification();
    
    if (typeof window._photoCloseCallback === 'function') {
        const callback = window._photoCloseCallback;
        window._photoCloseCallback = null;
        setTimeout(callback, 100);
    }
}

// Функция автоматического фото при копировании промта
async function takePhotoForPrompt(silent = false) {
    try {
        console.log('📸 takePhotoForPrompt вызвана!');
        
        const available = await checkCameraAvailability();
        if (!available) {
            console.log('📸 Камера недоступна, пропускаем фото');
            cameraAvailable = false;
            localStorage.setItem('megan_photo_taken', 'false');
            return { taken: false, error: 'Камера недоступна' };
        }
        
        const result = await takePhoto();
        if (result) {
            return {
                taken: true,
                fileName: result.fileName,
                time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
            };
        }
        localStorage.setItem('megan_photo_taken', 'false');
        return { taken: false };
    } catch (e) {
        console.log('⚠️ Не удалось сделать фото автоматически:', e);
        localStorage.setItem('megan_photo_taken', 'false');
        return { taken: false };
    }
}

// Функция получения информации о последнем фото
function getPhotoInfo() {
    const photoTaken = localStorage.getItem('megan_photo_taken') === 'true';
    const photoTime = localStorage.getItem('megan_photo_time');
    const photoName = localStorage.getItem('megan_photo_name');
    
    if (cameraAvailable === false) {
        return { taken: false };
    }
    
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

function isCameraAvailable() {
    return cameraAvailable;
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        isCameraActive = false;
    }
}

window.addEventListener('beforeunload', function() {
    stopCamera();
});

// Экспорт
window.takePhoto = takePhoto;
window.takePhotoForPrompt = takePhotoForPrompt;
window.stopCamera = stopCamera;
window.getPhotoInfo = getPhotoInfo;
window.closePhotoNotification = closePhotoNotification;
window.showPhotoSavedNotification = showPhotoSavedNotification;
window.checkCameraAvailability = checkCameraAvailability;
window.isCameraAvailable = isCameraAvailable;
window.lastPhotoUrl = lastPhotoUrl;
window.cameraAvailable = cameraAvailable;

console.log('✅ camera.js загружен');