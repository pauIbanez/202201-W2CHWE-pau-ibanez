/* eslint-disable import/extensions */
import { getGridAlignedCoords } from "./gridCoordenates.js";
import { drawCell, moveCells } from "./cellRendering.js";
import { drawGrid } from "./drawGrid.js";

let prevMousePos;
let mouseDown = false;
let moving = false;

// eslint-disable-next-line import/no-mutable-exports
let cellPositions = [];

const getMousePos = (event) => ({
  x: event.clientX,
  y: event.clientY,
});

const reset = (gridCtx, gridCanvas, cellCtx, cellCanvas, cellSize) => {
  moving = false;
  gridCtx.setTransform(1, 0, 0, 1, 0, 0);
  drawGrid(gridCanvas, gridCtx, cellSize);
  cellCtx.clearRect(0, 0, cellCanvas.width, cellCanvas.height);

  cellPositions = cellPositions.map((cell) =>
    drawCell(cellCtx, getGridAlignedCoords(cell, cellSize), cellSize)
  );
};

const setMouseAction = (state, action, event, canvasesArray, cellSize) => {
  mouseDown = state;
  switch (action) {
    case 1:
      if (state) {
        prevMousePos = getMousePos(event);
      } else {
        // eslint-disable-next-line no-param-reassign
        canvasesArray[1].style.cursor = "pointer";

        if (!moving) {
          const clientInstanciatedCell = getGridAlignedCoords(
            {
              x: event.clientX,
              y: event.clientY,
            },
            cellSize
          );

          const dupped = cellPositions.findIndex(
            (cell) =>
              cell.x === clientInstanciatedCell.x &&
              cell.y === clientInstanciatedCell.y
          );

          if (dupped === -1) {
            cellPositions.push(
              drawCell(canvasesArray[2], clientInstanciatedCell, cellSize)
            );
          } else {
            cellPositions.splice(dupped, 1);
          }
        }

        reset(
          canvasesArray[0],
          canvasesArray[1],
          canvasesArray[2],
          canvasesArray[3],
          cellSize
        );
      }
      break;

    case 2:
      if (moving)
        reset(
          canvasesArray[0],
          canvasesArray[1],
          canvasesArray[2],
          canvasesArray[3],
          cellSize
        );
      break;

    default:
      break;
  }
};

const mouseMoving = (
  event,
  gridCtx,
  gridCanvas,
  cellCtx,
  cellCanvas,
  cellSize,
  paused
) => {
  if (!mouseDown) return;
  if (!paused) {
    console.log("Don't have time to fix bug, so if you want to move, pause!");
    return;
  }
  moving = true;
  // eslint-disable-next-line no-param-reassign
  gridCanvas.style.cursor = "grabbing";
  const mousePosThisFrame = getMousePos(event);

  const mouseFrameOffset = {
    x: mousePosThisFrame.x - prevMousePos.x,
    y: mousePosThisFrame.y - prevMousePos.y,
  };

  gridCtx.translate(mouseFrameOffset.x, mouseFrameOffset.y);

  drawGrid(gridCanvas, gridCtx, cellSize);
  const movedCells = moveCells(
    cellPositions,
    mouseFrameOffset.x,
    mouseFrameOffset.y
  );
  prevMousePos = mousePosThisFrame;

  cellCtx.clearRect(0, 0, cellCanvas.width, cellCanvas.height);
  movedCells.forEach((cell) => {
    drawCell(
      cellCtx,
      { x: cell.x + mouseFrameOffset.x, y: cell.y + mouseFrameOffset.y },
      cellSize,
      false
    );
  });

  cellPositions = movedCells;
};

const updateCellPositions = (newCellPositions) => {
  cellPositions = newCellPositions;
};

export default setMouseAction;
export { setMouseAction, mouseMoving, cellPositions, updateCellPositions };
