import { observer } from "mobx-react";
import React, { useContext } from "react";
import styled from "styled-components";
import { EditorStateContext } from "../contexts";
import { toHex } from "../utils";

const StyledGlyphInfo = styled.div`
  margin: 4px;
`

const Header = styled.h5`
  margin: 0px;
`

const Content = styled.p`
  margin: 0px;
`

const GlyphInfoBlock = (props: {header: string, content: string}) => {
  return (
    <div>
      <Header>{props.header}</Header>
      <Content>{props.content}</Content>
    </div>
  )
}

const GlyphInfo = observer(() => {
  let editorState = useContext(EditorStateContext);
  let project = editorState.project;

  let unicode = editorState.editingUnicode;
  let glyph = project.getGlyph(unicode);
  let gd = project.getGlyphDataWithComponent(unicode);

  return (
    <StyledGlyphInfo>
      <GlyphInfoBlock
        header={"UNICODE"}
        content={`${unicode} | ${toHex(unicode)}`}
      />
      <GlyphInfoBlock
        header={"ADVANCE WIDTH"}
        content={`${project.getAdvanceWidth(gd)}`}
      />
      <GlyphInfoBlock
        header={"NAME"}
        content={glyph.name}
      />
    </StyledGlyphInfo>
  )
})

export default GlyphInfo;
