const gameBoard = (() => {
    const field = Array.from({ length: 3 }, () => new Array(3));
    return { field };
})();
const Player = (marker) => {
    const Tick = (posx, posy) => {
        if (gameBoard.field[posx][posy] === undefined) {
            gameBoard.field[posx][posy] = marker;
        }
        if (marker === "X") {
            marker = "O";
        }
        else {
            marker = "X";
        }
    }
    const getMarker = () => marker;
    return { Tick, getMarker };
};

const displayText = document.querySelector('.resultText');

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
                if (gameBoard.field[i][j] !== undefined) {
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
        if (gameWon.value || boardFull.isFull) {
            if (gameWon.value) {
                displayText.textContent = `${gameWon.winner} has won the game!`;
            }
            else {
                displayText.textContent = "It's a draw!";
            }
        }
        else{
            displayText.textContent = `${player.getMarker()}'s turn!`;
        }
    }
    return { displayStatus };
})();

const grid = document.querySelector('.gridBoard');
const displayController = (() => {
    const currentPlayer = Player("X");
    const gridCreate = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('div');
                cell.addEventListener('click', () => {
                    if (gameBoard.field[i][j] === undefined) {
                        const checkGame = isGameWon();
                        if (!checkGame.value) {
                            cell.textContent = currentPlayer.getMarker();
                            currentPlayer.Tick(i, j);
                            PlayGame.displayStatus(currentPlayer);
                        }
                    }
                })
                cell.classList.add('cell');
                grid.appendChild(cell);
            }
        }
    }
    return { gridCreate };
})();

const ChooseRandom = (player) => {
    let randomRow = Math.floor(Math.random() * 3);
    let randomCol = Math.floor(Math.random() * 3);
    player.Tick(randomCol, randomRow);
};

displayController.gridCreate();