import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import { AppStateContext, EditorStateContext } from './contexts';
import AppState from './models/appState'
import EditorState from './models/editorState';

const root = createRoot(document.getElementById('root')!);
root.render(
  <AppStateContext.Provider value={new AppState()}>
    <EditorStateContext.Provider value={new EditorState()}>
      <App />
    </EditorStateContext.Provider>
  </AppStateContext.Provider>
);
