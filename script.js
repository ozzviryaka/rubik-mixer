// Base moves for different cube sizes
const moveSets = {
    2: ['R', 'U', 'F'],
    3: ['R', 'L', 'U', 'D', 'F', 'B'],
    4: ['R', 'L', 'U', 'D', 'F', 'B', 'r', 'u', 'f', 'Rw', 'Uw', 'Fw'],
};

// Move descriptions for different cube sizes
const moveDescriptions = {
    2: [
        { move: 'R', desc: 'Right face clockwise' },
        { move: 'U', desc: 'Up face clockwise' },
        { move: 'F', desc: 'Front face clockwise' },
        { move: '\'', desc: 'Counter-clockwise (e.g., R\')' },
        { move: '2', desc: 'Double turn (e.g., R2)' }
    ],
    3: [
        { move: 'R', desc: 'Right face clockwise' },
        { move: 'L', desc: 'Left face clockwise' },
        { move: 'U', desc: 'Up face clockwise' },
        { move: 'D', desc: 'Down face clockwise' },
        { move: 'F', desc: 'Front face clockwise' },
        { move: 'B', desc: 'Back face clockwise' },
        { move: '\'', desc: 'Counter-clockwise (e.g., R\')' },
        { move: '2', desc: 'Double turn (e.g., R2)' }
    ],
    4: [
        { move: 'R', desc: 'Right outer face' },
        { move: 'L', desc: 'Left outer face' },
        { move: 'U', desc: 'Up outer face' },
        { move: 'D', desc: 'Down outer face' },
        { move: 'F', desc: 'Front outer face' },
        { move: 'B', desc: 'Back outer face' },
        { move: 'r', desc: 'Right inner layer' },
        { move: 'u', desc: 'Up inner layer' },
        { move: 'f', desc: 'Front inner layer' },
        { move: 'Rw', desc: 'Right wide face' },
        { move: 'Uw', desc: 'Up wide face' },
        { move: 'Fw', desc: 'Front wide face' },
        { move: '\'', desc: 'Counter-clockwise' },
        { move: '2', desc: 'Double turn' }
    ]
};

// Modifiers
const modifiers = ['', '\'', '2'];

// Opposite face pairs
const oppositeFaces = {
    'R': 'L', 'L': 'R',
    'U': 'D', 'D': 'U',
    'F': 'B', 'B': 'F',
    'r': 'l', 'l': 'r',
    'u': 'd', 'd': 'u',
    'f': 'b', 'b': 'f',
};

const defaultCubeSizeToMoveCount = {
    2: 11,
    3: 27,
    4: 45
};

// Get base face without modifier
function getBaseFace(move) {
    return move.replace(/['2]/g, '');
}

// Check if moves are similar (same face or opposite)
function areSimilarMoves(move1, move2) {
    const base1 = getBaseFace(move1);
    const base2 = getBaseFace(move2);
    
    // Same face
    if (base1 === base2) return true;
    
    // Opposite faces
    if (oppositeFaces[base1] === base2) return true;
    
    return false;
}

// Validate new move
function isValidMove(moves, newMove) {
    if (moves.length === 0) return true;
    
    const baseFace = getBaseFace(newMove);
    const lastMove = moves[moves.length - 1];
    const lastBaseFace = getBaseFace(lastMove);
    
    // Cannot repeat the same face consecutively
    if (baseFace === lastBaseFace) return false;
    
    // Check last 3 moves (to avoid duplicates in group of 4)
    if (moves.length >= 3) {
        const lastThree = moves.slice(-2);
        const lastThreeFaces = lastThree.map(m => getBaseFace(m));
        
        // If new face already appears in last 3 moves
        if (lastThreeFaces.includes(baseFace)) {
            return false;
        }
        
        // Check for opposite faces in last 3 moves
        for (const face of lastThreeFaces) {
            if (oppositeFaces[face] === baseFace) {
                return false;
            }
        }
    }
    
    return true;
}

// Generate random move
function generateRandomMove(availableMoves) {
    const baseFace = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    return baseFace + modifier;
}

// Generate scramble algorithm
function generateScramble(cubeSize, moveCount) {
    const availableMoves = moveSets[cubeSize];
    const scramble = [];
    let attempts = 0;
    const maxAttemptsPerMove = 50; // Maximum attempts per move
    
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
        
        // If couldn't add move after many attempts, add any valid one
        if (!moveAdded) {
            // Find all available faces that don't conflict
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
                // As last resort, just add a random move
                scramble.push(generateRandomMove(availableMoves));
            }
        }
    }
    
    return scramble;
}

// Display scramble algorithm
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

// Copy algorithm to clipboard
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

// Update move notation
function updateNotation(cubeSize) {
    const notationGrid = document.querySelector('.notation-grid');
    const descriptions = moveDescriptions[cubeSize];
    
    notationGrid.innerHTML = '';
    
    descriptions.forEach(item => {
        const notationItem = document.createElement('div');
        notationItem.className = 'notation-item';
        notationItem.innerHTML = `<strong>${item.move}</strong> - ${item.desc}`;
        notationGrid.appendChild(notationItem);
    });
}

// Event handlers
document.getElementById('generateBtn').addEventListener('click', () => {
    const cubeSize = parseInt(document.getElementById('cubeSize').value);
    const moveCount = parseInt(document.getElementById('moveCount').value);
    
    const scramble = generateScramble(cubeSize, moveCount);
    displayScramble(scramble);
});

document.getElementById('copyBtn').addEventListener('click', copyToClipboard);

// Update notation when cube size changes
document.getElementById('cubeSize').addEventListener('change', (e) => {
    const cubeSize = parseInt(e.target.value);
    updateNotation(cubeSize);
});

document.getElementById('cubeSize').addEventListener('change', (e) => {
    const cubeSize = parseInt(e.target.value);
    const moveCountSelect = document.getElementById('moveCount');
    const recommendedMoveCount = defaultCubeSizeToMoveCount[cubeSize];
    
    // Update move count selection to recommended value
    moveCountSelect.value = recommendedMoveCount;
});

document.getElementById('cubeSize').addEventListener('change', (e) => {
    const cubeSize = parseInt(document.getElementById('cubeSize').value);
    const moveCount = parseInt(document.getElementById('moveCount').value);
    
    const scramble = generateScramble(cubeSize, moveCount);
    displayScramble(scramble);
});

document.getElementById('moveCount').addEventListener('change', (e) => {
    const cubeSize = parseInt(document.getElementById('cubeSize').value);
    const moveCount = parseInt(e.target.value);
    
    const scramble = generateScramble(cubeSize, moveCount);
    displayScramble(scramble);
});

// Generate initial scramble on page load
window.addEventListener('load', () => {
    const cubeSize = parseInt(document.getElementById('cubeSize').value);
    const moveCount = parseInt(document.getElementById('moveCount').value);
    updateNotation(cubeSize);
    const scramble = generateScramble(cubeSize, moveCount);
    displayScramble(scramble);
});
