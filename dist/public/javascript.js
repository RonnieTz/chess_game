import { Game } from './utils/Game.js';
import { getLegalMoves } from './utils/legalMoves.js';
import { renderBoard } from './utils/renderBoard.js';
import { kingIsInCheck } from './utils/kingIsInCheck.js';
import { isCheckmate } from './utils/checkmate.js';
const board = document.querySelector('.app');
const resetButton = document.querySelector('.reset');
const rotateButton = document.querySelector('.rotate');
const backButton = document.querySelector('.back');
const nextButton = document.querySelector('.next');
const turnElement = document.querySelector('.turn');
const checkElement = document.querySelector('.check');
export const game = new Game();
renderBoard(board, game.board);
getLegalMoves(game.history, { top: 6, left: 6 });
let backButtonDisabled = true;
let nextButtonDisabled = true;
let navigationIndex = 0;
board.addEventListener('click', (e) => {
    const clickedElement = e.target;
    const clickedPieceName = clickedElement.title;
    const clickedPieceColor = clickedPieceName.split('_')[0];
    const [clickedTop, clickedLeft] = clickedElement.id.split('-').map(Number);
    const clickedPieceElement = document.getElementById(`piece-${clickedTop}-${clickedLeft}`);
    const selectedCellElement = document.getElementById(`${game.selectedPiece?.top}-${game.selectedPiece?.left}`);
    const selectedPieceElement = document.getElementById(`piece-${game.selectedPiece?.top}-${game.selectedPiece?.left}`);
    if (!game.selectedPiece) {
        if (navigationIndex !== game.history.length - 1) {
            return;
        }
        if (clickedPieceColor === game.turn) {
            //If the clicked piece is the same color as the current turn, select it
            game.selectPiece(clickedPieceName, clickedTop, clickedLeft);
            game.calculateLegalMoves(clickedTop, clickedLeft);
            game.filterLegalMovesThatPutKingInCheck();
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
            if (!game.legalMoves.some(({ top, left }) => top === clickedTop && left === clickedLeft)) {
                //If the clicked cell is not a legal move, remove the selection
                selectedCellElement.classList.remove('selected');
                game.removeSelection();
            }
            //If the clicked piece is a different color, move the selected piece to the clicked cell
            if (game.legalMoves.some(({ top, left }) => top === clickedTop && left === clickedLeft)) {
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
                if (game.selectedPiece.piece.includes('pawn') &&
                    !clickedPieceColor &&
                    game.selectedPiece.left !== clickedLeft) {
                    document
                        .getElementById('piece-' + game.selectedPiece.top + '-' + clickedLeft)
                        ?.remove();
                    document.getElementById(game.selectedPiece.top + '-' + clickedLeft).title = '';
                }
                if (game.selectedPiece.piece.includes('pawn') &&
                    (clickedTop === 0 || clickedTop === 7)) {
                    selectedPieceElement.setAttribute('src', `/assets/${game.selectedPiece.piece.split('_')[0]}_queen.svg`);
                    clickedElement.title =
                        game.selectedPiece.piece.split('_')[0] + '_queen';
                }
                if (game.selectedPiece.piece.includes('king') &&
                    (clickedTop === 0 || clickedTop === 7) &&
                    (game.selectedPiece.top === 0 || game.selectedPiece.top === 7)) {
                    if (clickedLeft === 6) {
                        const rookPieceElement = document.getElementById('piece-' + clickedTop + '-7');
                        const rookCellElement = document.getElementById(`${clickedTop}-7`);
                        const rookNewCellElement = document.getElementById(`${clickedTop}-5`);
                        rookCellElement.title = '';
                        rookNewCellElement.title = `${game.selectedPiece.piece.split('_')[0]}_rook`;
                        rookPieceElement.style.top = `${clickedTop * 12.5}%`;
                        rookPieceElement.style.left = `${5 * 12.5}%`;
                        rookPieceElement.id = `piece-${clickedTop}-5`;
                    }
                    if (clickedLeft === 2) {
                        const rookPieceElement = document.getElementById('piece-' + clickedTop + '-0');
                        const rookCellElement = document.getElementById(`${clickedTop}-0`);
                        const rookNewCellElement = document.getElementById(`${clickedTop}-3`);
                        rookCellElement.title = '';
                        rookNewCellElement.title = `${game.selectedPiece.piece.split('_')[0]}_rook`;
                        rookPieceElement.style.top = `${clickedTop * 12.5}%`;
                        rookPieceElement.style.left = `${3 * 12.5}%`;
                        rookPieceElement.id = `piece-${clickedTop}-3`;
                    }
                }
                backButton.classList.remove('disabled');
                backButtonDisabled = false;
                navigationIndex = game.history.length;
                setTimeout(() => {
                    turnElement.textContent =
                        game.turn === 'white' ? 'White Playing' : 'Black Playing';
                }, 650);
                game.movePiece(game.selectedPiece.top, game.selectedPiece.left, clickedTop, clickedLeft);
                const isKingInCheck = kingIsInCheck(game, game.turn);
                let opponentKingElementCell;
                let kingElementCell;
                game.board.forEach((row, i) => {
                    row.forEach((cell, j) => {
                        if (cell.piece === `${game.turn}_king`) {
                            opponentKingElementCell = document.getElementById(`piece-${i}-${j}`);
                        }
                        if (cell.piece === `${game.turn === 'white' ? 'black' : 'white'}_king`) {
                            kingElementCell = document.getElementById(`piece-${i}-${j}`);
                        }
                    });
                });
                setTimeout(() => {
                    if (isKingInCheck) {
                        checkElement.style.display = 'block';
                    }
                    else {
                        checkElement.style.display = 'none';
                    }
                }, 650);
                kingElementCell.classList.remove('in-check');
                if (isKingInCheck) {
                    opponentKingElementCell.classList.add('in-check');
                }
                const checkmate = isCheckmate(game, game.turn);
                console.log(checkmate);
            }
        }
    }
});
rotateButton.addEventListener('click', () => {
    board.classList.toggle('rotated');
    game.board.forEach((row, top) => {
        row.forEach((cell, left) => {
            const pieceElement = document.getElementById(`piece-${top}-${left}`);
            if (pieceElement) {
                pieceElement.classList.toggle('rotated');
            }
        });
    });
});
resetButton.addEventListener('click', () => {
    game.resetGame();
    board.textContent = '';
    board.classList.remove('rotated');
    renderBoard(board, game.board);
    backButton.classList.add('disabled');
    navigationIndex = 0;
    nextButton.classList.add('disabled');
});
backButton.addEventListener('click', () => {
    if (!backButtonDisabled && navigationIndex > 0) {
        navigationIndex--;
        board.textContent = '';
        renderBoard(board, game.history[navigationIndex]);
        nextButton.classList.remove('disabled');
        nextButtonDisabled = false;
        if (navigationIndex === 0) {
            backButton.classList.add('disabled');
            backButtonDisabled = true;
        }
    }
});
nextButton.addEventListener('click', () => {
    if (!nextButtonDisabled && navigationIndex < game.history.length - 1) {
        navigationIndex++;
        board.textContent = '';
        renderBoard(board, game.history[navigationIndex]);
        backButton.classList.remove('disabled');
        backButtonDisabled = false;
        if (navigationIndex === game.history.length - 1) {
            nextButton.classList.add('disabled');
            nextButtonDisabled = true;
        }
    }
});
