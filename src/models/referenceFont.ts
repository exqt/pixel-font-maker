import { makeAutoObservable } from "mobx";
import opentype, { Font } from "opentype.js";

const DEFAULT_REFERENCE_FONT = "NotoSansKR-Regular.otf"

export class ReferenceFont {
  font?: Font;
  scale = 256;
  offsetX = 0;
  offsetY = 0;
  enable = true;

  constructor(font?: Font) {
    makeAutoObservable(this);

    if (!font) {
      opentype.load("fonts/" + DEFAULT_REFERENCE_FONT)
        .then((font) => {
          this.setFont(font);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    else {
      this.setFont(font);
    }
  }

  setFont(font: Font) {
    this.font = font;
  }

  setScale(s: number) {
    this.scale = s;
  }

  setOffset(x?: number, y?: number) {
    if (x || x == 0) this.offsetX = x;
    if (y || y == 0) this.offsetY = y;
  }

  setEnable(enable: boolean) {
    this.enable = enable;
  }

  getPathData(unicode: number) {
    if (this.font) {
      let path = this.font.getPath(String.fromCharCode(unicode), this.offsetX, -this.offsetY, this.scale);
      return path.toPathData(1);
    }
    else {
      return "";
    }
  }
}
