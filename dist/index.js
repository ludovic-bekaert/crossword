// src/components/Grid/Grid.jsx
import React3, { useMemo, useState as useState2 } from "react";
import PropTypes2 from "prop-types";
import _get from "lodash/get";
import _cloneDeep from "lodash/cloneDeep";
import _isNil from "lodash/isNil";
import _isNaN from "lodash/isNaN";

// src/components/Cell/Cell.jsx
import React from "react";
import PropTypes from "prop-types";
var styles = {
  activeColor: "#bbdefb",
  selectedColor: "#2196f3"
};
var Cell = ({
  active,
  children,
  locked,
  onClick,
  selected,
  size
}) => {
  const { activeColor, selectedColor } = styles;
  return /* @__PURE__ */ React.createElement("div", {
    className: "cw_cell",
    style: {
      width: size,
      height: size,
      fontSize: size / 2,
      backgroundColor: locked ? "#000" : selected ? selectedColor : active ? activeColor : void 0
    },
    onClick
  }, children);
};
Cell.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  locked: PropTypes.bool,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  size: PropTypes.number
};
var Cell_default = Cell;

// src/utils/keyboardUtils.js
function arrowToCoord(keyCode) {
  switch (keyCode) {
    case 37:
      return [-1, 0];
    case 38:
      return [0, -1];
    case 39:
      return [1, 0];
    case 40:
      return [0, 1];
    default:
      return [0, 0];
  }
}

// src/hooks/storage.js
import { useState } from "react";

// src/utils/arrayUtils.js
function nestedArray(defaultValue, ...level) {
  return Array.from(new Array(level[0]), () => {
    if (level.length === 1) {
      return defaultValue;
    } else {
      return nestedArray(defaultValue, ...level.slice(1));
    }
  });
}

// src/hooks/storage.js
function defaultGrid(row, col) {
  return nestedArray(true, row, col);
}
function defaultGuess(row) {
  return JSON.parse(JSON.stringify(nestedArray([], row)));
}
function useStorage(GRID_ROW, GRID_COL) {
  const [grid, setGrid] = useState(localStorage.getItem("grid") ? JSON.parse(localStorage.getItem("grid")) : defaultGrid(GRID_ROW, GRID_COL));
  const [guess, setGuess] = useState(localStorage.getItem("guess") ? JSON.parse(localStorage.getItem("guess")) : defaultGuess(GRID_ROW));
  function handleGridChange(value) {
    setGrid(value);
    localStorage.setItem("grid", JSON.stringify(value));
  }
  function handleGuessChange(value) {
    setGuess(value);
    localStorage.setItem("guess", JSON.stringify(value));
  }
  function reset() {
    localStorage.removeItem("guess");
    localStorage.removeItem("grid");
    setGrid(defaultGrid(GRID_ROW, GRID_COL));
    setGuess(defaultGuess(GRID_ROW));
  }
  return {
    grid,
    guess,
    setGrid: handleGridChange,
    setGuess: handleGuessChange,
    reset
  };
}

// src/components/Row/Row.jsx
import React2 from "react";

// src/utils/numberUtils.js
function toRoman(number) {
  switch (number) {
    case 1:
      return "I";
    case 2:
      return "II";
    case 3:
      return "III";
    case 4:
      return "IV";
    case 5:
      return "V";
    case 6:
      return "VI";
    case 7:
      return "VII";
    case 8:
      return "VIII";
    case 9:
      return "IX";
    case 10:
      return "X";
    default:
      return number;
  }
}

// src/components/Row/Row.jsx
var Row = ({ children, value, cellSize }) => {
  return /* @__PURE__ */ React2.createElement("div", {
    className: "cw_row"
  }, /* @__PURE__ */ React2.createElement("div", {
    style: { width: cellSize },
    className: "cw_row-head"
  }, toRoman(value)), children);
};
var Row_default = Row;

// src/components/Grid/Grid.jsx
var Crossword = ({
  gridSize: GRID_ROW = 10,
  colSize: GRID_COL = 12,
  cellSize = 40
}) => {
  const [direction, setDirection] = useState2("row");
  const [editMode, setEditMode] = useState2(false);
  const [active, setActive] = useState2({ col: 0, row: 0 });
  const { grid, guess, setGrid, setGuess, reset: resetData } = useStorage(GRID_ROW, GRID_COL);
  const cols = useMemo(() => new Array(GRID_COL).fill(""), [GRID_COL]);
  function handleClick(row, col) {
    if (editMode) {
      const newState = _cloneDeep(grid);
      newState[row][col] = !grid[row][col];
      setGrid(newState);
    } else {
      if (grid[row][col]) {
        if (active.col === col && active.row === row) {
          setDirection(direction === "row" ? "col" : "row");
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
      const nextCol = active.col + col * step;
      const nextRow = active.row + row * step;
      if (nextRow > -1 && nextRow < GRID_ROW && nextCol > -1 && nextCol < GRID_COL) {
        if (grid[nextRow][nextCol]) {
          setActive({
            row: nextRow,
            col: nextCol
          });
        } else {
          moveActive(row, col, step + 1);
        }
      }
    }
  }
  function moveToPrevious() {
    if (direction === "row") {
      moveActive(0, -1);
    } else {
      moveActive(-1, 0);
    }
  }
  function moveToNext() {
    if (direction === "row") {
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
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        const newState = _cloneDeep(guess);
        newState[active.row][active.col] = e.key;
        setGuess(newState);
        moveToNext();
      } else if (e.keyCode >= 37 && e.keyCode <= 40) {
        const [x, y] = arrowToCoord(e.keyCode);
        moveActive(y, x);
      } else if (e.keyCode === 8) {
        const newState = _cloneDeep(guess);
        newState[active.row][active.col] = "";
        setGuess(newState);
        moveToPrevious();
      } else if (e.keyCode === 9) {
        setDirection(direction === "row" ? "col" : "row");
      }
    }
  }
  return /* @__PURE__ */ React3.createElement("div", {
    className: "crossword",
    onKeyDown: handleKeyDown,
    tabIndex: "1"
  }, /* @__PURE__ */ React3.createElement("div", {
    className: "cw_game-zone"
  }, /* @__PURE__ */ React3.createElement("div", {
    className: "cw_row"
  }, /* @__PURE__ */ React3.createElement("div", {
    style: { width: cellSize, height: cellSize }
  }), cols.map((c, j) => /* @__PURE__ */ React3.createElement("div", {
    className: "cw_col-head",
    style: { flex: 100 / GRID_COL },
    key: j
  }, j + 1))), grid.map((row, i) => /* @__PURE__ */ React3.createElement(Row_default, {
    key: i,
    value: i + 1,
    cellSize
  }, row.map((cell, j) => /* @__PURE__ */ React3.createElement(Cell_default, {
    key: `${i}-${j}`,
    cell,
    size: cellSize,
    onClick: () => handleClick(i, j),
    locked: !grid[i][j],
    active: !editMode && (i === active.row && direction === "row" || j === active.col && direction === "col"),
    selected: !editMode && i === active.row && j === active.col
  }, _get(guess, `[${i}][${j}`)))))), /* @__PURE__ */ React3.createElement("label", null, "Edit mode ", /* @__PURE__ */ React3.createElement("input", {
    type: "checkbox",
    checked: editMode,
    onChange: () => setEditMode(!editMode)
  })), /* @__PURE__ */ React3.createElement("button", {
    onClick: () => resetData()
  }, "Reset"));
};
Crossword.propTypes = {
  colSize: PropTypes2.number,
  gridSize: PropTypes2.number,
  cellSize: PropTypes2.number
};
var Grid_default = Crossword;
export {
  Grid_default as Crossword
};
