// ====== НАСТРОЕНИЯ (С ПОДДЕРЖКОЙ I18N) ======

function getMoodLabels() {
    return {
        'calm': t('mood.calm'),
        'excited': t('mood.excited'),
        'furious': t('mood.furious'),
        'playful': t('mood.playful'),
        'obsessed': t('mood.obsessed')
    };
}

function getMoodDescriptions() {
    return {
        'calm': t('mood_descriptions.calm'),
        'excited': t('mood_descriptions.excited'),
        'furious': t('mood_descriptions.furious'),
        'playful': t('mood_descriptions.playful'),
        'obsessed': t('mood_descriptions.obsessed')
    };
}

function openMoodDialog() {
    console.log('🎭 openMoodDialog вызвана');
    
    const currentMood = document.body.getAttribute('data-mood') || 'calm';
    console.log('Текущее настроение:', currentMood);
    
    // Ищем модальное окно
    const dialog = document.getElementById('moodDialog');
    if (!dialog) {
        console.error('❌ Модальное окно #moodDialog не найдено!');
        return;
    }
    
    // Ищем радиокнопки с правильным именем (moodRadioModal)
    const radios = document.querySelectorAll('input[name="moodRadioModal"]');
    console.log('Найдено радиокнопок:', radios.length);
    
    if (radios.length === 0) {
        console.error('❌ Радиокнопки с именем moodRadioModal не найдены!');
        // Пробуем найти альтернативные
        const altRadios = document.querySelectorAll('input[type="radio"][name*="mood"]');
        console.log('Альтернативные радиокнопки:', altRadios.length);
    }
    
    radios.forEach(r => { 
        r.checked = (r.value === currentMood); 
        console.log(`Радио ${r.value}: ${r.checked ? '✓' : '✗'}`);
    });
    
    // Обновляем заголовок
    const title = dialog.querySelector('.mood-dialog-title');
    if (title) title.innerHTML = `<span>🧸</span> ${t('mood_dialog.title')}`;
    
    // Обновляем кнопки
    const cancelBtn = dialog.querySelector('.mood-dialog-actions .mood-dialog-btn:not(.primary)');
    if (cancelBtn) cancelBtn.textContent = t('mood_dialog.cancel');
    
    const applyBtn = dialog.querySelector('.mood-dialog-actions .primary');
    if (applyBtn) applyBtn.textContent = t('mood_dialog.apply');
    
    // Обновляем названия настроений
    const labels = getMoodLabels();
    const descriptions = getMoodDescriptions();
    
    const items = dialog.querySelectorAll('.mood-radio-item');
    items.forEach(item => {
        const radio = item.querySelector('input[type="radio"]');
        if (radio) {
            const mood = radio.value;
            const nameEl = item.querySelector('.mood-name');
            const descEl = item.querySelector('.mood-desc');
            const iconEl = item.querySelector('.mood-icon');
            
            if (nameEl) nameEl.textContent = labels[mood] || mood;
            if (descEl) descEl.textContent = descriptions[mood] || '';
            
            // Обновляем иконки
            const icons = {
                'calm': '🧊',
                'excited': '⚡',
                'furious': '🔥',
                'playful': '😈',
                'obsessed': '🖤'
            };
            if (iconEl) iconEl.textContent = icons[mood] || '🧸';
        }
    });
    
    dialog.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    console.log('✅ Модальное окно открыто');
}

function closeMoodDialog() {
    console.log('🎭 closeMoodDialog вызвана');
    const savedMood = localStorage.getItem('megan_site_mood') || 'calm';
    document.body.setAttribute('data-mood', savedMood);
    document.getElementById('moodDialog').style.display = 'none';
    document.body.style.overflow = '';
}

function applyMoodSelection() {
    console.log('🎭 applyMoodSelection вызвана');
    
    // Ищем выбранную радиокнопку с правильным именем (moodRadioModal)
    const selected = document.querySelector('input[name="moodRadioModal"]:checked');
    console.log('Выбрано:', selected ? selected.value : 'НЕТ');
    
    if (selected) {
        const mood = selected.value;
        console.log('Применяем настроение:', mood);
        
        document.body.setAttribute('data-mood', mood);
        localStorage.setItem('megan_site_mood', mood);
        
        // Обновляем отображение в редакторе профиля
        const moodElement = document.getElementById('edMoodValue');
        if (moodElement) {
            const labels = getMoodLabels();
            const descriptions = getMoodDescriptions();
            moodElement.textContent = labels[mood] + ' (' + descriptions[mood] + ')';
            console.log('Обновлено поле edMoodValue:', moodElement.textContent);
        } else {
            console.warn('⚠️ Поле edMoodValue не найдено');
        }
        
        if (typeof liveUpdateDossier === 'function') {
            liveUpdateDossier();
            console.log('✅ liveUpdateDossier вызвана');
        }
    } else {
        console.warn('⚠️ Не выбрано ни одной радиокнопки');
    }
    
    document.getElementById('moodDialog').style.display = 'none';
    document.body.style.overflow = '';
}

// ====== ЭКСПОРТ ДЛЯ ОБРАТНОЙ СОВМЕСТИМОСТИ ======
// Создаём глобальные переменные для dossier.js
window.moodLabels = getMoodLabels();
window.moodDescriptions = getMoodDescriptions();

// Обновляем при смене языка
document.addEventListener('languageChanged', function() {
    window.moodLabels = getMoodLabels();
    window.moodDescriptions = getMoodDescriptions();
});

// Восстановление при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('megan_site_mood');
    if (saved) {
        document.body.setAttribute('data-mood', saved);
        // Исправлено: ищем радиокнопку с правильным именем
        const radio = document.querySelector(`input[name="moodRadioModal"][value="${saved}"]`);
        if (radio) radio.checked = true;
    }
});

// Экспорт
window.openMoodDialog = openMoodDialog;
window.closeMoodDialog = closeMoodDialog;
window.applyMoodSelection = applyMoodSelection;

console.log('✅ mood.js загружен');
