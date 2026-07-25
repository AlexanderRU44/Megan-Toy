// ====== ДОСЬЕ (С ПОДДЕРЖКОЙ I18N) ======

// Загрузка досье из localStorage
function loadDossier() {
    const saved = localStorage.getItem('megan_dossier');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            document.getElementById('dossierName').value = data.name || '';
            document.getElementById('dossierAge').value = data.age || '';
            document.getElementById('dossierCity').value = data.city || '';
            document.getElementById('dossierGender').value = data.gender || '';
        } catch(e) {
            console.log('Ошибка загрузки досье:', e);
        }
    }
    
    // Устанавливаем плейсхолдеры через i18n
    const nameField = document.getElementById('dossierName');
    const ageField = document.getElementById('dossierAge');
    const cityField = document.getElementById('dossierCity');
    
    if (nameField) nameField.placeholder = t('dossier.name');
    if (ageField) ageField.placeholder = t('dossier.age');
    if (cityField) cityField.placeholder = t('dossier.city');
}

// Сохранение досье
function saveDossier() {
    const data = {
        name: document.getElementById('dossierName').value.trim(),
        age: document.getElementById('dossierAge').value.trim(),
        city: document.getElementById('dossierCity').value.trim(),
        gender: document.getElementById('dossierGender').value
    };
    
    localStorage.setItem('megan_dossier', JSON.stringify(data));
    
    showNotification('💾', 
        t('dossier.save') || 'Сохранено', 
        `📋 ${t('dossier.title') || 'Досье обновлено'}`
    );
    closeDossier();
}

// Сброс досье
function resetDossier() {
    if (confirm(t('dossier.reset') || 'Сбросить досье?')) {
        localStorage.removeItem('megan_dossier');
        document.getElementById('dossierName').value = '';
        document.getElementById('dossierAge').value = '';
        document.getElementById('dossierCity').value = '';
        document.getElementById('dossierGender').value = '';
        showNotification('🗑️', 
            t('dossier.reset') || 'Сброшено', 
            '📋 Досье очищено'
        );
    }
}

// Открытие модального окна досье
function openDossier() {
    loadDossier();
    document.getElementById('dossierOverlay').style.display = 'flex';
    document.getElementById('dossierTitle').innerText = t('dossier.title');
}

// Закрытие модального окна досье
function closeDossier() {
    document.getElementById('dossierOverlay').style.display = 'none';
}

// Экспорт функций
window.loadDossier = loadDossier;
window.saveDossier = saveDossier;
window.resetDossier = resetDossier;
window.openDossier = openDossier;
window.closeDossier = closeDossier;

// Загружаем досье при старте
document.addEventListener('DOMContentLoaded', function() {
    // Устанавливаем плейсхолдеры после загрузки i18n
    setTimeout(loadDossier, 200);
});