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

type HangulTemplateRule = (cho: number, jung: number, jong: number) => [tCho: number, tJung: number, tJong: number];
type HangulTemplateTooltip = {choseong: string[], jungseong: string[], jongseong: string[]}
export class HangulTemplate {
  templateName: string;
  nCho: number;
  nJung: number;
  nJong: number;
  rule: HangulTemplateRule;
  tooltip: HangulTemplateTooltip;

  constructor(templateName: string, nCho: number, nJung: number, nJong: number, rule: HangulTemplateRule, tooltip: HangulTemplateTooltip) {
    this.templateName = templateName;
    this.nCho = nCho; 
    this.nJung = nJung;
    this.nJong = nJong;
    this.rule = rule;
    this.tooltip = tooltip;
  }

  apply(project: Project, ptr: number) {
    let choComponents = setComponents(project, this.nCho, 19, ptr, this.templateName, "choseong");
    ptr += this.nCho*19;
    let jungComponents = setComponents(project, this.nJung, 21, ptr, this.templateName, "jungseong");
    ptr += this.nJung*21;
    let jongComponents = setComponents(project, this.nJong, 28, ptr, this.templateName, "jongseong");
    ptr += this.nJong*28;

    for (let cho = 0; cho < 19; cho++) {
      for (let jung = 0; jung < 21; jung++) {
        for (let jong = 0; jong < 28; jong++) {
          let u = cho*21*28 + jung*28 + jong + 0xAC00;
          let [tCho, tJung, tJong] = this.rule(cho, jung, jong);
          let g = project.getGlyph(u);
          g.addComponent(choComponents[tCho][cho]);
          g.addComponent(jungComponents[tJung][jung]);
          if (jong > 0) g.addComponent(jongComponents[tJong][jong]);
          project.setGlyph(u, g);
        }
      }
    }
  }
}

// ZIK
const hangulTemplateZIK = new HangulTemplate("ZIK", 4, 2, 2, (cho, jung, jong) => {
  const isVerticalJung = (n: number) => n < 8 || n == 20;
  return [
    (jong != 0 ? 0 : 2) + (isVerticalJung(jung) ? 0 : 1),
    (jong != 0 ? 0 : 1),
    (isVerticalJung(jung) ? 0 : 1)
  ];
}, {
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
})

const hangulTemplateDKB = new HangulTemplate("DKB", 8, 4, 4, (cho, jung, jong) => {
  //                           ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ
  const choTypesWithoutFinal = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 2, 4, 4, 4, 2, 1, 3, 0];
  const choTypesWithFinal =    [5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 7, 7, 6, 6, 7, 7, 7, 6, 6, 7, 5];
  const jongTypes =            [0, 2, 0, 2, 1, 2, 1, 2, 3, 0, 2, 1, 3, 3, 1, 2, 1, 3, 3, 1, 1];

  return [
    jong == 0 ? choTypesWithoutFinal[jung] : choTypesWithFinal[jung],
    (jong == 0 ? 0 : 2) + ((cho == 0 || cho == 15) ? 0 : 1),
    jongTypes[jung]
  ]
}, {
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
})

const hangulTemplateMinzkn = new HangulTemplate("MINZKN", 10, 6, 4, (cho, jung, jong) => {
  //                 ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ
  const choTypes  = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 2, 4, 4, 4, 2, 1, 3, 0];
  const jongTypes = [0, 2, 0, 2, 1, 2, 1, 2, 3, 0, 2, 1, 3, 3, 1, 2, 1, 3, 3, 1, 0];
  const jungType = (cho: number) => {
    if (cho == 0 || cho == 15) return 0;
    else if (cho == 18) return 1;
    else return 2;
  }

  return [
    (jong == 0 ? 0 : 5) + choTypes[jung],
    (jong == 0 ? 0 : 3) + jungType(cho),
    jongTypes[jung]
  ]
}, {
  choseong: [
    "받침 없는 [ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅣ]",
    "받침 없는 [ㅗ ㅛ ㅡ]",
    "받침 없는 [ㅜ ㅠ]",
    "받침 없는 [ㅘ ㅙ ㅚ ㅢ]",
    "받침 없는 [ㅝ ㅞ ㅟ]",
    "받침 있는 [ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅣ]",
    "받침 있는 [ㅗ ㅛ ㅡ]",
    "받침 있는 [ㅜ ㅠ]",
    "받침 있는 [ㅘ ㅙ ㅚ ㅢ]",
    "받침 있는 [ㅝ ㅞ ㅟ]",
  ],
  jungseong: [
    "받침 없는 초성 [ㄱ ㅋ] 과 결합 ",
    "받침 있는 초성 [ㅎ] 과 결합 ",
    "받침 없는 초성 [ㄱ ㅋ ㅎ] 이외의 초성과 결합 ",
    "받침 있는 초성 [ㄱ ㅋ] 과 결합 ",
    "받침 있는 초성 [ㅎ] 과 결합 ",
    "받침 있는 초성 [ㄱ ㅋ ㅎ] 이외의 초성과 결합 ",
  ],
  jongseong: [
    "중성 [ㅏ ㅑ ㅘ ㅣ]",
    "중성 [ㅓ ㅕ ㅚ ㅝ ㅟ ㅢ]",
    "중성 [ㅐ ㅒ ㅔ ㅖ ㅙ ㅞ]",
    "중성 [ㅗ ㅛ ㅜ ㅠ ㅡ]"
  ]
})

const hangulTemplateHanterm = new HangulTemplate("HANTERM", 10, 7, 4, (cho, jung, jong) => {
  //                 ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ
  const choTypes =  [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 2, 4, 4, 4, 2, 1, 3, 0];
  const jongTypes = [0, 2, 0, 2, 1, 2, 1, 2, 3, 0, 2, 1, 3, 3, 1, 2, 1, 3, 3, 1, 0];
  const jungClass = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0];
  let jungType = -1;
  if (jungClass[jung] == 0) {
    if (jong == 0) jungType = 0; // 종성 없음
    else if (jong == 4) jungType = 1; // ㄴ
    else jungType = 2;
  }
  else {
    jungType = 3 + (jong == 0 ? 0 : 2) + ((cho == 0 || cho == 15) ? 0 : 1);
  }

  return [
    (jong == 0 ? 0 : 5) + choTypes[jung],
    jungType,
    jongTypes[jung]
  ]
}, {
  choseong: [
    "받침 없는 [ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅣ]",
    "받침 없는 [ㅗ ㅛ ㅡ]",
    "받침 없는 [ㅜ ㅠ]",
    "받침 없는 [ㅘ ㅙ ㅚ ㅢ]",
    "받침 없는 [ㅝ ㅞ ㅟ]",
    "받침 있는 [ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅣ]",
    "받침 있는 [ㅗ ㅛ ㅡ]",
    "받침 있는 [ㅜ ㅠ]",
    "받침 있는 [ㅘ ㅙ ㅚ ㅢ]",
    "받침 있는 [ㅝ ㅞ ㅟ]",
  ],
  jungseong: [
    "받침 없음",
    "받침 [ㄴ] 과 결합 ",
    "받침 [ㄴ] 이외의 받침과 결합 ",
    //
    "받침 없는 초성 [ㄱ ㅋ] 과 결합 ",
    "받침 없는 초성 [ㄱ ㅋ] 이외의 초성과 결합 ",
    "받침 있는 초성 [ㄱ ㅋ] 과 결합 ",
    "받침 있는 초성 [ㄱ ㅋ] 이외의 초성과 결합 ",
  ],
  jongseong: [
    "중성 [ㅏ ㅑ ㅘ ㅣ]",
    "중성 [ㅓ ㅕ ㅚ ㅝ ㅟ ㅢ]",
    "중성 [ㅐ ㅒ ㅔ ㅖ ㅙ ㅞ]",
    "중성 [ㅗ ㅛ ㅜ ㅠ ㅡ]"
  ]
})

export const HANGUL_TEMPLATES: {[k:string]: HangulTemplate} = {
  ZIK: hangulTemplateZIK,
  DKB: hangulTemplateDKB,
  MINZKN: hangulTemplateMinzkn,
  HANTERM: hangulTemplateHanterm
}
