import GlyphSet from "../models/glyphSet";
import ksx1001SyllablesSet from "./ksx1001";

const asciiSet = new GlyphSet("ASCII", [[0, 0], [33, 127]]);
const latinExtendedSet = new GlyphSet("Latin-1 Supplement, Latin Extended-AB", [[0xA1, 0x24F]]);
const greekSet = new GlyphSet("Greek", [[0x370, 0x3FF]]);
const cyrillicSet = new GlyphSet("Cyrillic", [[0x400, 0x52F]]);
const arrowsSet = new GlyphSet("Arrows", [[0x2190, 0x21FF]]);
const enclosedSet = new GlyphSet("Enclosed Alphanumerics & CJK Letters and Months", [[0x2460, 0x24FF], [0x3200, 0x32FF]]);
const geometricShapesSet = new GlyphSet("Geometry Shapes", [[0x25A0, 0x25FF]]);
const boxDrawingBlockElementSet = new GlyphSet("Box drawing & Block Elements", [[0x2500, 0x259F]]);
const miscellaneousSymbolsSet = new GlyphSet("Miscellaneous Symbols", [[0x2600, 0x26FF]]);
const CJKSymbolsSet = new GlyphSet("CJK Symbols and Punctuation", [[0x3000, 0x303F]]);
const CJKUnifiedIdeographs = new GlyphSet("CJK Unified Ideographs", [[0x4E00, 0x9FFF]]);
const japaneseHiraganaSet = new GlyphSet("Japanese Hiragana", [[0x3040, 0x309F]]);
const japaneseKatakanaSet = new GlyphSet("Japanese Katakana", [[0x30A0, 0x30FF]]);
const koreanCompatibilityJamoSet = new GlyphSet("Korean Compatibility Jamo", [[0x3130, 0x318F]]);
const koreanSyllables = new GlyphSet("Korean Syllables", [[0xAC00, 0xD7AF]]);
const privateUseSet = new GlyphSet("Private Use", [[0xE000, 0xF8FF]]);

let GlyphSetList = [
  asciiSet,
  latinExtendedSet,
  greekSet,
  cyrillicSet,
  enclosedSet,
  arrowsSet,
  geometricShapesSet,
  boxDrawingBlockElementSet,
  miscellaneousSymbolsSet,
  CJKSymbolsSet,
  CJKUnifiedIdeographs,
  japaneseHiraganaSet,
  japaneseKatakanaSet,
  koreanCompatibilityJamoSet,
  koreanSyllables,
  ksx1001SyllablesSet,
  privateUseSet
];

export default GlyphSetList;