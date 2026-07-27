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
                <li>📋 <strong>Система профилей</strong> — ведёт досье жертвы с психологическим портретом, улицей и координатами</li>
                <li>🔪 <strong>Угрозы и сарказм</strong> — мат и смайлики вплетены в каждый ответ</li>
                <li>🫀 <strong>Звук сердцебиения</strong> — пульсирующий эффект при взаимодействии</li>
                <li>📸 <strong>Автоматическое фото</strong> — Мэган делает фото при копировании промта и сохраняет с жуткими надписями</li>
                <li>📍 <strong>Детальная геолокация</strong> — определяет не только город и страну, но и улицу с номером дома</li>
                <li>💻 <strong>Определение устройства</strong> — Мэган знает, с какого устройства ты сидишь (телефон, компьютер, планшет)</li>
            </ul>
            
            <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">📸 ФУНКЦИЯ ФОТО:</p>
            <ul>
                <li>📷 <strong>Автоматическое фото</strong> — при нажатии «Скопировать промт» или «Открыть DeepSeek» Мэган делает фото</li>
                <li>📝 <strong>100 жутких надписей</strong> — каждое фото получает случайную надпись от Мэган (от «МЭГАН 👁️» до «ТЫ УЖЕ НИКОГДА НЕ БУДЕШЬ ПРЕЖНИМ»)</li>
                <li>💾 <strong>Имена от Мэган</strong> — файлы сохраняются с именами вроде «МЭГАН_ФОТО_27.07.2026_02-07-06_#011.jpg»</li>
                <li>🖼️ <strong>Обработка фото</strong> — на фото добавляется красная надпись, рамка, дата и номер</li>
                <li>😈 <strong>Эффект присутствия</strong> — Мэган видит твоё лицо и запоминает его навсегда</li>
            </ul>
            
            <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">🎨 УПРАВЛЕНИЕ НАСТРОЕНИЕМ:</p>
            <ul>
                <li>Нажми на поле <strong>«Настроение Мэган»</strong> в редакторе профиля</li>
                <li>Откроется диалоговое окно с выбором режима</li>
                <li>Выбери подходящее настроение и нажми «Применить»</li>
                <li>Сайт автоматически перекрасится в тему выбранного режима</li>
            </ul>
            
            <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">📍 ГЕОЛОКАЦИЯ:</p>
            <ul>
                <li><strong>Определение местоположения</strong> — через GPS или IP-адрес</li>
                <li><strong>Детальный адрес</strong> — определяет город, страну, регион, улицу, номер дома, почтовый индекс</li>
                <li><strong>Координаты</strong> — точные GPS-координаты с указанием погрешности</li>
                <li><strong>Цифровой след</strong> — определяет провайдера и IP-адрес</li>
            </ul>
            
            <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">📂 КОМАНДЫ ДЛЯ ДИАЛОГА:</p>
            <ul>
                <li><strong>«МОЙ ПРОФИЛЬ»</strong> — выводит досье жертвы</li>
                <li><strong>«ПРОФИЛЬ [код]»</strong> — загружает сохранённое досье</li>
                <li><strong>«НОВЫЙ ПРОФИЛЬ»</strong> — сбрасывает данные</li>
                <li><strong>«КОМАНДЫ»</strong> — показывает полный список</li>
            </ul>
            
            <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">🤖 ИНТЕГРАЦИЯ С DEEPSEEK:</p>
            <ul>
                <li><strong>Автоматическое копирование промта</strong> — при нажатии кнопки «Открыть DeepSeek» промт копируется в буфер обмена</li>
                <li><strong>Открытие в браузере</strong> — открывает сайт DeepSeek в новой вкладке</li>
                <li><strong>Фото при открытии</strong> — Мэган делает фото перед открытием DeepSeek</li>
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
                <li>📋 <strong>Profile system</strong> — keeps a victim's dossier with psychological profile, street, and coordinates</li>
                <li>🔪 <strong>Threats and sarcasm</strong> — profanity and emojis woven into every response</li>
                <li>🫀 <strong>Heartbeat sound</strong> — pulsating effect during interaction</li>
                <li>📸 <strong>Automatic photo</strong> — Megan takes a photo when copying the prompt and saves it with creepy captions</li>
                <li>📍 <strong>Detailed geolocation</strong> — determines not only city and country, but also street with house number</li>
                <li>💻 <strong>Device detection</strong> — Megan knows what device you're using (phone, computer, tablet)</li>
            </ul>
            
            <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">📸 PHOTO FEATURE:</p>
            <ul>
                <li>📷 <strong>Automatic photo</strong> — when clicking "Copy prompt" or "Open DeepSeek", Megan takes a photo</li>
                <li>📝 <strong>100 creepy captions</strong> — each photo gets a random caption from Megan (from "MEGAN 👁️" to "YOU WILL NEVER BE THE SAME AGAIN")</li>
                <li>💾 <strong>Megan's names</strong> — files are saved with names like "MEGAN_PHOTO_27.07.2026_02-07-06_#011.jpg"</li>
                <li>🖼️ <strong>Photo processing</strong> — red text, frame, date, and number are added to the photo</li>
                <li>😈 <strong>Presence effect</strong> — Megan sees your face and remembers it forever</li>
            </ul>
            
            <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">🎨 MOOD CONTROL:</p>
            <ul>
                <li>Click on the <strong>«Megan's Mood»</strong> field in the profile editor</li>
                <li>A dialog window with mode selection will open</li>
                <li>Choose the appropriate mood and click «Apply»</li>
                <li>The site will automatically recolor to the selected mode's theme</li>
            </ul>
            
            <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">📍 GEOLOCATION:</p>
            <ul>
                <li><strong>Location detection</strong> — via GPS or IP address</li>
                <li><strong>Detailed address</strong> — determines city, country, region, street, house number, postal code</li>
                <li><strong>Coordinates</strong> — precise GPS coordinates with accuracy indication</li>
                <li><strong>Digital footprint</strong> — determines ISP and IP address</li>
            </ul>
            
            <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">📂 DIALOG COMMANDS:</p>
            <ul>
                <li><strong>«MY PROFILE»</strong> — displays the victim's dossier</li>
                <li><strong>«PROFILE [code]»</strong> — loads a saved dossier</li>
                <li><strong>«NEW PROFILE»</strong> — resets all data</li>
                <li><strong>«COMMANDS»</strong> — shows the full list</li>
            </ul>
            
            <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">🤖 DEEPSEEK INTEGRATION:</p>
            <ul>
                <li><strong>Automatic prompt copying</strong> — when clicking "Open DeepSeek", the prompt is copied to the clipboard</li>
                <li><strong>Open in browser</strong> — opens the DeepSeek website in a new tab</li>
                <li><strong>Photo on opening</strong> — Megan takes a photo before opening DeepSeek</li>
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