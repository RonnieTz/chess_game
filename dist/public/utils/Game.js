import { initialPositions } from './initialPositions.js';
export class Game {
    board;
    history = [];
    selectedPiece;
    turn = 'white';
    legalMoves = [
        { top: 0, left: 0 },
        { top: 0, left: 1 },
    ];
    constructor(board) {
        this.board = Array(8).fill(Array(8).fill({ piece: undefined }));
        this.board = this.board.map((row, i) => {
            return row.map((_cell, j) => {
                const piece = initialPositions.find(({ top, left }) => top === i && left === j);
                return {
                    piece: piece?.name,
                    pieceMoved: false,
                    color: piece?.name?.split('_')[0],
                };
            });
        });
        this.history.push(this.board);
        this.board.forEach((row, i) => {
            const rowElement = document.createElement('div');
            rowElement.classList.add('row');
            row.forEach((cell, j) => {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.classList.add((i + j) % 2 === 0 ? 'cell-light' : 'cell-dark');
                cellElement.id = `${i}-${j}`;
                cellElement.title = cell.piece || '';
                rowElement.appendChild(cellElement);
                if (cell.piece) {
                    const pieceElement = document.createElement('img');
                    pieceElement.src = `/assets/${cell.piece}.svg`;
                    pieceElement.style.top = `${i * 12.5}%`;
                    pieceElement.style.left = `${j * 12.5}%`;
                    pieceElement.classList.add('piece');
                    pieceElement.id = `piece-${i}-${j}`;
                    board.appendChild(pieceElement);
                }
            });
            board.appendChild(rowElement);
        });
    }
    selectPiece(piece, top, left) {
        this.selectedPiece = { piece, top, left };
    }
    removeSelection() {
        this.selectedPiece = undefined;
    }
    movePiece(selectedTop, selectedLeft, targetTop, targetLeft) {
        const selectedPieceName = this.board[selectedTop][selectedLeft].piece;
        this.board[selectedTop][selectedLeft].piece = undefined;
        this.board[selectedTop][selectedLeft].pieceMoved = true;
        this.board[targetTop][targetLeft].piece = selectedPieceName;
        this.board[targetTop][targetLeft].color = this.turn;
        this.board[targetTop][targetLeft].pieceMoved = true;
        this.history.push(JSON.parse(JSON.stringify(this.board)));
    }
    nextTurn() {
        this.turn = this.turn === 'white' ? 'black' : 'white';
    }
}
