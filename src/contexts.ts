import React, { createContext } from 'react';
import AppState from './models/appState';
import EditorState from './models/editorState';

export const AppStateContext = createContext<AppState|null>(null);
export const EditorStateContext = createContext<EditorState|null>(null);
