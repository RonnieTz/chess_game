import { Game } from './Game.js';
import { getLegalMoves } from './legalMoves.js';

export const kingIsInCheck = (game: Game, turn: 'white' | 'black') => {
  let kingIsInCheck = false;
  game.board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell.piece && cell.color !== turn) {
        const legalMoves = getLegalMoves(game.history, { top: i, left: j });
        legalMoves.forEach((move) => {
          if (game.board[move.top][move.left].piece === `${turn}_king`) {
            kingIsInCheck = true;
          }
        });
      }
    });
  });
  return kingIsInCheck;
};
