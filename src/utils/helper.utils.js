// Functions that help validate values
export const getNumbValue = (value, defaultVal, min, max) => {
  const numbValue = parseInt(value);
  if(!numbValue) return defaultVal;
  else if(min && numbValue < min) return min;
  else if(max && numbValue > max) return max;
  return numbValue;
};

export const getEnumValue = (value, defaultVal, enumVals) => {
  return enumVals.includes(value) ? value : defaultVal;
};

// Set of functions that set and get cursor position values from/to state
export const setCursorPos = (e, setAnchor) => {
  setAnchor({
    mouseX: e.clientX,
    mouseY: e.clientY,
  });
};

export const getCursorPos = (anchor) => {
  if(!anchor) return;
  return {top: anchor.mouseY, left: anchor.mouseX};
};
