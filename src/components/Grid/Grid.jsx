/* eslint-disable no-console */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import _isNil from 'lodash/isNil';
import _isNaN from 'lodash/isNaN';
import Cell from '../Cell';
import { arrowToCoord } from '../../utils/keyboardUtils';
import { useStorage } from '../../hooks/storage';
import Row from '../Row';
import './Grid.scss';

const Crossword = ({
  gridSize: GRID_ROW = 10,
  colSize: GRID_COL = 12,
  cellSize = 40,
}) => {
  const [direction, setDirection] = useState('row');
  const [editMode, setEditMode] = useState(false);
  const [active, setActive] = useState({ col: 0, row: 0 });
  const { grid, guess, setGrid, setGuess, reset: resetData } = useStorage(GRID_ROW, GRID_COL);

  const cols = useMemo(() => new Array(GRID_COL).fill(''), [GRID_COL]);

  function handleClick(row, col) {
    if (editMode) {
      const newState = _cloneDeep(grid);
      newState[row][col] = !grid[row][col];
      setGrid(newState)
    } else {
      // Cannot select black cell
      if (grid[row][col]) {
        // If we click on the current active, we change the direction
        if (active.col === col && active.row === row) {
          setDirection(direction === 'row' ? 'col' : 'row');
        } else {
          setActive({
            col,
            row
          });
        }
      }
    }
  }

  function moveActive(row, col, step = 1) {
    if (!_isNaN(active.row) && !_isNaN(active.col)) {
      const nextCol = active.col + (col * step);
      const nextRow = active.row + (row * step);
      if (
        nextRow > -1 &&
        nextRow < GRID_ROW &&
        nextCol > -1 &&
        nextCol < GRID_COL
      ) {
        if (grid[nextRow][nextCol]) {
          setActive({
            row: nextRow,
            col: nextCol,
          });
        } else {
          moveActive(row, col, step + 1);
        }
      }
    }
  }

  function moveToPrevious() {
    if (direction === 'row') {
      moveActive(0, -1);
    } else {
      moveActive(-1, 0);
    }
  }

  function moveToNext() {
    if (direction === 'row') {
      moveActive(0, 1);
    } else {
      moveActive(1, 0);
    }
  }

  function handleKeyDown(e) {
    if (!e.ctrlKey) {
      e.preventDefault();
    }
    if (!_isNil(active.row) && !_isNil(active.col) && !e.ctrlKey && !editMode) {
      // Letter
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        const newState = _cloneDeep(guess);
        newState[active.row][active.col] = e.key;
        setGuess(newState);
        moveToNext();
      }
      // Arrow
      else if (e.keyCode >= 37 && e.keyCode <= 40) {
        const [x, y] = arrowToCoord(e.keyCode);
        moveActive(y, x);
      }
      // Backspace
      else if (e.keyCode === 8) {
        const newState = _cloneDeep(guess);
        newState[active.row][active.col] = '';
        setGuess(newState);
        moveToPrevious();
      }
      // Tab key
      else if (e.keyCode === 9) {
        setDirection(direction === 'row' ? 'col' : 'row');
      }
    }
  }

  return (
    <div
      className="crossword"
      onKeyDown={handleKeyDown}
      tabIndex="1"
    >
      <div className="cw_game-zone">
        <div className="cw_row">
          <div style={{ width: cellSize, height: cellSize }}></div>
          {cols.map((c, j) => (
            <div className="cw_col-head" style={{ flex: 100 / GRID_COL }} key={j}>{j + 1}</div>
          ))}
        </div>
        {
          grid.map((row, i) => (
            <Row key={i} value={i + 1} cellSize={cellSize}>
              {row.map((cell, j) => (
                <Cell
                key={`${i}-${j}`}
                  cell={cell}
                  size={cellSize}
                  onClick={() => handleClick(i, j)}
                  locked={!grid[i][j]}
                  active={!editMode && ((i === active.row && direction === 'row') || (j === active.col && direction === 'col'))}
                  selected={!editMode && i === active.row && j === active.col}
                  >
                  { _get(guess, `[${i}][${j}`)}
                </Cell>
              ))}
            </Row>
          ))
        }
      </div>
      <label>Edit mode <input type="checkbox" checked={editMode} onChange={() => setEditMode(!editMode)} /></label>
      <button onClick={() => resetData()}>Reset</button>
    </div>
  );
}

Crossword.propTypes = {
  colSize: PropTypes.number,
  gridSize: PropTypes.number,
  cellSize: PropTypes.number,
};

export default Crossword;