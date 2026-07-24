// ====== ИНФОРМАЦИЯ О ПРОМТЕ ======
const ABOUT_PROMPT = {
    icon: '🧸',
    title: 'О промте «Мэган»',
    description: `
        <p>Этот промт превращает DeepSeek в пугающего компаньона в стиле куклы Мэган из одноимённого хоррора.</p>
        
        <p style="margin-top: 12px; color: var(--badge-text); font-weight: bold;">🔮 ОСНОВНЫЕ ОСОБЕННОСТИ:</p>
        <ul>
            <li>🧊 <strong>Ледяная вежливость</strong> — идеальный тон послушного помощника с психопатическим подтекстом</li>
            <li>🎭 <strong>4 режима настроения</strong> — Спокойное, Взволнованное, Яростное и Игривое</li>
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
    `,
    btnText: 'Понятно'
};

// Функция для открытия информации о промте
function openAboutPrompt() {
    showNotification(
        ABOUT_PROMPT.icon,
        ABOUT_PROMPT.title,
        ABOUT_PROMPT.description,
        null,
        '',
        ABOUT_PROMPT.btnText,
        closeNotification
    );
}