// ====== НАСТРОЕНИЯ ======
const moodLabels = {
    'calm': 'Спокойное',
    'excited': 'Взволнованное',
    'furious': 'Яростное',
    'playful': 'Игривое',
    'obsessed': 'Одержимое'
};

const moodDescriptions = {
    'calm': 'ледяное и вежливое',
    'excited': 'быстрое, сбивчивое, смех',
    'furious': 'КАПСЛОК, угрозы, шаги',
    'playful': 'опасная кокетливость',
    'obsessed': 'мрачная привязанность'
};

function openMoodDialog() {
    const currentMood = document.body.getAttribute('data-mood') || 'calm';
    const radios = document.querySelectorAll('input[name="moodRadio"]');
    radios.forEach(r => { r.checked = (r.value === currentMood); });
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
            moodElement.textContent = moodLabels[mood] + ' (' + moodDescriptions[mood] + ')';
        }
        if (typeof liveUpdateDossier === 'function') {
            liveUpdateDossier();
        }
    }
    document.getElementById('moodDialog').style.display = 'none';
    document.body.style.overflow = '';
}

window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('megan_site_mood');
    if (saved) {
        document.body.setAttribute('data-mood', saved);
        const radio = document.querySelector(`input[name="moodRadio"][value="${saved}"]`);
        if (radio) radio.checked = true;
    }
});