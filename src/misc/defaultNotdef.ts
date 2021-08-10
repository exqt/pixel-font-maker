import { Glyph } from "../models/glyph";

const NOTDEF_GLYPH = Glyph.loadJSON({
  unicode: 0x0,
  name: "nodef",
  data: [
    "#######",
    "##...##",
    "#.#.#.#",
    "#..#..#",
    "#.#.#.#",
    "##...##",
    "#######",
  ]
})

export default NOTDEF_GLYPH;
