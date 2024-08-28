import { game } from './utils/Game.js';

export const movePieceEvents = () => {
  const board = document.querySelector('.app') as HTMLElement;
  board.addEventListener('click', (e) => {
    const targetElement = e.target as HTMLElement;
    //@ts-ignore
    const target = e.target.id.split('-');
    const top = Number(target[0]);
    const left = Number(target[1]);
    const piece = target[2];
    const targetColor = piece ? piece.split('_')[0] : undefined;

    if (game.selectedPiece) {
      const { top: selectedTop, left: selectedLeft } = game.selectedPiece;

      if (game.turn === targetColor) {
        const selectedCell = document.getElementById(
          `${selectedTop}-${selectedLeft}-${game.selectedPiece.name}`
        );
        selectedCell?.classList.toggle('selected');
        game.legalMoves.forEach(({ top, left }) => {
          const { name } = game.pieces.find(
            ({ top: t, left: l }) => t === top && l === left
          )!;

          const cell = document.getElementById(
            `${top}-${left}` + (name ? `-${name}` : '')
          );

          if (cell) {
            cell.classList.remove('legal-move');
          }
        });
        game.removeSelection();
      }
      if (true) {
        const {
          left: selectedLeft,
          top: selectedTop,
          name: selectedName,
        } = game.selectedPiece;
        const selectedPiece = game.pieces.find(
          ({ top, left }) => top === selectedTop && left === selectedLeft
        );
        const selectedElement = document.getElementById(
          `${selectedTop}-${selectedLeft}-${selectedPiece?.name}`
        );
        const pieceElement = document.getElementById(
          `img${selectedTop}-${selectedLeft}-${selectedName}`
        );
        const targetPieceElement = document.getElementById(
          `img${top}-${left}-${piece}`
        );
        targetPieceElement?.remove();
        pieceElement?.style.setProperty('top', `${top * 12.5}%`);
        pieceElement?.style.setProperty('left', `${left * 12.5}%`);
        selectedElement?.classList.remove('selected');
        game.board[selectedTop][selectedLeft] = { piece: undefined };
        game.board[top][left] = { piece: selectedName };
        game.pieces = game.pieces.map((piece) => {
          if (piece.top === selectedTop && piece.left === selectedLeft) {
            return { ...piece, top, left };
          }
          return piece;
        });
        game.removeSelection();
      }
    } else if (!game.selectedPiece) {
      if (targetColor === game.turn) {
        game.selectPiece(piece, top, left);
        targetElement.classList.add('selected');
        game.legalMoves.forEach(({ top, left }) => {
          const { name } = game.pieces.find(
            ({ top: t, left: l }) => t === top && l === left
          )!;

          const cell = document.getElementById(
            `${top}-${left}` + (name ? `-${name}` : '')
          );

          if (cell) {
            cell.classList.add('legal-move');
          }
        });
      }
    }
  });
};
