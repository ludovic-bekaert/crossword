/**
 * Create nested array of level.length dimension
 * The last level is filled with defaultValue
 * 
 * @param {any} defaultValue 
 * @param  {...number} level - The list of the nested arrays' size
 * @returns {array}
 */
export function nestedArray(defaultValue, ...level) {
  return Array.from(new Array(level[0]), () => {
    if (level.length === 1) {
      // make uniq
      return defaultValue;
    } else {
      return nestedArray(defaultValue, ...level.slice(1));
    }
  });
}