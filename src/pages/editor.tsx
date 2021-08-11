import React, { useState, Component, useContext, useEffect } from 'react';
import styled from 'styled-components'
import GlyphEditor from '../components/GlyphEditor';
import GlyphComponentList from '../components/GlyphComponentList'
import GlyphViewer from '../components/GlyphViewer';
import MenuBar from '../components/ProjectMenuBar';
import { AppStateContext, EditorStateContext } from '../contexts';
import EditorState from '../models/editorState';
import ReferenceFontOption from '../components/ReferenceFontOption';
import GlyphInfo from '../components/GlyphInfo';
import BackButton from '../components/common/BackButton';
import EditorKeyListener from '../components/EditorKeyListener';
import GlyphEditorTools from '../components/GlyphEditorTools';

const Container = styled.div`
  width: 840px;
  display: block;
  margin: 0 auto;
`

const QuitConfirm = () => {
  useEffect(() => {
    window.onbeforeunload = () => {
      return "are you sure want to quit?";
    }

    return () => {
      window.onbeforeunload = null;
    }
  })

  return <></>;
}

const EditorPage = () => {
  let appState = useContext(AppStateContext);
  let editorState = useContext(EditorStateContext);

  const backToMain = () => {
    if(!confirm("are you sure want to go to the main page?\nmake sure the project is saved")) return;
    appState.setPage("main");
    editorState.reset();
  }

  return (
    <Container>
      <QuitConfirm />
      <EditorKeyListener />
      <BackButton onClick={backToMain} />
      <MenuBar />
      <ReferenceFontOption />
      <div style={{ display: 'flex', justifyContent: "space-between" }}>
        <div>
          <GlyphEditorTools/>
          <GlyphEditor />
          <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', marginTop: '4px' }}>
            <GlyphComponentList />
            <GlyphInfo />
          </div>
        </div>
        <GlyphViewer />
      </div>
    </Container>
  );
}

export default EditorPage;
