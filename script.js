// Базові рухи для різних розмірів кубиків
const moveSets = {
    2: ['R', 'L', 'U', 'D', 'F', 'B'],
    3: ['R', 'L', 'U', 'D', 'F', 'B', 'M', 'E', 'S'],
    4: ['R', 'L', 'U', 'D', 'F', 'B', 'r', 'l', 'u', 'd', 'f', 'b'],
    5: ['R', 'L', 'U', 'D', 'F', 'B', 'r', 'l', 'u', 'd', 'f', 'b', 'Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw']
};

// Модифікатори
const modifiers = ['', '\'', '2'];

// Групи протилежних граней
const oppositeFaces = {
    'R': 'L', 'L': 'R',
    'U': 'D', 'D': 'U',
    'F': 'B', 'B': 'F',
    'r': 'l', 'l': 'r',
    'u': 'd', 'd': 'u',
    'f': 'b', 'b': 'f',
    'Rw': 'Lw', 'Lw': 'Rw',
    'Uw': 'Dw', 'Dw': 'Uw',
    'Fw': 'Bw', 'Bw': 'Fw',
    'M': 'M', 'E': 'E', 'S': 'S'
};

// Отримати базову грань без модифікатора
function getBaseFace(move) {
    return move.replace(/['2]/g, '');
}

// Перевірка, чи є рухи схожими (та сама грань або протилежні)
function areSimilarMoves(move1, move2) {
    const base1 = getBaseFace(move1);
    const base2 = getBaseFace(move2);
    
    // Та сама грань
    if (base1 === base2) return true;
    
    // Протилежні грані
    if (oppositeFaces[base1] === base2) return true;
    
    return false;
}

// Перевірка останніх 4 рухів на наявність повторів або схожих рухів
function isValidSequence(moves) {
    if (moves.length < 4) return true;
    
    const lastFour = moves.slice(-4);
    const faces = lastFour.map(move => getBaseFace(move));
    
    // Перевірка на повтори
    const uniqueFaces = new Set(faces);
    if (uniqueFaces.size < faces.length) {
        return false;
    }
    
    // Перевірка на схожі рухи (протилежні грані)
    for (let i = 0; i < lastFour.length; i++) {
        for (let j = i + 1; j < lastFour.length; j++) {
            if (areSimilarMoves(lastFour[i], lastFour[j])) {
                return false;
            }
        }
    }
    
    return true;
}

// Генерація випадкового руху
function generateRandomMove(availableMoves) {
    const baseFace = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    return baseFace + modifier;
}

// Генерація алгоритму змішування
function generateScramble(cubeSize, moveCount) {
    const availableMoves = moveSets[cubeSize];
    const scramble = [];
    let attempts = 0;
    const maxAttempts = moveCount * 100; // Запобігання нескінченному циклу
    
    while (scramble.length < moveCount && attempts < maxAttempts) {
        attempts++;
        const newMove = generateRandomMove(availableMoves);
        
        // Не додаємо рух, якщо він ідентичний попередньому
        if (scramble.length > 0 && newMove === scramble[scramble.length - 1]) {
            continue;
        }
        
        // Не додаємо рух, якщо він з тієї ж грані, що й попередній
        if (scramble.length > 0 && getBaseFace(newMove) === getBaseFace(scramble[scramble.length - 1])) {
            continue;
        }
        
        scramble.push(newMove);
        
        // Перевірка валідності послідовності
        if (!isValidSequence(scramble)) {
            scramble.pop(); // Видаляємо неправильний рух
        }
    }
    
    return scramble;
}

// Відображення алгоритму
function displayScramble(scramble) {
    const algorithmDiv = document.getElementById('algorithm');
    algorithmDiv.innerHTML = '';
    algorithmDiv.classList.add('has-content');
    
    scramble.forEach((move, index) => {
        const moveSpan = document.createElement('span');
        moveSpan.className = 'move';
        moveSpan.textContent = move;
        moveSpan.style.animationDelay = `${index * 0.05}s`;
        algorithmDiv.appendChild(moveSpan);
    });
}

// Копіювання алгоритму
function copyToClipboard() {
    const algorithmDiv = document.getElementById('algorithm');
    const moves = Array.from(algorithmDiv.querySelectorAll('.move'))
        .map(span => span.textContent)
        .join(' ');
    
    if (moves) {
        navigator.clipboard.writeText(moves).then(() => {
            const copyBtn = document.getElementById('copyBtn');
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span class="copy-icon">✅</span>';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
                copyBtn.classList.remove('copied');
            }, 2000);
        });
    }
}

// Обробники подій
document.getElementById('generateBtn').addEventListener('click', () => {
    const cubeSize = parseInt(document.getElementById('cubeSize').value);
    const moveCount = parseInt(document.getElementById('moveCount').value);
    
    const scramble = generateScramble(cubeSize, moveCount);
    displayScramble(scramble);
});

document.getElementById('copyBtn').addEventListener('click', copyToClipboard);

// Генерація початкового алгоритму при завантаженні сторінки
window.addEventListener('load', () => {
    const cubeSize = parseInt(document.getElementById('cubeSize').value);
    const moveCount = parseInt(document.getElementById('moveCount').value);
    const scramble = generateScramble(cubeSize, moveCount);
    displayScramble(scramble);
});
