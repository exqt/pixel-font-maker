import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components'
import { Layer, Rect, Text, Line, Stage, Path } from 'react-konva';
import { KonvaEventObject } from 'konva/types/Node';
import { GlyphData } from '../models/glyphData';
import { EditorStateContext } from '../contexts';
import { observer } from 'mobx-react';
import EditorState from '../models/editorState';
import { toCell } from '../utils';
import { BRUSHES } from '../misc/brushes';

const EditorWrapper = styled.div`
`

interface MouseState {
  cx: number,
  cy: number,
  down: number,
}

const GlyphEditorOverlayLayer = observer((props: {mouseState: MouseState, editorState: EditorState}) => {
  let verticalLines = [];
  let editorState = props.editorState;
  let editorSize = editorState.editorSize;
  let cellSize = editorState.cellSize;
  let project = editorState.project;
  let glyph = project.getGlyph(editorState.editingUnicode);
  const lineWidth = editorState.zoom == 0 ? [4, 2] : [2, 1];

  for (let x = 0; x < editorState.cells; x++) {
    let nx = x - project.attr.offsetX;
    verticalLines.push(
      <Line
        key={x*cellSize}
        x={x*cellSize}
        y={0}
        points={[0, 0, 0, editorSize]}
        strokeWidth={nx % 8 == 0 ? lineWidth[0] : lineWidth[1]}
        stroke="#FFF"
      />
    )
  }

  let horizonalLines = [];
  for (let y = 0; y < editorState.cells; y++) {
    let ny = y - project.attr.descent;
    horizonalLines.push(
      <Line
        key={y*cellSize}
        x={0}
        y={y*cellSize}
        points={[0, 0, editorSize, 0]}
        strokeWidth={ny % 8 == 0 ? lineWidth[0] : lineWidth[1]}
        stroke="#FFF"
      />
    )
  }

  let w = glyph.advanceWidth || project.getAdvanceWidth(editorState.glyphData);
  let WidthIndicator =
    <Line
      x={project.attr.offsetX*cellSize}
      y={2}
      points={[0, 0, w*cellSize, 0]}
      strokeWidth={4}
      stroke={w <= editorState.cells ? "#3AB" : "#eb0"}
    />

  let mouseHover = BRUSHES[props.editorState.brushType].map((d, i) =>
    <Rect
      x={cellSize*(props.mouseState.cx+d[0])+1}
      y={cellSize*(props.mouseState.cy+d[1])+1}
      width={cellSize-1}
      height={cellSize-1}
      fill="#FFFFFF55"
      key={i}
    />
  )

  const highlightedColor = "#E11";

  return (
    <Layer listening={false}>
      {mouseHover}
      {verticalLines}
      {horizonalLines}
      <Line
        x={project.attr.offsetX*cellSize}
        y={0}
        points={[0, 0, 0, editorSize]}
        strokeWidth={lineWidth[0]}
        stroke={highlightedColor}
      />
      <Line
        x={0}
        y={project.attr.descent*cellSize}
        points={[0, 0, editorSize, 0]}
        strokeWidth={lineWidth[0]}
        stroke={highlightedColor}
      />
      <Line
        x={0}
        y={(project.attr.ascent + project.attr.descent)*cellSize}
        points={[0, 0, editorSize, 0]}
        strokeWidth={lineWidth[0]}
        stroke={highlightedColor}
      />
      {WidthIndicator}
    </Layer>
  )
})

const GlyphEditorBackLayer = observer((props: {editorState: EditorState }) => {
  let { editorState } = props;
  let project = editorState.project;
  let refFont = editorState.referenceFont;
  let pathData = refFont.getPathData(editorState.editingUnicode);
  let cellSize = editorState.cellSize;
  let components = project.getGlyphs(project.getGlyph(editorState.editingUnicode).components);
  const colors = ["#cf7500", "#119400", "#005ca7"];

  let Cell = (x: number, y: number, color: string) => (
    <Rect
      key={'c'+x+'-'+y+color}
      x={cellSize*x+1}
      y={cellSize*y+1}
      width={cellSize-1}
      height={cellSize-1}
      fill={color}
    />
  );

  let cells = [];
  let nCells = editorState.cells;
  for (let y = 0; y < nCells; y++) {
    for (let x = 0; x < nCells; x++) {
      for (let i = 0; i < components.length; i++) {
        let c = components[i];
        if (c.data.getPixel(x, y)) {
          cells.push(Cell(x, y, colors[i]));
        }
      }
    }
  }

  return (
    <Layer listening={false}>
      <Rect
        fill="#AAA"
        width={512}
        height={512}
      />
      {editorState.referenceFont.enable ?
        <Path
          x={project.attr.offsetX*cellSize}
          y={project.attr.descent*cellSize}
          scaleY={-1}
          data={pathData}
          fill="#777777"
        /> : null
      }
      {cells}
    </Layer>
  )
})

const GlyphEditorMainLayer = (props: {glyph: GlyphData, editorState: EditorState}) => {
  let editorState = props.editorState;
  let cellSize = editorState.cellSize;

  let Cell = (x: number, y: number) => (
    <Rect
      key={'c'+x+'-'+y}
      x={cellSize*x+1}
      y={cellSize*y+1}
      width={cellSize-1}
      height={cellSize-1}
      fill="black"
    />
  )

  let cells = []
  let nCells = editorState.cells;
  for (let y = 0; y < nCells; y++) {
    for (let x = 0; x < nCells; x++) {
      if (props.glyph.getPixel(x, y)) cells.push(Cell(x, y));
    }
  }

  return (
    <Layer listening={false}>
      {cells}
    </Layer>
  )
}

const applyBrush = (g: GlyphData, brushType: number, x: number, y: number, bit: number) => {
  let b = BRUSHES[brushType];
  for (let [dx, dy] of b) {
    g.setPixel(x + dx, y + dy, bit);
  }
}

const GlyphEditor = observer(() => {
  let editorState = useContext(EditorStateContext);
  let editorSize = editorState.editorSize;
  let cellSize = editorState.cellSize;
  let [mouseState, setMouseState] = useState<MouseState>({cx: 0, cy: 0, down: -1});
  let project = editorState.project;

  useEffect(() => {
    let g = project.getGlyph(editorState.editingUnicode);
    editorState.setGlyphData(g.data.clone());
    let prevUnicode = editorState.editingUnicode;

    return () => {
      let gd = editorState.glyphData;
      let g = project.getGlyph(prevUnicode);
      g.setData(gd);
      project.setGlyph(prevUnicode, g);
    }
  }, [editorState.editingUnicode])

  const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    let b = e.evt.button;
    if (mouseState.down != -1) return;

    setMouseState({...mouseState, down: b});
    editorState.pushGlyphData();

    let newGlyph = editorState.glyphData.clone();
    let [cx, cy] = toCell(e.evt.offsetX, editorSize - e.evt.offsetY, cellSize);
    //newGlyph.setPixel(cx, cy, b == 0 ? 1 : 0);
    applyBrush(newGlyph, editorState.brushType, cx, cy, b == 0 ? 1 : 0);
    editorState.setGlyphData(newGlyph);
  }

  const onMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    let b = e.evt.button;
    if (mouseState.down != b) return;
    setMouseState({...mouseState, down: -1});

    let gd = editorState.glyphData.clone();
    let g = project.getGlyph(editorState.editingUnicode);
    g.setData(gd);
    project.setGlyph(editorState.editingUnicode, g);
  }

  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    let [cx, cy] = toCell(e.evt.offsetX, editorSize - e.evt.offsetY, cellSize);
    if (cx == mouseState.cx && cy == mouseState.cy) return;
    setMouseState({...mouseState, cx: cx, cy: cy});
    if (mouseState.down == -1) return;

    let newGlyph = editorState.glyphData.clone();
    applyBrush(newGlyph, editorState.brushType, cx, cy, mouseState.down == 0 ? 1 : 0);
    editorState.setGlyphData(newGlyph);
  }

  return (
    <EditorWrapper>
      <Stage
        width={editorSize}
        height={editorSize}
        offsetY={editorSize}
        scaleY={-1}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onContextMenu={(e: KonvaEventObject<PointerEvent>) => e.evt.preventDefault()}
      >
        <GlyphEditorBackLayer
          editorState={editorState}
        />
        <GlyphEditorMainLayer
          glyph={editorState.glyphData}
          editorState={editorState}
        />
        <GlyphEditorOverlayLayer
          mouseState={mouseState}
          editorState={editorState}
        />
      </Stage>
    </EditorWrapper>
  );
})

export default GlyphEditor;
