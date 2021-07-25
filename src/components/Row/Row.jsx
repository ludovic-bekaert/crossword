import React from 'react';
import { toRoman } from '../../utils/numberUtils';

const Row = ({ children, value, cellSize }) => {
  return (
    <div className="cw_row">
      <div style={{ width: cellSize }} className="cw_row-head">{toRoman(value)}</div>
      {children}
    </div>
  );
};
  
export default Row;