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
