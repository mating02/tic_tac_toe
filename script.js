const grid = document.querySelector('.gridBoard');
const displayText = document.querySelector('.resultText');
const restartBtn = document.querySelector('.btn-primary');
const optionPlayerX = document.querySelector('.option.X');
const optionPlayerO = document.querySelector('.option.O');
const selectElement = document.getElementById('selectDiff');
let selectedValue = selectElement.value; 
let isGameRestarted = false;
let isPlayerO = false;
let easy = selectedValue==="easy" || selectedValue==="medium" || selectedValue==="hard";

const gameBoard = (() => {
    const field = Array.from({ length: 3 }, () => new Array(3));
    const cleanField = () => {
        field.forEach(row => row.fill(undefined))
    }
    const gridCreate = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell', `cell-${i}-${j}`);
                grid.appendChild(cell);
            }
        }
    }
    return { field, cleanField, gridCreate };
})();

gameBoard.gridCreate();

const isGameWon = () => {
    // add const winner
    // look if a player has won
    let winner;
    let value = false;
    if (gameBoard.field[1][1] !== undefined) {
        if (gameBoard.field[0][0] == gameBoard.field[1][1] && gameBoard.field[1][1] == gameBoard.field[2][2] ||
            gameBoard.field[0][2] == gameBoard.field[1][1] && gameBoard.field[1][1] == gameBoard.field[2][0]) {
            winner = gameBoard.field[1][1];
            value = true;
        }
    }

    for (let i = 0; i < 3; i++) {
        if (gameBoard.field[i][0] !== undefined) {
            if (gameBoard.field[i][0] == gameBoard.field[i][1] && gameBoard.field[i][1] == gameBoard.field[i][2]) {
                winner = gameBoard.field[i][0];
                value = true;
            }
        }
    }

    for (let j = 0; j < 3; j++) {
        if (gameBoard.field[1][j] !== undefined) {
            if (gameBoard.field[0][j] == gameBoard.field[1][j] && gameBoard.field[1][j] == gameBoard.field[2][j]) {
                winner = gameBoard.field[0][j];
                value = true;
            }
        }
    }
    return { winner, value };
}

const PlayGame = (() => {
    const isBoardFull = () => {
        let isFull = true;
        outer: for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameBoard.field[i][j] === undefined) {
                    isFull = false;
                    break outer;
                }
            }
        }
        return { isFull };
    }

    const displayStatus = (player) => {
        const gameWon = isGameWon();
        const boardFull = isBoardFull();
        if (gameWon.value) {
            displayText.textContent = `${gameWon.winner} has won the game!`;
        }
        else if (boardFull.isFull) {
            displayText.textContent = "It's a draw!";
        }
        else {
            //if playerSelection === "X"...
            displayText.textContent = `Let's go!`;
        }
    }
    return { displayStatus, isBoardFull };
})();

const Player = (marker) => {
    const Tick = (posx, posy) => {
        if (gameBoard.field[posx][posy] === undefined) {
            gameBoard.field[posx][posy] = marker;
        }
        const checkResult = isGameWon();
        if (marker === "X") {
            marker = "O";
            if (!checkResult.value && !PlayGame.isBoardFull().isFull) {
                if(easy){
                    Bot().playRandom(marker);
                }
                else{
                    Bot().playHard(marker);
                }
                marker = "X";
            }

        }
        else {
            marker = "X";
            if (!checkResult.value && !PlayGame.isBoardFull().isFull) {
                if(easy){
                    Bot().playRandom(marker);
                }
                else{
                    Bot().playHard(marker);
                }
                marker = "O";
            }
        }
    }
    const getMarker = () => marker;
    const setMarker = (mark) => marker = mark;
    return { Tick, getMarker, setMarker };
};

const fieldSteps = Array.from({length: 3}, () => new Array(3).fill(0)); // This array is necessary to find the best move

function minmax(marker, player, steps){
    const gameWon = isGameWon();
    if(gameWon.value || PlayGame.isBoardFull().isFull){
        if(gameWon.winner === marker){
            return 100/steps;     //so the maximum will be the min number of steps
        }
        else if(gameWon.winner !== marker){
            return -100 /steps;  //so the maximum will be the min number of steps
        }
        else{
            return 0;
        }
    }
    if(player.getMarker() === marker){
        let value = Number.MIN_SAFE_INTEGER;
        let bestMove = { row: -1, col: -1};
        for(let i = 0; i < 3; i++){
            for(let j= 0; j < 3; j++){
                if(gameBoard.field[i][j] === undefined){
                    gameBoard.field[i][j] = player.getMarker();
                    const opponentMarker = player.getMarker() === "X" ? "O" : "X";
                    player.setMarker(opponentMarker);
                    const newVal = minmax(marker, player, steps+1);
                    if(newVal > value){
                        value = newVal;
                        bestMove = { row: i, col: j };
                    }
                    gameBoard.field[i][j] = undefined;
                    fieldSteps[i][j] = value;
                    const originalMarker = player.getMarker() === "X" ? "O" : "X";
                    player.setMarker(originalMarker);
                }
            }
        }
        if (steps === 0) {
            // If it's the top-level call, return the best move
            return bestMove;
        }
        return value;
    }
    else{
        let val = Number.MAX_SAFE_INTEGER;
        let bestMove = { row:-1, col:-1 };
        for(let i = 0; i < 3; i++){
            for(let j= 0; j < 3; j++){
                if(gameBoard.field[i][j] === undefined){
                    gameBoard.field[i][j] = player.getMarker();
                    const opponentMarker = player.getMarker() === "X" ? "O" : "X";
                    player.setMarker(opponentMarker);
                    const newVal = minmax(marker, player, steps+1);
                    if(newVal < val){
                        val = newVal;
                        bestMove = { row: i, col: j };
                    }
                    gameBoard.field[i][j] = undefined;
                    fieldSteps[i][j] = val;
                    const originalMarker = player.getMarker() === "X" ? "O" : "X";
                    player.setMarker(originalMarker);
                }
            }
        }
        if (steps === 0) {
            // If it's the top-level call, return the best move
            return bestMove;
        }
        return val;
    }
}

//Ort der besten Wahrscheinlichkeit speichern

const Bot = (() => {
    const playRandom = (marker) => {
        let randomRow = Math.floor(Math.random() * 3);
        let randomCol = Math.floor(Math.random() * 3);
        while (gameBoard.field[randomRow][randomCol] !== undefined) {
            randomRow = Math.floor(Math.random() * 3);
            randomCol = Math.floor(Math.random() * 3);
        }
        const chosenCell = document.querySelector(`.cell-${randomRow}-${randomCol}`);
        gameBoard.field[randomRow][randomCol] = marker;
        if (marker === "X") {
            chosenCell.style.color = "#FF5722";
        }
        else {
            chosenCell.style.color = "#2196F3";
        }
        chosenCell.textContent = marker;
    };
        const playHard = (marker) => {
        const currentPlayer = Player(marker);
        const bestMove = minmax(marker, currentPlayer, 0);
        const chosenCell = document.querySelector(`.cell-${bestMove.row}-${bestMove.col}`);
        gameBoard.field[bestMove.row][bestMove.col] = marker;
        if (marker === "X") {
            chosenCell.style.color = "#FF5722";
        }
        else {
            chosenCell.style.color = "#2196F3";
        }
        chosenCell.textContent = marker;
    }

    return { playRandom, playHard};
});

const displayController = (() => {
    let currentPlayer = Player("X");
    const activateBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              
                const cell = document.querySelector(`.cell-${i}-${j}`);
                cell.addEventListener('click', () => {
                    if (gameBoard.field[i][j] === undefined) {
                        const checkGame = isGameWon();
                        if (!checkGame.value) {
                            if(isPlayerO){
                                currentPlayer.setMarker("O");
                            }
                            else{
                                currentPlayer.setMarker("X");
                            }
                            if (currentPlayer.getMarker() === "X") {
                                cell.style.color = "#FF5722";
                            }
                            else {
                                cell.style.color = "#2196F3";
                            }
                            cell.textContent = currentPlayer.getMarker();
                            currentPlayer.Tick(i, j);
                        }
                    }
                    PlayGame.displayStatus(currentPlayer);
                });
            };
        };
    };
    return { activateBoard };
});


function restartGame() {
    gameBoard.cleanField();
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        cell.textContent = '';
    });
    if(isPlayerO){
        if(easy){
            Bot().playRandom("X");
        }
        else{
            Bot().playHard("X");
        }
    }
    isGameRestarted = true;
    displayText.textContent = "Let's go!";
}

restartBtn.addEventListener('click', () => {
    restartGame();
});

optionPlayerO.addEventListener('click', () => {
    let checkPlayerO = true;
    if(!isPlayerO){
        checkPlayerO = false;
    }
    isPlayerO = true;
    if(!checkPlayerO){restartGame();}
    optionPlayerO.style.border = '3px solid black';
    optionPlayerX.style.border = '1px solid black';
});

optionPlayerX.addEventListener('click', () => {
    let checkPlayerO = true;
    if(!isPlayerO){
        checkPlayerO = false;
    }
    isPlayerO = false;
    if(checkPlayerO){
        restartGame();
    }
    optionPlayerO.style.border = '1px solid black';
    optionPlayerX.style.border = '3px solid black';
});

selectElement.addEventListener('change', (event) => {
    restartGame();
    easy = event.target.value === "easy" || event.target.value === "medium" || event.target.value === "hard";
});

displayController().activateBoard();