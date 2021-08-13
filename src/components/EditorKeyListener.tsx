import React, { useContext, useEffect } from 'react';
import { AppStateContext, EditorStateContext } from '../contexts';

const EditorKeyListener = () => {
  let appState = useContext(AppStateContext);
  let editorState = useContext(EditorStateContext);
  let project = editorState.project;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (appState.isModalOpen) return;

      if (e.ctrlKey) {
        if (e.key === "z") editorState.undo();
        else if (e.key === "x") editorState.cut();
        else if (e.key === "c") editorState.copy();
        else if (e.key === "v") editorState.paste();
        else if (e.key === "s") project.save();
      }

      if (e.key == "1" || e.key == "2" || e.key == "3") {
        let b = parseInt(e.key);
        editorState.setBrushType(b - 1);
      }

      if (e.key.slice(0, 5) == "Arrow") {
        let [dx, dy] = [0, 0];
        if (e.key == "ArrowDown") dy = -1;
        else if (e.key == "ArrowUp") dy = 1;
        else if (e.key == "ArrowLeft") dx = -1;
        else if (e.key == "ArrowRight") dx = 1;
        editorState.shift(dx, dy);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    }
  }, [])

  return (<></>)
}

export default EditorKeyListener;
