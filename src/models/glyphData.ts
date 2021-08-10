import opentype from "opentype.js";
import Project from "./project";
import { TTF } from "fonteditor-core";

export class GlyphData {
  data?: Uint32Array;

  constructor(data?: Uint32Array) {
    this.data = data || new Uint32Array(32);
  }

  static loadJSON(data?: Array<string>) {
    if (!data) return new GlyphData();
    let d = new Uint32Array(32);
    let h = data.length;

    for (let y = 0; y < h; y++) {
      let row = data[h-1-y];
      for (let x = 0; x < row.length; x++) {
        if (row[x] == "#") d[y] |= 1 << x;
      }
    }

    return new GlyphData(d);
  }

  toJSON() : string[] {
    const data: string[] = this.toString().split("\n");
    data.pop(); // remove empty line
    return data;
  }

  clone() {
    let g = new GlyphData(this.data.slice());
    return g;
  }

  toString() {
    let r = "";
    let y = 31;
    for(; y >= 0 && this.data[y] == 0; y--);

    let w = this.getWidth();
    for (; y >= 0; y--) {
      let buf = "";
      for (let x = 0; x < w; x++) {
        buf += this.getPixel(x, y) == 1 ? "#" : ".";
      }
      r += buf + "\n";
    }

    return r;
  }

  copyData(glyph: GlyphData) {
    for (let i = 0; i < 32; i++) {
      this.data[i] = glyph.data[i];
    }
  }

  getPixel(x: number, y: number) {
    if (!(0 <= x && x < 32 && 0 <= y && y < 32)) return 0;
    return (this.data[y] & (1<<x)) >> (x);
  }

  setPixel(x: number, y: number, v: number) {
    if (!(0 <= x && x < 32 && 0 <= y && y < 32)) return;
    this.data[y] = (this.data[y] & ~(1<<x)) | (v << x);
  }

  togglePixel(x: number, y: number) {
    this.data[y] = (this.data[y]) ^ (1 << x);
  }

  clear() {
    this.data = new Uint32Array(32).fill(0);
  }

  isEmpty() {
    return this.data.reduce((x, y) => x | y) == 0;
  }

  equals(g: GlyphData) {
    for (let y = 0; y < 32; y++) {
      if (this.data[y] !== g.data[y]) return false;
    }
    return true;
  }

  merge(g: GlyphData) {
    let ng = this.clone();
    for (let y = 0; y < 32; y++) {
      ng.data[y] |= g.data[y];
    }
    return ng;
  }

  shift(dx: number, dy: number) {
    let ng = new GlyphData();
    for (let y = 0; y < 32; y++) {
      if (0 <= y - dy && y - dy < 32) {
        ng.data[y] = dx > 0 ? this.data[y - dy] << dx : this.data[y - dy] >> (-dx);
      }
    }
    this.data = ng.data;
  }

  getWidth() {
    let w = -1;
    for (let y = 0; y < 32; y++) {
      if (this.data[y] == 0) continue;
      for (let x = 31; x > w; x--) {
        if (this.getPixel(x, y) == 1) {
          w = Math.max(w, x);
        }
      }
    }
    return w + 1;
  }

  getHeight() {
    let h = -1;
    for (let x = 0; x < 32; x++) {
      for (let y = h; y < 32; y++) {
        if (this.getPixel(x, y) == 1) {
          h = Math.max(h, y);
        }
      }
    }
    return h + 1;
  }

  // ^---->
  // |    |
  // <----v

  getContours(offsetX: number = 0, offsetY: number = 0, scale: number = 1) {
    const UP = 0;
    const RIGHT = 1;
    const DOWN = 2;
    const LEFT = 3;

    let arrows: Array<Array<[number, number]>> = new Array<Array<[number, number]>>(33*33);
    let toVertex = (x: number, y: number) => x*33 + y;
    let toPosition = (v: number): [number, number] => [Math.floor(v / 33), v % 33];

    for (let i = 0; i < 33*33; i++) arrows[i] = [];

    // generate unit arrows
    for (let y = 0; y < 33; y++) {
      for (let x = 0; x < 33; x++) {
        let b0 = this.getPixel(x, y);
        let bl = this.getPixel(x - 1, y);
        let bd = this.getPixel(x, y - 1);

        if (b0 != 0 && bl == 0) { // up
          arrows[toVertex(x, y)].push([toVertex(x, y + 1), UP]);
        }
        else if(b0 == 0 && bl != 0) { // down
          arrows[toVertex(x, y + 1)].push([toVertex(x, y), DOWN]);
        }

        if (b0 != 0 && bd == 0) { // left
          arrows[toVertex(x + 1, y)].push([toVertex(x, y), LEFT]);
        }
        else if(b0 == 0 && bd != 0) { // right
          arrows[toVertex(x, y)].push([toVertex(x + 1, y), RIGHT]);
        }
      }
    }

    let contours: Array<TTF.Contour> = [];
    let contour: TTF.Contour = [];
    let dfs = (v: number, dir: number) => {
      if (arrows[v].length == 0) return;

      let mn = 4;
      let idx = -1;
      for (let i = 0; i < arrows[v].length; i++) {
        let ad = arrows[v][i][1];
        let d = (ad - dir + 4) % 4;
        if (d < mn) {
          mn = d;
          idx = i;
        }
      }

      let u = arrows[v][idx];
      arrows[v].splice(idx, 1);
      let [x, y] = toPosition(v);
      if (dir != u[1]) contour.push({x: x, y: y, onCurve: true});
      dfs(...u);
    }

    for (let v = 0; v < 33*33; v++) {
      while (arrows[v].length > 0) {
        dfs(arrows[v][0][0], arrows[v][0][1]);
      }

      if (contour.length > 0) {
        contours.push(contour);
        contour = [];
      }
    }

    //
    for (let c of contours) {
      for (let p of c) {
        p.x = (p.x - offsetX) * scale;
        p.y = (p.y - offsetY) * scale;
      }
    }

    return contours;
  }
}
