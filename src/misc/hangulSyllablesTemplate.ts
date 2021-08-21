import { Glyph } from "../models/glyph";
import Project from "../models/project";

// 19 x 21 x 28
//       0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
// 초성: ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ (19개)
// 중성: ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ (21개)
// 종성:   ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ (28개)

const choseongs = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const jungseongs = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const jongseongs = " ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";

const setComponents = (project: Project, r: number, c: number, ptr: number, templateID: string, type: "choseong" | "jungseong" | "jongseong") => {
  let components:  Array<Array<number>> = [];
  let s = "";
  if (type === "choseong") s = choseongs;
  else if (type == "jungseong") s = jungseongs;
  else if (type == "jongseong") s = jongseongs;

  for (let i = 0; i < r; i++) {
    components.push([]);
    for (let j = 0; j < c; j++) {
      let g = new Glyph();
      g.name = `${templateID} | ${type} | ${i+1} | ${s.charAt(j)}`;

      project.glyphs.set(ptr, g);
      components[i].push(ptr);
      ptr++;
    }
  }

  return components;
}

const ptrStart = 0xE000;

export const TOOLTIP_ZIK = {
  choseong: [
    "받침 있고 중성 [ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅣ] 와 결합 (EX : 먄, 먠, 미)",
    "받침 있고 중성 [ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ] 와 결합 (EX : 옹, 왱, 융)",
    "받침 없고 중성 [ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅣ] 와 결합 (EX : 개, 네, 아)",
    "받침 없고 중성 [ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ] 와 결합 (EX : 오, 뇌, 위)"
  ],
  jungseong: [
    "받침 있는 글자의 중성부분 (EX : 감, 괨, 굼)",
    "받침 없는 글자의 중성부분 (EX : 오, 우, 야)"
  ],
  jongseong: [
    "중성 [ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅣ] 와 결합 (EX : 펭, 귄, 웱)",
    "중성 [ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ] 와 결합 (EX : 뫔, 뭄, 밈)"
  ]
}

export const applyHangulTemplateZIK = (project: Project) => {
  let ptr = ptrStart;

  let choComponents = setComponents(project, 4, 19, ptr, "ZIK", "choseong");
  ptr += 4*19;
  let jungComponents = setComponents(project, 2, 21, ptr, "ZIK", "jungseong");
  ptr += 2*21;
  let jongComponents = setComponents(project, 2, 28, ptr, "ZIK", "jongseong");
  ptr += 2*28;

  const isVerticalJung = (n: number) => n < 8 || n == 20;
  for (let cho = 0; cho < 19; cho++) {
    for (let jung = 0; jung < 21; jung++) {
      for (let jong = 0; jong < 28; jong++) {
        let u = cho*21*28 + jung*28 + jong + 0xAC00;
        let choT = (jong != 0 ? 0 : 2) + (isVerticalJung(jung) ? 0 : 1);
        let jungT = (jong != 0 ? 0 : 1);
        let jongT = (isVerticalJung(jung) ? 0 : 1);
        let g = project.getGlyph(u);

        g.addComponent(choComponents[choT][cho]);
        g.addComponent(jungComponents[jungT][jung]);
        if (jong > 0) g.addComponent(jongComponents[jongT][jong]);
        project.setGlyph(u, g);
      }
    }
  }
}

export const TOOLTIP_DKB = {
  choseong: [
    "받침 없는 [ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅣ] 와 결합",
    "받침 없는 [ㅗ ㅛ ㅡ]",
    "받침 없는 [ㅜ ㅠ]",
    "받침 없는 [ㅘ ㅙ ㅚ ㅢ]",
    "받침 없는 [ㅝ ㅞ ㅟ]",
    "받침 있는 [ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅣ] 와 결합",
    "받침 있는 [ㅗ ㅛ ㅜ ㅠ ㅡ]",
    "받침 있는 [ㅘ ㅙ ㅚ ㅢ ㅝ ㅞ ㅟ]",
  ],
  jungseong: [
    "받침 없는 [ㄱ ㅋ] 와 결합 (EX : 괴, 가, 큐, 캬)",
    "받침 없는 [ㄱ ㅋ] 이외의 자음과 결합 (EX : 외, 나, 류, 먀)",
    "받침 있는 [ㄱ ㅋ] 와 결합 (EX : 광, 쾅, 굉, 괽)",
    "받침 있는 [ㄱ ㅋ] 이외의 자음과 결합 (EX : 웅, 얅, 약, 약)"
  ],
  jongseong: [
    "중성 [ㅏ ㅑ ㅘ] 와 결합",
    "중성 [ㅓ ㅕ ㅚ ㅝ ㅟ ㅢ ㅣ]",
    "중성 [ㅐ ㅒ ㅔ ㅖ ㅙ ㅞ]",
    "중성 [ㅗ ㅛ ㅜ ㅠ ㅡ]"
  ]
}


export const applyHangulTemplateDKB = (project: Project) => {
  let ptr = ptrStart;

  let choComponents = setComponents(project, 8, 19, ptr, "DKB", "choseong");
  ptr += 8*19;
  let jungComponents = setComponents(project, 4, 21, ptr, "DKB", "jungseong");
  ptr += 4*21;
  let jongComponents = setComponents(project, 4, 28, ptr, "DKB", "jongseong");
  ptr += 4*28;

  // 종성 : 총 4벌 (4줄)
  // 1벌 : 중성 [ㅏ ㅑ ㅘ] 와 결합
  // 2벌 : 중성 [ㅓ ㅕ ㅚ ㅝ ㅟ ㅢ ㅣ]
  // 3벌 : 중성 [ㅐ ㅒ ㅔ ㅖ ㅙ ㅞ]
  // 4벌 : 중성 [ㅗ ㅛ ㅜ ㅠ ㅡ]
  // 초성: ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ (19개)
  // 중성: ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ (21개)
  // 종성:   ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ (28개)


  //                           ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ
  const choTypesWithoutFinal = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 2, 4, 4, 4, 2, 1, 3, 0];
  const choTypesWithFinal =    [5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 7, 7, 6, 6, 7, 7, 7, 6, 6, 7, 5];
  const jongTypes =            [0, 2, 0, 2, 1, 2, 1, 2, 3, 0, 2, 1, 3, 3, 1, 2, 1, 3, 3, 1, 1];

  for (let cho = 0; cho < 19; cho++) {
    for (let jung = 0; jung < 21; jung++) {
      for (let jong = 0; jong < 28; jong++) {
        let u = cho*21*28 + jung*28 + jong + 0xAC00;
        let choT = jong == 0 ? choTypesWithoutFinal[jung] : choTypesWithFinal[jung];
        let jungT = (jong == 0 ? 0 : 2) + ((cho == 0 || cho == 15) ? 0 : 1);
        let jongT = jongTypes[jung];
        let g = project.getGlyph(u);

        g.addComponent(choComponents[choT][cho]);
        g.addComponent(jungComponents[jungT][jung]);
        if (jong > 0) g.addComponent(jongComponents[jongT][jong]);
        project.setGlyph(u, g);
      }
    }
  }
}
