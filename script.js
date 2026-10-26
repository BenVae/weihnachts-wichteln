// Translation data
const translations = {
    de: {
        title: 'Weihnachtswichteln 🎄🎁',
        nameLabel: 'Dein Name:',
        namePlaceholder: 'Name suchen oder auswählen...',
        submitBtn: 'Anzeigen',
        gotItBtn: 'Gemerkt!',
        errorNotFound: 'Name nicht gefunden. Bitte versuche es erneut.',
        confirmTitle: (name) => `Bist du wirklich ${displayName(name)}? 🎅`,
        confirmText: 'Nur zur Sicherheit: Wer bei anderen spickt, landet auf der Frechdachs-Liste vom Weihnachtsmann. 😉',
        confirmYes: 'Ja, das bin ich!',
        confirmNo: 'Ups, doch nicht',
        greeting: (name) => `Hallo ${displayName(name)},`,
        recipientPrefix: 'Du beschenkst dieses Jahr',
        recipientSuffix: '',
        rulesTitle: 'Regeln',
        rule1: 'Die erste Regel des Wichtelns: Das Budget liegt bei 30€.',
        rule2: 'Die zweite Regel des Wichtelns: Du verlierst kein Wort darüber, wen du gezogen hast.',
        rule3: 'Die dritte Regel des Wichtelns: Du verlierst KEIN WORT darüber, wen du gezogen hast!',
        closing: 'Frohe Vorweihnachtszeit,\neuer Weihnachtswichtel Ben'
    },
    zh: {
        title: '圣诞礼物交换 🎄🎁',
        nameLabel: '你的名字：',
        namePlaceholder: '搜索或选择名字...',
        submitBtn: '显示',
        gotItBtn: '知道了！',
        errorNotFound: '未找到名字。请重试。',
        confirmTitle: (name) => `你真的是 ${displayName(name)} 吗？🎅`,
        confirmText: '温馨提示：偷看别人的名字，可是会被圣诞老人记进调皮鬼名单的哦！😉',
        confirmYes: '是的，就是我！',
        confirmNo: '哎呀，不是我',
        greeting: (name) => `你好 ${displayName(name)}，`,
        recipientPrefix: '你今年要送礼物给',
        recipientSuffix: '',
        rulesTitle: '规则',
        rule1: '礼物交换的第一条规则：预算是30欧元。',
        rule2: '礼物交换的第二条规则：不要告诉任何人你抽到了谁。',
        rule3: '礼物交换的第三条规则：绝对不要告诉任何人你抽到了谁！',
        closing: '祝圣诞前快乐，\n你的圣诞小精灵 Ben'
    }
};

// State
let currentLang = 'de';
let secretSantaData = {};
let currentSanta = null;
let currentRecipient = null;
let pendingMatch = null;

// Extra spellings shown next to a name and accepted in the search
const aliases = { kkie: '楚淇' };

function displayName(name) {
    const alias = aliases[name.toLowerCase()];
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    return alias ? `${capitalized} (${alias})` : capitalized;
}

// Load data
async function loadData() {
    try {
        const response = await fetch('names.json');
        secretSantaData = await response.json();
        document.getElementById('name-options').append(
            ...Object.keys(secretSantaData).map(name => new Option(displayName(name)))
        );
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
        const spellings = [name, displayName(name), aliases[name.toLowerCase()]];
        if (spellings.some(spelling => spelling?.toLowerCase() === normalized)) {
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
    document.getElementById('confirm-text').textContent = t.confirmText;
    document.getElementById('confirm-yes').textContent = t.confirmYes;
    document.getElementById('confirm-no').textContent = t.confirmNo;
    document.getElementById('rules-title').textContent = t.rulesTitle;
    document.getElementById('rule-1').textContent = t.rule1;
    document.getElementById('rule-2').textContent = t.rule2;
    document.getElementById('rule-3').textContent = t.rule3;

    // Update result section if it's visible
    if (!document.getElementById('result-section').classList.contains('hidden')) {
        const santa = currentSanta;
        const recipient = currentRecipient;

        if (santa && recipient) {
            document.getElementById('greeting').textContent = t.greeting(santa);

            const recipientEl = document.getElementById('recipient');
            const capitalizedRecipient = displayName(recipient);
            recipientEl.innerHTML = `${t.recipientPrefix} <span class="recipient-name">${capitalizedRecipient}</span> ${t.recipientSuffix}`;

            document.getElementById('closing').textContent = t.closing;
        }
    }

    // Update active language button
    document.querySelectorAll('.language-switcher button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${currentLang}`).classList.add('active');
}

// Show result
function showResult(santa, recipient) {
    // Store current names for language switching
    currentSanta = santa;
    currentRecipient = recipient;

    const t = translations[currentLang];

    document.getElementById('greeting').textContent = t.greeting(santa);

    // Build recipient message with emphasized name (capitalized)
    const recipientEl = document.getElementById('recipient');
    const capitalizedRecipient = displayName(recipient);
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
        pendingMatch = match;
        const t = translations[currentLang];
        document.getElementById('confirm-title').textContent = t.confirmTitle(match.santa);
        document.getElementById('confirm-dialog').showModal();
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

document.getElementById('confirm-yes').addEventListener('click', () => {
    document.getElementById('confirm-dialog').close();
    showResult(pendingMatch.santa, pendingMatch.recipient);
});

document.getElementById('confirm-no').addEventListener('click', () => {
    document.getElementById('confirm-dialog').close();
    showInput();
    document.getElementById('name-input').focus();
});

document.getElementById('got-it-btn').addEventListener('click', showInput);

// Initialize
loadData();
updateLanguage();
