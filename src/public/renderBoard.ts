import { game } from './utils/Game.js';
export const renderBoard = () => {
  const board = document.querySelector('.app') as HTMLElement;

  game.board.forEach((row, i) => {
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    row.forEach((cell, j) => {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      cellElement.classList.add((i + j) % 2 === 0 ? 'cell-light' : 'cell-dark');
      cellElement.id = `${i}-${j}` + (cell.piece ? `-${cell.piece}` : '');
      rowElement.appendChild(cellElement);
    });
    board.appendChild(rowElement);
  });

  game.pieces.forEach(({ name, top, left }) => {
    const piece = document.createElement('img');
    piece.classList.add('piece');
    piece.id = `img${top}-${left}-${name}`;
    piece.src = `./assets/${name}.svg`;
    piece.alt = name;
    piece.style.top = `${top * 12.5}%`;
    piece.style.left = `${left * 12.5}%`;
    board.appendChild(piece);
  });
};
