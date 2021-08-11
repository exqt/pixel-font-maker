import { makeAutoObservable } from "mobx"
import { GlyphData } from "./glyphData";
import Project from "./project";
import { ReferenceFont } from "./referenceFont";

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

  setGlyphData(glyph: GlyphData) {
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

  pasteGlyphData() {
    if (this.clipboard) this.glyphData = this.clipboard.clone();
  }

  get cellSize() {
    return this.editorSize / this.cells;
  }

  get cells() {
    if (this.zoom == 0) return 12;
    if (this.zoom == 1) return 18;
    return 24;
  }

  undo() {
    this.popGlyphData();
    this.project.getGlyph(this.editingUnicode).setData(this.glyphData);
  }

  cut() {
    this.copyGlyphData();
    this.clear();
  }

  copy() {
    this.copyGlyphData();
  }

  paste() {
    this.pasteGlyphData();
    this.project.getGlyph(this.editingUnicode).setData(this.glyphData);
  }

  clear() {
    this.pushGlyphData();
    this.setGlyphData(new GlyphData());
    this.project.getGlyph(this.editingUnicode).setData(this.glyphData);
  }

  shift(dx: number, dy: number) {
    let c = this.glyphData.clone();
    c.shift(dx, dy);
    this.pushGlyphData();
    this.copyGlyphData();
    this.setGlyphData(c);
    this.project.getGlyph(this.editingUnicode).setData(this.glyphData);
  }

  flipH() {
    let c = this.glyphData.clone();
    c.flipH();
    this.pushGlyphData();
    this.setGlyphData(c);
    this.project.getGlyph(this.editingUnicode).setData(this.glyphData);
  }

  flipV() {
    let c = this.glyphData.clone();
    c.flipV();
    this.pushGlyphData();
    this.setGlyphData(c);
    this.project.getGlyph(this.editingUnicode).setData(this.glyphData);
  }
}
