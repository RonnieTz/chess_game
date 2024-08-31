import { getLegalMoves } from './legalMoves.js';
import { Game } from './Game.js';

export const isCheckmate = (game: Game, turn: 'white' | 'black') => {
  const legalMoves: { top: number; left: number }[] = [];
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
