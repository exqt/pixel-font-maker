import { makeAutoObservable } from "mobx"
import GlyphSet from "./glyphSet";
import { GlyphData } from "./glyphData";
import Project from "./project";
import { ReferenceFont } from "./referenceFont";
import { toHex } from "../utils";

export default class EditorState {
  project: Project;
  editorSize = 27*16;

  editingUnicode: number;
  glyphData: GlyphData;
  brushType: number;
  referenceFont: ReferenceFont;
  zoom: number;

  stack: Array<GlyphData>;
  clipboard?: GlyphData;

  componentGlyphSet: GlyphSet;

  constructor() {
    makeAutoObservable(this);
    this.project = new Project();
    this.reset();
  }

  reset() {
    this.editingUnicode = 0;
    this.glyphData = new GlyphData();
    this.brushType = 0;

    this.referenceFont = new ReferenceFont();
    this.zoom = 0;

    this.stack = [];
    this.clipboard = null;

    this.componentGlyphSet = new GlyphSet("...");
  }

  setProject(project: Project) {
    this.project = project;
  }

  setEditingUnicode(unicode: number) {
    this.editingUnicode = unicode;
    this.stack = [];
  }

  setZoom(zoom: number) {
    this.zoom = zoom;
  }

  setGlyphData(glyph: GlyphData, limitWidth?: number) {
    if (limitWidth) glyph.limitWidth(limitWidth);
    this.glyphData = glyph;
  }

  setBrushType(bType: number) {
    this.brushType = bType;
  }

  pushGlyphData() {
    if (this.stack.length > 0 && this.stack[this.stack.length - 1].equals(this.glyphData)) return;
    this.stack.push(this.glyphData);
  }

  popGlyphData() {
    if (this.stack.length > 0) {
      this.glyphData = this.stack.pop();
    }
  }

  copyGlyphData() {
    this.clipboard = this.glyphData.clone();
  }

  updateProject() {
    let g = this.project.getGlyph(this.editingUnicode).clone();
    g.setData(this.glyphData);
    this.project.setGlyph(this.editingUnicode, g);
  }

  get cellSize() {
    return this.editorSize / this.cells;
  }

  get cells() {
    if (this.zoom == 0) return 12;
    if (this.zoom == 1) return 18;
    return 24;
  }

  clear() {
    this.pushGlyphData();
    this.setGlyphData(new GlyphData());
    this.updateProject();
  }

  undo() {
    this.popGlyphData();
    this.updateProject();
  }

  cut() {
    this.copyGlyphData();
    this.clear();
  }

  copy() {
    this.copyGlyphData();
    this.updateProject();
  }

  paste() {
    if (this.clipboard) {
      this.pushGlyphData();
      this.glyphData = this.clipboard.clone();
      this.updateProject();
    }
  }

  shift(dx: number, dy: number) {
    let c = this.glyphData.clone();
    c.shift(dx, dy);
    this.pushGlyphData();
    this.copyGlyphData();
    this.setGlyphData(c);
    this.updateProject();
  }

  flipH() {
    let c = this.glyphData.clone();
    c.flipH();
    this.pushGlyphData();
    this.setGlyphData(c);
    this.updateProject();
  }

  flipV() {
    let c = this.glyphData.clone();
    c.flipV();
    this.pushGlyphData();
    this.setGlyphData(c);
    this.updateProject();
  }

  generateComponentGlyphSet(unicode: number) {
    let gs = new GlyphSet(`Glyphs with component (${toHex(unicode)})`);
    this.project.getUnicodes().forEach((u) => {
      if (this.project.getGlyph(u).components.includes(unicode)) gs.addUnicode(u);
    });
    this.componentGlyphSet = gs;
  }
}
