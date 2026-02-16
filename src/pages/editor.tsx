import React, { useContext, useEffect } from 'react';
import styled from 'styled-components'
import GlyphEditor from '../components/GlyphEditor';
import GlyphComponentList from '../components/GlyphComponentList'
import GlyphViewer from '../components/GlyphViewer';
import AppMenuBar from '../components/AppMenuBar';
import { AppStateContext, EditorStateContext } from '../contexts';
import ReferenceFontOption from '../components/ReferenceFontOption';
import GlyphInfo from '../components/GlyphInfo';
import EditorKeyListener from '../components/EditorKeyListener';

const Container = styled.div`
  width: 840px;
  display: block;
  margin: 0 auto;
`

const QuitConfirm = () => {
  useEffect(() => {
    window.electronAPI.onBeforeClose(() => {
      if (confirm("Are you sure you want to quit?")) {
        window.electronAPI.confirmClose();
      }
    });
  }, []);

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
      <AppMenuBar onBack={backToMain} />
      <ReferenceFontOption />
      <div style={{ display: 'flex', justifyContent: "space-between" }}>
        <div>
          <GlyphEditor />
          <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', marginTop: '4px', width: "432px" }}>
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
