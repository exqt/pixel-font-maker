export const toHex = (x: number, pad?: number) => {
  return "0x" + x.toString(16).toLocaleUpperCase().padStart(pad ? pad : 2, "0");
}

export const toCell = (x: number, y: number, cellSize: number) => {
  let cx = Math.floor(x / cellSize);
  let cy = Math.floor(y / cellSize);
  return [cx, cy];
}

export const isWhiteSpace = (unicode: number) => {
  if (unicode == 32) return true;
  return false;
}

export const decompose = (unicode: number) => {
  let n = unicode - 0xAC00;
  let cho = Math.floor( n / (21 * 28) );
  let jung = Math.floor( (n % (21 * 28)) / 28 );
  let jong = n % 28;
  return [cho, jung, jong];
}

export const nearPower2 = (n: number) => {
  let r = 1;
  while (r < n) r *= 2;
  return r;
}
