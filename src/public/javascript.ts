import { Game } from './utils/Game.js';
import { getLegalMoves } from './utils/legalMoves.js';
const board = document.querySelector('.app') as HTMLElement;

export const game = new Game(board);
getLegalMoves(game.history, { top: 6, left: 6 });

board.addEventListener('click', (e) => {
  const clickedElement = e.target as HTMLElement;
  const clickedPieceName = clickedElement.title;
  const clickedPieceColor = clickedPieceName.split('_')[0];
  const [clickedTop, clickedLeft] = clickedElement.id.split('-').map(Number);
  const clickedPieceElement = document.getElementById(
    `piece-${clickedTop}-${clickedLeft}`
  )!;

  const selectedCellElement = document.getElementById(
    `${game.selectedPiece?.top}-${game.selectedPiece?.left}`
  )!;
  const selectedPieceElement = document.getElementById(
    `piece-${game.selectedPiece?.top}-${game.selectedPiece?.left}`
  )!;

  if (!game.selectedPiece) {
    if (clickedPieceColor === game.turn) {
      //If the clicked piece is the same color as the current turn, select it
      game.selectPiece(clickedPieceName, clickedTop, clickedLeft);
      game.legalMoves = getLegalMoves(game.history, {
        top: clickedTop,
        left: clickedLeft,
      });
      clickedElement.classList.add('selected');
      game.legalMoves.forEach(({ top, left }) => {
        const cellElement = document.getElementById(`${top}-${left}`)!;
        cellElement.classList.add('legal-move');
      });
    }
  } else if (game.selectedPiece) {
    game.legalMoves.forEach(({ top, left }) => {
      const cellElement = document.getElementById(`${top}-${left}`)!;
      cellElement.classList.remove('legal-move');
    });
    if (clickedPieceColor === game.turn) {
      //If the clicked piece is the same color as the selected piece, remove the selection
      selectedCellElement.classList.remove('selected');
      game.removeSelection();
    } else if (clickedPieceColor !== game.turn) {
      //If the clicked piece is a different color, move the selected piece to the clicked cell
      if (
        game.legalMoves.some(
          ({ top, left }) => top === clickedTop && left === clickedLeft
        )
      ) {
        selectedPieceElement.style.top = `${clickedTop * 12.5}%`;
        selectedPieceElement.style.left = `${clickedLeft * 12.5}%`;
        selectedPieceElement.id = `piece-${clickedTop}-${clickedLeft}`;
        clickedElement.title = game.selectedPiece.piece;
        game.movePiece(
          game.selectedPiece.top,
          game.selectedPiece.left,
          clickedTop,
          clickedLeft
        );
        if (clickedPieceElement) {
          clickedPieceElement.remove();
        }
        if (
          game.selectedPiece.piece.includes('pawn') &&
          !clickedPieceColor &&
          game.selectedPiece.left !== clickedLeft
        ) {
          document
            .getElementById(
              'piece-' + game.selectedPiece.top + '-' + clickedLeft
            )
            ?.remove();
          document.getElementById(
            game.selectedPiece.top + '-' + clickedLeft
          )!.title = '';
          game.removePiece(game.selectedPiece.top, clickedLeft);
        }
        if (
          game.selectedPiece.piece.includes('pawn') &&
          (clickedTop === 0 || clickedTop === 7)
        ) {
          console.log('promote');
          selectedPieceElement.setAttribute(
            'src',
            `/assets/${game.selectedPiece.piece.split('_')[0]}_queen.svg`
          );
          clickedElement.title =
            game.selectedPiece.piece.split('_')[0] + '_queen';
          game.promotePawn(clickedTop, clickedLeft);
        }
        game.nextTurn();
      }
      selectedCellElement.classList.remove('selected');
      game.removeSelection();
    }
  }
});
