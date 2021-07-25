import { useState } from 'react';
import { nestedArray } from '../utils/arrayUtils';

function defaultGrid(row, col) {
  return nestedArray(true, row, col);
}

function defaultGuess(row) {
  return JSON.parse(JSON.stringify(nestedArray([], row)));
}


export function useStorage(GRID_ROW, GRID_COL) {
    const [grid, setGrid] = useState(localStorage.getItem('grid') ? JSON.parse(localStorage.getItem('grid')) : defaultGrid(GRID_ROW, GRID_COL));
    const [guess, setGuess] = useState(localStorage.getItem('guess') ? JSON.parse(localStorage.getItem('guess')) : defaultGuess(GRID_ROW));

    function handleGridChange(value) {
      setGrid(value);
      localStorage.setItem('grid', JSON.stringify(value));
    }

    function handleGuessChange(value) {
      setGuess(value);
      localStorage.setItem('guess', JSON.stringify(value));
    }
  
    function reset() {
      localStorage.removeItem('guess');
      localStorage.removeItem('grid');
      setGrid(defaultGrid(GRID_ROW, GRID_COL));
      setGuess(defaultGuess(GRID_ROW));
    }
  
    return {
      grid,
      guess,
      setGrid: handleGridChange,
      setGuess: handleGuessChange,
      reset
    }
}