import { GlyphData } from "./glyphData";
import Project from "./project";

export interface Command {
  readonly description: string;
  undo(): void;
  redo(): void;
}

export class GlyphDataCommand implements Command {
  readonly description: string;
  private project: Project;
  private unicode: number;
  private before: GlyphData;
  private after: GlyphData;

  constructor(project: Project, unicode: number, before: GlyphData, after: GlyphData, description = "Edit glyph") {
    this.project = project;
    this.unicode = unicode;
    this.before = before;
    this.after = after;
    this.description = description;
  }

  undo() {
    let g = this.project.getGlyph(this.unicode).clone();
    g.setData(this.before);
    this.project.setGlyph(this.unicode, g);
  }

  redo() {
    let g = this.project.getGlyph(this.unicode).clone();
    g.setData(this.after);
    this.project.setGlyph(this.unicode, g);
  }
}
