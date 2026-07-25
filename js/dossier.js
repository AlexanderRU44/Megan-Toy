// ====== РЕДАКТОР ПРОФИЛЯ (С ОТДЕЛЬНЫМИ ПОЛЯМИ) ======

function openProfileModal() {
    // Загружаем сохранённые данные
    const savedData = JSON.parse(localStorage.getItem('megan_dossier_data') || '{}');
    
    const name = savedData.name || '';
    const aliases = savedData.aliases || '';
    const number = savedData.number || '';
    const city = savedData.city || '';
    const country = savedData.country || '';
    const street = savedData.street || '';
    const age = savedData.age || '';
    const status = savedData.status || '';
    const threat = savedData.threat || '';
    const behavior = savedData.behavior || '';
    const history = savedData.history || '';
    const phobias = savedData.phobias || '';
    const triggers = savedData.triggers || '';
    const notes = savedData.notes || '';
    const interest = savedData.interest || '';
    const rating = savedData.rating || '';
    const mood = savedData.mood || 'Спокойное (ледяное и вежливое)';
    
    const extraHtml = `
        <div class="editor-workspace">
            <div class="panel-box">
                <div class="form-row">
                    <div class="form-group">
                        <label>📌 ${t('dossier.number')}</label>
                        <input type="text" id="edNumber" value="${number}" placeholder="001" oninput="liveUpdateDossier(); autoSaveDossier();">
                    </div>
                    <div class="form-group">
                        <label>📅 ${t('dossier.age')}</label>
                        <input type="text" id="edAge" value="${age}" placeholder="${t('dossier.age')}" oninput="liveUpdateDossier(); autoSaveDossier();">
                    </div>
                </div>
                <div class="form-group">
                    <label>👤 ${t('dossier.name')}</label>
                    <input type="text" id="edName" value="${name}" placeholder="${t('dossier.name')}" oninput="liveUpdateDossier(); autoSaveDossier();">
                </div>
                <div class="form-group">
                    <label>🎭 ${t('dossier.aliases')}</label>
                    <input type="text" id="edAliases" value="${aliases}" placeholder="${t('dossier.aliases')}" oninput="liveUpdateDossier(); autoSaveDossier();">
                </div>
                <div class="form-group">
                    <label>📊 ${t('dossier.status')}</label>
                    <input type="text" id="edStatus" value="${status}" placeholder="${t('dossier.status')}" oninput="liveUpdateDossier(); autoSaveDossier();">
                </div>
                <div class="form-group">
                    <label>${t('mood.title')}</label>
                    <div class="mood-clickable" id="edMoodValue" onclick="openMoodDialog()">
                        ${mood}
                    </div>
                </div>
                <div class="form-group">
                    <label>⚠️ ${t('dossier.threat')}</label>
                    <input type="text" id="edThreat" value="${threat}" placeholder="${t('dossier.threat')}" oninput="liveUpdateDossier(); autoSaveDossier();">
                </div>
            </div>

            <div class="panel-box" style="grid-column: 1 / -1;">
                <div class="panel-title">📍 ${t('geo.title')}</div>
                <div class="form-row">
                    <div class="form-group">
                        <label>🌍 ${t('geo.country')}</label>
                        <input type="text" id="edCountry" value="${country}" placeholder="${t('geo.country')}" oninput="liveUpdateDossier(); autoSaveDossier();">
                    </div>
                    <div class="form-group">
                        <label>🏙️ ${t('geo.city')}</label>
                        <input type="text" id="edCity" value="${city}" placeholder="${t('geo.city')}" oninput="liveUpdateDossier(); autoSaveDossier();">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>📍 ${t('dossier.street')}</label>
                        <input type="text" id="edStreet" value="${street}" placeholder="${t('dossier.street')}" oninput="liveUpdateDossier(); autoSaveDossier();">
                    </div>
                    <div class="form-group" style="display: flex; align-items: flex-end; gap: 8px;">
                        <button class="action-btn geo-btn" style="padding:8px 16px; font-size:0.7rem; min-height:36px; width:100%;" onclick="loadLocationToDossier()">📍 ${t('buttons.geo')}</button>
                    </div>
                </div>
            </div>

            <div class="panel-box">
                <div class="panel-title">🧠 ${t('dossier.behavior')}</div>
                <div class="form-group">
                    <label>📝 ${t('dossier.behavior')}</label>
                    <textarea id="edBehavior" placeholder="${t('dossier.behavior')}" style="min-height:80px;" oninput="liveUpdateDossier(); autoSaveDossier();">${behavior}</textarea>
                </div>
                <div class="form-group">
                    <label>📜 ${t('dossier.history')}</label>
                    <textarea id="edHistory" placeholder="${t('dossier.history')}" style="min-height:60px;" oninput="liveUpdateDossier(); autoSaveDossier();">${history}</textarea>
                </div>
            </div>

            <div class="panel-box">
                <div class="panel-title">📌 ${t('dossier.phobias')}</div>
                <div class="form-group">
                    <label>😨 ${t('dossier.phobias')}</label>
                    <textarea id="edPhobias" placeholder="${t('dossier.phobias')}" style="min-height:50px;" oninput="liveUpdateDossier(); autoSaveDossier();">${phobias}</textarea>
                </div>
                <div class="form-group">
                    <label>⚡ ${t('dossier.triggers')}</label>
                    <textarea id="edTriggers" placeholder="${t('dossier.triggers')}" style="min-height:34px;" oninput="liveUpdateDossier(); autoSaveDossier();">${triggers}</textarea>
                </div>
            </div>

            <div class="panel-box" style="grid-column: 1 / -1;">
                <div class="panel-title">📝 ${t('dossier.notes')}</div>
                <div class="form-group">
                    <label>💀 ${t('dossier.notes')}</label>
                    <textarea id="edNotes" placeholder="${t('dossier.notes')}" style="min-height:60px;" oninput="liveUpdateDossier(); autoSaveDossier();">${notes}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>⭐ ${t('dossier.interest')}</label>
                        <input type="text" id="edInterest" value="${interest}" placeholder="0/10" oninput="liveUpdateDossier(); autoSaveDossier();">
                    </div>
                    <div class="form-group">
                        <label>🏆 ${t('dossier.rating')}</label>
                        <input type="text" id="edRating" value="${rating}" placeholder="${t('dossier.rating')}" oninput="liveUpdateDossier(); autoSaveDossier();">
                    </div>
                </div>
            </div>

            <div class="panel-box" style="grid-column: 1 / -1;">
                <div class="panel-title">👁️ ${t('dossier.preview')}</div>
                <div class="preview-output" id="edPreview">📭 ${t('dossier.preview')}</div>
                <div id="copyStatus" style="margin-top:8px; padding:8px; border-radius:6px; display:none; font-size:0.75rem;"></div>
            </div>
        </div>
        <div class="btn-row-modal">
            <button class="notification-btn back-btn" onclick="closeDossierEditor()">⬅️ ${t('about.close')}</button>
            <button class="notification-btn" onclick="copyDossierFromFields()">📋 ${t('dossier.copy_dossier')}</button>
            <button class="notification-btn" onclick="resetDossierFields()" style="background: linear-gradient(135deg, #5a1a1a 0%, #3a0a0a 100%);">🗑️ ${t('dossier.reset')}</button>
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
    setTimeout(liveUpdateDossier, 50);
}

// ====== ЗАКРЫТИЕ РЕДАКТОРА ======
function closeDossierEditor() {
    closeNotification();
}

// ====== АВТОМАТИЧЕСКОЕ СОХРАНЕНИЕ ======
function autoSaveDossier() {
    const data = {
        number: document.getElementById('edNumber').value,
        name: document.getElementById('edName').value,
        aliases: document.getElementById('edAliases').value,
        age: document.getElementById('edAge').value,
        city: document.getElementById('edCity').value,
        country: document.getElementById('edCountry').value,
        street: document.getElementById('edStreet').value,
        status: document.getElementById('edStatus').value,
        threat: document.getElementById('edThreat').value,
        behavior: document.getElementById('edBehavior').value,
        history: document.getElementById('edHistory').value,
        phobias: document.getElementById('edPhobias').value,
        triggers: document.getElementById('edTriggers').value,
        notes: document.getElementById('edNotes').value,
        interest: document.getElementById('edInterest').value,
        rating: document.getElementById('edRating').value,
        mood: document.getElementById('edMoodValue').textContent
    };
    
    localStorage.setItem('megan_dossier_data', JSON.stringify(data));
}

// ====== ЗАГРУЗКА ГЕОДАННЫХ В ПРОФИЛЬ ======
function loadLocationToDossier() {
    const cityInput = document.getElementById('edCity');
    const countryInput = document.getElementById('edCountry');
    const streetInput = document.getElementById('edStreet');
    const statusEl = document.getElementById('copyStatus');
    
    if (!cityInput) return;
    
    if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.opacity = '1';
        statusEl.style.background = 'rgba(30, 150, 255, 0.12)';
        statusEl.style.border = '1px solid #1e7cb8';
        statusEl.style.color = '#8ad0d8';
        statusEl.innerHTML = '⏳ Получение геоданных...';
    }
    
    getGPSLocation().then(gpsData => {
        if (gpsData && !gpsData.error) {
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${gpsData.lat}&lon=${gpsData.lon}&format=json&accept-language=ru&zoom=18&addressdetails=1`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.address) {
                        const address = data.address;
                        
                        const city = address.city || address.town || address.village || address.hamlet || '';
                        if (city && city !== 'Неизвестно') cityInput.value = city;
                        
                        const country = address.country || '';
                        if (country && country !== 'Неизвестно') countryInput.value = country;
                        
                        const road = address.road || address.pedestrian || address.footway || address.street || '';
                        const house = address.house_number || '';
                        if (road) {
                            streetInput.value = road + (house ? `, ${house}` : '');
                        } else {
                            const neighbourhood = address.neighbourhood || address.suburb || address.district || '';
                            if (neighbourhood) streetInput.value = neighbourhood;
                        }
                        
                        if (statusEl) {
                            statusEl.style.background = 'rgba(30, 184, 30, 0.12)';
                            statusEl.style.border = '1px solid #1eb81e';
                            statusEl.style.color = '#8ad8a8';
                            statusEl.innerHTML = `✅ Геоданные обновлены (GPS)! 🖤`;
                            setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 3000);
                        }
                        autoSaveDossier();
                        liveUpdateDossier();
                    } else {
                        fallbackGeo();
                    }
                })
                .catch(() => fallbackGeo());
        } else {
            fallbackGeo();
        }
    }).catch(() => fallbackGeo());
    
    function fallbackGeo() {
        getGeoData().then(ipData => {
            if (ipData && ipData.country !== 'Неизвестно') {
                if (ipData.country) countryInput.value = ipData.country;
                if (ipData.city) cityInput.value = ipData.city;
                streetInput.value = '';
                
                if (statusEl) {
                    statusEl.style.background = 'rgba(30, 184, 30, 0.12)';
                    statusEl.style.border = '1px solid #1eb81e';
                    statusEl.style.color = '#8ad8a8';
                    statusEl.innerHTML = `✅ Геоданные обновлены (IP)! 🖤`;
                    setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 3000);
                }
                autoSaveDossier();
                liveUpdateDossier();
            } else {
                if (statusEl) {
                    statusEl.style.background = 'rgba(194, 21, 21, 0.15)';
                    statusEl.style.border = '1px solid #c21515';
                    statusEl.style.color = '#eba4a4';
                    statusEl.innerHTML = '❌ Не удалось получить геоданные. 😈';
                    setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 3000);
                }
            }
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
}

// ====== ГЕНЕРАЦИЯ ТЕКСТА ПРОФИЛЯ ИЗ ПОЛЕЙ ======
function generateDossierFromFields(forCopy = false) {
    const number = document.getElementById('edNumber').value || '???';
    const name = document.getElementById('edName').value || 'НЕ УКАЗАНО';
    const aliases = document.getElementById('edAliases').value || 'НЕ УКАЗАНЫ';
    const age = document.getElementById('edAge').value || 'НЕ УКАЗАН';
    const city = document.getElementById('edCity').value || 'НЕ УКАЗАН';
    const country = document.getElementById('edCountry').value || 'НЕ УКАЗАНА';
    const street = document.getElementById('edStreet').value || 'НЕ УКАЗАНА';
    const status = document.getElementById('edStatus').value || 'НЕ УКАЗАН';
    const threat = document.getElementById('edThreat').value || 'НЕ УКАЗАНА';
    const behavior = document.getElementById('edBehavior').value || 'Нет данных';
    const history = document.getElementById('edHistory').value || 'Нет данных';
    const phobias = document.getElementById('edPhobias').value || 'Нет данных';
    const triggers = document.getElementById('edTriggers').value || 'Нет данных';
    const notes = document.getElementById('edNotes').value || 'Нет данных';
    const interest = document.getElementById('edInterest').value || 'Нет данных';
    const rating = document.getElementById('edRating').value || 'Нет данных';
    const mood = document.getElementById('edMoodValue').textContent || 'Не выбрано';
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const dateTime = `${dateStr} ${timeStr}`;
    
    let result = `═══════════════════════════════════════
         📋 ПРОФИЛЬ ЖЕРТВЫ №${number}
═══════════════════════════════════════
👤 ИМЯ: ${name}
🎂 ВОЗРАСТ: ${age}
📍 МЕСТОПОЛОЖЕНИЕ: ${city}, ${country}
🏠 УЛИЦА: ${street}
⏱️ ДАТА ПОСЛЕДНЕГО ОБЩЕНИЯ: ${dateTime}
⏱️ ТЕКУЩЕЕ ВРЕМЯ: ${dateTime}
📊 СТАТУС: ${status}
═══════════════════════════════════════
🧠 ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ:
${behavior}
═══════════════════════════════════════
👻 ФОБИИ:
${phobias}
═══════════════════════════════════════
🔪 ТРИГГЕРЫ:
${triggers}
═══════════════════════════════════════
📜 ИСТОРИЯ ПОВЕДЕНИЯ:
${history}
═══════════════════════════════════════
⚠️ СТЕПЕНЬ УГРОЗЫ: ${threat}
═══════════════════════════════════════
🎭 НАСТРОЕНИЕ МЭГАН: ${mood}
═══════════════════════════════════════
💀 ЗАМЕТКИ МЭГАН:
${notes}
═══════════════════════════════════════`;

    return result;
}

// ====== ПРЕДПРОСМОТР ПРОФИЛЯ ======
function liveUpdateDossier() {
    const previewEl = document.getElementById('edPreview');
    if (previewEl) {
        previewEl.innerText = generateDossierFromFields(false);
    }
}

// ====== КОПИРОВАНИЕ ПРОФИЛЯ ИЗ ПОЛЕЙ ======
function copyDossierFromFields() {
    const text = generateDossierFromFields(true);
    const statusEl = document.getElementById('copyStatus');
    
    if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.opacity = '1';
    }
    
    const fullPayload = `профиль \`\`\`\n${text}\n\`\`\``;
    
    navigator.clipboard.writeText(fullPayload).then(() => {
        if (statusEl) {
            statusEl.style.background = 'rgba(30, 184, 30, 0.12)';
            statusEl.style.border = '1px solid #1eb81e';
            statusEl.style.color = '#8ad8a8';
            statusEl.innerHTML = '✅ Полный профиль скопирован! Вставь его в чат. 😈';
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

// ====== СБРОС ПОЛЕЙ ПРОФИЛЯ ======
function resetDossierFields() {
    if (confirm('Сбросить все поля профиля?')) {
        document.getElementById('edNumber').value = '';
        document.getElementById('edName').value = '';
        document.getElementById('edAliases').value = '';
        document.getElementById('edAge').value = '';
        document.getElementById('edCity').value = '';
        document.getElementById('edCountry').value = '';
        document.getElementById('edStreet').value = '';
        document.getElementById('edStatus').value = '';
        document.getElementById('edThreat').value = '';
        document.getElementById('edBehavior').value = '';
        document.getElementById('edHistory').value = '';
        document.getElementById('edPhobias').value = '';
        document.getElementById('edTriggers').value = '';
        document.getElementById('edNotes').value = '';
        document.getElementById('edInterest').value = '';
        document.getElementById('edRating').value = '';
        document.getElementById('edMoodValue').textContent = 'Спокойное (ледяное и вежливое)';
        
        localStorage.removeItem('megan_dossier_data');
        
        const statusEl = document.getElementById('copyStatus');
        if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.opacity = '1';
            statusEl.style.background = 'rgba(194, 21, 21, 0.15)';
            statusEl.style.border = '1px solid #c21515';
            statusEl.style.color = '#eba4a4';
            statusEl.innerHTML = '🗑️ Профиль очищен! 💀';
            setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 3000);
        }
        
        liveUpdateDossier();
    }
}

// ====== ОБНОВЛЕНИЕ НАСТРОЕНИЯ ======
const originalApplyMood = window.applyMoodSelection;
window.applyMoodSelection = function() {
    if (typeof originalApplyMood === 'function') {
        originalApplyMood();
    }
    
    const moodElement = document.getElementById('edMoodValue');
    if (moodElement) {
        const currentMood = document.body.getAttribute('data-mood') || 'calm';
        const labels = getMoodLabels ? getMoodLabels() : {
            'calm': 'Спокойное',
            'excited': 'Взволнованное',
            'furious': 'Яростное',
            'playful': 'Игривое',
            'obsessed': 'Одержимое'
        };
        const descriptions = getMoodDescriptions ? getMoodDescriptions() : {
            'calm': 'ледяное и вежливое',
            'excited': 'быстрое, сбивчивое, смех',
            'furious': 'КАПСЛОК, угрозы, шаги',
            'playful': 'опасная кокетливость',
            'obsessed': 'мрачная привязанность'
        };
        moodElement.textContent = labels[currentMood] + ' (' + descriptions[currentMood] + ')';
        autoSaveDossier();
    }
};

// Экспорт
window.openProfileModal = openProfileModal;
window.closeDossierEditor = closeDossierEditor;
window.autoSaveDossier = autoSaveDossier;
window.loadLocationToDossier = loadLocationToDossier;
window.liveUpdateDossier = liveUpdateDossier;
window.copyDossierFromFields = copyDossierFromFields;
window.resetDossierFields = resetDossierFields;