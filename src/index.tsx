import React, { createContext, useContext } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AppStateContext, EditorStateContext } from './contexts';
import AppState from './models/appState'
import EditorState from './models/editorState';

document.addEventListener("keydown", (e) => {
  if (e.key === 's' && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
    e.preventDefault();
  }
}, false);

ReactDOM.render(
  <AppStateContext.Provider value={new AppState()}>
    <EditorStateContext.Provider value={new EditorState()}>
      <App />
    </EditorStateContext.Provider>
  </AppStateContext.Provider>,
  document.getElementById('root')
);
