import React, { useState, Component, ReactElement, useMemo } from 'react';
import styled from 'styled-components'
import { Layer, Rect, Text, Line, Stage } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/types/Node';
import { GlyphData } from '../models/glyphData';
import EditorState from '../models/editorState';
import { observer } from 'mobx-react';

const Wrapper = styled.div`
  background-color: #777;
  border: 1px solid black;
  &:hover {
    background-color: #999;
  }
`

interface GlyphRendererProps {
  size?: number
  glyphData?: GlyphData
  editorState: EditorState
  onClick?: () => void
  onContextMenu?: () => void
}

const GlyphRenderer = observer((props: GlyphRendererProps) => {
  let size = props.size ? props.size : 32;
  let nCells = props.editorState.cells;
  let cellSize = Math.floor(size / nCells);

  let Cell = (x: number, y: number) => (
    <Rect
      key={'c'+x+'-'+y}
      x={cellSize*x}
      y={cellSize*y}
      width={cellSize}
      height={cellSize}
      fill="black"
    />
  )

  let layer = useMemo(() => {
    let cells = [];
    if (props.glyphData) {
      for (let y = 0; y < nCells; y++) {
        for (let x = 0; x < nCells; x++) {
          if (props.glyphData.getPixel(x, y)) cells.push(Cell(x, y));
        }
      }
    }

    return (
      <Layer listening={false}>
        {cells}
      </Layer>
    );
  }, [props.glyphData, cellSize]);

  return (
    <Wrapper>
      <Stage
        width={size}
        height={size}
        offsetY={size}
        scaleY={-1}
        onClick={(e) => {
          if (e.evt.button != 0) return;
          if (props.onClick) props.onClick();
        }}
        onContextMenu={
          (e: KonvaEventObject<PointerEvent>) => {
            e.evt.preventDefault();
            if (props.onContextMenu) props.onContextMenu();
          }
        }
      >
        {layer}
      </Stage>
    </Wrapper>
  );
})

export default GlyphRenderer;
