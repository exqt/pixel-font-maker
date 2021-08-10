import { observer } from "mobx-react";
import React, { useContext, useState } from "react";
import { FaPlus } from "react-icons/fa";
import styled from "styled-components";
import { EditorStateContext,  } from "../contexts";
import EditorState from "../models/editorState";
import GlyphRenderer from "./GlyphRenderer";

const StyledComponentList = styled.div `
`

const List = styled.div`
  background-color: #555;
  height: 64px;
  display: flex;
`

const Header = styled.h5`
  margin: 0px;
`

const StyledComponentAdd = styled.div`
  height: 64px;
  width: 64px;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
`

const GlyphComponentAdd = () => {
  let editorState = useContext(EditorStateContext);
  let project = editorState.project;

  const onClick = () => {
    let unicode = parseInt(prompt("Component unicode"));
    if (unicode) {
      let g = project.getGlyph(editorState.editingUnicode);
      g.addComponent(unicode);
      project.setGlyph(editorState.editingUnicode, g);
    }
  }

  return (
    <StyledComponentAdd onClick={onClick}>
      <FaPlus/>
    </StyledComponentAdd>
  )
}

const GlyphComponentList = observer((props: {}) => {
  let editorState = useContext(EditorStateContext);
  let project = editorState.project;
  let components = project.getGlyph(editorState.editingUnicode).getComponents();

  const glyphs = components.map((u, i) => {
    return (
      <GlyphRenderer
        glyphData={project.getGlyph(u).data}
        editorState={editorState}
        size={64}
        onClick={() => editorState.setEditingUnicode(u)}
        onContextMenu={() => {
          if (confirm("delete?")) project.getGlyph(editorState.editingUnicode).removeComponent(u);
        }}
        key={u}
      />
    )
  });

  return (
    <StyledComponentList>
      <Header>COMPONENTS</Header>
      <List>
        {glyphs}
        {components.length < 3 ? <GlyphComponentAdd/> : null}
      </List>
    </StyledComponentList>
  )
})

export default GlyphComponentList;
