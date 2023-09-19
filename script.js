const gameBoard = (() => {
    const field = Array.from({length: 3}, () => new Array(3));
    return {field};
})();

const Player = (marker) => {
    const Tick = (posx, posy) => {
        if(gameBoard.field[posx][posy] === undefined){
            gameBoard.field[posx][posy] = marker;
        }
        if(marker === "X") {
            marker = "O";
        }
        else{
            marker = "X";
        }
    }
    return {Tick, marker};
};

const ChooseRandom = (player) => {
    let randomRow = Math.floor(Math.random() * 3);
    let randomCol = Math.floor(Math.random() * 3);
    player.Tick(randomCol, randomRow);
};

const PlayGame = (type, player) => {
    const isGameWon = () => {
        // add const winner
        // look if a player has won
    }
    const isBoardFull = () => {
        let isFull = true;
        outer: for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(gameBoard.field[i][j] !== undefined){
                    isFull = false;
                    break outer;
                }
            }
        }
        return isFull;
    }
    if(isGameWon || isBoardFull){
        if(isBoardFull){
            // display Draw
        }
        if(isGameWon){
            //display Win
        }
    }
    // add game dynamics
};

// add eventListeners and DOM manipulation

// FIRST TO DO: DISPLAY ARRAY AND TIC TAC TOE GRID FIRST!!!