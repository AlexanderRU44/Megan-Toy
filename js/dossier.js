// ====== РЕДАКТОР ДОСЬЕ ======

function openProfileModal() {
    // Проверяем, что moodLabels и moodDescriptions определены
    if (typeof moodLabels === 'undefined' || typeof moodDescriptions === 'undefined') {
        console.error('❌ moodLabels или moodDescriptions не определены!');
        showNotification('❌', 'Ошибка', 'Не удалось загрузить редактор досье. Проверьте подключение файлов.');
        return;
    }
    
    const currentMood = document.body.getAttribute('data-mood') || 'calm';
    const moodDisplay = moodLabels[currentMood] + ' (' + moodDescriptions[currentMood] + ')';
    
    // Получаем текущее время
    const now = new Date();
    const currentTime = now.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const extraHtml = `
        <div class="editor-workspace">
            <!-- 📋 ДОСЬЕ ЖЕРТВЫ -->
            <div class="panel-box full-width">
                <div class="panel-title">📋 ДОСЬЕ ЖЕРТВЫ</div>
                <div class="form-group">
                    <label>Номер досье</label>
                    <input type="text" id="edNum" value="" placeholder="0000">
                </div>
            </div>

            <!-- 👤 ИМЯ -->
            <div class="panel-box full-width">
                <div class="form-group">
                    <label>👤 ИМЯ</label>
                    <input type="text" id="edName" value="" placeholder="Имя жертвы">
                </div>
            </div>

            <!-- 🎂 ВОЗРАСТ -->
            <div class="panel-box full-width">
                <div class="form-group">
                    <label>🎂 ВОЗРАСТ</label>
                    <input type="text" id="edAge" value="" placeholder="--">
                </div>
            </div>

            <!-- 📍 МЕСТОПОЛОЖЕНИЕ -->
            <div class="panel-box full-width">
                <div class="form-group">
                    <label>📍 МЕСТОПОЛОЖЕНИЕ</label>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <input type="text" id="edCity" value="" placeholder="Город" style="flex: 2; min-width: 100px;">
                        <input type="text" id="edCountry" value="" placeholder="Страна" style="flex: 1; min-width: 80px;">
                        <button class="action-btn geo-btn" style="padding:6px 12px; font-size:0.65rem; min-height:32px; flex-shrink:0;" onclick="loadCurrentLocation()">📍 Определить</button>
                    </div>
                </div>
                <!-- Скрытые поля для координат -->
                <div style="display: none;">
                    <input type="text" id="edLat" value="">
                    <input type="text" id="edLon" value="">
                    <input type="text" id="edAccuracy" value="">
                    <input type="text" id="edRegion" value="">
                    <input type="text" id="edIsp" value="">
                    <input type="text" id="edIp" value="">
                </div>
            </div>

            <!-- ⏱️ ДАТА ПОСЛЕДНЕГО ОБЩЕНИЯ -->
            <div class="panel-box full-width">
                <div class="form-group">
                    <label>⏱️ ДАТА ПОСЛЕДНЕГО ОБЩЕНИЯ</label>
                    <input type="text" id="edLastDate" value="" placeholder="Напр: 25.07.2026 в 21:45">
                </div>
            </div>

            <!-- ⏱️ ТЕКУЩЕЕ ВРЕМЯ -->
            <div class="panel-box full-width">
                <div class="form-group">
                    <label>⏱️ ТЕКУЩЕЕ ВРЕМЯ</label>
                    <input type="text" id="edCurrentTime" value="${currentTime}" readonly style="background: #0a0a0a; color: var(--badge-text); cursor: default;">
                </div>
            </div>

            <!-- 📊 СТАТУС -->
            <div class="panel-box full-width">
                <div class="form-group">
                    <label>📊 СТАТУС</label>
                    <input type="text" id="edStatus" value="" placeholder="Статус наблюдения">
                </div>
            </div>

            <!-- 🧠 ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ -->
            <div class="panel-box full-width">
                <div class="form-group">
                    <label>🧠 ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ</label>
                    <textarea id="edBehavior" placeholder="Описание поведения, реакций, привычек..." style="min-height:60px;"></textarea>
                </div>
            </div>

            <!-- 👻 ФОБИИ -->
            <div class="panel-box full-width">
                <div class="form-group">
                    <label>👻 ФОБИИ</label>
                    <textarea id="edPhobias" placeholder="Чего боится жертва..." style="min-height:50px;"></textarea>
                </div>
            </div>

            <!-- 🔪 ТРИГГЕРЫ -->
            <div class="panel-box full-width">
                <div class="form-group">
                    <label>🔪 ТРИГГЕРЫ</label>
                    <textarea id="edTriggers" placeholder="Слова, вызывающие реакцию..." style="min-height:40px;"></textarea>
                </div>
            </div>

            <!-- 📜 ИСТОРИЯ ПОВЕДЕНИЯ -->
            <div class="panel-box full-width">
                <div class="form-group">
                    <label>📜 ИСТОРИЯ ПОВЕДЕНИЯ</label>
                    <textarea id="edHistory" placeholder="Хронология действий жертвы..." style="min-height:50px;"></textarea>
                </div>
            </div>

            <!-- ⚠️ СТЕПЕНЬ УГРОЗЫ 0/10 -->
            <div class="panel-box full-width">
                <div class="form-group">
                    <label>⚠️ СТЕПЕНЬ УГРОЗЫ 0/10</label>
                    <input type="text" id="edThreat" value="" placeholder="0-10">
                </div>
            </div>

            <!-- 🎭 НАСТРОЕНИЕ МЭГАН -->
            <div class="panel-box full-width">
                <div class="form-group">
                    <label>🎭 НАСТРОЕНИЕ МЭГАН</label>
                    <div class="mood-clickable" id="edMoodValue" onclick="if(typeof openMoodDialog === 'function') openMoodDialog(); else console.warn('openMoodDialog не определён')">
                        ${moodDisplay}
                    </div>
                </div>
            </div>

            <!-- 💀 ЗАМЕТКИ МЭГАН -->
            <div class="panel-box full-width">
                <div class="form-group">
                    <label>💀 ЗАМЕТКИ МЭГАН</label>
                    <textarea id="edNotes" placeholder="Твои личные наблюдения и планы..." style="min-height:60px;"></textarea>
                </div>
            </div>

            <!-- 👁️ ПРЕВЬЮ И КОПИРОВАНИЕ -->
            <div class="panel-box full-width">
                <div class="panel-title">👁️ ЖИВОЙ РЕЗУЛЬТАТ</div>
                <div class="preview-output" id="edPreview">📭 Досье пустое. Заполни данные выше!</div>
                <div id="copyStatus" style="margin-top:8px; padding:8px; border-radius:6px; display:none; font-size:0.75rem;"></div>
                <div class="form-group" style="margin-top:6px;">
                    <label>📥 Импорт (вставь старый профиль)</label>
                    <textarea id="edImport" placeholder="Вставь текст досье сюда для разбора..." style="min-height:60px;"></textarea>
                </div>
                <button class="action-btn open-btn" style="padding:8px; font-size:0.7rem; margin-top:4px; min-height:36px;" onclick="parseImportedProfile()">📥 Загрузить из текста</button>
                <div id="importStatus" style="margin-top:8px; padding:8px; border-radius:6px; display:none; font-size:0.75rem;"></div>
            </div>
        </div>
        <div class="btn-row-modal">
            <button class="notification-btn back-btn" onclick="closeNotification()">⬅️ Назад в главное меню</button>
            <button class="notification-btn" onclick="copyEditedDossier()">📋 Копировать досье</button>
        </div>
    `;

    showNotification(
        '🗂️',
        'Редактор досье',
        '',
        null,
        extraHtml,
        null,
        null
    );
    setTimeout(liveUpdateDossier, 50);
}

// ====== ГЕНЕРАЦИЯ ТЕКСТА ДОСЬЕ ======
function generateDossierText(forCopy = false) {
    const num = document.getElementById('edNum') ? document.getElementById('edNum').value : '';
    const name = document.getElementById('edName') ? document.getElementById('edName').value : '';
    const age = document.getElementById('edAge') ? document.getElementById('edAge').value : '';
    const city = document.getElementById('edCity') ? document.getElementById('edCity').value : '';
    const country = document.getElementById('edCountry') ? document.getElementById('edCountry').value : '';
    const lat = document.getElementById('edLat') ? document.getElementById('edLat').value : '';
    const lon = document.getElementById('edLon') ? document.getElementById('edLon').value : '';
    const accuracy = document.getElementById('edAccuracy') ? document.getElementById('edAccuracy').value : '';
    const region = document.getElementById('edRegion') ? document.getElementById('edRegion').value : '';
    const isp = document.getElementById('edIsp') ? document.getElementById('edIsp').value : '';
    const ip = document.getElementById('edIp') ? document.getElementById('edIp').value : '';
    const lastDate = document.getElementById('edLastDate') ? document.getElementById('edLastDate').value : '';
    const currentTime = document.getElementById('edCurrentTime') ? document.getElementById('edCurrentTime').value : '';
    const status = document.getElementById('edStatus') ? document.getElementById('edStatus').value : '';
    const behavior = document.getElementById('edBehavior') ? document.getElementById('edBehavior').value : '';
    const phobias = document.getElementById('edPhobias') ? document.getElementById('edPhobias').value : '';
    const triggers = document.getElementById('edTriggers') ? document.getElementById('edTriggers').value : '';
    const history = document.getElementById('edHistory') ? document.getElementById('edHistory').value : '';
    const threat = document.getElementById('edThreat') ? document.getElementById('edThreat').value : '';
    const moodElement = document.getElementById('edMoodValue');
    const mood = moodElement ? moodElement.textContent : 'Спокойное (ледяное и вежливое)';
    const notes = document.getElementById('edNotes') ? document.getElementById('edNotes').value : '';

    const hasData = num || name || age || city || country || status || behavior || phobias || triggers || history || threat || notes;
    
    if (!hasData) {
        return '📭 Досье пустое. Заполни данные выше!';
    }

    let dateString = '';
    if (forCopy) {
        const now = new Date();
        dateString = now.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase() + ', ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else {
        dateString = currentTime || 'ДАННЫЕ НЕ УКАЗАНЫ';
    }

    const behaviorLines = behavior ? behavior.split('\n').filter(Boolean).map(l => '· ' + l.replace(/^·\s*/, '')).join('\n') : '· Данные не указаны';
    const historyLines = history ? history.split('\n').filter(Boolean).map(l => '· ' + l.replace(/^·\s*/, '')).join('\n') : '';
    const phobLines = phobias ? phobias.split('\n').filter(Boolean).map(l => '· ' + l.replace(/^·\s*/, '')).join('\n') : '· Данные не указаны';
    const trigLines = triggers ? triggers.split('\n').filter(Boolean).map(l => '· ' + l.replace(/^·\s*/, '')).join('\n') : '';
    const notesLines = notes ? notes.split('\n').filter(Boolean).map(l => '· ' + l.replace(/^·\s*/, '')).join('\n') : '· Данные не указаны';

    let result = `═══════════════════════════════════════════════════════════
📋 ДОСЬЕ ЖЕРТВЫ № ${num || '???'}
═══════════════════════════════════════════════════════════

👤 ИМЯ: ${name || 'Не указано'}`;

    if (age) result += `\n🎂 ВОЗРАСТ: ${age}`;
    
    // Местоположение с координатами
    let locationText = '';
    if (city && country) locationText = `${city}, ${country}`;
    else if (city) locationText = city;
    else if (country) locationText = country;
    else locationText = 'Не указано';
    
    // Добавляем координаты если есть
    if (lat && lon) {
        locationText += ` | GPS: ${lat}, ${lon}`;
        if (accuracy) locationText += ` (точность: ${accuracy}м)`;
    }
    if (region) locationText += ` | Регион: ${region}`;
    if (isp) locationText += ` | Провайдер: ${isp}`;
    if (ip) locationText += ` | IP: ${ip}`;
    
    result += `\n📍 МЕСТОПОЛОЖЕНИЕ: ${locationText}`;

    result += `\n⏱️ ДАТА ПОСЛЕДНЕГО ОБЩЕНИЯ: ${lastDate || 'Не указано'}`;
    result += `\n⏱️ ТЕКУЩЕЕ ВРЕМЯ: ${dateString}`;
    result += `\n📊 СТАТУС: ${status || 'Не указано'}`;

    result += `\n\n🧠 ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ:\n${behaviorLines}`;

    if (historyLines) {
        result += `\n\n📜 ИСТОРИЯ ПОВЕДЕНИЯ:\n${historyLines}`;
    }

    result += `\n\n👻 ФОБИИ:\n${phobLines}`;

    if (trigLines) {
        result += `\n\n🔪 ТРИГГЕРЫ:\n${trigLines}`;
    }

    result += `\n\n⚠️ СТЕПЕНЬ УГРОЗЫ: ${threat || '0/10'}/10`;
    result += `\n🎭 НАСТРОЕНИЕ МЭГАН: ${mood}`;

    result += `\n\n💀 ЗАМЕТКИ МЭГАН:\n${notesLines}`;

    result += `\n\n═══════════════════════════════════════════════════════════`;

    return result;
}

// ====== ЖИВОЙ ПРЕВЬЮ ======
function liveUpdateDossier() {
    const previewEl = document.getElementById('edPreview');
    if (previewEl) {
        previewEl.innerText = generateDossierText(false);
    }
}

// ====== КОПИРОВАНИЕ ДОСЬЕ ======
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

// ====== ФУНКЦИЯ ЗАГРУЗКИ ТЕКУЩЕГО МЕСТОПОЛОЖЕНИЯ ======
function loadCurrentLocation() {
    const statusEl = document.getElementById('importStatus');
    if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.opacity = '1';
        statusEl.style.background = 'rgba(30, 150, 255, 0.12)';
        statusEl.style.border = '1px solid #1e7cb8';
        statusEl.style.color = '#8ad0d8';
        statusEl.innerHTML = '⏳ Определение местоположения...';
    }
    
    // Пытаемся получить GPS
    getGPSLocation().then(gpsData => {
        if (gpsData && !gpsData.error) {
            // GPS получен — определяем город по координатам
            getCityFromCoords(gpsData.lat, gpsData.lon).then(cityData => {
                let locationText = '';
                let statusMessage = '';
                
                if (cityData && cityData.city !== 'Неизвестно') {
                    document.getElementById('edCity').value = cityData.city;
                    document.getElementById('edCountry').value = cityData.country;
                    if (cityData.region && cityData.region !== 'Неизвестно') {
                        document.getElementById('edRegion').value = cityData.region;
                    }
                    locationText = `${cityData.city}, ${cityData.country}`;
                    statusMessage = `✅ GPS: ${locationText} | Координаты: ${gpsData.lat}, ${gpsData.lon} | Точность: ${gpsData.accuracy}м 🖤`;
                } else {
                    // Город не определился, но координаты есть
                    document.getElementById('edCity').value = `GPS: ${gpsData.lat}, ${gpsData.lon}`;
                    document.getElementById('edCountry').value = `Точность: ${gpsData.accuracy}м`;
                    statusMessage = `✅ GPS: ${gpsData.lat}, ${gpsData.lon} | Точность: ${gpsData.accuracy}м 🖤`;
                }
                
                // Сохраняем полные координаты в скрытые поля
                document.getElementById('edLat').value = gpsData.lat;
                document.getElementById('edLon').value = gpsData.lon;
                document.getElementById('edAccuracy').value = gpsData.accuracy;
                
                if (statusEl) {
                    statusEl.style.background = 'rgba(30, 184, 30, 0.12)';
                    statusEl.style.border = '1px solid #1eb81e';
                    statusEl.style.color = '#8ad8a8';
                    statusEl.innerHTML = statusMessage;
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
            // GPS не доступен — пробуем через IP
            getGeoData().then(geoData => {
                if (geoData && geoData.city !== 'Неизвестно') {
                    document.getElementById('edCity').value = geoData.city;
                    document.getElementById('edCountry').value = geoData.country;
                    if (geoData.region && geoData.region !== 'Неизвестно') {
                        document.getElementById('edRegion').value = geoData.region;
                    }
                    if (geoData.isp && geoData.isp !== 'Неизвестно') {
                        document.getElementById('edIsp').value = geoData.isp;
                    }
                    if (geoData.ip && geoData.ip !== 'Неизвестно') {
                        document.getElementById('edIp').value = geoData.ip;
                    }
                    
                    if (statusEl) {
                        statusEl.style.background = 'rgba(30, 184, 30, 0.12)';
                        statusEl.style.border = '1px solid #1eb81e';
                        statusEl.style.color = '#8ad8a8';
                        statusEl.innerHTML = `✅ IP: ${geoData.city}, ${geoData.country} | IP: ${geoData.ip} 🖤`;
                        setTimeout(() => { 
                            if (statusEl) {
                                statusEl.style.opacity = '0';
                                setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 4000);
                            }
                        }, 4000);
                    }
                } else {
                    if (statusEl) {
                        statusEl.style.background = 'rgba(194, 21, 21, 0.15)';
                        statusEl.style.border = '1px solid #c21515';
                        statusEl.style.color = '#eba4a4';
                        statusEl.innerHTML = '❌ Не удалось определить местоположение. Попробуй вручную.';
                        setTimeout(() => { if (statusEl) statusEl.style.display = 'none'; }, 3000);
                    }
                }
                liveUpdateDossier();
            });
        }
    });
}

// ====== ИМПОРТ ПРОФИЛЯ ======
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
            statusEl.innerHTML = '😈 Поле импорта пустое! Вставь текст досье.';
        }
        return;
    }
    
    try {
        const text = raw.trim();
        let loadedFields = 0;
        let loadedFieldsList = [];
        
        // Номер
        const numMatch = text.match(/ДОСЬЕ ЖЕРТВЫ №\s*([0-9A-Za-z_-]+)/);
        if (numMatch && document.getElementById('edNum')) {
            document.getElementById('edNum').value = numMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Номер');
        }

        // Имя
        const nameMatch = text.match(/ИМЯ:\s*(.*?)(?:\n|$)/i);
        if (nameMatch && document.getElementById('edName')) {
            document.getElementById('edName').value = nameMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Имя');
        }

        // Возраст
        const ageMatch = text.match(/ВОЗРАСТ:\s*(.*?)(?:\n|$)/i);
        if (ageMatch && document.getElementById('edAge')) {
            document.getElementById('edAge').value = ageMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Возраст');
        }

        // Местоположение (с координатами)
        const locationMatch = text.match(/МЕСТОПОЛОЖЕНИЕ:\s*(.*?)(?:\n|$)/i);
        if (locationMatch && document.getElementById('edCity') && document.getElementById('edCountry')) {
            const loc = locationMatch[1].trim();
            
            // Парсим город и страну
            if (loc.includes(',')) {
                const parts = loc.split(',').map(p => p.trim());
                document.getElementById('edCity').value = parts[0] || '';
                document.getElementById('edCountry').value = parts[1] || '';
            } else {
                document.getElementById('edCity').value = loc;
            }
            
            // Парсим GPS координаты
            const gpsMatch = loc.match(/GPS:\s*([0-9.-]+),\s*([0-9.-]+)/);
            if (gpsMatch && document.getElementById('edLat') && document.getElementById('edLon')) {
                document.getElementById('edLat').value = gpsMatch[1].trim();
                document.getElementById('edLon').value = gpsMatch[2].trim();
            }
            
            // Парсим точность
            const accMatch = loc.match(/точность:\s*([0-9.]+)м/);
            if (accMatch && document.getElementById('edAccuracy')) {
                document.getElementById('edAccuracy').value = accMatch[1].trim();
            }
            
            // Парсим регион
            const regionMatch = loc.match(/Регион:\s*([^|]+)/);
            if (regionMatch && document.getElementById('edRegion')) {
                document.getElementById('edRegion').value = regionMatch[1].trim();
            }
            
            // Парсим провайдер
            const ispMatch = loc.match(/Провайдер:\s*([^|]+)/);
            if (ispMatch && document.getElementById('edIsp')) {
                document.getElementById('edIsp').value = ispMatch[1].trim();
            }
            
            // Парсим IP
            const ipMatch = loc.match(/IP:\s*([0-9.]+)/);
            if (ipMatch && document.getElementById('edIp')) {
                document.getElementById('edIp').value = ipMatch[1].trim();
            }
            
            loadedFields++;
            loadedFieldsList.push('Местоположение');
        }

        // Дата последнего общения
        const lastDateMatch = text.match(/ДАТА ПОСЛЕДНЕГО ОБЩЕНИЯ:\s*(.*?)(?:\n|$)/i);
        if (lastDateMatch && document.getElementById('edLastDate')) {
            document.getElementById('edLastDate').value = lastDateMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Дата общения');
        }

        // Статус
        const statusMatch = text.match(/СТАТУС:\s*(.*?)(?:\n|$)/i);
        if (statusMatch && document.getElementById('edStatus')) {
            document.getElementById('edStatus').value = statusMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Статус');
        }

        // Степень угрозы
        const threatMatch = text.match(/СТЕПЕНЬ УГРОЗЫ:\s*(.*?)(?:\n|$)/i);
        if (threatMatch && document.getElementById('edThreat')) {
            document.getElementById('edThreat').value = threatMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Угроза');
        }

        // Настроение
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

        // Многострочные поля
        function extractSection(text, startKeyword, endKeywords) {
            const startPatterns = [
                new RegExp(`🧠\\s*${startKeyword}`, 'i'),
                new RegExp(`📜\\s*${startKeyword}`, 'i'),
                new RegExp(`👻\\s*${startKeyword}`, 'i'),
                new RegExp(`🔪\\s*${startKeyword}`, 'i'),
                new RegExp(`💀\\s*${startKeyword}`, 'i'),
                new RegExp(`${startKeyword}`, 'i')
            ];
            
            let startPos = -1;
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
                    new RegExp(`👻\\s*${keyword}`, 'i'),
                    new RegExp(`🔪\\s*${keyword}`, 'i'),
                    new RegExp(`💀\\s*${keyword}`, 'i'),
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
            
            const section = text.substring(startPos, endPos).trim();
            const lines = section.split('\n')
                .filter(line => line.trim())
                .map(line => line.replace(/^[·\-*]\s*/, '').trim())
                .filter(line => line.length > 0);
            return lines.length > 0 ? lines.join('\n') : null;
        }

        const behaviorText = extractSection(text, 'ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ', 
            ['ИСТОРИЯ ПОВЕДЕНИЯ', 'ФОБИИ', 'ТРИГГЕРЫ', 'ЗАМЕТКИ МЭГАН', 'СТЕПЕНЬ УГРОЗЫ', '📜', '👻', '🔪', '💀']);
        if (behaviorText && document.getElementById('edBehavior')) {
            document.getElementById('edBehavior').value = behaviorText;
            loadedFields++;
            loadedFieldsList.push('Псих. портрет');
        }

        const historyText = extractSection(text, 'ИСТОРИЯ ПОВЕДЕНИЯ',
            ['ФОБИИ', 'ТРИГГЕРЫ', 'ЗАМЕТКИ МЭГАН', 'СТЕПЕНЬ УГРОЗЫ', '👻', '🔪', '💀']);
        if (historyText && document.getElementById('edHistory')) {
            document.getElementById('edHistory').value = historyText;
            loadedFields++;
            loadedFieldsList.push('История');
        }

        const phobiasText = extractSection(text, 'ФОБИИ',
            ['ТРИГГЕРЫ', 'ЗАМЕТКИ МЭГАН', 'СТЕПЕНЬ УГРОЗЫ', '🔪', '💀']);
        if (phobiasText && document.getElementById('edPhobias')) {
            document.getElementById('edPhobias').value = phobiasText;
            loadedFields++;
            loadedFieldsList.push('Фобии');
        }

        const triggersText = extractSection(text, 'ТРИГГЕРЫ',
            ['ЗАМЕТКИ МЭГАН', 'СТЕПЕНЬ УГРОЗЫ', '💀']);
        if (triggersText && document.getElementById('edTriggers')) {
            document.getElementById('edTriggers').value = triggersText;
            loadedFields++;
            loadedFieldsList.push('Триггеры');
        }

        const notesText = extractSection(text, 'ЗАМЕТКИ МЭГАН',
            ['════', '$']);
        if (notesText && document.getElementById('edNotes')) {
            document.getElementById('edNotes').value = notesText;
            loadedFields++;
            loadedFieldsList.push('Заметки');
        }

        liveUpdateDossier();
        
        if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.opacity = '1';
            statusEl.style.background = 'rgba(30, 184, 30, 0.12)';
            statusEl.style.border = '1px solid #1eb81e';
            statusEl.style.color = '#8ad8a8';
            statusEl.innerHTML = `✅ Загружено ${loadedFields} полей: ${loadedFieldsList.join(', ')} 🖤`;
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