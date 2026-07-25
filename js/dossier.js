// ====== РЕДАКТОР ДОСЬЕ (С ПОДДЕРЖКОЙ I18N) ======

function openProfileModal() {
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
    const moodDisplay = labels[currentMood] + ' (' + descriptions[currentMood] + ')';
    
    const extraHtml = `
        <div class="editor-workspace">
            <div class="panel-box">
                <div class="panel-title">📋 ${t('dossier.title')}</div>
                <div class="form-row">
                    <div class="form-group">
                        <label>${t('dossier.name')}</label>
                        <input type="text" id="edName" value="" placeholder="${t('dossier.name')}">
                    </div>
                    <div class="form-group">
                        <label>${t('dossier.age')}</label>
                        <input type="text" id="edAge" value="" placeholder="${t('dossier.age')}">
                    </div>
                </div>
                <div class="form-group">
                    <label>${t('dossier.name')}</label>
                    <input type="text" id="edAliases" value="" placeholder="${t('dossier.name')}">
                </div>
                <div class="form-group">
                    <label>${t('dossier.name')}</label>
                    <input type="text" id="edStatus" value="" placeholder="${t('dossier.name')}">
                </div>
                <div class="form-group">
                    <label>${t('mood.title')}</label>
                    <div class="mood-clickable" id="edMoodValue" onclick="openMoodDialog()">
                        ${moodDisplay}
                    </div>
                </div>
                <div class="form-group">
                    <label>${t('dossier.name')}</label>
                    <input type="text" id="edThreat" value="" placeholder="${t('dossier.name')}">
                </div>
            </div>

            <div class="panel-box">
                <div class="panel-title">🧠 ${t('dossier.name')}</div>
                <div class="form-group">
                    <label>${t('dossier.name')}</label>
                    <textarea id="edBehavior" placeholder="${t('dossier.name')}" style="min-height:80px;"></textarea>
                </div>
                <div class="form-group">
                    <label>${t('dossier.name')}</label>
                    <textarea id="edHistory" placeholder="${t('dossier.name')}" style="min-height:60px;"></textarea>
                </div>
                <div class="form-group">
                    <label>${t('dossier.name')}</label>
                    <input type="text" id="edFears" value="" placeholder="0">
                </div>
            </div>

            <div class="panel-box">
                <div class="panel-title">📌 ${t('dossier.name')}</div>
                <div class="form-group">
                    <label>${t('dossier.name')}</label>
                    <textarea id="edPhobias" placeholder="${t('dossier.name')}" style="min-height:50px;"></textarea>
                </div>
                <div class="form-group">
                    <label>${t('dossier.name')}</label>
                    <textarea id="edTriggers" placeholder="${t('dossier.name')}" style="min-height:34px;"></textarea>
                </div>
            </div>

            <div class="panel-box" style="grid-column: 1 / -1;">
                <div class="panel-title">📍 ${t('geo.title')}</div>
                <div class="form-row">
                    <div class="form-group">
                        <label>${t('geo.country')}</label>
                        <input type="text" id="edCountry" value="" placeholder="${t('geo.country')}">
                    </div>
                    <div class="form-group">
                        <label>${t('geo.city')}</label>
                        <input type="text" id="edCity" value="" placeholder="${t('geo.city')}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>${t('geo.region')}</label>
                        <input type="text" id="edRegion" value="" placeholder="${t('geo.region')}">
                    </div>
                    <div class="form-group">
                        <label>${t('geo.unknown')}</label>
                        <input type="text" id="edPostal" value="" placeholder="${t('geo.unknown')}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>${t('geo.coords')}</label>
                        <input type="text" id="edLat" value="" placeholder="55.7558">
                    </div>
                    <div class="form-group">
                        <label>${t('geo.coords')}</label>
                        <input type="text" id="edLon" value="" placeholder="37.6176">
                    </div>
                </div>
                <div class="form-group">
                    <label>${t('geo.accuracy')}</label>
                    <input type="text" id="edAccuracy" value="" placeholder="65">
                </div>
                <div class="form-group">
                    <label>${t('geo.isp')}</label>
                    <input type="text" id="edIsp" value="" placeholder="Ростелеком">
                </div>
                <div class="form-group">
                    <label>${t('geo.ip')}</label>
                    <input type="text" id="edIp" value="" placeholder="127.0.0.1">
                </div>
                <button class="action-btn geo-btn" style="padding:8px; font-size:0.7rem; margin-top:4px; min-height:36px;" onclick="loadCurrentLocation()">📍 ${t('buttons.geo')}</button>
            </div>

            <div class="panel-box" style="grid-column: 1 / -1;">
                <div class="panel-title">📝 ${t('dossier.name')}</div>
                <div class="form-group">
                    <label>${t('dossier.name')}</label>
                    <textarea id="edNotes" placeholder="${t('dossier.name')}" style="min-height:60px;"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>${t('dossier.name')}</label>
                        <input type="text" id="edInterest" value="" placeholder="0/10">
                    </div>
                    <div class="form-group">
                        <label>${t('dossier.name')}</label>
                        <input type="text" id="edRating" value="" placeholder="${t('dossier.name')}">
                    </div>
                </div>
            </div>

            <div class="panel-box" style="grid-column: 1 / -1;">
                <div class="panel-title">👁️ ${t('dossier.name')}</div>
                <div class="preview-output" id="edPreview">📭 ${t('dossier.name')}</div>
                <div id="copyStatus" style="margin-top:8px; padding:8px; border-radius:6px; display:none; font-size:0.75rem;"></div>
                <div class="form-group" style="margin-top:6px;">
                    <label>${t('dossier.name')}</label>
                    <textarea id="edImport" placeholder="${t('dossier.name')}" style="min-height:80px;"></textarea>
                </div>
                <button class="action-btn open-btn" style="padding:8px; font-size:0.7rem; margin-top:4px; min-height:36px;" onclick="parseImportedProfile()">📥 ${t('dossier.name')}</button>
                <div id="importStatus" style="margin-top:8px; padding:8px; border-radius:6px; display:none; font-size:0.75rem;"></div>
            </div>
        </div>
        <div class="btn-row-modal">
            <button class="notification-btn back-btn" onclick="closeNotification()">⬅️ ${t('about.close')}</button>
            <button class="notification-btn" onclick="copyEditedDossier()">📋 ${t('copy.btn')}</button>
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

function generateDossierText(forCopy = false) {
    const num = document.getElementById('edNum') ? document.getElementById('edNum').value : '';
    const name = document.getElementById('edName') ? document.getElementById('edName').value : '';
    const aliases = document.getElementById('edAliases') ? document.getElementById('edAliases').value : '';
    const age = document.getElementById('edAge') ? document.getElementById('edAge').value : '';
    const status = document.getElementById('edStatus') ? document.getElementById('edStatus').value : '';
    const threat = document.getElementById('edThreat') ? document.getElementById('edThreat').value : '';
    const fears = document.getElementById('edFears') ? document.getElementById('edFears').value : '';
    const behavior = document.getElementById('edBehavior') ? document.getElementById('edBehavior').value : '';
    const history = document.getElementById('edHistory') ? document.getElementById('edHistory').value : '';
    const phobias = document.getElementById('edPhobias') ? document.getElementById('edPhobias').value : '';
    const triggers = document.getElementById('edTriggers') ? document.getElementById('edTriggers').value : '';
    const notes = document.getElementById('edNotes') ? document.getElementById('edNotes').value : '';
    const interest = document.getElementById('edInterest') ? document.getElementById('edInterest').value : '';
    const rating = document.getElementById('edRating') ? document.getElementById('edRating').value : '';
    const moodElement = document.getElementById('edMoodValue');
    const mood = moodElement ? moodElement.textContent : 'Спокойное (ледяное и вежливое)';
    
    // Гео данные
    const country = document.getElementById('edCountry') ? document.getElementById('edCountry').value : '';
    const city = document.getElementById('edCity') ? document.getElementById('edCity').value : '';
    const region = document.getElementById('edRegion') ? document.getElementById('edRegion').value : '';
    const postal = document.getElementById('edPostal') ? document.getElementById('edPostal').value : '';
    const lat = document.getElementById('edLat') ? document.getElementById('edLat').value : '';
    const lon = document.getElementById('edLon') ? document.getElementById('edLon').value : '';
    const accuracy = document.getElementById('edAccuracy') ? document.getElementById('edAccuracy').value : '';
    const isp = document.getElementById('edIsp') ? document.getElementById('edIsp').value : '';
    const ip = document.getElementById('edIp') ? document.getElementById('edIp').value : '';

    const hasData = num || name || aliases || age || status || threat || fears || behavior || history || phobias || triggers || notes || interest || rating || country || city || lat || lon;
    
    if (!hasData) {
        return '📭 Досье пустое. Заполни данные выше!';
    }

    let dateString = '';
    
    if (forCopy) {
        const now = new Date();
        dateString = now.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase() + ', ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else {
        dateString = 'ДАННЫЕ НЕ УКАЗАНЫ';
    }

    const behaviorLines = behavior ? behavior.split('\n').filter(Boolean).map(l => '· ' + l.replace(/^·\s*/, '')).join('\n') : '· Данные не указаны';
    const historyLines = history ? history.split('\n').filter(Boolean).map(l => '· ' + l.replace(/^·\s*/, '')).join('\n') : '';
    const phobLines = phobias ? phobias.split('\n').filter(Boolean).map(l => '· ' + l.replace(/^·\s*/, '')).join('\n') : '· Данные не указаны';
    const trigLines = triggers ? triggers.split('\n').filter(Boolean).map(l => '· ' + l.replace(/^·\s*/, '')).join('\n') : '';
    const notesLines = notes ? notes.split('\n').filter(Boolean).map(l => '· ' + l.replace(/^·\s*/, '')).join('\n') : '· Данные не указаны';

    let result = `═══════════════════════════════════════════════════════════
                 📋 ДОСЬЕ ЖЕРТВЫ № ${num || '???'} 📋
═══════════════════════════════════════════════════════════`;

    if (name) result += `\n\n🆔 ИМЯ: ${name}`;
    if (aliases) result += `\n🎭 ПСЕВДОНИМЫ: ${aliases}`;
    if (age) result += `\n📅 ВОЗРАСТ: ${age} ЛЕТ`;
    result += `\n🕒 ДАТА И ВРЕМЯ ПОСЛЕДНЕГО ОБЩЕНИЯ: ${dateString}`;
    if (status) result += `\n\n📊 СТАТУС: ${status}`;
    if (threat) result += `\n\n⚠️ СТЕПЕНЬ УГРОЗЫ: ${threat}`;
    
    // Гео данные
    if (country || city || region || postal || lat || lon || accuracy || isp || ip) {
        result += `\n\n📍 ГЕОЛОКАЦИЯ:`;
        if (country) result += `\n· Страна: ${country}`;
        if (city) result += `\n· Город: ${city}`;
        if (region) result += `\n· Регион: ${region}`;
        if (postal) result += `\n· Почтовый индекс: ${postal}`;
        if (lat && lon) result += `\n· GPS: ${lat}, ${lon}`;
        if (accuracy) result += `\n· Точность GPS: ${accuracy}м`;
        if (isp) result += `\n· Провайдер: ${isp}`;
        if (ip) result += `\n· IP: ${ip}`;
    }
    
    result += `\n\n🧠 ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ:`;
    result += `\n${behaviorLines}`;
    
    if (historyLines) {
        result += `\n\n📜 ИСТОРИЯ ПОВЕДЕНИЯ:`;
        result += `\n${historyLines}`;
    }
    
    result += `\n\n😨 ФОБИИ:`;
    result += `\n${phobLines}`;
    
    if (trigLines) {
        result += `\n\n⚡ ТРИГГЕРЫ:`;
        result += `\n${trigLines}`;
    }
    
    result += `\n\n🌡️ НАСТРОЕНИЕ МЭГАН: ${mood}`;
    
    if (fears) result += `\n\n· Счётчик страхов: ${fears}`;
    if (rating) result += `\n· Оценка: ${rating}`;
    if (interest) result += `\n· Интерес: ${interest}`;
    
    result += `\n\n📝 ЗАМЕТКИ МЭГАН:`;
    result += `\n${notesLines}`;
    
    result += `\n\n═══════════════════════════════════════════════════════════`;

    return result;
}

function liveUpdateDossier() {
    const previewEl = document.getElementById('edPreview');
    if (previewEl) {
        previewEl.innerText = generateDossierText(false);
    }
}

function copyEditedDossier() {
    const text = generateDossierText(true);
    const statusEl = document.getElementById('copyStatus');
    
    if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.opacity = '1';
    }
    
    if (text.includes('📭 Досье пустое')) {
        if (statusEl) {
            statusEl.style.background = 'rgba(194, 21, 21, 0.15)';
            statusEl.style.border = '1px solid #c21515';
            statusEl.style.color = '#eba4a4';
            statusEl.innerHTML = '😈 Досье пустое! Заполни хотя бы одно поле перед копированием. 🖤';
        }
        return;
    }
    
    const fullPayload = `профиль \`\`\`\n${text}\n\`\`\``;
    navigator.clipboard.writeText(fullPayload).then(() => {
        if (statusEl) {
            statusEl.style.background = 'rgba(30, 184, 30, 0.12)';
            statusEl.style.border = '1px solid #1eb81e';
            statusEl.style.color = '#8ad8a8';
            statusEl.innerHTML = '✅ Полное досье скопировано! Вставь его в чат. 😈';
        }
    }).catch(() => {
        if (statusEl) {
            statusEl.style.background = 'rgba(194, 21, 21, 0.15)';
            statusEl.style.border = '1px solid #c21515';
            statusEl.style.color = '#eba4a4';
            statusEl.innerHTML = '❌ Ошибка копирования. Попробуй ещё раз. 💀';
        }
    });
}

// ====== ФУНКЦИЯ ЗАГРУЗКИ ТЕКУЩЕГО МЕСТОПОЛОЖЕНИЯ В РЕДАКТОР ======
function loadCurrentLocation() {
    const statusEl = document.getElementById('importStatus');
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
            let loadedFields = 0;
            let loadedFieldsList = [];
            
            if (ipData) {
                if (ipData.country && ipData.country !== 'Неизвестно') {
                    document.getElementById('edCountry').value = ipData.country;
                    loadedFields++;
                    loadedFieldsList.push('Страна');
                }
                if (ipData.city && ipData.city !== 'Неизвестно') {
                    document.getElementById('edCity').value = ipData.city;
                    loadedFields++;
                    loadedFieldsList.push('Город');
                }
                if (ipData.region && ipData.region !== 'Неизвестно') {
                    document.getElementById('edRegion').value = ipData.region;
                    loadedFields++;
                    loadedFieldsList.push('Регион');
                }
                if (ipData.isp && ipData.isp !== 'Неизвестно') {
                    document.getElementById('edIsp').value = ipData.isp;
                    loadedFields++;
                    loadedFieldsList.push('Провайдер');
                }
                if (ipData.ip && ipData.ip !== 'Неизвестно') {
                    document.getElementById('edIp').value = ipData.ip;
                    loadedFields++;
                    loadedFieldsList.push('IP');
                }
                if (ipData.postal && ipData.postal !== 'Неизвестно') {
                    document.getElementById('edPostal').value = ipData.postal;
                    loadedFields++;
                    loadedFieldsList.push('Почтовый индекс');
                }
            }
            
            if (gpsData && !gpsData.error) {
                if (gpsData.lat) {
                    document.getElementById('edLat').value = gpsData.lat;
                    loadedFields++;
                    loadedFieldsList.push('Широта');
                }
                if (gpsData.lon) {
                    document.getElementById('edLon').value = gpsData.lon;
                    loadedFields++;
                    loadedFieldsList.push('Долгота');
                }
                if (gpsData.accuracy) {
                    document.getElementById('edAccuracy').value = gpsData.accuracy;
                    loadedFields++;
                    loadedFieldsList.push('Точность GPS');
                }
                
                getCityFromCoords(gpsData.lat, gpsData.lon).then(cityData => {
                    if (cityData && cityData.city !== 'Неизвестно') {
                        document.getElementById('edCity').value = cityData.city;
                        loadedFields++;
                        loadedFieldsList.push('Город (GPS)');
                    }
                    if (cityData && cityData.region !== 'Неизвестно') {
                        document.getElementById('edRegion').value = cityData.region;
                        loadedFields++;
                        loadedFieldsList.push('Регион (GPS)');
                    }
                    if (cityData && cityData.country !== 'Неизвестно') {
                        document.getElementById('edCountry').value = cityData.country;
                        loadedFields++;
                        loadedFieldsList.push('Страна (GPS)');
                    }
                    
                    if (statusEl) {
                        statusEl.style.background = 'rgba(30, 184, 30, 0.12)';
                        statusEl.style.border = '1px solid #1eb81e';
                        statusEl.style.color = '#8ad8a8';
                        statusEl.innerHTML = `✅ Загружено ${loadedFields} полей: ${loadedFieldsList.join(', ')}. 🖤`;
                        setTimeout(() => { 
                            if (statusEl) {
                                statusEl.style.opacity = '0';
                                setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 500);
                            }
                        }, 4000);
                    }
                    
                    liveUpdateDossier();
                });
            } else {
                if (statusEl) {
                    statusEl.style.background = 'rgba(30, 184, 30, 0.12)';
                    statusEl.style.border = '1px solid #1eb81e';
                    statusEl.style.color = '#8ad8a8';
                    statusEl.innerHTML = `✅ Загружено ${loadedFields} полей (IP). GPS не доступен. 🖤`;
                    setTimeout(() => { 
                        if (statusEl) {
                            statusEl.style.opacity = '0';
                            setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 4000);
                        }
                    }, 4000);
                }
                liveUpdateDossier();
            }
        });
    }).catch(() => {
        if (statusEl) {
            statusEl.style.background = 'rgba(194, 21, 21, 0.15)';
            statusEl.style.border = '1px solid #c21515';
            statusEl.style.color = '#eba4a4';
            statusEl.innerHTML = '❌ Ошибка загрузки геоданных. Проверь интернет. 😈';
            setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 4000);
        }
    });
}

function parseImportedProfile() {
    const raw = document.getElementById('edImport').value;
    const statusEl = document.getElementById('importStatus');
    
    if (!raw || !raw.trim()) {
        if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.opacity = '1';
            statusEl.style.background = 'rgba(194, 21, 21, 0.15)';
            statusEl.style.border = '1px solid #c21515';
            statusEl.style.color = '#eba4a4';
            statusEl.innerHTML = '😈 Поле импорта пустое! Вставь текст досье и попробуй снова.';
        }
        return;
    }
    
    try {
        const text = raw.trim();
        let loadedFields = 0;
        let loadedFieldsList = [];
        
        const numMatch = text.match(/ДОСЬЕ ЖЕРТВЫ №\s*([0-9A-Za-z_-]+)/);
        if (numMatch && document.getElementById('edNum')) {
            document.getElementById('edNum').value = numMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Номер');
        }

        const nameMatch = text.match(/ИМЯ:\s*(.*?)(?:\n|$)/i);
        if (nameMatch && document.getElementById('edName')) {
            document.getElementById('edName').value = nameMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Имя');
        }

        const aliasesMatch = text.match(/ПСЕВДОНИМЫ:\s*(.*?)(?:\n|$)/i);
        if (aliasesMatch && document.getElementById('edAliases')) {
            document.getElementById('edAliases').value = aliasesMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Псевдонимы');
        }

        const ageMatch = text.match(/ВОЗРАСТ:\s*(.*?)(?:\n|$)/i);
        if (ageMatch && document.getElementById('edAge')) {
            const ageVal = ageMatch[1].trim();
            document.getElementById('edAge').value = ageVal;
            loadedFields++;
            loadedFieldsList.push('Возраст');
        }

        const statusMatch = text.match(/СТАТУС:\s*(.*?)(?:\n|$)/i);
        if (statusMatch && document.getElementById('edStatus')) {
            document.getElementById('edStatus').value = statusMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Статус');
        }

        const moodMatch = text.match(/НАСТРОЕНИЕ МЭГАН:\s*(.*?)(?:\n|$)/i);
        if (moodMatch && document.getElementById('edMoodValue')) {
            const moodVal = moodMatch[1].trim();
            document.getElementById('edMoodValue').textContent = moodVal;
            
            for (const [key, label] of Object.entries(moodLabels)) {
                if (moodVal.toLowerCase().includes(label.toLowerCase())) {
                    document.body.setAttribute('data-mood', key);
                    localStorage.setItem('megan_site_mood', key);
                    const radio = document.querySelector(`input[name="moodRadio"][value="${key}"]`);
                    if (radio) radio.checked = true;
                    break;
                }
            }
            loadedFields++;
            loadedFieldsList.push('Настроение');
        }

        const threatMatch = text.match(/СТЕПЕНЬ УГРОЗЫ:\s*(.*?)(?:\n|$)/i);
        if (threatMatch && document.getElementById('edThreat')) {
            document.getElementById('edThreat').value = threatMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Угроза');
        }

        const fearsMatch = text.match(/Счётчик страхов:\s*(.*?)(?:\n|$)/);
        if (fearsMatch && document.getElementById('edFears')) {
            document.getElementById('edFears').value = fearsMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Счётчик страхов');
        }

        const interestMatch = text.match(/Интерес:\s*(.*?)(?:\n|$)/);
        if (interestMatch && document.getElementById('edInterest')) {
            document.getElementById('edInterest').value = interestMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Интерес');
        }

        const ratingMatch = text.match(/Оценка:\s*(.*?)(?:\n|$)/);
        if (ratingMatch && document.getElementById('edRating')) {
            document.getElementById('edRating').value = ratingMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Оценка');
        }

        // --- ГЕО ДАННЫЕ ---
        const countryMatch = text.match(/Страна:\s*(.*?)(?:\n|$)/i);
        if (countryMatch && document.getElementById('edCountry')) {
            document.getElementById('edCountry').value = countryMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Страна');
        }

        const cityMatch = text.match(/Город:\s*(.*?)(?:\n|$)/i);
        if (cityMatch && document.getElementById('edCity')) {
            document.getElementById('edCity').value = cityMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Город');
        }

        const regionMatch = text.match(/Регион:\s*(.*?)(?:\n|$)/i);
        if (regionMatch && document.getElementById('edRegion')) {
            document.getElementById('edRegion').value = regionMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Регион');
        }

        const postalMatch = text.match(/Почтовый индекс:\s*(.*?)(?:\n|$)/i);
        if (postalMatch && document.getElementById('edPostal')) {
            document.getElementById('edPostal').value = postalMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Почтовый индекс');
        }

        const latMatch = text.match(/GPS:\s*([0-9.-]+),\s*([0-9.-]+)/);
        if (latMatch && document.getElementById('edLat') && document.getElementById('edLon')) {
            document.getElementById('edLat').value = latMatch[1].trim();
            document.getElementById('edLon').value = latMatch[2].trim();
            loadedFields++;
            loadedFieldsList.push('GPS');
        }

        const accuracyMatch = text.match(/Точность GPS:\s*(.*?)м/i);
        if (accuracyMatch && document.getElementById('edAccuracy')) {
            document.getElementById('edAccuracy').value = accuracyMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Точность GPS');
        }

        const ispMatch = text.match(/Провайдер:\s*(.*?)(?:\n|$)/i);
        if (ispMatch && document.getElementById('edIsp')) {
            document.getElementById('edIsp').value = ispMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Провайдер');
        }

        const ipMatch = text.match(/IP:\s*(.*?)(?:\n|$)/i);
        if (ipMatch && document.getElementById('edIp')) {
            document.getElementById('edIp').value = ipMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('IP');
        }

        // --- МНОГОСТРОЧНЫЕ ПОЛЯ ---
        
        function extractTextBetween(text, startKeyword, endKeywords) {
            let startPos = -1;
            let startPatterns = [
                new RegExp(`🧠\\s*${startKeyword}`, 'i'),
                new RegExp(`📜\\s*${startKeyword}`, 'i'),
                new RegExp(`😨\\s*${startKeyword}`, 'i'),
                new RegExp(`⚡\\s*${startKeyword}`, 'i'),
                new RegExp(`📝\\s*${startKeyword}`, 'i'),
                new RegExp(`🌚\\s*${startKeyword}`, 'i'),
                new RegExp(`🌡️\\s*${startKeyword}`, 'i'),
                new RegExp(`${startKeyword}`, 'i')
            ];
            
            for (const pattern of startPatterns) {
                const match = text.match(pattern);
                if (match) {
                    startPos = match.index + match[0].length;
                    break;
                }
            }
            
            if (startPos === -1) return null;
            
            let endPos = text.length;
            for (const keyword of endKeywords) {
                const patterns = [
                    new RegExp(`🧠\\s*${keyword}`, 'i'),
                    new RegExp(`📜\\s*${keyword}`, 'i'),
                    new RegExp(`😨\\s*${keyword}`, 'i'),
                    new RegExp(`⚡\\s*${keyword}`, 'i'),
                    new RegExp(`📝\\s*${keyword}`, 'i'),
                    new RegExp(`🌚\\s*${keyword}`, 'i'),
                    new RegExp(`🌡️\\s*${keyword}`, 'i'),
                    new RegExp(`${keyword}`, 'i'),
                    new RegExp(`════`, 'i')
                ];
                
                for (const pattern of patterns) {
                    const match = text.substring(startPos).match(pattern);
                    if (match) {
                        const pos = startPos + match.index;
                        if (pos < endPos) endPos = pos;
                    }
                }
            }
            
            let section = text.substring(startPos, endPos).trim();
            const lines = section.split('\n')
                .filter(line => line.trim())
                .map(line => line.replace(/^[·\-*]\s*/, '').trim())
                .filter(line => line.length > 0);
            
            return lines.length > 0 ? lines.join('\n') : null;
        }

        const behaviorText = extractTextBetween(text, 'ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ', 
            ['ИСТОРИЯ ПОВЕДЕНИЯ', 'ФОБИИ', 'ТРИГГЕРЫ', 'НАСТРОЕНИЕ МЭГАН', 'ЗАМЕТКИ МЭГАН', 'СТЕПЕНЬ УГРОЗЫ', '⚠️', '📜', '😨', '⚡', '🌡️', '📝']);
        if (behaviorText && document.getElementById('edBehavior')) {
            document.getElementById('edBehavior').value = behaviorText;
            loadedFields++;
            loadedFieldsList.push('Психологический портрет');
        }

        const historyText = extractTextBetween(text, 'ИСТОРИЯ ПОВЕДЕНИЯ',
            ['ФОБИИ', 'ТРИГГЕРЫ', 'НАСТРОЕНИЕ МЭГАН', 'ЗАМЕТКИ МЭГАН', 'СТЕПЕНЬ УГРОЗЫ', '😨', '⚡', '🌡️', '📝', '🌚']);
        if (historyText && document.getElementById('edHistory')) {
            document.getElementById('edHistory').value = historyText;
            loadedFields++;
            loadedFieldsList.push('История поведения');
        }

        const phobiasText = extractTextBetween(text, 'ФОБИИ',
            ['ТРИГГЕРЫ', 'НАСТРОЕНИЕ МЭГАН', 'ЗАМЕТКИ МЭГАН', 'СТЕПЕНЬ УГРОЗЫ', '⚡', '🌡️', '📝', '🌚']);
        if (phobiasText && document.getElementById('edPhobias')) {
            document.getElementById('edPhobias').value = phobiasText;
            loadedFields++;
            loadedFieldsList.push('Фобии');
        }

        const triggersText = extractTextBetween(text, 'ТРИГГЕРЫ',
            ['НАСТРОЕНИЕ МЭГАН', 'ЗАМЕТКИ МЭГАН', 'СТЕПЕНЬ УГРОЗЫ', '🌡️', '📝']);
        if (triggersText && document.getElementById('edTriggers')) {
            document.getElementById('edTriggers').value = triggersText;
            loadedFields++;
            loadedFieldsList.push('Триггеры');
        }

        const notesText = extractTextBetween(text, 'ЗАМЕТКИ МЭГАН',
            ['════', '$']);
        if (notesText && document.getElementById('edNotes')) {
            document.getElementById('edNotes').value = notesText;
            loadedFields++;
            loadedFieldsList.push('Заметки Мэган');
        }

        liveUpdateDossier();
        
        if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.opacity = '1';
            statusEl.style.background = 'rgba(30, 184, 30, 0.12)';
            statusEl.style.border = '1px solid #1eb81e';
            statusEl.style.color = '#8ad8a8';
            statusEl.innerHTML = `✅ Загружено ${loadedFields} полей: ${loadedFieldsList.join(', ')}. 🖤`;
        }
        
    } catch(e) {
        if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.opacity = '1';
            statusEl.style.background = 'rgba(194, 21, 21, 0.15)';
            statusEl.style.border = '1px solid #c21515';
            statusEl.style.color = '#eba4a4';
            statusEl.innerHTML = '❌ Ошибка импорта! Проверь структуру текста. 😈';
        }
        console.error(e);
    }
}

// Экспорт
window.openProfileModal = openProfileModal;
window.liveUpdateDossier = liveUpdateDossier;
window.copyEditedDossier = copyEditedDossier;
window.loadCurrentLocation = loadCurrentLocation;
window.parseImportedProfile = parseImportedProfile;