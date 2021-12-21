import { observer } from "mobx-react";
import React, { useContext } from "react";
import { FaTimes } from "react-icons/fa";
import styled from "styled-components";
import { EditorStateContext } from "../contexts";
import { HANGUL_TEMPLATES } from "../misc/hangulSyllablesTemplate";
import { toHex } from "../utils";
import NumberInput from "./common/NumberInput";

const StyledGlyphInfo = styled.div`
  margin: 4px;
`

const Header = styled.h5`
  margin: 0px;
`

const GlyphInfoBlock = (props: {header: string, children: JSX.Element|JSX.Element[]}) => {
  return (
    <div>
      <Header>{props.header}</Header>
      {props.children}
    </div>
  )
}

const AdvanceWidthWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  user-select: none;
  &:hover {
    background-color: #FFFFFF20;
  }
  transition: 0.2s;
`

const AdvanceWidth = observer(() => {
  let editorState = useContext(EditorStateContext);
  let project = editorState.project;

  let unicode = editorState.editingUnicode;
  let glyph = project.getGlyph(unicode);
  let gd = project.getGlyphDataWithComponent(unicode);
  let defaultWidth = project.getAdvanceWidth(gd);

  const setGlyphWidth = (num?: number) => {
    glyph.setAdvanceWidth(num);
    project.setGlyph(unicode, glyph);
  }

  const WidthEditor = (
    <>
      <NumberInput
        value={glyph.advanceWidth}
        minValue={1}
        maxValue={32}
        onChangeValue={(v) => setGlyphWidth(v)}
      />
      <div
        onClick={(e) => {
          e.preventDefault();
          let g = project.getGlyph(unicode);
          g.setAdvanceWidth();
          project.setGlyph(unicode, g);
        }}
      >
        <FaTimes />
      </div>
    </>
  )

  return (
    <AdvanceWidthWrapper>
      {
        glyph.advanceWidth ?
          WidthEditor :
          <span
            style={{color: "#888", width: "100%"}}
            onClick={() => setGlyphWidth(defaultWidth)}
          >
            {defaultWidth}
          </span>
      }
    </AdvanceWidthWrapper>
  )
})

const getNote = (name: string) => {
  if (!name) return null;

  let l = name.split(" | ");

  let templateName = l[0];
  const hangulTemplate = HANGUL_TEMPLATES[templateName];
  if (!hangulTemplate) return null;
  const tooltip = hangulTemplate.tooltip;

  let type = l[1];
  let h;
  if (type == "choseong") h = tooltip["choseong"];
  else if (type == "jungseong") h = tooltip["jungseong"];
  else if (type == "jongseong") h = tooltip["jongseong"];
  else return null;

  let r = parseInt(l[2]) - 1;
  return h[r];
}

const GlyphInfo = observer(() => {
  let editorState = useContext(EditorStateContext);
  let project = editorState.project;
  let unicode = editorState.editingUnicode;
  let glyph = project.getGlyph(unicode);
  let note = getNote(glyph.name);

  return (
    <StyledGlyphInfo>
      <GlyphInfoBlock header={"UNICODE"}>
        <span>{`${unicode} | ${toHex(unicode)}`}</span>
      </GlyphInfoBlock>
      <GlyphInfoBlock header={"NAME"}>
        <span>{glyph.name || ("undefined")}</span>
      </GlyphInfoBlock>
      <GlyphInfoBlock header={"ADVANCE WIDTH"}>
        <AdvanceWidth/>
      </GlyphInfoBlock>
      { note ?
        <GlyphInfoBlock header={"NOTE"}>
          <span>{note}</span>
        </GlyphInfoBlock> : null
      }
    </StyledGlyphInfo>
  )
})

export default GlyphInfo;
