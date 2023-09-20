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

const grid = document.querySelector('.gridBoard');
const displayController = (() => {
    const currentPlayer = Player("X");
    const gridCreate = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('div');
                cell.addEventListener('click', () => {
                    if(gameBoard.field[i][j] === undefined){
                        cell.textContent = currentPlayer.getMarker();
                        currentPlayer.Tick(i, j);
                    }
                })
                cell.classList.add('cell');
                grid.appendChild(cell);
            }
        }
    }
    return {gridCreate};
})();

const ChooseRandom = (player) => {
    let randomRow = Math.floor(Math.random() * 3);
    let randomCol = Math.floor(Math.random() * 3);
    player.Tick(randomCol, randomRow);
};

const PlayGame = (type, player) => {
    displayController.gridCreate();
    /* const isGameWon = () => {
        // add const winner
        // look if a player has won
    }
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
        return isFull;
    }
    
    if (isGameWon || isBoardFull) {
        if (isBoardFull) {
            // display Draw
        }
        if (isGameWon) {
            //display Win
        }
    }
    */
    // add game dynamics
};

displayController.gridCreate();