export function arrowToCoord(keyCode) {
  switch (keyCode) {
    case 37: // Left
      return [-1, 0];
    case 38: // Up
      return [0, -1];
    case 39: // Right
      return [1, 0];
    case 40: // Down
      return [0, 1];
    default:
      return [0, 0];
  }
}