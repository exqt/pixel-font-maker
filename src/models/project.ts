import { makeAutoObservable, ObservableMap } from "mobx";
import { saveAs } from 'file-saver';
import { GlyphData } from "./glyphData";
import { isWhiteSpace, nearPower2, toHex } from "../utils";
import { Glyph, GlyphAttributeKeys, GlyphJSON } from "./glyph";
import { Font, TTF } from "fonteditor-core";
import NOTDEF_GLYPH from "../misc/defaultNotdef";
import { woff2 } from 'fonteditor-core';

const SCALE = 16;

export interface IProjectAttributes {
  name: string;
  author: string;
  widthType: string;
  fixedWidth: number;
  spaceWidth: number;
  letterSpacing: number;
  descent: number;
  ascent: number;
  offsetX: number;
  lineGap: number;
  maxWidth: number;
}

interface ProjectJSON {
  version: number;
  glyphs: GlyphJSON[];
  attr: IProjectAttributes;
}

class Project {
  version = 1;
  glyphs: ObservableMap<number, Glyph>;
  attr: IProjectAttributes;
  changed = true;

  constructor(attr?: IProjectAttributes) {
    makeAutoObservable(this);
    this.glyphs = new ObservableMap();
    this.attr = {
      name: "unnamed-font",
      author: "unknown",
      widthType: "monospace",
      fixedWidth: 8,
      spaceWidth: 4,
      letterSpacing: 1,
      descent: 2,
      ascent: 8,
      offsetX: 0,
      lineGap: 0,
      maxWidth: 24,
      ...attr
    }
  }

  static loadJSON(p: ProjectJSON) {
    let project = new Project(p.attr);
    project.version = p.version;

    for (let g of p.glyphs) {
      let glyph = Glyph.loadJSON(g);
      project.setGlyph(g.unicode, glyph);
    }

    return project;
  }

  toJSON() : ProjectJSON {
    const glyphs: GlyphJSON[] = [];
    let keys = Array.from(this.glyphs.keys());
    keys.sort((a, b) => a - b);

    for (let key of keys) {
      let g = this.glyphs.get(key);
      let gJSON = g.toJSON();
      gJSON.unicode = key;
      glyphs.push(gJSON);
    }

    return {
      version: this.version,
      attr: this.attr,
      glyphs: glyphs,
    }
  }

  addNotdefGlyph() {
    let notdefGlyph = NOTDEF_GLYPH.clone();
    notdefGlyph.data.shift(this.attr.offsetX, this.attr.descent);
    this.setGlyph(0x0, notdefGlyph);
  }

  getTTFGlyph(unicode: number, name?: string, advanceWidth?: number) : TTF.Glyph {
    let g = this.getGlyph(unicode);
    let gd = this.getGlyphDataWithComponent(unicode);
    let contours = gd.getContours(this.attr.offsetX, this.attr.descent, SCALE);

    advanceWidth = advanceWidth || g.advanceWidth || this.getAdvanceWidth(gd);
    let xMin, yMin, xMax, yMax;

    // (?) buggy if contours is empty
    if (contours.length === 0) {
      contours.push([
        {x: 0, y: 0, onCurve: true},
      ])
    }

    xMin = contours[0][0].x; yMin = contours[0][0].y;
    xMax = contours[0][0].x; yMax = contours[0][0].y;
    for (let c of contours) {
      for (let p of c) {
        xMin = Math.min(xMin, p.x);
        yMin = Math.min(yMin, p.y);
        xMax = Math.max(xMax, p.x);
        yMax = Math.max(yMax, p.y);
      }
    }

    return {
      contours: contours,
      xMin: xMin,
      yMin: yMin,
      xMax: xMax,
      yMax: yMax,
      advanceWidth: advanceWidth * SCALE,
      leftSideBearing: xMin,
      name: name,
      unicode: [unicode],
    }
  }

  async toTrueTypeFile(type: string) {
    const glyphs: TTF.Glyph[] = [];

    glyphs.push(this.getTTFGlyph(0, ".notdef"));
    glyphs.push(this.getTTFGlyph(32, "space", this.attr.widthType == "monospace" ? this.attr.fixedWidth : this.attr.spaceWidth));

    let keys = Array.from(this.glyphs.keys());
    for (let unicode of keys) {
      if (unicode === 0 || unicode === 32) continue;
      glyphs.push(this.getTTFGlyph(unicode));
    }

    const emptyFontPath = "fonts/empty.ttf";
    const buffer = await fetch(emptyFontPath).then((res) => res.arrayBuffer());
    let font = Font.create(buffer, { type: 'ttf' });

    let ttf = font.get();
    ttf.glyf = glyphs;

    ttf.name.fontFamily = this.attr.name;
    ttf.name.fontSubFamily = "regular";
    ttf.name.fullName = this.attr.name;
    ttf.name.postScriptName = this.attr.name;
    ttf.name.uniqueSubFamily = this.attr.name;
    ttf.name.version = "v" + this.version;
    ttf.name.copyright = `Copyright © ${(new Date).getFullYear()} ${this.attr.author}`

    ttf.head.unitsPerEm = (this.attr.ascent + this.attr.descent) * SCALE;

    ttf.hhea.descent = -this.attr.descent*SCALE;
    ttf.hhea.ascent = this.attr.ascent*SCALE;
    ttf.hhea.lineGap = this.attr.lineGap*SCALE;

    ttf["OS/2"].sTypoAscender = this.attr.ascent*SCALE;
    ttf["OS/2"].sTypoDescender = -this.attr.descent*SCALE;
    ttf["OS/2"].usWinAscent = this.attr.ascent*SCALE;
    ttf["OS/2"].usWinDescent = this.attr.descent*SCALE;
    ttf["OS/2"].sxHeight = (this.glyphs.get(120).data.getHeight() - this.attr.descent) * SCALE;
    ttf["OS/2"].sCapHeight = this.attr.ascent*SCALE;

    ttf["OS/2"].ulUnicodeRange1 = 2415919111;
    ttf["OS/2"].ulUnicodeRange2 = 290520083;
    ttf["OS/2"].ulUnicodeRange3 = 262160;
    ttf["OS/2"].ulCodePageRange1 = 524289;

    ttf["OS/2"].ySubscriptXSize = ttf.head.unitsPerEm / 2;
    ttf["OS/2"].ySubscriptYSize = ttf.head.unitsPerEm / 2;
    ttf["OS/2"].ySubscriptXOffset = 0;
    ttf["OS/2"].ySubscriptYOffset = 0;
    ttf["OS/2"].ySuperscriptXSize = ttf.head.unitsPerEm / 2;
    ttf["OS/2"].ySuperscriptYSize = ttf.head.unitsPerEm / 2;
    ttf["OS/2"].ySuperscriptXOffset = 0;
    ttf["OS/2"].ySuperscriptYOffset = ttf.head.unitsPerEm / 2;
    ttf["OS/2"].yStrikeoutSize = SCALE;
    ttf["OS/2"].yStrikeoutPosition = (this.attr.ascent - this.attr.descent) * SCALE / 2;

    ttf["OS/2"].bFamilyType = 2;
    ttf["OS/2"].bSerifStyle = 2;
    ttf["OS/2"].bWeight = 6;
    ttf["OS/2"].bProportion = 1;
    ttf["OS/2"].bContrast = 0;
    ttf["OS/2"].bStrokeVariation = 1;
    ttf["OS/2"].bArmStyle = 1;
    ttf["OS/2"].bLetterform = 1;
    ttf["OS/2"].bMidline = 1;
    ttf["OS/2"].bXHeight = 1;

    console.log(ttf);

    font.sort();
    if (type == 'ttf') {
      let b = font.write({ type: 'ttf' });
      const file = new File([b], this.attr.name + ".ttf", { type: 'font/ttf' });
      return file;
    }
    else if (type == 'woff2') {
      await woff2.init('/fonts/woff2.wasm');
      let b = font.write({ type: 'woff2' });
      const file = new File([b], this.attr.name + ".woff2", { type: 'font/woff2' });
      return file;
    }
  }

  toBDFFile() {
    let b: Array<string> = [];
    let size = this.attr.ascent + this.attr.descent;
    b.push(
`STARTFONT 2.1
FONT -${this.attr.name}-${"Regular"}-${"R"}-${"Regular"}--${size}-${size}-${75}-c-${80}-${"iso10646-1"}
SIZE ${size} ${75} ${75}
FONTBOUNDINGBOX ${this.attr.maxWidth} ${size} ${0} ${-this.attr.descent}
STARTPROPERTIES ${10}
FAMILY_NAME ${this.attr.name}
WEIGHT_NAME ${"Regular"}
FONT_VERSION ${"1.0"}
COPYRIGHT Copyright © ${(new Date).getFullYear()} ${this.attr.author}
FOUNDRY PIXEL FONT MAKER
FONT_ASCENT ${this.attr.ascent}
FONT_DESCENT ${this.attr.descent}
CAP_HEIGHT ${this.attr.ascent}
FONT_SIZE ${this.attr.ascent + this.attr.descent}
X_HEIGHT ${this.glyphs.get(120).data.getHeight() - this.attr.descent}
ENDPROPERTIES
CHARS ${this.glyphs.size + 1}
`
    )

    const makeChar = (unicode: number, gd: GlyphData, w?: number) => {
      w = w ? w : this.getAdvanceWidth(gd);
      return `STARTCHAR U+${unicode.toString(16).padStart(4, "0")}
ENCODING ${unicode}
SWIDTH ${500} 0
DWIDTH ${w} 0
BBX ${w} ${gd.getHeight()} ${0} ${-this.attr.descent}
${gd.toBDFFormat(this.attr.maxWidth)}
ENDCHAR
`;
    }

    b.push(makeChar(32, new GlyphData(), this.attr.widthType == "monospace" ? this.attr.fixedWidth : this.attr.spaceWidth));
    this.glyphs.forEach((g, unicode) => {
      let gd = this.getGlyphDataWithComponent(unicode);
      b.push(makeChar(unicode, gd));
    });
    b.push("ENDFONT");

    const file = new File([b.join("")], this.attr.name + ".bdf", { type: 'font/bdf' });
    return file;
  }

  async export(type: string) {
    if (type == "ttf" || type == "woff2") {
      let file = await this.toTrueTypeFile(type);
      saveAs(file, this.attr.name + "." + type);
    }
    else if (type == "bdf") {
      let file = this.toBDFFile();
      saveAs(file, this.attr.name + "." + type);
    }
  }

  save() {
    let o = this.toJSON();
    let jsonKeys = ["version", "attr", ...Object.keys(this.attr), "glyphs", ...GlyphAttributeKeys];
    let s = JSON.stringify(o, jsonKeys, "\t");
    const file = new File([s], this.attr.name + ".pfp");
    saveAs(file, this.attr.name + ".pfp");
  }

  setGlyph(unicode: number, glyph: Glyph) {
    if (glyph.isEmpty() && !isWhiteSpace(unicode)) return this.glyphs.delete(unicode);
    glyph.data.limitWidth(this.attr.maxWidth);
    this.glyphs.set(unicode, glyph);
    this.changed = true;
  }

  getGlyph(unicode: number) {
    return this.glyphs.get(unicode) || new Glyph();
  }

  getGlyphs(unicodes: Array<number>) : Array<Glyph> {
    return unicodes.map((u) => this.getGlyph(u));
  }

  getUnicodes() {
    return Array.from(this.glyphs.keys());
  }

  getGlyphDataWithComponent(unicode: number) {
    let g = this.getGlyph(unicode);
    let d = g.data.clone();
    for (let x of this.getGlyphs(g.getComponents()).map((g) => g.data)) d.merge(x);
    return d;
  }

  getAdvanceWidth(data: GlyphData) {
    let w = data.getWidth() - this.attr.offsetX;
    if (this.attr.widthType == "monospace") {
      if (w <= 0) return this.attr.fixedWidth;
      return Math.ceil(w / this.attr.fixedWidth) * this.attr.fixedWidth;
    }
    else if (this.attr.widthType == "proportional") {
      return w + this.attr.letterSpacing;
    }
  }

  getMaxHeight() {
    let maxHeight = 0;
    this.glyphs.forEach((glyph) => {
      maxHeight = Math.max(maxHeight, glyph.data.getHeight());
    })
    return maxHeight - this.attr.descent;
  }

  setDescent(descent: number) {
    this.attr.descent = descent;
  }

  setAscent(ascent: number) {
    this.attr.ascent = ascent;
  }

  setName(name: string) {
    this.attr.name = name;
  }

  setAuthor(author: string) {
    this.attr.author = author;
  }

  setWdidthType(widthType: string) {
    this.attr.widthType = widthType;
  }

  setFixedWidth(width: number) {
    this.attr.fixedWidth = width;
  }

  setSpaceWidth(spaceWidth: number) {
    this.attr.spaceWidth = spaceWidth;
  }

  setLetterSpacing(letterSpacing: number) {
    this.attr.letterSpacing = letterSpacing;
  }

  setLineGap(lineGap: number) {
    this.attr.lineGap = lineGap;
  }

  setMaxWidth(maxWidth: number) {
    this.attr.maxWidth = maxWidth;
  }
}

export default Project;
