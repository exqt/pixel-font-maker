import { TTF } from "fonteditor-core";
import { makeAutoObservable } from "mobx";
import { GlyphData } from "./glyphData";
import Project from "./project";

export type GlyphJSON = {
  unicode: number
  data?: Array<string>
  components?: Array<number>
  name?: string
  advanceWidth?: number
}

export const GlyphAttributeKeys = ["unicode", "data", "components", "name", "advanceWidth"];

export class Glyph {
  data: GlyphData;
  components: Array<number> = [];
  name?: string;
  advanceWidth?: number

  constructor(data?: GlyphData) {
    makeAutoObservable(this);
    this.data = data ? data.clone() : new GlyphData();
  }

  static loadJSON(json: GlyphJSON) {
    let d = json.data ? GlyphData.loadJSON(json.data) : undefined;
    let g = new Glyph(d);
    if (json.components) g.setComponents(json.components);
    g.name = json.name;
    g.advanceWidth = json.advanceWidth;
    return g;
  }

  toJSON(unicode?: number) : GlyphJSON {
    const data: string[] = this.data.isEmpty() ? undefined : this.data.toJSON();

    return {
      unicode: unicode,
      data: data,
      name: this.name,
      components: this.components.length > 0 ? this.components : undefined,
      advanceWidth: this.advanceWidth
    }
  }

  clone() {
    let g = new Glyph(this.data);
    g.name = this.name;
    g.components = this.components;
    return g;
  }

  isEmpty() {
    return this.components.length == 0 && this.data.isEmpty() && !this.name && !this.advanceWidth;
  }

  setData(data: GlyphData) {
    this.data = data;
  }

  setAdvanceWidth(width?: number) {
    this.advanceWidth = width;
  }

  addComponent(comp: number) {
    let a = this.getComponents();
    if (a.includes(comp)) return;
    a = a.slice();
    a.push(comp);
    this.setComponents(a);
  }

  removeComponent(comp: number) {
    let a = this.components.filter((c) => c != comp);
    this.setComponents(a);
  }

  getComponents() {
    return this.components;
  }

  setComponents(a: Array<number>) {
    this.components = a;
  }
}
