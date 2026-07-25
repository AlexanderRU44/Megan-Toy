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
        if (typeof loadPrompt === 'function') {
            loadPrompt();
        }
        if (typeof initRandomQuote === 'function') {
            initRandomQuote();
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

// Получение массива по ключу
function tArray(key) {
    const lang = getCurrentLanguage();
    const keys = key.split('.');
    let result = LOCALES[lang];
    
    for (const k of keys) {
        if (result && result[k] !== undefined) {
            result = result[k];
        } else {
            console.warn(`Translation missing: ${key}`);
            return [];
        }
    }
    return Array.isArray(result) ? result : [];
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
    
    document.title = t('ui.title');
    document.documentElement.lang = getCurrentLanguage();
    
    updateTraits();
    
    console.log(`🌍 Язык установлен: ${getCurrentLanguage()}`);
}

function updateTraits() {
    const badge = document.getElementById('traitBadge');
    if (!badge) return;
    
    const traits = tArray('traits');
    if (traits.length > 0) {
        window._characterTraits = traits;
        if (window.traitIndex !== undefined) {
            const idx = window.traitIndex || 0;
            const [label, heart] = traits[idx % traits.length].split(' 🫀');
            badge.innerHTML = `<span>${label}</span><span class="inline-heart">🫀</span>`;
        }
    }
}

// Экспорт
window.getCurrentLanguage = getCurrentLanguage;
window.setLanguage = setLanguage;
window.t = t;
window.tArray = tArray;
window.applyTranslations = applyTranslations;
window.updateTraits = updateTraits;

document.addEventListener('DOMContentLoaded', applyTranslations);