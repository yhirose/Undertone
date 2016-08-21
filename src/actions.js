
export function prev() {
  return { type: 'PREV' };
}

export function next() {
  return { type: 'NEXT' };
}

export function toggleCheck(index) {
  return { type: 'TOGGLE_CHECK', index };
}

export function setIndex(index) {
  return { type: 'SET_INDEX', index };
}
