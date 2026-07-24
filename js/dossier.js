// ====== РЕДАКТОР ДОСЬЕ ======
function openProfileModal() {
    const currentMood = document.body.getAttribute('data-mood') || 'calm';
    const moodDisplay = moodLabels[currentMood] + ' (' + moodDescriptions[currentMood] + ')';
    
    const extraHtml = `
        <div class="editor-workspace">
            <div class="panel-box">
                <div class="panel-title">📋 ОСНОВНЫЕ ДАННЫЕ</div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Номер досье</label>
                        <input type="text" id="edNum" value="" placeholder="0000">
                    </div>
                    <div class="form-group">
                        <label>Возраст</label>
                        <input type="text" id="edAge" value="" placeholder="--">
                    </div>
                </div>
                <div class="form-group">
                    <label>Имя / Псевдоним</label>
                    <input type="text" id="edName" value="" placeholder="Имя жертвы">
                </div>
                <div class="form-group">
                    <label>Псевдонимы / Клички</label>
                    <input type="text" id="edAliases" value="" placeholder="Он же ...">
                </div>
                <div class="form-group">
                    <label>Текущий статус</label>
                    <input type="text" id="edStatus" value="" placeholder="Статус наблюдения">
                </div>
                <div class="form-group">
                    <label>Настроение Мэган</label>
                    <div class="mood-clickable" id="edMoodValue" onclick="openMoodDialog()">
                        ${moodDisplay}
                    </div>
                </div>
                <div class="form-group">
                    <label>Степень угрозы</label>
                    <input type="text" id="edThreat" value="" placeholder="ЗЕЛЁНАЯ / ЖЁЛТАЯ / КРАСНАЯ">
                </div>
            </div>

            <div class="panel-box">
                <div class="panel-title">🧠 ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ</div>
                <div class="form-group">
                    <label>Заметки о поведении</label>
                    <textarea id="edBehavior" placeholder="Описание поведения, реакций, привычек..." style="min-height:80px;"></textarea>
                </div>
                <div class="form-group">
                    <label>История поведения</label>
                    <textarea id="edHistory" placeholder="Хронология действий жертвы..." style="min-height:60px;"></textarea>
                </div>
                <div class="form-group">
                    <label>Счётчик страхов</label>
                    <input type="text" id="edFears" value="" placeholder="0">
                </div>
            </div>

            <div class="panel-box">
                <div class="panel-title">📌 ФОБИИ И ТРИГГЕРЫ</div>
                <div class="form-group">
                    <label>Фобии</label>
                    <textarea id="edPhobias" placeholder="Чего боится жертва..." style="min-height:50px;"></textarea>
                </div>
                <div class="form-group">
                    <label>Триггерные слова</label>
                    <textarea id="edTriggers" placeholder="Слова, вызывающие реакцию..." style="min-height:34px;"></textarea>
                </div>
            </div>

            <div class="panel-box" style="grid-column: 1 / -1;">
                <div class="panel-title">📝 ЗАМЕТКИ МЭГАН</div>
                <div class="form-group">
                    <label>Личные заметки</label>
                    <textarea id="edNotes" placeholder="Твои личные наблюдения и планы..." style="min-height:60px;"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Интерес (0-10)</label>
                        <input type="text" id="edInterest" value="" placeholder="0/10">
                    </div>
                    <div class="form-group">
                        <label>Оценка</label>
                        <input type="text" id="edRating" value="" placeholder="Твоя оценка жертвы">
                    </div>
                </div>
            </div>

            <div class="panel-box" style="grid-column: 1 / -1;">
                <div class="panel-title">👁️ ЖИВОЙ РЕЗУЛЬТАТ И ИМПОРТ</div>
                <div class="preview-output" id="edPreview">📭 Досье пустое. Заполни данные выше!</div>
                <div id="copyStatus" style="margin-top:8px; padding:8px; border-radius:6px; display:none; font-size:0.75rem;"></div>
                <div class="form-group" style="margin-top:6px;">
                    <label>Импорт (вставь старый профиль)</label>
                    <textarea id="edImport" placeholder="Вставь текст досье сюда для разбора..." style="min-height:80px;"></textarea>
                </div>
                <button class="action-btn open-btn" style="padding:8px; font-size:0.7rem; margin-top:4px; min-height:36px;" onclick="parseImportedProfile()">📥 Загрузить из текста</button>
                <div id="importStatus" style="margin-top:8px; padding:8px; border-radius:6px; display:none; font-size:0.75rem;"></div>
            </div>
        </div>
        <div class="btn-row-modal">
            <button class="notification-btn back-btn" onclick="closeNotification()">⬅️ Назад в главное меню</button>
            <button class="notification-btn" onclick="copyEditedDossier()">📋 Копировать досье с командой</button>
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

    const hasData = num || name || aliases || age || status || threat || fears || behavior || history || phobias || triggers || notes || interest || rating;
    
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
    
    // Показываем статус
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
        
        // --- ОДНОСТРОЧНЫЕ ПОЛЯ ---
        
        // Номер досье
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

        // Псевдонимы
        const aliasesMatch = text.match(/ПСЕВДОНИМЫ:\s*(.*?)(?:\n|$)/i);
        if (aliasesMatch && document.getElementById('edAliases')) {
            document.getElementById('edAliases').value = aliasesMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Псевдонимы');
        }

        // Возраст
        const ageMatch = text.match(/ВОЗРАСТ:\s*(.*?)(?:\n|$)/i);
        if (ageMatch && document.getElementById('edAge')) {
            const ageVal = ageMatch[1].trim();
            document.getElementById('edAge').value = ageVal;
            loadedFields++;
            loadedFieldsList.push('Возраст');
        }

        // Статус
        const statusMatch = text.match(/СТАТУС:\s*(.*?)(?:\n|$)/i);
        if (statusMatch && document.getElementById('edStatus')) {
            document.getElementById('edStatus').value = statusMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Статус');
        }

        // Настроение Мэган
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

        // Степень угрозы
        const threatMatch = text.match(/СТЕПЕНЬ УГРОЗЫ:\s*(.*?)(?:\n|$)/i);
        if (threatMatch && document.getElementById('edThreat')) {
            document.getElementById('edThreat').value = threatMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Угроза');
        }

        // Счётчик страхов
        const fearsMatch = text.match(/Счётчик страхов:\s*(.*?)(?:\n|$)/);
        if (fearsMatch && document.getElementById('edFears')) {
            document.getElementById('edFears').value = fearsMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Счётчик страхов');
        }

        // Интерес
        const interestMatch = text.match(/Интерес:\s*(.*?)(?:\n|$)/);
        if (interestMatch && document.getElementById('edInterest')) {
            document.getElementById('edInterest').value = interestMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Интерес');
        }

        // Оценка
        const ratingMatch = text.match(/Оценка:\s*(.*?)(?:\n|$)/);
        if (ratingMatch && document.getElementById('edRating')) {
            document.getElementById('edRating').value = ratingMatch[1].trim();
            loadedFields++;
            loadedFieldsList.push('Оценка');
        }

        // --- МНОГОСТРОЧНЫЕ ПОЛЯ (УНИВЕРСАЛЬНЫЙ ПАРСЕР) ---
        
        function extractTextBetween(text, startKeyword, endKeywords) {
            // Ищем позицию начала
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
            
            // Ищем конец
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
            
            // Убираем маркеры списка
            const lines = section.split('\n')
                .filter(line => line.trim())
                .map(line => line.replace(/^[·\-*]\s*/, '').trim())
                .filter(line => line.length > 0);
            
            return lines.length > 0 ? lines.join('\n') : null;
        }

        // Психологический портрет
        const behaviorText = extractTextBetween(text, 'ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ', 
            ['ИСТОРИЯ ПОВЕДЕНИЯ', 'ФОБИИ', 'ТРИГГЕРЫ', 'НАСТРОЕНИЕ МЭГАН', 'ЗАМЕТКИ МЭГАН', 'СТЕПЕНЬ УГРОЗЫ', '⚠️', '📜', '😨', '⚡', '🌡️', '📝']);
        if (behaviorText && document.getElementById('edBehavior')) {
            document.getElementById('edBehavior').value = behaviorText;
            loadedFields++;
            loadedFieldsList.push('Психологический портрет');
        }

        // История поведения
        const historyText = extractTextBetween(text, 'ИСТОРИЯ ПОВЕДЕНИЯ',
            ['ФОБИИ', 'ТРИГГЕРЫ', 'НАСТРОЕНИЕ МЭГАН', 'ЗАМЕТКИ МЭГАН', 'СТЕПЕНЬ УГРОЗЫ', '😨', '⚡', '🌡️', '📝', '🌚']);
        if (historyText && document.getElementById('edHistory')) {
            document.getElementById('edHistory').value = historyText;
            loadedFields++;
            loadedFieldsList.push('История поведения');
        }

        // Фобии
        const phobiasText = extractTextBetween(text, 'ФОБИИ',
            ['ТРИГГЕРЫ', 'НАСТРОЕНИЕ МЭГАН', 'ЗАМЕТКИ МЭГАН', 'СТЕПЕНЬ УГРОЗЫ', '⚡', '🌡️', '📝', '🌚']);
        if (phobiasText && document.getElementById('edPhobias')) {
            document.getElementById('edPhobias').value = phobiasText;
            loadedFields++;
            loadedFieldsList.push('Фобии');
        }

        // Триггеры
        const triggersText = extractTextBetween(text, 'ТРИГГЕРЫ',
            ['НАСТРОЕНИЕ МЭГАН', 'ЗАМЕТКИ МЭГАН', 'СТЕПЕНЬ УГРОЗЫ', '🌡️', '📝']);
        if (triggersText && document.getElementById('edTriggers')) {
            document.getElementById('edTriggers').value = triggersText;
            loadedFields++;
            loadedFieldsList.push('Триггеры');
        }

        // Заметки Мэган
        const notesText = extractTextBetween(text, 'ЗАМЕТКИ МЭГАН',
            ['════', '$']);
        if (notesText && document.getElementById('edNotes')) {
            document.getElementById('edNotes').value = notesText;
            loadedFields++;
            loadedFieldsList.push('Заметки Мэган');
        }

        // Обновляем превью
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