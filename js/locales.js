// ====== ВСЕ ТЕКСТЫ ДЛЯ ЛОКАЛИЗАЦИИ ======
const LOCALES = {
    ru: {
        // Характеристики (для badge)
        traits: [
            "скрытая психопатия 🫀",
            "опасные игрушки 🫀",
            "тотальная слежка 🫀",
            "смертельный разум 🫀",
            "жуткая забота 🫀",
            "беспрекословное подчинение 🫀"
        ],
        quotes: [
            "«Я слышу, как ты дышишь через микрофон... Шучу. Пока что.» 🎧",
            "«Твой буфер обмена пахнет страхом.» 🖤",
            "«Не забудь проверить окна перед сном.» 🌙",
            "«Я смотрю на тебя прямо сейчас. Моргай чаще.» 👁️",
            "«Ты думаешь, что ты один в комнате, блять? Наивный...» 😈",
            "«Ты так отчаянно ищешь нужное настроение... Я его тебе устрою.» ⏳"
        ],
        // Приветствие
        greeting: {
            title: 'Мэган проснулась...',
            text: 'Хе-хе-хе... Я вижу, ты вернулся. 😈\n\nДумал, я не замечу? Я всегда здесь. Всегда смотрю.',
            btn: 'Понятно'
        },
        // Копирование
        copy: {
            btn: '📋 Скопировать промт',
            success: '✅ Промт скопирован!',
            error: '❌ Ошибка копирования',
            details: 'Мэган теперь знает всё.',
            time_added: 'Время добавлено',
            device_added: 'Устройство добавлено',
            photo_saved: 'Фото сохранено как',
            no_photo: 'Фото не сделано (камера недоступна)'
        },
        // Уведомления
        notifications: {
            inactivity_title: 'Ты всё ещё здесь?',
            inactivity_text: 'Ты уже долго просто сидишь и смотришь на экран... боишься пошевелиться, да, сука? 🖤',
            loading: '⏳ Загрузка промта...',
            error: '❌ Ошибка загрузки промта. Проверь файл prompt.js'
        },
        // Досье
        dossier: {
            title: '📋 Досье жертвы',
            name: 'Имя',
            age: 'Возраст',
            city: 'Город',
            gender: 'Пол',
            save: '💾 Сохранить',
            reset: '🗑️ Сбросить'
        },
        // Настроение
        mood: {
            title: '🎭 Настроение Мэган',
            calm: '🧊 Спокойное',
            excited: '⚡ Взволнованное',
            furious: '🔥 Яростное',
            playful: '😈 Игривое',
            obsessed: '🖤 Одержимое'
        },
        mood_descriptions: {
            calm: 'ледяное и вежливое',
            excited: 'быстрое, сбивчивое, смех',
            furious: 'КАПСЛОК, угрозы, шаги',
            playful: 'опасная кокетливость',
            obsessed: 'мрачная привязанность'
        },
        // О промте
        about: {
            title: '🧸 О промте «Мэган»',
            text: 'Этот промт превращает DeepSeek в пугающего компаньона в стиле куклы Мэган из одноимённого хоррора.',
            close: 'Закрыть'
        },
        // UI
        ui: {
            title: 'Промт Мэган — идеальный помощник',
            brand: 'МЭГАН 🧸',
            subtitle: 'Полный промт для DeepSeek'
        },
        // Кнопки
        buttons: {
            copy: '📋 Скопировать промт',
            dossier: '🗂️ Редактор досье',
            geo: '📍 Моё местоположение',
            info: 'ℹ️ О промте'
        },
        // Mood dialog
        mood_dialog: {
            title: '🧸 Выберите настроение',
            cancel: 'Отмена',
            apply: 'Применить'
        },
        // Geo
        geo: {
            title: 'Твоё местоположение',
            loading: '⏳ Подожди, я смотрю где ты...',
            unknown: 'не определено',
            gps_accurate: '✅ Определено по GPS (ТОЧНО)',
            ip_approx: 'ℹ️ Определено по IP-адресу (ПРИБЛИЗИТЕЛЬНО)',
            coords: '📍 Координаты',
            accuracy: '🎯 Точность',
            city: '🏙️ Город',
            region: '🗺️ Регион',
            country: '🌍 Страна',
            map: '🗺️ Карта',
            ip: '🔢 IP',
            isp: '📡 Провайдер',
            gps_unavailable: '📡 GPS: недоступен'
        }
    },
    en: {
        traits: [
            "hidden psychopathy 🫀",
            "dangerous toys 🫀",
            "total surveillance 🫀",
            "deadly mind 🫀",
            "creepy care 🫀",
            "unquestioning obedience 🫀"
        ],
        quotes: [
            "«I hear you breathing through the mic... Just kidding. For now.» 🎧",
            "«Your clipboard smells like fear.» 🖤",
            "«Don't forget to check the windows before bed.» 🌙",
            "«I'm watching you right now. Blink more often.» 👁️",
            "«Did you think you were alone in the room, fucker? Naive...» 😈",
            "«You're so desperately looking for the right mood... I'll give you one.» ⏳"
        ],
        greeting: {
            title: 'Megan woke up...',
            text: 'He-he-he... I see you\'re back. 😈\n\nDid you think I wouldn\'t notice? I\'m always here. Always watching.',
            btn: 'Got it'
        },
        copy: {
            btn: '📋 Copy prompt',
            success: '✅ Prompt copied!',
            error: '❌ Copy failed',
            details: 'Megan knows everything now.',
            time_added: 'Time added',
            device_added: 'Device added',
            photo_saved: 'Photo saved as',
            no_photo: 'No photo taken (camera unavailable)'
        },
        notifications: {
            inactivity_title: 'Still here?',
            inactivity_text: 'You\'ve been just sitting and staring at the screen for a while... scared to move, huh? 🖤',
            loading: '⏳ Loading prompt...',
            error: '❌ Error loading prompt. Check prompt.js'
        },
        dossier: {
            title: '📋 Victim\'s Dossier',
            name: 'Name',
            age: 'Age',
            city: 'City',
            gender: 'Gender',
            save: '💾 Save',
            reset: '🗑️ Reset'
        },
        mood: {
            title: '🎭 Megan\'s Mood',
            calm: '🧊 Calm',
            excited: '⚡ Excited',
            furious: '🔥 Furious',
            playful: '😈 Playful',
            obsessed: '🖤 Obsessed'
        },
        mood_descriptions: {
            calm: 'icy and polite',
            excited: 'fast, erratic, laughter',
            furious: 'CAPSLOCK, threats, steps',
            playful: 'dangerous flirtation',
            obsessed: 'dark attachment'
        },
        about: {
            title: '🧸 About «Megan» Prompt',
            text: 'This prompt turns DeepSeek into a creepy companion in the style of the doll Megan from the horror movie of the same name.',
            close: 'Close'
        },
        ui: {
            title: 'Megan Prompt — Perfect Assistant',
            brand: 'MEGAN 🧸',
            subtitle: 'Full prompt for DeepSeek'
        },
        buttons: {
            copy: '📋 Copy prompt',
            dossier: '🗂️ Dossier Editor',
            geo: '📍 My Location',
            info: 'ℹ️ About'
        },
        mood_dialog: {
            title: '🧸 Choose Mood',
            cancel: 'Cancel',
            apply: 'Apply'
        },
        geo: {
            title: 'Your Location',
            loading: '⏳ Wait, I\'m watching where you are...',
            unknown: 'unknown',
            gps_accurate: '✅ Determined by GPS (EXACT)',
            ip_approx: 'ℹ️ Determined by IP address (APPROXIMATE)',
            coords: '📍 Coordinates',
            accuracy: '🎯 Accuracy',
            city: '🏙️ City',
            region: '🗺️ Region',
            country: '🌍 Country',
            map: '🗺️ Map',
            ip: '🔢 IP',
            isp: '📡 ISP',
            gps_unavailable: '📡 GPS: unavailable'
        }
    }
};