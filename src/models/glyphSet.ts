import Project from "./project";

export default class GlyphSet {
  name: string;
  unicodes: Array<number>;

  constructor(name: string, ranges?: Array<[number, number]>) {
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

export class HangulComponentGlyphSet extends GlyphSet {
  components: {
    choseongs: Array<Array<number>>
    jungseongs: Array<Array<number>>
    jongseongs: Array<Array<number>>
  };

  constructor(project: Project) {
    super("Hangul Components");

    this.components = {
      choseongs: [],
      jungseongs: [],
      jongseongs: []
    }

    project.getUnicodes().forEach((u) => {
      if (u < 0xE000) return;
      let g = project.getGlyph(u);
      if (!g.name) return;
      let s = g.name.split(" | ");
      if (s.length !== 4) return;

      let type = s[1];
      let idx = parseInt(s[2]) - 1;
      let a;

      if (type == "choseong") a = this.components.choseongs;
      else if (type == "jungseong") a = this.components.jungseongs;
      else if (type == "jongseong") a = this.components.jongseongs;
      else return;

      if (idx <= a.length) a.push([]);
      a[idx].push(u);
      this.unicodes.push(u);
    });
  }
}