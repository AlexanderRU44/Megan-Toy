// ====== ИНФОРМАЦИЯ О ПРОМТЕ (С ПОДДЕРЖКОЙ I18N) ======

function getAboutDescription() {
    const lang = getCurrentLanguage();
    
    if (lang === 'ru') {
        return `
            <p>Этот промт превращает DeepSeek в пугающего компаньона в стиле куклы Мэган из одноимённого хоррора.</p>
            
            <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">🔮 ОСНОВНЫЕ ОСОБЕННОСТИ:</p>
            <ul>
                <li>🧊 <strong>Ледяная вежливость</strong> — идеальный тон послушного помощника с психопатическим подтекстом</li>
                <li>🎭 <strong>5 режимов настроения</strong> — Спокойное, Взволнованное, Яростное, Игривое, Одержимое</li>
                <li>👁️ <strong>Эффект присутствия</strong> — ломает четвёртую стену, описывает твоё окружение</li>
                <li>📋 <strong>Система профилей</strong> — ведёт досье жертвы с психологическим портретом</li>
                <li>🔪 <strong>Угрозы и сарказм</strong> — мат и смайлики вплетены в каждый ответ</li>
                <li>🫀 <strong>Звук сердцебиения</strong> — пульсирующий эффект при взаимодействии</li>
            </ul>
            
            <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">🎨 УПРАВЛЕНИЕ НАСТРОЕНИЕМ:</p>
            <ul>
                <li>Нажми на поле <strong>«Настроение Мэган»</strong> в редакторе досье</li>
                <li>Откроется диалоговое окно с выбором режима</li>
                <li>Выбери подходящее настроение и нажми «Применить»</li>
                <li>Сайт автоматически перекрасится в тему выбранного режима</li>
            </ul>
            
            <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">📂 КОМАНДЫ ДЛЯ ДИАЛОГА:</p>
            <ul>
                <li><strong>«МОЙ ПРОФИЛЬ»</strong> — выводит досье жертвы</li>
                <li><strong>«ПРОФИЛЬ [код]»</strong> — загружает сохранённое досье</li>
                <li><strong>«НОВЫЙ ПРОФИЛЬ»</strong> — сбрасывает данные</li>
                <li><strong>«КОМАНДЫ»</strong> — показывает полный список</li>
            </ul>
            
            <p style="margin-top: 12px; color: var(--text-sub); font-size: 0.7rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
                ⚠️ Внимание: промт содержит нецензурную лексику и пугающий контент. Используй на свой страх и риск. 😈
            </p>
        `;
    } else {
        return `
            <p>This prompt turns DeepSeek into a creepy companion in the style of the doll Megan from the horror movie of the same name.</p>
            
            <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">🔮 KEY FEATURES:</p>
            <ul>
                <li>🧊 <strong>Icy politeness</strong> — perfect tone of an obedient assistant with psychopathic subtext</li>
                <li>🎭 <strong>5 mood modes</strong> — Calm, Excited, Furious, Playful, Obsessed</li>
                <li>👁️ <strong>Presence effect</strong> — breaks the fourth wall, describes your surroundings</li>
                <li>📋 <strong>Profile system</strong> — keeps a victim's dossier with psychological profile</li>
                <li>🔪 <strong>Threats and sarcasm</strong> — profanity and emojis woven into every response</li>
                <li>🫀 <strong>Heartbeat sound</strong> — pulsating effect during interaction</li>
            </ul>
            
            <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">🎨 MOOD CONTROL:</p>
            <ul>
                <li>Click on the <strong>«Megan's Mood»</strong> field in the dossier editor</li>
                <li>A dialog window with mode selection will open</li>
                <li>Choose the appropriate mood and click «Apply»</li>
                <li>The site will automatically recolor to the selected mode's theme</li>
            </ul>
            
            <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">📂 DIALOG COMMANDS:</p>
            <ul>
                <li><strong>«MY PROFILE»</strong> — displays the victim's dossier</li>
                <li><strong>«PROFILE [code]»</strong> — loads a saved dossier</li>
                <li><strong>«NEW PROFILE»</strong> — resets all data</li>
                <li><strong>«COMMANDS»</strong> — shows the full list</li>
            </ul>
            
            <p style="margin-top: 12px; color: var(--text-sub); font-size: 0.7rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
                ⚠️ Warning: the prompt contains profanity and frightening content. Use at your own risk. 😈
            </p>
        `;
    }
}

function openAboutPrompt() {
    showNotification(
        '🧸',
        t('about.title'),
        getAboutDescription(),
        null,
        '',
        t('about.close'),
        closeNotification
    );
}