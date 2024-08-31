import { Game } from './Game.js';
export const isCheckmate = (game, turn) => {
    const legalMoves = [];
    game.board.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell.color === turn) {
                const gameCopy = new Game();
                gameCopy.loadGame(JSON.parse(JSON.stringify(game)));
            }
        });
    });
    console.log(legalMoves);
    return legalMoves.length === 0;
};
