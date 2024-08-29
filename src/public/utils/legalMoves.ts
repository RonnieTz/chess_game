import { game } from '../javascript.js';

type History = typeof game.history;

export const getLegalMoves = (
  history: History,
  { top, left }: { top: number; left: number }
) => {
  const range = [0, 1, 2, 3, 4, 5, 6, 7];
  const legalMoves: { top: number; left: number }[] = [];
  const currentBoard = history[history.length - 1];
  const previousBoard = history[history.length - 2];
  const currentPieceColor = currentBoard[top][left]?.color;
  const currentPiece = currentBoard[top][left]?.piece?.split('_')[1];
  const currentPieceMoved = currentBoard[top][left]?.pieceMoved;

  const isEmpty = (top: number, left: number) => {
    return !currentBoard[top][left]?.piece;
  };
  const isOpponent = (top: number, left: number) => {
    return (
      currentBoard[top][left]?.piece &&
      currentBoard[top][left]?.color !== currentPieceColor
    );
  };

  //If the piece is a pawn

  if (currentPiece === 'pawn') {
    const direction = currentPieceColor === 'white' ? -1 : 1;

    if (top === 1 || top === 6) {
      if (
        isEmpty(top + direction, left) &&
        isEmpty(top + direction * 2, left) &&
        !currentPieceMoved
      ) {
        legalMoves.push({ top: top + direction * 2, left });
      }
    }
    if (range.includes(top + direction)) {
      if (isEmpty(top + direction, left)) {
        legalMoves.push({ top: top + direction, left });
      }
    }
    if (range.includes(top + direction) && range.includes(left - 1)) {
      if (isOpponent(top + direction, left - 1)) {
        legalMoves.push({ top: top + direction, left: left - 1 });
      }
    }
    if (range.includes(top + direction) && range.includes(left + 1)) {
      if (isOpponent(top + direction, left + 1)) {
        legalMoves.push({ top: top + direction, left: left + 1 });
      }
    }

    //En passant

    if (top === 3 || top === 4) {
      if (range.includes(left + 1)) {
        if (
          previousBoard[top + direction * 2][left + 1]?.piece?.split('_')[1] ===
            'pawn' &&
          previousBoard[top + direction * 2][left + 1]?.color !==
            currentPieceColor &&
          isEmpty(top + direction * 2, left + 1) &&
          isEmpty(top + direction, left + 1) &&
          !previousBoard[top + direction][left + 1]?.piece &&
          isOpponent(top, left + 1) &&
          currentBoard[top][left + 1]?.piece?.split('_')[1] === 'pawn' &&
          !previousBoard[top][left + 1]?.piece
        ) {
          legalMoves.push({ top: top + direction, left: left + 1 });
        }

        if (
          previousBoard[top + direction * 2][left - 1]?.piece?.split('_')[1] ===
            'pawn' &&
          previousBoard[top + direction * 2][left - 1]?.color !==
            currentPieceColor &&
          isEmpty(top + direction * 2, left - 1) &&
          isEmpty(top + direction, left - 1) &&
          !previousBoard[top + direction][left - 1]?.piece &&
          isOpponent(top, left - 1) &&
          currentBoard[top][left - 1]?.piece?.split('_')[1] === 'pawn' &&
          !previousBoard[top][left - 1]?.piece
        ) {
          legalMoves.push({ top: top + direction, left: left - 1 });
        }
      }
    }
  }
  console.log(previousBoard);

  return legalMoves;
};
