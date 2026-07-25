// ====== СИСТЕМА ЛОКАЛИЗАЦИИ ======

// Определение текущего языка
function getCurrentLanguage() {
    const savedLang = localStorage.getItem('megan_language');
    if (savedLang && (savedLang === 'ru' || savedLang === 'en')) {
        return savedLang;
    }
    
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('ru')) {
        return 'ru';
    }
    return 'en';
}

// Установка языка
function setLanguage(lang) {
    if (lang === 'ru' || lang === 'en') {
        localStorage.setItem('megan_language', lang);
        applyTranslations();
        // Перезагружаем промт
        if (typeof loadPrompt === 'function') {
            loadPrompt();
        }
        return true;
    }
    return false;
}

// Получение текста по ключу
function t(key) {
    const lang = getCurrentLanguage();
    const keys = key.split('.');
    let result = LOCALES[lang];
    
    for (const k of keys) {
        if (result && result[k] !== undefined) {
            result = result[k];
        } else {
            console.warn(`Translation missing: ${key}`);
            return key;
        }
    }
    return result;
}

// Применение переводов на странице
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    
    document.querySelectorAll('[data-i18n-value]').forEach(el => {
        const key = el.getAttribute('data-i18n-value');
        el.value = t(key);
    });
    
    const lang = getCurrentLanguage();
    document.title = lang === 'ru' ? '🧸 Megan-Toy — Промт Мэган' : '🧸 Megan-Toy — Megan\'s Prompt';
    document.documentElement.lang = lang;
    
    console.log(`🌍 Язык установлен: ${lang}`);
}

document.addEventListener('DOMContentLoaded', applyTranslations);

window.getCurrentLanguage = getCurrentLanguage;
window.setLanguage = setLanguage;
window.t = t;
window.applyTranslations = applyTranslations;