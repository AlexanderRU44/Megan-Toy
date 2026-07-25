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
    const currentMood = document.body.getAttribute('data-mood') || 'calm';
    const radios = document.querySelectorAll('input[name="moodRadio"]');
    radios.forEach(r => { r.checked = (r.value === currentMood); });
    
    // Обновляем заголовок
    const title = document.querySelector('.mood-dialog-title');
    if (title) title.innerHTML = `${t('mood_dialog.title')}`;
    
    // Обновляем кнопки
    const cancelBtn = document.querySelector('.mood-dialog-actions .mood-dialog-btn:not(.primary)');
    if (cancelBtn) cancelBtn.textContent = t('mood_dialog.cancel');
    
    const applyBtn = document.querySelector('.mood-dialog-actions .primary');
    if (applyBtn) applyBtn.textContent = t('mood_dialog.apply');
    
    // Обновляем названия настроений
    const labels = getMoodLabels();
    const descriptions = getMoodDescriptions();
    
    document.querySelectorAll('.mood-radio-item').forEach(item => {
        const radio = item.querySelector('input[type="radio"]');
        if (radio) {
            const mood = radio.value;
            const nameEl = item.querySelector('.mood-name');
            const descEl = item.querySelector('.mood-desc');
            if (nameEl) nameEl.textContent = labels[mood] || mood;
            if (descEl) descEl.textContent = descriptions[mood] || '';
        }
    });
    
    document.getElementById('moodDialog').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeMoodDialog() {
    const savedMood = localStorage.getItem('megan_site_mood') || 'calm';
    document.body.setAttribute('data-mood', savedMood);
    document.getElementById('moodDialog').style.display = 'none';
    document.body.style.overflow = '';
}

function applyMoodSelection() {
    const selected = document.querySelector('input[name="moodRadio"]:checked');
    if (selected) {
        const mood = selected.value;
        document.body.setAttribute('data-mood', mood);
        localStorage.setItem('megan_site_mood', mood);
        
        const moodElement = document.getElementById('edMoodValue');
        if (moodElement) {
            const labels = getMoodLabels();
            const descriptions = getMoodDescriptions();
            moodElement.textContent = labels[mood] + ' (' + descriptions[mood] + ')';
        }
        if (typeof liveUpdateDossier === 'function') {
            liveUpdateDossier();
        }
    }
    document.getElementById('moodDialog').style.display = 'none';
    document.body.style.overflow = '';
}

// Восстановление при загрузке
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('megan_site_mood');
    if (saved) {
        document.body.setAttribute('data-mood', saved);
        const radio = document.querySelector(`input[name="moodRadio"][value="${saved}"]`);
        if (radio) radio.checked = true;
    }
});

// Экспорт
window.openMoodDialog = openMoodDialog;
window.closeMoodDialog = closeMoodDialog;
window.applyMoodSelection = applyMoodSelection;