// ====== НАСТРОЕНИЕ (С ПОДДЕРЖКОЙ I18N) ======

// Текущее настроение
let currentMood = localStorage.getItem('megan_mood') || 'calm';

// Применение настроения
function applyMood(mood) {
    currentMood = mood;
    localStorage.setItem('megan_mood', mood);
    
    // Удаляем все классы настроения
    document.body.className = document.body.className
        .split(' ')
        .filter(c => !c.startsWith('mood-'))
        .join(' ');
    
    // Добавляем новый класс
    document.body.classList.add(`mood-${mood}`);
    
    console.log(`🎭 Настроение изменено на: ${mood}`);
}

// Открытие диалога выбора настроения
function openMoodDialog() {
    const dialog = document.getElementById('moodDialog');
    if (!dialog) return;
    
    dialog.style.display = 'flex';
    
    // Устанавливаем заголовок через i18n
    const title = document.getElementById('moodTitle');
    if (title) title.innerText = t('mood.title');
    
    // Устанавливаем текст кнопок через i18n
    const moodButtons = [
        { id: 'moodCalm', key: 'mood.calm' },
        { id: 'moodExcited', key: 'mood.excited' },
        { id: 'moodAngry', key: 'mood.angry' },
        { id: 'moodPlayful', key: 'mood.playful' },
        { id: 'moodObsessed', key: 'mood.obsessed' }
    ];
    
    moodButtons.forEach(({ id, key }) => {
        const btn = document.getElementById(id);
        if (btn) btn.innerText = t(key);
    });
}

// Закрытие диалога
function closeMoodDialog() {
    const dialog = document.getElementById('moodDialog');
    if (dialog) dialog.style.display = 'none';
}

// Выбор настроения
function selectMood(mood) {
    applyMood(mood);
    closeMoodDialog();
    showNotification('🎭', 
        t('mood.title') || 'Настроение', 
        `${t(`mood.${mood}`) || mood} ${t('mood.title') || 'выбрано'}`
    );
}

// Загрузка сохранённого настроения
function loadMood() {
    const saved = localStorage.getItem('megan_mood');
    if (saved) {
        applyMood(saved);
    } else {
        applyMood('calm');
    }
}

// Экспорт функций
window.applyMood = applyMood;
window.openMoodDialog = openMoodDialog;
window.closeMoodDialog = closeMoodDialog;
window.selectMood = selectMood;
window.loadMood = loadMood;

// Загружаем настроение при старте
document.addEventListener('DOMContentLoaded', loadMood);