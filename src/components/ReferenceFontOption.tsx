import { observer } from "mobx-react";
import opentype from "opentype.js";
import React, { useContext, useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaSyncAlt } from "react-icons/fa";
import styled from "styled-components";
import { EditorStateContext } from "../contexts";
import Button from "./common/Button";
import Slider from "./common/Slider";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid black;
  padding: 2px 0px 2px 0px;
  user-select: none;
  align-items: center;
`

const FontInput = () => {
  let editorState = useContext(EditorStateContext);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    let file = e.target.files[0];
    if (!file) return;
    let url = URL.createObjectURL(file);

    opentype.load(url)
      .then((font) => {
        editorState.referenceFont.setFont(font);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <>
      <input type="file" accept=".ttf,.otf" onChange={onChangeFile}/>
    </>
  )
}

const ReferenceFontOption = observer(() => {
  let editorState = useContext(EditorStateContext);

  return (
    <Wrapper>
      <Button compact={true} onClick={() => editorState.referenceFont.setEnable(!editorState.referenceFont.enable)}>
        {editorState.referenceFont.enable ? <FaEye/> : <FaEyeSlash/>}
      </Button>
      <Button compact={true} onClick={() => {
        editorState.referenceFont.setOffset(0, 0);
        editorState.referenceFont.setScale(256);
      }}>
        <FaSyncAlt/>
      </Button>
      <Slider
        label="X"
        onChange={(v) => editorState.referenceFont.setOffset(v, null)}
        min={-100} max={100}
        value={editorState.referenceFont.offsetX}
      />
      <Slider
        label="Y"
        onChange={(v) => editorState.referenceFont.setOffset(null, v)}
        min={-100} max={100}
        value={editorState.referenceFont.offsetY}
      />
      <Slider
        label="Scale"
        onChange={(v) => editorState.referenceFont.setScale(v)}
        min={64} max={2*editorState.editorSize}
        value={editorState.referenceFont.scale}
      />
      <FontInput/>
    </Wrapper>
  )
})

export default ReferenceFontOption;
