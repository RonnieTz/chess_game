import { Game } from './utils/Game.js';
const board = document.querySelector('.app');
const game = new Game(board);
board.addEventListener('click', (e) => {
    const clickedElement = e.target;
    const clickedPieceName = clickedElement.title;
    const clickedPieceColor = clickedPieceName.split('_')[0];
    const [clickedTop, clickedLeft] = clickedElement.id.split('-').map(Number);
    const clickedPieceElement = document.getElementById(`piece-${clickedTop}-${clickedLeft}`);
    const selectedCellElement = document.getElementById(`${game.selectedPiece?.top}-${game.selectedPiece?.left}`);
    const selectedPieceElement = document.getElementById(`piece-${game.selectedPiece?.top}-${game.selectedPiece?.left}`);
    if (!game.selectedPiece) {
        if (clickedPieceColor === game.turn) {
            //If the clicked piece is the same color as the current turn, select it
            game.selectPiece(clickedPieceName, clickedTop, clickedLeft);
            clickedElement.classList.add('selected');
            game.legalMoves.forEach(({ top, left }) => {
                const cellElement = document.getElementById(`${top}-${left}`);
                cellElement.classList.add('legal-move');
            });
        }
    }
    else if (game.selectedPiece) {
        game.legalMoves.forEach(({ top, left }) => {
            const cellElement = document.getElementById(`${top}-${left}`);
            cellElement.classList.remove('legal-move');
        });
        if (clickedPieceColor === game.turn) {
            //If the clicked piece is the same color as the selected piece, remove the selection
            selectedCellElement.classList.remove('selected');
            game.removeSelection();
        }
        else if (clickedPieceColor !== game.turn) {
            //If the clicked piece is a different color, move the selected piece to the clicked cell
            if (game.legalMoves.some(({ top, left }) => top === clickedTop && left === clickedLeft)) {
                selectedPieceElement.style.top = `${clickedTop * 12.5}%`;
                selectedPieceElement.style.left = `${clickedLeft * 12.5}%`;
                selectedPieceElement.id = `piece-${clickedTop}-${clickedLeft}`;
                clickedElement.title = game.selectedPiece.piece;
                game.movePiece(game.selectedPiece.top, game.selectedPiece.left, clickedTop, clickedLeft);
                if (clickedPieceElement) {
                    clickedPieceElement.remove();
                }
                game.nextTurn();
            }
            selectedCellElement.classList.remove('selected');
            game.removeSelection();
        }
    }
});
