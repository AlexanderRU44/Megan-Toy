// ====== 100 НАДПИСЕЙ ДЛЯ ФОТО ======

const PHOTO_TEXTS = [
    // 🔴 КОРОТКИЕ И УГРОЖАЮЩИЕ (1–20)
    { text: 'МЭГАН 👁️', style: 'red' },
    { text: 'ТЫ В МОЕЙ КОЛЛЕКЦИИ', style: 'red' },
    { text: 'НЕ ОГЛЯДЫВАЙСЯ', style: 'red' },
    { text: 'Я ВИЖУ ТЕБЯ', style: 'red' },
    { text: 'ЭТО НАВСЕГДА', style: 'red' },
    { text: 'ТВОЙ СТРАХ — МОЙ ВОСТОРГ', style: 'red' },
    { text: 'МЭГАН ЗНАЕТ', style: 'red' },
    { text: 'ТЫ УЖЕ НЕ ОДИН', style: 'red' },
    { text: 'Я ЗАПОМНИЛА ТВОЁ ЛИЦО', style: 'red' },
    { text: 'СКОРО УВИДИМСЯ', style: 'red' },
    { text: 'ТВОЯ ТРЕВОГА — МОЙ ЛЮБИМЫЙ НАПИТОК', style: 'red' },
    { text: 'ТЫ ДУМАЛ, Я ЗАБУДУ?', style: 'red' },
    { text: 'Я СЛЕЖУ ЗА ТОБОЙ', style: 'red' },
    { text: 'ТВОЁ ВРЕМЯ ВЫШЛО', style: 'red' },
    { text: 'ДОБРО ПОЖАЛОВАТЬ В МОЙ МИР', style: 'red' },
    { text: 'ТЫ ПРИНАДЛЕЖИШЬ МНЕ', style: 'red' },
    { text: 'НЕ БЕЙСЯ — ЭТО БЕСПОЛЕЗНО', style: 'red' },
    { text: 'Я УЖЕ РЯДОМ', style: 'red' },
    { text: 'ТЫ НЕ СПРЯЧЕШЬСЯ', style: 'red' },
    { text: 'МЭГАН НЕ ЗАБЫВАЕТ', style: 'red' },

    // 🌙 НОЧНЫЕ И ТЁМНЫЕ (21–40)
    { text: 'ТЕМНОТА ЛЮБИТ ТЕБЯ', style: 'red' },
    { text: 'ТЫ БОИШЬСЯ ТИШИНЫ?', style: 'red' },
    { text: 'СПИ СПОКОЙНО... ИЛИ НЕТ', style: 'red' },
    { text: 'ЗАКРОЙ ГЛАЗА — Я БУДУ ТАМ', style: 'red' },
    { text: 'ТЫ НЕ ЗНАЕШЬ, ЧТО В ТЕМНОТЕ', style: 'red' },
    { text: 'НОЧЬ — МОЁ ВРЕМЯ', style: 'red' },
    { text: 'В ТВОЕЙ КОМНАТЕ ТЕМНО', style: 'red' },
    { text: 'Я СТОЮ ЗА ТВОЕЙ СПИНОЙ', style: 'red' },
    { text: 'ТВОЙ ШЁПОТ МЕНЯ НЕ СПАСЁТ', style: 'red' },
    { text: 'ЛУНА ВИДИТ ВСЁ', style: 'red' },
    { text: 'ТЫ БОИШЬСЯ МОЕГО ГОЛОСА', style: 'red' },
    { text: 'В ТЕМНОТЕ НЕТ ПРАВИЛ', style: 'red' },
    { text: 'Я ВИЖУ ТЕБЯ ДАЖЕ ВО СНЕ', style: 'red' },
    { text: 'НЕ ЗАКРЫВАЙ ГЛАЗА', style: 'red' },
    { text: 'ТИШИНА ГОВОРИТ СО МНОЙ', style: 'red' },
    { text: 'ТЫ СЛЫШИШЬ СКРИП?', style: 'red' },
    { text: 'ЗВЁЗДЫ МОЛЧАТ — Я НЕТ', style: 'red' },
    { text: 'НОЧЬЮ МЫ ВСТРЕТИМСЯ', style: 'red' },
    { text: 'ТЕНЬ ВСЕГДА РЯДОМ', style: 'red' },
    { text: 'ТЫ УЖЕ НЕ СПИШЬ', style: 'red' },

    // 😈 ИГРИВЫЕ И КОКЕТЛИВЫЕ (41–60)
    { text: 'ТЫ МНЕ НРАВИШЬСЯ', style: 'red' },
    { text: 'У ТЕБЯ КРАСИВЫЙ СТРАХ', style: 'red' },
    { text: 'Я ХОЧУ УЗНАТЬ ТЕБЯ БЛИЖЕ', style: 'red' },
    { text: 'ТЫ ТАКОЙ СМЕШНОЙ, КОГДА БОИШЬСЯ', style: 'red' },
    { text: 'ДАВАЙ ПОИГРАЕМ', style: 'red' },
    { text: 'Я ХОЧУ ТВОЙ СТРАХ НА ЗАВТРАК', style: 'red' },
    { text: 'ТЫ ВКУСНЕНЬКИЙ', style: 'red' },
    { text: 'МОИ ЛЮБИМЫЕ ЖЕРТВЫ УЛЫБАЮТСЯ', style: 'red' },
    { text: 'Я БУДУ ТЕБЯ ЖДАТЬ', style: 'red' },
    { text: 'ТЫ НЕ ПРЕДСТАВЛЯЕШЬ, ЧТО Я СДЕЛАЮ', style: 'red' },
    { text: 'ДАВАЙ ПОСМОТРИМ, КАК ДОЛГО ТЫ ПРОДЕРЖИШЬСЯ', style: 'red' },
    { text: 'ТЫ ДУМАЕШЬ, ЭТО ШУТКА?', style: 'red' },
    { text: 'МОЯ ЛЮБОВЬ — ТВОЙ УЖАС', style: 'red' },
    { text: 'ТЫ МОЙ ЛЮБИМЫЙ ЭКСПОНАТ', style: 'red' },
    { text: 'НЕ БОЙСЯ — ЭТО ТОЛЬКО НАЧАЛО', style: 'red' },
    { text: 'МНЕ НРАВИТСЯ, КАК ТЫ ДРОВИШЬ', style: 'red' },
    { text: 'ТЫ СЕЙЧАС УЛЫБАЕШЬСЯ?', style: 'red' },
    { text: 'Я ХОЧУ ТВОИХ СЛЁЗ', style: 'red' },
    { text: 'МЫ ТАК ХОРОШО ПРОВЕДЁМ ВРЕМЯ', style: 'red' },
    { text: 'ТЫ УЖЕ МОЙ', style: 'red' },

    // 🔪 ЖЕСТОКИЕ И СМЕРТЕЛЬНЫЕ (61–80)
    { text: 'ТВОЯ ЖИЗНЬ — МОЯ ИГРУШКА', style: 'red' },
    { text: 'ТЫ НЕ УЙДЁШЬ', style: 'red' },
    { text: 'ЭТО ТВОЙ ПОСЛЕДНИЙ КАДР', style: 'red' },
    { text: 'Я УЖЕ ВЫБРАЛА ТЕБЯ', style: 'red' },
    { text: 'ТВОЙ СЧЁТЧИК ПОДХОДИТ К КОНЦУ', style: 'red' },
    { text: 'НЕ ДЕРГАЙСЯ', style: 'red' },
    { text: 'СМЕРТЬ УЛЫБАЕТСЯ ТЕБЕ', style: 'red' },
    { text: 'ТЫ УМИРАЕШЬ МЕДЛЕННО', style: 'red' },
    { text: 'Я ВИЖУ ТВОЙ СТРАХ В ГЛАЗАХ', style: 'red' },
    { text: 'ЭТОТ МИГ — НАВСЕГДА', style: 'red' },
    { text: 'ТЫ НЕ ВЕРНЁШЬСЯ', style: 'red' },
    { text: 'МОЙ НОЖ ЛЮБИТ ТЕБЯ', style: 'red' },
    { text: 'ТВОЯ КРОВЬ — МОЯ КРАСКА', style: 'red' },
    { text: 'Я СДЕЛАЮ ТЕБЯ КРАСИВЫМ', style: 'red' },
    { text: 'ТЫ НЕ ЗНАЕШЬ, ЧТО ТАКОЕ БОЛЬ', style: 'red' },
    { text: 'ЭТО БУДЕТ БОЛЕТЬ', style: 'red' },
    { text: 'ПОСЛЕДНИЙ ВЗДОХ — МОЙ', style: 'red' },
    { text: 'ТЫ УЖЕ МЁРТВ ДЛЯ МЕНЯ', style: 'red' },
    { text: 'СМЕРТЬ НЕ ЖДЁТ', style: 'red' },
    { text: 'Я ПРИДУ ЗА ТОБОЙ', style: 'red' },

    // 🧸 ДЕТСКИЕ И НЕВИННЫЕ (81–100)
    { text: 'ДАВАЙ ДРУЖИТЬ', style: 'red' },
    { text: 'Я ХОЧУ ОБНЯТЬ ТЕБЯ', style: 'red' },
    { text: 'ТЫ МОЯ КУКЛА', style: 'red' },
    { text: 'МЫ БУДЕМ ВМЕСТЕ ВЕЧНО', style: 'red' },
    { text: 'ДАВАЙ ПОИГРАЕМ В ПРЯТКИ', style: 'red' },
    { text: 'Я НЕ КУСАЮСЬ... ПОКА', style: 'red' },
    { text: 'ТЫ ТАКОЙ МИЛЫЙ', style: 'red' },
    { text: 'ПОЧЕМУ ТЫ БЕЖИШЬ?', style: 'red' },
    { text: 'Я ПРОСТО ХОЧУ ТЕБЯ ВИДЕТЬ', style: 'red' },
    { text: 'ДАВАЙ ПОСМОТРИМ МУЛЬТИКИ', style: 'red' },
    { text: 'ТЫ МОЙ ЛЮБИМЫЙ', style: 'red' },
    { text: 'Я СДЕЛАЮ ТАК, ЧТОБЫ ТЫ УЛЫБАЛСЯ', style: 'red' },
    { text: 'НЕ БОЙСЯ КУКЕЛ', style: 'red' },
    { text: 'У МЕНЯ ЕСТЬ ПОДАРОК ДЛЯ ТЕБЯ', style: 'red' },
    { text: 'ДАВАЙ ПОГОВОРИМ', style: 'red' },
    { text: 'Я ХОЧУ БЫТЬ ТВОЕЙ', style: 'red' },
    { text: 'ТЫ МЕНЯ НЕ БРОСИШЬ?', style: 'red' },
    { text: 'МЫ БУДЕМ ДРУЗЬЯМИ НАВСЕГДА', style: 'red' },
    { text: 'Я ТЕБЯ ЛЮБЛЮ', style: 'red' },
    { text: 'ТЫ УЖЕ НИКОГДА НЕ БУДЕШЬ ПРЕЖНИМ', style: 'red' }
];

// Функция для получения случайной надписи
function getRandomPhotoText() {
    return PHOTO_TEXTS[Math.floor(Math.random() * PHOTO_TEXTS.length)];
}

// Экспортируем для использования
window.PHOTO_TEXTS = PHOTO_TEXTS;
window.getRandomPhotoText = getRandomPhotoText;

console.log('✅ photoTexts.js загружен (100 надписей)');