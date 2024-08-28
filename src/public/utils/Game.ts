const initialPositions = [
  { name: 'black_rook', top: 0, left: 0 },
  { name: 'black_knight', top: 0, left: 1 },
  { name: 'black_bishop', top: 0, left: 2 },
  { name: 'black_queen', top: 0, left: 3 },
  { name: 'black_king', top: 0, left: 4 },
  { name: 'black_bishop', top: 0, left: 5 },
  { name: 'black_knight', top: 0, left: 6 },
  { name: 'black_rook', top: 0, left: 7 },
  { name: 'black_pawn', top: 1, left: 0 },
  { name: 'black_pawn', top: 1, left: 1 },
  { name: 'black_pawn', top: 1, left: 2 },
  { name: 'black_pawn', top: 1, left: 3 },
  { name: 'black_pawn', top: 1, left: 4 },
  { name: 'black_pawn', top: 1, left: 5 },
  { name: 'black_pawn', top: 1, left: 6 },
  { name: 'black_pawn', top: 1, left: 7 },
  { name: 'white_pawn', top: 6, left: 0 },
  { name: 'white_pawn', top: 6, left: 1 },
  { name: 'white_pawn', top: 6, left: 2 },
  { name: 'white_pawn', top: 6, left: 3 },
  { name: 'white_pawn', top: 6, left: 4 },
  { name: 'white_pawn', top: 6, left: 5 },
  { name: 'white_pawn', top: 6, left: 6 },
  { name: 'white_pawn', top: 6, left: 7 },
  { name: 'white_rook', top: 7, left: 0 },
  { name: 'white_knight', top: 7, left: 1 },
  { name: 'white_bishop', top: 7, left: 2 },
  { name: 'white_queen', top: 7, left: 3 },
  { name: 'white_king', top: 7, left: 4 },
  { name: 'white_bishop', top: 7, left: 5 },
  { name: 'white_knight', top: 7, left: 6 },
  { name: 'white_rook', top: 7, left: 7 },
];

class Game {
  board: { piece: string | undefined }[][];
  pieces: { name: string; top: number; left: number }[];
  selectedPiece: { name: string; top: number; left: number } | undefined;
  turn: 'white' | 'black' = 'white';
  legalMoves: { top: number; left: number }[] = [
    { top: 0, left: 0 },
    { top: 0, left: 1 },
  ];
  constructor() {
    this.board = Array(8).fill(Array(8).fill({ piece: undefined }));
    this.board = this.board.map((row, i) => {
      return row.map((_cell, j) => {
        return {
          piece: initialPositions.find(
            ({ top, left }) => top === i && left === j
          )?.name,
        };
      });
    });

    this.pieces = initialPositions;
  }
  selectPiece(name: string, top: number, left: number) {
    this.selectedPiece = { name, top, left };
  }
  removeSelection() {
    this.selectedPiece = undefined;
  }
  nextTurn() {
    this.turn = this.turn === 'white' ? 'black' : 'white';
  }
}

export const game = new Game();
