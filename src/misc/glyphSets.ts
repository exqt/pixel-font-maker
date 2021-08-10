export class GlyphSet {
  name: string;
  unicodes: Array<number>;

  constructor(name: string, ranges?: Array<[number, number]>) {
    this.name = name;
    this.unicodes = [];
    if (ranges) {
      for (let [start, len] of ranges) {
        for (let u = start; u < start + len; u++) {
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
}

import ksx1001SyllablesSet from "./ksx1001";

const asciiSet = new GlyphSet("ASCII", [[0, 1], [33, 94]]);
const latinExtendedSet = new GlyphSet("Latin-1 Supplement, Latin Extended-AB", [[0xA1, 431]]);
const greekSet = new GlyphSet("Greek", [[0x370, 144]]);
const japaneseHiraganaSet = new GlyphSet("Japanese Hiragana", [[0x3040, 93]]);
const japaneseKatakanaSet = new GlyphSet("Japanese Katakana", [[0x30A0, 93]]);
const koreanJamoSet = new GlyphSet("Korean Jamo", [[0x3130, 96]]);
const koreanSyllables = new GlyphSet("Korean Syllables", [[0xAC00, 19*21*28]]);
const privateUseSet = new GlyphSet("Private Use", [[0xE000, 6400]]);

const glyphSetList = [
  asciiSet,
  latinExtendedSet,
  greekSet,
  japaneseHiraganaSet,
  japaneseKatakanaSet,
  koreanJamoSet,
  koreanSyllables,
  ksx1001SyllablesSet,
  privateUseSet
];

export default glyphSetList;
