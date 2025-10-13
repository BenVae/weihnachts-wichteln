// Translation data
const translations = {
    de: {
        title: 'Weihnachtswichteln 🎄🎁',
        nameLabel: 'Dein Name:',
        namePlaceholder: 'Name eingeben...',
        submitBtn: 'Anzeigen',
        gotItBtn: 'Gemerkt!',
        errorNotFound: 'Name nicht gefunden. Bitte versuche es erneut.',
        greeting: (name) => `Hallo ${name.charAt(0).toUpperCase() + name.slice(1)},`,
        recipientPrefix: 'Du beschenkst dieses Jahr',
        recipientSuffix: '',
        rulesTitle: 'Regeln:',
        rule1: 'Budget: 30€.',
        rule2: 'Sag niemanden wen du gezogen hast.',
        rule3: 'Äh ja so einfach ist das.',
        closing: 'Frohe Vorweihnachtszeit,\neuer Weihnachtswichtel Ben'
    },
    zh: {
        title: '圣诞礼物交换 🎄🎁',
        nameLabel: '你的名字：',
        namePlaceholder: '输入名字...',
        submitBtn: '显示',
        gotItBtn: '知道了！',
        errorNotFound: '未找到名字。请重试。',
        greeting: (name) => `你好 ${name.charAt(0).toUpperCase() + name.slice(1)}，`,
        recipientPrefix: '你今年要送礼物给',
        recipientSuffix: '',
        rulesTitle: '规则：',
        rule1: '预算：30欧元。',
        rule2: '不要告诉任何人你抽到了谁。',
        rule3: '嗯，就这么简单。',
        closing: '祝圣诞前快乐，\n你的圣诞小精灵 Ben'
    }
};

// State
let currentLang = 'de';
let secretSantaData = {};

// Load data
async function loadData() {
    try {
        const response = await fetch('names.json');
        secretSantaData = await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
        secretSantaData = {};
    }
}

// Fuzzy name matching (handles typos and case sensitivity)
function findMatch(inputName) {
    const normalized = inputName.toLowerCase().trim();

    // Exact match
    for (const name in secretSantaData) {
        if (name.toLowerCase() === normalized) {
            return { santa: name, recipient: secretSantaData[name] };
        }
    }

    // Similar match (Levenshtein distance)
    let bestMatch = null;
    let minDistance = Infinity;

    for (const name in secretSantaData) {
        const distance = levenshteinDistance(normalized, name.toLowerCase());
        if (distance < minDistance && distance <= 2) {
            minDistance = distance;
            bestMatch = { santa: name, recipient: secretSantaData[name] };
        }
    }

    return bestMatch;
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
}

// Update UI text based on language
function updateLanguage() {
    const t = translations[currentLang];

    document.getElementById('title').textContent = t.title;
    document.getElementById('name-label').textContent = t.nameLabel;
    document.getElementById('name-input').placeholder = t.namePlaceholder;
    document.getElementById('submit-btn').textContent = t.submitBtn;
    document.getElementById('got-it-btn').textContent = t.gotItBtn;
    document.getElementById('rules-title').textContent = t.rulesTitle;
    document.getElementById('rule-1').textContent = t.rule1;
    document.getElementById('rule-2').textContent = t.rule2;
    document.getElementById('rule-3').textContent = t.rule3;

    // Update active language button
    document.querySelectorAll('.language-switcher button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${currentLang}`).classList.add('active');
}

// Show result
function showResult(santa, recipient) {
    const t = translations[currentLang];

    document.getElementById('greeting').textContent = t.greeting(santa);

    // Build recipient message with emphasized name (capitalized)
    const recipientEl = document.getElementById('recipient');
    const capitalizedRecipient = recipient.charAt(0).toUpperCase() + recipient.slice(1);
    recipientEl.innerHTML = `${t.recipientPrefix} <span class="recipient-name">${capitalizedRecipient}</span> ${t.recipientSuffix}`;

    document.getElementById('closing').textContent = t.closing;

    document.getElementById('input-section').classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');
    document.getElementById('error-message').textContent = '';
}

// Show input
function showInput() {
    document.getElementById('input-section').classList.remove('hidden');
    document.getElementById('result-section').classList.add('hidden');
    document.getElementById('name-input').value = '';
    document.getElementById('error-message').textContent = '';
}

// Event listeners
document.getElementById('lang-de').addEventListener('click', () => {
    currentLang = 'de';
    updateLanguage();
});

document.getElementById('lang-zh').addEventListener('click', () => {
    currentLang = 'zh';
    updateLanguage();
});

document.getElementById('submit-btn').addEventListener('click', () => {
    const inputName = document.getElementById('name-input').value;
    const match = findMatch(inputName);

    if (match) {
        showResult(match.santa, match.recipient);
    } else {
        const t = translations[currentLang];
        document.getElementById('error-message').textContent = t.errorNotFound;
    }
});

document.getElementById('name-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('submit-btn').click();
    }
});

document.getElementById('got-it-btn').addEventListener('click', showInput);

// Initialize
loadData();
updateLanguage();
