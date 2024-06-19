// Global variables for game state
let emptyRow = 3;
let emptyCol = 3;
let moveCounter = 0;
let timer;
let timeCounter = 0;

// Start a new game when the page loads
window.onload = () => {
    initializePuzzle();
    startTimer();
    setupModal();
};

// Create the puzzle board
function initializePuzzle(simple = false) {
    const table = document.getElementById('puzzle-board');
    table.innerHTML = '';
    let numbers = Array.from({ length: 15 }, (_, i) => i + 1);
    if (!simple) {
        numbers = numbers.sort(() => Math.random() - 0.5);
    }
    numbers.push(16); // The empty space

    let index = 0;
    for (let i = 0; i < 4; i++) {
        const row = table.insertRow();
        for (let j = 0; j < 4; j++) {
            const cell = row.insertCell();
            cell.id = `cell${i}${j}`;
            cell.className = `tile${numbers[index]}`;
            cell.innerHTML = numbers[index] !== 16 ? numbers[index] : '';
            cell.onclick = () => moveTile(i, j);
            if (numbers[index] === 16) {
                emptyRow = i;
                emptyCol = j;
            }
            index++;
        }
    }
    moveCounter = 0;
    timeCounter = 0;
    updateStats();
}

// Handle tile click
function moveTile(row, col) {
    if ((Math.abs(row - emptyRow) + Math.abs(col - emptyCol)) === 1) {
        swapTiles(row, col, emptyRow, emptyCol);
        emptyRow = row;
        emptyCol = col;
        moveCounter++;
        updateStats();
        if (checkWin()) {
            setTimeout(showWinModal, 100);
        }
    }
}

// Swap two tiles
function swapTiles(row1, col1, row2, col2) {
    const cell1 = document.getElementById(`cell${row1}${col1}`);
    const cell2 = document.getElementById(`cell${row2}${col2}`);
    [cell1.className, cell1.innerHTML, cell2.className, cell2.innerHTML] = 
    [cell2.className, cell2.innerHTML, cell1.className, cell1.innerHTML];
}

// Check if the puzzle is solved
function checkWin() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (document.getElementById(`cell${i}${j}`).className !== `tile${i * 4 + j + 1}`) {
                return false;
            }
        }
    }
    return true;
}

// Start a new game
function startNewGame() {
    initializePuzzle();
}

// Start a simple game
function startSimpleGame() {
    initializePuzzle(true);
}

// Start the game timer
function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeCounter++;
        updateStats();
    }, 1000);
}

// Update the move and time counters
function updateStats() {
    document.getElementById('moveCounter').innerText = moveCounter;
    document.getElementById('timeCounter').innerText = timeCounter;
}

// Set up the win modal
function setupModal() {
    const modal = document.getElementById("winModal");
    const span = document.getElementsByClassName("close")[0];

    span.onclick = () => modal.style.display = "none";

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

// Show the win modal
function showWinModal() {
    document.getElementById('finalMoveCount').innerText = moveCounter;
    document.getElementById('finalTimeCount').innerText = timeCounter;
    document.getElementById("winModal").style.display = "block";
}

// Restart the game when the "Play Again" button is clicked
function playAgain() {
    document.getElementById("winModal").style.display = "none";
    startNewGame();
}
