// ====== РЕДАКТОР ДОСЬЕ (С ПУСТЫМ ШАБЛОНОМ) ======

// ШАБЛОН ДОСЬЕ (ПУСТОЙ — ТОЛЬКО СТРУКТУРА)
const DOSSIER_TEMPLATE = `═══════════════════════════════════════
         📋 ДОСЬЕ ЖЕРТВЫ №[НОМЕР]
═══════════════════════════════════════
👤 ИМЯ: 
🎂 ВОЗРАСТ: 
📍 МЕСТОПОЛОЖЕНИЕ: 
⏱️ ДАТА ПОСЛЕДНЕГО ОБЩЕНИЯ: 
⏱️ ТЕКУЩЕЕ ВРЕМЯ: 
📊 СТАТУС: 
═══════════════════════════════════════
🧠 ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ:

═══════════════════════════════════════
👻 ФОБИИ:

═══════════════════════════════════════
🔪 ТРИГГЕРЫ:

═══════════════════════════════════════
📜 ИСТОРИЯ ПОВЕДЕНИЯ:

═══════════════════════════════════════
⚠️ СТЕПЕНЬ УГРОЗЫ: 
═══════════════════════════════════════
🎭 НАСТРОЕНИЕ МЭГАН: 
═══════════════════════════════════════
💀 ЗАМЕТКИ МЭГАН:

═══════════════════════════════════════`;

function openProfileModal() {
    let savedDossier = localStorage.getItem('megan_dossier_text');
    if (!savedDossier) {
        savedDossier = DOSSIER_TEMPLATE;
    }
    
    const extraHtml = `
        <div class="editor-workspace" style="display: flex; flex-direction: column; gap: 12px;">
            <div class="panel-box" style="grid-column: 1 / -1;">
                <div class="panel-title">📝 ${t('dossier.title')}</div>
                <div class="form-group">
                    <label>📋 ${t('dossier.text') || 'Текст досье'}</label>
                    <textarea id="edDossierText" placeholder="${t('dossier.placeholder') || 'Введите текст досье...'}" style="min-height: 400px; font-size: 0.72rem; line-height: 1.6; font-family: 'Courier New', monospace; background: #0a0a0a; color: var(--prompt-text); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 12px; width: 100%; resize: vertical; white-space: pre-wrap;">${savedDossier}</textarea>
                </div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px;">
                    <button class="action-btn copy-btn" style="padding:8px 16px; font-size:0.7rem; min-height:36px; flex:1;" onclick="saveDossierText()">💾 ${t('dossier.save')}</button>
                    <button class="action-btn geo-btn" style="padding:8px 16px; font-size:0.7rem; min-height:36px; flex:1;" onclick="loadCurrentLocationToDossier()">📍 ${t('buttons.geo')}</button>
                    <button class="action-btn info-btn" style="padding:8px 16px; font-size:0.7rem; min-height:36px; flex:1;" onclick="resetDossierToTemplate()">🔄 ${t('dossier.reset')}</button>
                    <button class="action-btn profile-btn" style="padding:8px 16px; font-size:0.7rem; min-height:36px; flex:1;" onclick="copyDossierText()">📋 ${t('copy.btn')}</button>
                </div>
                <div id="dossierStatus" style="margin-top:8px; padding:8px; border-radius:6px; display:none; font-size:0.75rem;"></div>
            </div>
            <div class="panel-box" style="grid-column: 1 / -1; background: rgba(0,0,0,0.2); border-color: var(--accent-border);">
                <div class="panel-title">📖 ${t('dossier.example') || 'Шаблон досье'}</div>
                <div style="font-size: 0.6rem; color: var(--text-sub); line-height: 1.5; white-space: pre-wrap; font-family: 'Courier New', monospace; padding: 8px; background: rgba(0,0,0,0.3); border-radius: 4px; max-height: 180px; overflow-y: auto;">
${DOSSIER_TEMPLATE}
                </div>
            </div>
        </div>
        <div class="btn-row-modal">
            <button class="notification-btn back-btn" onclick="closeNotification()">⬅️ ${t('about.close')}</button>
        </div>
    `;

    showNotification(
        '🗂️',
        t('dossier.title'),
        '',
        null,
        extraHtml,
        null,
        null
    );
}

// ====== СОХРАНЕНИЕ ТЕКСТА ДОСЬЕ ======
function saveDossierText() {
    const textarea = document.getElementById('edDossierText');
    const statusEl = document.getElementById('dossierStatus');
    
    if (!textarea) return;
    
    const text = textarea.value.trim();
    
    if (!text) {
        if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.opacity = '1';
            statusEl.style.background = 'rgba(194, 21, 21, 0.15)';
            statusEl.style.border = '1px solid #c21515';
            statusEl.style.color = '#eba4a4';
            statusEl.innerHTML = '😈 Досье пустое! Напиши что-нибудь... 🖤';
            setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 3000);
        }
        return;
    }
    
    localStorage.setItem('megan_dossier_text', text);
    
    if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.opacity = '1';
        statusEl.style.background = 'rgba(30, 184, 30, 0.12)';
        statusEl.style.border = '1px solid #1eb81e';
        statusEl.style.color = '#8ad8a8';
        statusEl.innerHTML = '✅ Досье сохранено! 😈';
        setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 3000);
    }
}

// ====== СБРОС К ШАБЛОНУ ======
function resetDossierToTemplate() {
    const textarea = document.getElementById('edDossierText');
    const statusEl = document.getElementById('dossierStatus');
    
    if (!textarea) return;
    
    if (confirm(t('dossier.confirm_clear') || 'Сбросить досье к шаблону?')) {
        textarea.value = DOSSIER_TEMPLATE;
        localStorage.setItem('megan_dossier_text', DOSSIER_TEMPLATE);
        
        if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.opacity = '1';
            statusEl.style.background = 'rgba(30, 150, 255, 0.12)';
            statusEl.style.border = '1px solid #1e7cb8';
            statusEl.style.color = '#8ad0d8';
            statusEl.innerHTML = '🔄 Шаблон восстановлен! 📋';
            setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 3000);
        }
    }
}

// ====== ЗАГРУЗКА ГЕО В ДОСЬЕ (ИСПРАВЛЕННАЯ — БЕЗ МУСОРА) ======
function loadCurrentLocationToDossier() {
    const textarea = document.getElementById('edDossierText');
    const statusEl = document.getElementById('dossierStatus');
    
    if (!textarea) return;
    
    if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.opacity = '1';
        statusEl.style.background = 'rgba(30, 150, 255, 0.12)';
        statusEl.style.border = '1px solid #1e7cb8';
        statusEl.style.color = '#8ad0d8';
        statusEl.innerHTML = '⏳ Получение геоданных...';
    }
    
    getGeoData().then(ipData => {
        getGPSLocation().then(gpsData => {
            let geoText = '';
            let city = 'Неизвестно';
            let country = 'Неизвестно';
            let region = 'Неизвестно';
            
            if (gpsData && !gpsData.error) {
                getCityFromCoords(gpsData.lat, gpsData.lon).then(cityData => {
                    if (cityData && cityData.city !== 'Неизвестно') {
                        city = cityData.city;
                        region = cityData.region;
                        country = cityData.country;
                        geoText = `${city}, ${region}, ${country}`;
                    } else {
                        geoText = `GPS: ${gpsData.lat}, ${gpsData.lon}`;
                    }
                    
                    // ОБНОВЛЯЕМ ТОЛЬКО СТРОКУ МЕСТОПОЛОЖЕНИЕ
                    let currentText = textarea.value;
                    
                    // Удаляем мусорные строки (если они появились)
                    currentText = currentText
                        .replace(/^ЕНВЕ\s*$/m, '')
                        .replace(/^ГОРОД\s*$/m, '')
                        .replace(/^НЕ ОПРЕДЕЛЕНО\s*$/m, '')
                        .replace(/^не определено\s*$/m, '')
                        .replace(/^КООРДИНАТЫ\s*$/m, '')
                        .replace(/^\d+\.\d+\s*$/m, '')
                        .replace(/\n{3,}/g, '\n\n'); // убираем лишние пустые строки
                    
                    // Обновляем местоположение
                    if (currentText.includes('📍 МЕСТОПОЛОЖЕНИЕ:')) {
                        currentText = currentText.replace(
                            /📍 МЕСТОПОЛОЖЕНИЕ:.*$/m,
                            `📍 МЕСТОПОЛОЖЕНИЕ: ${geoText}`
                        );
                    } else {
                        currentText = currentText.replace(
                            /(🎂 ВОЗРАСТ:.*)$/m,
                            `$1\n📍 МЕСТОПОЛОЖЕНИЕ: ${geoText}`
                        );
                    }
                    
                    // Обновляем время
                    const now = new Date();
                    const timeStr = now.toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    
                    currentText = currentText
                        .replace(/⏱️ ДАТА ПОСЛЕДНЕГО ОБЩЕНИЯ:.*$/m, `⏱️ ДАТА ПОСЛЕДНЕГО ОБЩЕНИЯ: ${timeStr}`)
                        .replace(/⏱️ ТЕКУЩЕЕ ВРЕМЯ:.*$/m, `⏱️ ТЕКУЩЕЕ ВРЕМЯ: ${timeStr}`);
                    
                    textarea.value = currentText;
                    saveDossierText();
                    
                    if (statusEl) {
                        statusEl.style.background = 'rgba(30, 184, 30, 0.12)';
                        statusEl.style.border = '1px solid #1eb81e';
                        statusEl.style.color = '#8ad8a8';
                        statusEl.innerHTML = `✅ Геоданные обновлены: ${geoText} 🖤`;
                        setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 3000);
                    }
                });
            } else if (ipData && ipData.country !== 'Неизвестно') {
                city = ipData.city || 'Неизвестно';
                country = ipData.country || 'Неизвестно';
                region = ipData.region || 'Неизвестно';
                geoText = `${city}, ${region}, ${country}`;
                
                let currentText = textarea.value;
                
                // Удаляем мусорные строки
                currentText = currentText
                    .replace(/^ЕНВЕ\s*$/m, '')
                    .replace(/^ГОРОД\s*$/m, '')
                    .replace(/^НЕ ОПРЕДЕЛЕНО\s*$/m, '')
                    .replace(/^не определено\s*$/m, '')
                    .replace(/^КООРДИНАТЫ\s*$/m, '')
                    .replace(/^\d+\.\d+\s*$/m, '')
                    .replace(/\n{3,}/g, '\n\n');
                
                if (currentText.includes('📍 МЕСТОПОЛОЖЕНИЕ:')) {
                    currentText = currentText.replace(
                        /📍 МЕСТОПОЛОЖЕНИЕ:.*$/m,
                        `📍 МЕСТОПОЛОЖЕНИЕ: ${geoText}`
                    );
                } else {
                    currentText = currentText.replace(
                        /(🎂 ВОЗРАСТ:.*)$/m,
                        `$1\n📍 МЕСТОПОЛОЖЕНИЕ: ${geoText}`
                    );
                }
                
                const now = new Date();
                const timeStr = now.toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                currentText = currentText
                    .replace(/⏱️ ДАТА ПОСЛЕДНЕГО ОБЩЕНИЯ:.*$/m, `⏱️ ДАТА ПОСЛЕДНЕГО ОБЩЕНИЯ: ${timeStr}`)
                    .replace(/⏱️ ТЕКУЩЕЕ ВРЕМЯ:.*$/m, `⏱️ ТЕКУЩЕЕ ВРЕМЯ: ${timeStr}`);
                
                textarea.value = currentText;
                saveDossierText();
                
                if (statusEl) {
                    statusEl.style.background = 'rgba(30, 184, 30, 0.12)';
                    statusEl.style.border = '1px solid #1eb81e';
                    statusEl.style.color = '#8ad8a8';
                    statusEl.innerHTML = `✅ Геоданные обновлены (IP): ${geoText} 🖤`;
                    setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 3000);
                }
            } else {
                if (statusEl) {
                    statusEl.style.background = 'rgba(194, 21, 21, 0.15)';
                    statusEl.style.border = '1px solid #c21515';
                    statusEl.style.color = '#eba4a4';
                    statusEl.innerHTML = '❌ Не удалось получить геоданные. 😈';
                    setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 3000);
                }
            }
        });
    }).catch(() => {
        if (statusEl) {
            statusEl.style.background = 'rgba(194, 21, 21, 0.15)';
            statusEl.style.border = '1px solid #c21515';
            statusEl.style.color = '#eba4a4';
            statusEl.innerHTML = '❌ Ошибка получения геоданных. Проверь интернет. 😈';
            setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 3000);
        }
    });
}

// ====== КОПИРОВАНИЕ ДОСЬЕ ======
function copyDossierText() {
    const textarea = document.getElementById('edDossierText');
    const statusEl = document.getElementById('dossierStatus');
    
    if (!textarea) return;
    
    const text = textarea.value.trim();
    
    if (!text) {
        if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.opacity = '1';
            statusEl.style.background = 'rgba(194, 21, 21, 0.15)';
            statusEl.style.border = '1px solid #c21515';
            statusEl.style.color = '#eba4a4';
            statusEl.innerHTML = '😈 Досье пустое! Напиши что-нибудь. 🖤';
            setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 3000);
        }
        return;
    }
    
    const fullPayload = `профиль \`\`\`\n${text}\n\`\`\``;
    
    navigator.clipboard.writeText(fullPayload).then(() => {
        if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.opacity = '1';
            statusEl.style.background = 'rgba(30, 184, 30, 0.12)';
            statusEl.style.border = '1px solid #1eb81e';
            statusEl.style.color = '#8ad8a8';
            statusEl.innerHTML = '✅ Досье скопировано! Вставь его в чат. 😈';
            setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 3000);
        }
    }).catch(() => {
        if (statusEl) {
            statusEl.style.background = 'rgba(194, 21, 21, 0.15)';
            statusEl.style.border = '1px solid #c21515';
            statusEl.style.color = '#eba4a4';
            statusEl.innerHTML = '❌ Ошибка копирования. Попробуй ещё раз. 💀';
            setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 3000);
        }
    });
}

// Экспорт
window.openProfileModal = openProfileModal;
window.saveDossierText = saveDossierText;
window.resetDossierToTemplate = resetDossierToTemplate;
window.loadCurrentLocationToDossier = loadCurrentLocationToDossier;
window.copyDossierText = copyDossierText;