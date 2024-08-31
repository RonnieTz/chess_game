import { Game } from './utils/Game.js';
import { getLegalMoves } from './utils/legalMoves.js';
import { renderBoard } from './utils/renderBoard.js';
const board = document.querySelector('.app') as HTMLElement;

export const game = new Game();
renderBoard(board);
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
      game.calculateLegalMoves(clickedTop, clickedLeft);
      game.filterLegalMovesThatPutKingInCheck();
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
      if (
        !game.legalMoves.some(
          ({ top, left }) => top === clickedTop && left === clickedLeft
        )
      ) {
        //If the clicked cell is not a legal move, remove the selection
        selectedCellElement.classList.remove('selected');
        game.removeSelection();
      }
      //If the clicked piece is a different color, move the selected piece to the clicked cell
      if (
        game.legalMoves.some(
          ({ top, left }) => top === clickedTop && left === clickedLeft
        )
      ) {
        selectedPieceElement.style.top = `${clickedTop * 12.5}%`;
        selectedPieceElement.style.left = `${clickedLeft * 12.5}%`;
        selectedPieceElement.id = `piece-${clickedTop}-${clickedLeft}`;
        selectedCellElement.title = '';
        clickedElement.title = game.selectedPiece.piece;
        selectedCellElement.classList.remove('selected');

        if (clickedPieceElement) {
          setTimeout(() => {
            clickedPieceElement.remove();
          }, 650);
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
        }
        if (
          game.selectedPiece.piece.includes('pawn') &&
          (clickedTop === 0 || clickedTop === 7)
        ) {
          selectedPieceElement.setAttribute(
            'src',
            `/assets/${game.selectedPiece.piece.split('_')[0]}_queen.svg`
          );
          clickedElement.title =
            game.selectedPiece.piece.split('_')[0] + '_queen';
        }

        if (
          game.selectedPiece.piece.includes('king') &&
          (clickedTop === 0 || clickedTop === 7) &&
          (game.selectedPiece.top === 0 || game.selectedPiece.top === 7)
        ) {
          if (clickedLeft === 6) {
            const rookPieceElement = document.getElementById(
              'piece-' + clickedTop + '-7'
            )!;
            const rookCellElement = document.getElementById(`${clickedTop}-7`)!;
            const rookNewCellElement = document.getElementById(
              `${clickedTop}-5`
            )!;
            rookCellElement.title = '';
            rookNewCellElement.title = `${
              game.selectedPiece.piece.split('_')[0]
            }_rook`;
            rookPieceElement.style.top = `${clickedTop * 12.5}%`;
            rookPieceElement.style.left = `${5 * 12.5}%`;
            rookPieceElement.id = `piece-${clickedTop}-5`;
          }
          if (clickedLeft === 2) {
            const rookPieceElement = document.getElementById(
              'piece-' + clickedTop + '-0'
            )!;
            const rookCellElement = document.getElementById(`${clickedTop}-0`)!;
            const rookNewCellElement = document.getElementById(
              `${clickedTop}-3`
            )!;
            rookCellElement.title = '';
            rookNewCellElement.title = `${
              game.selectedPiece.piece.split('_')[0]
            }_rook`;
            rookPieceElement.style.top = `${clickedTop * 12.5}%`;
            rookPieceElement.style.left = `${3 * 12.5}%`;
            rookPieceElement.id = `piece-${clickedTop}-3`;
          }
        }

        game.movePiece(
          game.selectedPiece.top,
          game.selectedPiece.left,
          clickedTop,
          clickedLeft
        );
      }
    }
  }
});
