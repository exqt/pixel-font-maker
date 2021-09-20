import React, { useContext, useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components'
import { observer } from 'mobx-react';
import TextInput from '../common/TextInput';
import Project from '../../models/project';
import NumberInput from '../common/NumberInput';
import { EditorStateContext } from '../../contexts';

const Wrapper = styled.div`
  width: 600px;
`

const Divider = styled.div`
  width: 100%;
  border-top: 1px solid #CCC;
  margin: 8px 0px;
`

const PreviewTextarea = styled.textarea`
  font-family: previewFont;
  background-color: #888;
  resize: none;
  width: 100%;
  outline: none;
  height: 400px;
  box-sizing: border-box;
`

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: previewFont;
    src:url(${(props: {url: string}) => props.url});
  }
`

const FontPreviewModal = observer((props: {url: string}) => {
  let [text, setText] = useState("");
  let [size, setSize] = useState(12);

  return (
    <Wrapper>
      <NumberInput
        label={"Font Size"} minValue={4} maxValue={256}
        value={size}
        onChangeValue={(v) => setSize(v)}
      />
      <Divider/>
      <GlobalStyle url={props.url}/>
      <PreviewTextarea
        style={{fontSize: size + "px"}}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </Wrapper>
  )
})

export default FontPreviewModal;
