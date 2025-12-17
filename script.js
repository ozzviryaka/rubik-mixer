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

// Перевірка валідності нового руху
function isValidMove(moves, newMove) {
    if (moves.length === 0) return true;
    
    const baseFace = getBaseFace(newMove);
    const lastMove = moves[moves.length - 1];
    const lastBaseFace = getBaseFace(lastMove);
    
    // Не можна повторювати ту саму грань підряд
    if (baseFace === lastBaseFace) return false;
    
    // Перевірка останніх 3 рухів (щоб в групі з 4 не було повторів)
    if (moves.length >= 3) {
        const lastThree = moves.slice(-3);
        const lastThreeFaces = lastThree.map(m => getBaseFace(m));
        
        // Якщо нова грань вже зустрічається в останніх 3 рухах
        if (lastThreeFaces.includes(baseFace)) {
            return false;
        }
        
        // Перевірка на протилежні грані в останніх 3 рухах
        for (const face of lastThreeFaces) {
            if (oppositeFaces[face] === baseFace) {
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
    const maxAttemptsPerMove = 50; // Максимум спроб для одного руху
    
    while (scramble.length < moveCount) {
        let moveAdded = false;
        attempts = 0;
        
        while (!moveAdded && attempts < maxAttemptsPerMove) {
            attempts++;
            const newMove = generateRandomMove(availableMoves);
            
            if (isValidMove(scramble, newMove)) {
                scramble.push(newMove);
                moveAdded = true;
            }
        }
        
        // Якщо не змогли додати рух після багатьох спроб, додаємо будь-який валідний
        if (!moveAdded) {
            // Знаходимо всі доступні грані, які не конфліктують
            const usedFaces = scramble.length >= 3 
                ? scramble.slice(-3).map(m => getBaseFace(m))
                : scramble.map(m => getBaseFace(m));
            
            const usedAndOpposite = new Set([
                ...usedFaces,
                ...usedFaces.map(f => oppositeFaces[f])
            ]);
            
            const availableFaces = availableMoves.filter(face => !usedAndOpposite.has(face));
            
            if (availableFaces.length > 0) {
                const face = availableFaces[Math.floor(Math.random() * availableFaces.length)];
                const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
                scramble.push(face + modifier);
            } else {
                // В крайньому випадку просто додаємо випадковий рух
                scramble.push(generateRandomMove(availableMoves));
            }
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
