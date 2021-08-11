import React, { useContext } from 'react';
import Button from './common/Button';
import { FaEraser, FaSearch } from 'react-icons/fa';
import { CgEditFlipH, CgEditFlipV } from 'react-icons/cg';
import { EditorStateContext } from '../contexts';

const GlyphEditorTools = () => {
  let editorState = useContext(EditorStateContext);

  return (
    <div>
      <Button compact={true} onClick={() => editorState.clear()}>
        <FaEraser/>
      </Button>
      <Button compact={true} onClick={() => editorState.flipH()}>
        <CgEditFlipH/>
      </Button>
      <Button compact={true} onClick={() => editorState.flipV()}>
        <CgEditFlipV/>
      </Button>
      <Button compact={true} onClick={() => editorState.setZoom((editorState.zoom + 1) % 3)}>
        <FaSearch/>
      </Button>
    </div>
  )
}

export default GlyphEditorTools;
