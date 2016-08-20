
export function prev() {
  return { type: 'PREV' };
}

export function next() {
  return { type: 'NEXT' };
}

export function check(checked) {
  return { type: 'CHECK', checked };
}

