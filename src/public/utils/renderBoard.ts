import { game } from '../javascript.js';

export const renderBoard = (board: HTMLElement) => {
  game.board.forEach((row, i) => {
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
};
