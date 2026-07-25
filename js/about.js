// ====== О ПРОМТЕ (С ПОДДЕРЖКОЙ I18N) ======

// Открытие модального окна "О промте"
function openAboutPrompt() {
    const overlay = document.getElementById('aboutOverlay');
    if (!overlay) return;
    
    overlay.style.display = 'flex';
    
    // Устанавливаем все тексты через i18n
    const title = document.getElementById('aboutTitle');
    const text = document.getElementById('aboutText');
    const closeBtn = document.getElementById('aboutClose');
    const copyBtn = document.getElementById('aboutCopyBtn');
    
    if (title) title.innerText = t('about.title');
    if (text) text.innerText = t('about.text');
    if (closeBtn) closeBtn.innerText = t('about.close');
    if (copyBtn) copyBtn.innerText = t('copy.btn');
}

// Закрытие модального окна
function closeAboutPrompt() {
    const overlay = document.getElementById('aboutOverlay');
    if (overlay) overlay.style.display = 'none';
}

// Копирование промта из окна "О промте"
function copyAboutPrompt() {
    const promptElement = document.getElementById('fullPrompt');
    if (!promptElement) return;
    
    const text = promptElement.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showNotification('✅', 
            t('copy.success') || 'Скопировано', 
            t('copy.details') || 'Мэган теперь знает всё.'
        );
    }).catch(() => {
        showNotification('❌', 
            t('copy.error') || 'Ошибка', 
            'Не удалось скопировать'
        );
    });
}

// Экспорт функций
window.openAboutPrompt = openAboutPrompt;
window.closeAboutPrompt = closeAboutPrompt;
window.copyAboutPrompt = copyAboutPrompt;