import { makeAutoObservable } from "mobx";

class GlyphSet {
  name: string;
  unicodes: Array<number>;

  constructor(name: string, ranges?: Array<[number, number]>) {
    makeAutoObservable(this);

    this.name = name;
    this.unicodes = [];
    if (ranges) {
      for (let [start, end] of ranges) {
        for (let u = start; u <= end; u++) {
          this.unicodes.push(u);
        }
      }
    }
  }

  addUnicode(u: number) {
    this.unicodes.push(u);
  }

  getUnicodes(i: number, length: number) {
    return this.unicodes.slice(i, i + length);
  }

  clear() {
    this.unicodes = [];
  }

  get length() {
    return this.unicodes.length;
  }
}

export default GlyphSet;
