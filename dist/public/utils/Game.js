import { initialPositions } from './initialPositions.js';
import { getLegalMoves } from './legalMoves.js';
export class Game {
    board;
    history = [];
    selectedPiece;
    turn = 'white';
    legalMoves = [
        { top: 0, left: 0 },
        { top: 0, left: 1 },
    ];
    constructor() {
        this.board = Array(8).fill(Array(8).fill({ piece: '', pieceMoved: false, color: '' }));
        this.board = this.board.map((row, i) => {
            return row.map((_cell, j) => {
                const piece = initialPositions.find(({ top, left }) => top === i && left === j);
                return {
                    piece: piece?.name || '',
                    pieceMoved: false,
                    color: piece?.name?.split('_')[0] || '',
                };
            });
        });
        this.history.push(this.board);
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');
    }
    selectPiece(piece, top, left) {
        this.selectedPiece = { piece, top, left };
        // this.legalMoves = getLegalMoves(this.history, { top, left });
    }
    calculateLegalMoves(top, left) {
        this.legalMoves = getLegalMoves(this.history, { top, left });
    }
    filterLegalMovesThatPutKingInCheck() {
        const filteredLegalMoves = this.legalMoves.filter(({ top, left }) => {
            let kingIsInCheck = false;
            const game = new Game();
            const allPossibleOpponentNextMoves = [];
            game.loadGame(JSON.parse(JSON.stringify(this)));
            game.movePiece(this.selectedPiece.top, this.selectedPiece.left, top, left);
            game.board.forEach((row, i) => {
                row.forEach((cell, j) => {
                    if (cell.piece && cell.color !== this.turn) {
                        const legalMoves = getLegalMoves(game.history, { top: i, left: j });
                        allPossibleOpponentNextMoves.push(...legalMoves);
                    }
                });
            });
            if (allPossibleOpponentNextMoves.some((move) => {
                const previousBoard = game.history[game.history.length - 2];
                if (move.top === 7) {
                    if (game.board[7][6].piece === 'white_king' &&
                        game.board[7][5].piece === 'white_rook' &&
                        !previousBoard[7][4].pieceMoved &&
                        !previousBoard[7][7].pieceMoved &&
                        move.left === 5) {
                        return true;
                    }
                    if (game.board[7][2].piece === 'white_king' &&
                        game.board[7][3].piece === 'white_rook' &&
                        !previousBoard[7][4].pieceMoved &&
                        !previousBoard[7][0].pieceMoved &&
                        move.left === 3) {
                        return true;
                    }
                }
                if (move.top === 0) {
                    if (game.board[0][6].piece === 'black_king' &&
                        game.board[0][5].piece === 'black_rook' &&
                        !previousBoard[0][4].pieceMoved &&
                        !previousBoard[0][7].pieceMoved &&
                        move.left === 5) {
                        return true;
                    }
                    if (game.board[0][2].piece === 'black_king' &&
                        game.board[0][3].piece === 'black_rook' &&
                        !previousBoard[0][4].pieceMoved &&
                        !previousBoard[0][0].pieceMoved &&
                        move.left === 3) {
                        return true;
                    }
                }
                return game.board[move.top][move.left].piece === `${this.turn}_king`;
            })) {
                kingIsInCheck = true;
            }
            return !kingIsInCheck;
        });
        this.legalMoves = filteredLegalMoves;
    }
    removeSelection() {
        this.selectedPiece = undefined;
    }
    removePiece(top, left) {
        this.board[top][left].piece = undefined;
        this.board[top][left].color = '';
    }
    promotePawn(top, left) {
        const piece = this.board[top][left].piece;
        if (piece === 'white_pawn' && top === 0) {
            this.board[top][left].piece = 'white_queen';
        }
        if (piece === 'black_pawn' && top === 7) {
            this.board[top][left].piece = 'black_queen';
        }
    }
    movePiece(selectedTop, selectedLeft, targetTop, targetLeft) {
        const selectedPieceName = this.board[selectedTop][selectedLeft].piece;
        const targetPieceColor = this.board[targetTop][targetLeft].color;
        this.board[selectedTop][selectedLeft].piece = '';
        this.board[selectedTop][selectedLeft].pieceMoved = true;
        this.board[selectedTop][selectedLeft].color = '';
        this.board[targetTop][targetLeft].piece = selectedPieceName;
        this.board[targetTop][targetLeft].color = this.turn;
        this.board[targetTop][targetLeft].pieceMoved = true;
        if (selectedPieceName?.includes('pawn') &&
            !targetPieceColor &&
            selectedLeft !== targetLeft) {
            this.removePiece(selectedTop, targetLeft);
        }
        if (selectedPieceName?.includes('pawn') &&
            (targetTop === 0 || targetTop === 7)) {
            this.promotePawn(targetTop, targetLeft);
        }
        if (this.selectedPiece?.piece.includes('king') &&
            (targetTop === 0 || targetTop === 7) &&
            (selectedTop === 0 || selectedTop === 7)) {
            if (selectedLeft === 4 && targetLeft === 6) {
                this.board[targetTop][5].piece = this.board[targetTop][7].piece;
                this.board[targetTop][5].color = this.board[targetTop][7].color;
                this.board[targetTop][5].pieceMoved = true;
                this.board[targetTop][7].piece = '';
                this.board[targetTop][7].color = '';
                this.board[targetTop][7].pieceMoved = true;
            }
            if (selectedLeft === 4 && targetLeft === 2) {
                this.board[targetTop][3].piece = this.board[targetTop][0].piece;
                this.board[targetTop][3].color = this.board[targetTop][0].color;
                this.board[targetTop][3].pieceMoved = true;
                this.board[targetTop][0].piece = '';
                this.board[targetTop][0].color = '';
                this.board[targetTop][0].pieceMoved = true;
            }
        }
        this.nextTurn();
        this.removeSelection();
        this.history.push(JSON.parse(JSON.stringify(this.board)));
    }
    nextTurn() {
        this.turn = this.turn === 'white' ? 'black' : 'white';
    }
    loadGame(game) {
        this.board = game.board;
        this.history = game.history;
        this.turn = game.turn;
        this.legalMoves = game.legalMoves;
        this.selectedPiece = game.selectedPiece;
    }
}
