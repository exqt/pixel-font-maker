import { makeAutoObservable } from "mobx"
import GlyphSet, { HangulComponentGlyphSet } from "./glyphSet";
import { GlyphData } from "./glyphData";
import Project from "./project";
import { ReferenceFont } from "./referenceFont";
import { toHex } from "../utils";
import CommandHistory from "./commandHistory";
import { GlyphDataCommand, SelectGlyphCommand } from "./commands";

export default class EditorState {
  project: Project;
  editorSize = 27*16;

  editingUnicode: number;
  glyphData: GlyphData;
  brushType: number;
  referenceFont: ReferenceFont;
  zoom: number;

  history: CommandHistory;
  clipboard?: GlyphData;

  _brushStartSnapshot: GlyphData | null = null;

  selectedComponentGlyphSet: GlyphSet;
  hangulComponentGlyphSet: GlyphSet;

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

    this.history = new CommandHistory();
    this.clipboard = null;
    this._brushStartSnapshot = null;

    this.selectedComponentGlyphSet = new GlyphSet("...");
  }

  generateSelectedComponentGlyphSet(unicode: number) {
    let gs = new GlyphSet(`Glyphs with component (${toHex(unicode)})`);
    this.project.getUnicodes().forEach((u) => {
      if (this.project.getGlyph(u).components.includes(unicode)) gs.addUnicode(u);
    });
    this.selectedComponentGlyphSet = gs;
  }

  setProject(project: Project) {
    this.project = project;
    this.hangulComponentGlyphSet = new HangulComponentGlyphSet(project);
  }

  setEditingUnicode(unicode: number) {
    if (unicode === this.editingUnicode) return;
    let prev = this.editingUnicode;
    this.updateProject();
    this.editingUnicode = unicode;
    this._reloadGlyphFromProject();
    let cmd = new SelectGlyphCommand(
      (u) => { this.editingUnicode = u; },
      prev,
      unicode,
    );
    this.history.push(cmd);
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

  beginBrushStroke() {
    this._brushStartSnapshot = this.glyphData.clone();
  }

  endBrushStroke() {
    if (!this._brushStartSnapshot) return;

    let after = this.glyphData.clone();
    after.limitWidth(this.project.attr.maxWidth);
    this.setGlyphData(after);

    if (!this._brushStartSnapshot.equals(after)) {
      let cmd = new GlyphDataCommand(
        this.project,
        this.editingUnicode,
        this._brushStartSnapshot,
        after.clone(),
        "Brush stroke"
      );
      this.history.push(cmd);
      this.updateProject();
    }

    this._brushStartSnapshot = null;
  }

  copyGlyphData() {
    this.clipboard = this.glyphData.clone();
  }

  updateProject() {
    let g = this.project.getGlyph(this.editingUnicode).clone();
    g.setData(this.glyphData);
    this.project.setGlyph(this.editingUnicode, g);
  }

  private _recordGlyphCommand(before: GlyphData, description: string) {
    let after = this.glyphData.clone();
    let cmd = new GlyphDataCommand(this.project, this.editingUnicode, before, after, description);
    this.history.push(cmd);
  }

  private _reloadGlyphFromProject() {
    let g = this.project.getGlyph(this.editingUnicode);
    this.glyphData = g.data.clone();
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
    let before = this.glyphData.clone();
    this.setGlyphData(new GlyphData());
    this._recordGlyphCommand(before, "Clear");
    this.updateProject();
  }

  undo() {
    this.updateProject();
    this.history.undo();
    this._reloadGlyphFromProject();
  }

  redo() {
    this.updateProject();
    this.history.redo();
    this._reloadGlyphFromProject();
  }

  cut() {
    this.copyGlyphData();
    this.clear();
  }

  copy() {
    this.copyGlyphData();
  }

  paste() {
    if (this.clipboard) {
      let before = this.glyphData.clone();
      this.glyphData = this.clipboard.clone();
      this._recordGlyphCommand(before, "Paste");
      this.updateProject();
    }
  }

  shift(dx: number, dy: number) {
    let before = this.glyphData.clone();
    let c = this.glyphData.clone();
    c.shift(dx, dy);
    this.copyGlyphData();
    this.setGlyphData(c);
    this._recordGlyphCommand(before, "Shift");
    this.updateProject();
  }

  flipH() {
    let before = this.glyphData.clone();
    let c = this.glyphData.clone();
    c.flipH();
    this.setGlyphData(c);
    this._recordGlyphCommand(before, "Flip horizontal");
    this.updateProject();
  }

  flipV() {
    let before = this.glyphData.clone();
    let c = this.glyphData.clone();
    c.flipV();
    this.setGlyphData(c);
    this._recordGlyphCommand(before, "Flip vertical");
    this.updateProject();
  }
}
