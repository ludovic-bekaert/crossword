import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  activeColor: '#bbdefb',
  selectedColor: '#2196f3',
}

const Cell = ({
  active,
  children,
  locked,
  onClick,
  selected,
  size
}) => {
  const { activeColor, selectedColor } = styles;
  return (
    <div
      className="cw_cell"
      style={{
        width: size,
        height: size,
        fontSize: size / 2,
        backgroundColor: locked ? '#000' : selected ? selectedColor : active ? activeColor : undefined,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

Cell.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  locked: PropTypes.bool,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  size: PropTypes.number
};

export default Cell;