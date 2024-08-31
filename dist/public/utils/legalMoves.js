export const getLegalMoves = (history, { top, left }) => {
    const range = [0, 1, 2, 3, 4, 5, 6, 7];
    const legalMoves = [];
    const currentBoard = history[history.length - 1];
    const previousBoard = history[history.length - 2];
    const currentPieceColor = currentBoard[top][left]?.color;
    const currentPiece = currentBoard[top][left]?.piece?.split('_')[1];
    const currentPieceMoved = currentBoard[top][left]?.pieceMoved;
    const isEmpty = (top, left) => {
        return !currentBoard[top][left]?.piece;
    };
    const isOpponent = (top, left) => {
        return (currentBoard[top][left]?.piece &&
            currentBoard[top][left]?.color !== currentPieceColor);
    };
    const isAlly = (top, left) => {
        return (currentBoard[top][left]?.piece &&
            currentBoard[top][left]?.color === currentPieceColor);
    };
    //If the piece is a pawn
    if (currentPiece === 'pawn') {
        const direction = currentPieceColor === 'white' ? -1 : 1;
        if (top === 1 || top === 6) {
            if (isEmpty(top + direction, left) &&
                isEmpty(top + direction * 2, left) &&
                !currentPieceMoved) {
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
                if (previousBoard[top + direction * 2][left + 1]?.piece?.split('_')[1] ===
                    'pawn' &&
                    previousBoard[top + direction * 2][left + 1]?.color !==
                        currentPieceColor &&
                    isEmpty(top + direction * 2, left + 1) &&
                    isEmpty(top + direction, left + 1) &&
                    !previousBoard[top + direction][left + 1]?.piece &&
                    isOpponent(top, left + 1) &&
                    currentBoard[top][left + 1]?.piece?.split('_')[1] === 'pawn' &&
                    !previousBoard[top][left + 1]?.piece) {
                    legalMoves.push({ top: top + direction, left: left + 1 });
                }
                if (previousBoard[top + direction * 2][left - 1]?.piece?.split('_')[1] ===
                    'pawn' &&
                    previousBoard[top + direction * 2][left - 1]?.color !==
                        currentPieceColor &&
                    isEmpty(top + direction * 2, left - 1) &&
                    isEmpty(top + direction, left - 1) &&
                    !previousBoard[top + direction][left - 1]?.piece &&
                    isOpponent(top, left - 1) &&
                    currentBoard[top][left - 1]?.piece?.split('_')[1] === 'pawn' &&
                    !previousBoard[top][left - 1]?.piece) {
                    legalMoves.push({ top: top + direction, left: left - 1 });
                }
            }
        }
    }
    if (currentPiece === 'knight') {
        const moves = [
            { top: top - 2, left: left - 1 },
            { top: top - 2, left: left + 1 },
            { top: top - 1, left: left - 2 },
            { top: top - 1, left: left + 2 },
            { top: top + 1, left: left - 2 },
            { top: top + 1, left: left + 2 },
            { top: top + 2, left: left - 1 },
            { top: top + 2, left: left + 1 },
        ];
        moves.forEach(({ top, left }) => {
            if (range.includes(top) && range.includes(left)) {
                if (range.includes(top) &&
                    range.includes(left) &&
                    (isEmpty(top, left) || isOpponent(top, left))) {
                    legalMoves.push({ top, left });
                }
            }
        });
    }
    if (currentPiece === 'rook' || currentPiece === 'queen') {
        for (let i = top + 1; i < 8; i++) {
            if (isEmpty(i, left)) {
                legalMoves.push({ top: i, left });
            }
            else if (isOpponent(i, left)) {
                legalMoves.push({ top: i, left });
                break;
            }
            else {
                break;
            }
        }
        for (let i = top - 1; i >= 0; i--) {
            if (isEmpty(i, left)) {
                legalMoves.push({ top: i, left });
            }
            else if (isOpponent(i, left)) {
                legalMoves.push({ top: i, left });
                break;
            }
            else {
                break;
            }
        }
        for (let i = left + 1; i < 8; i++) {
            if (isEmpty(top, i)) {
                legalMoves.push({ top, left: i });
            }
            else if (isOpponent(top, i)) {
                legalMoves.push({ top, left: i });
                break;
            }
            else {
                break;
            }
        }
        for (let i = left - 1; i >= 0; i--) {
            if (isEmpty(top, i)) {
                legalMoves.push({ top, left: i });
            }
            else if (isOpponent(top, i)) {
                legalMoves.push({ top, left: i });
                break;
            }
            else {
                break;
            }
        }
    }
    if (currentPiece === 'bishop' || currentPiece === 'queen') {
        for (let i = 1; top + i < 8 && left + i < 8; i++) {
            if (isEmpty(top + i, left + i)) {
                legalMoves.push({ top: top + i, left: left + i });
            }
            else if (isOpponent(top + i, left + i)) {
                legalMoves.push({ top: top + i, left: left + i });
                break;
            }
            else {
                break;
            }
        }
        for (let i = 1; top - i >= 0 && left - i >= 0; i++) {
            if (isEmpty(top - i, left - i)) {
                legalMoves.push({ top: top - i, left: left - i });
            }
            else if (isOpponent(top - i, left - i)) {
                legalMoves.push({ top: top - i, left: left - i });
                break;
            }
            else {
                break;
            }
        }
        for (let i = 1; top + i < 8 && left - i >= 0; i++) {
            if (isEmpty(top + i, left - i)) {
                legalMoves.push({ top: top + i, left: left - i });
            }
            else if (isOpponent(top + i, left - i)) {
                legalMoves.push({ top: top + i, left: left - i });
                break;
            }
            else {
                break;
            }
        }
        for (let i = 1; top - i >= 0 && left + i < 8; i++) {
            if (isEmpty(top - i, left + i)) {
                legalMoves.push({ top: top - i, left: left + i });
            }
            else if (isOpponent(top - i, left + i)) {
                legalMoves.push({ top: top - i, left: left + i });
                break;
            }
            else {
                break;
            }
        }
    }
    if (currentPiece === 'king') {
        const moves = [
            { top: top - 1, left: left - 1 },
            { top: top - 1, left },
            { top: top - 1, left: left + 1 },
            { top, left: left - 1 },
            { top, left: left + 1 },
            { top: top + 1, left: left - 1 },
            { top: top + 1, left },
            { top: top + 1, left: left + 1 },
        ];
        moves.forEach(({ top, left }) => {
            if (range.includes(top) && range.includes(left)) {
                if (isEmpty(top, left) || isOpponent(top, left)) {
                    legalMoves.push({ top, left });
                }
            }
        });
        if (top === 0 || top === 7) {
            if (!currentBoard[top][left].pieceMoved) {
                if (!currentBoard[top][5].piece &&
                    !currentBoard[top][6].piece &&
                    !currentBoard[top][7].pieceMoved) {
                    legalMoves.push({ top, left: 6 });
                }
                if (!currentBoard[top][3].piece &&
                    !currentBoard[top][2].piece &&
                    !currentBoard[top][1].piece &&
                    !currentBoard[top][0].pieceMoved) {
                    legalMoves.push({ top, left: 2 });
                }
            }
        }
    }
    return legalMoves;
};
