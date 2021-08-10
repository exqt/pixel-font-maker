import { observer } from 'mobx-react';
import React, { ChangeEventHandler, useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import Selection, { SelectionItem } from './common/Selection';
import GlyphRenderer from './GlyphRenderer';
import { toHex } from '../utils';
import { EditorStateContext } from '../contexts';
import glyphSetList, { GlyphSet } from '../misc/glyphSets';
import Button from './common/Button';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const GlyphViewerWrapper = styled.div`
`

const GlyphViewerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
`

const GlyphWrapper = styled.div`
`

const StyledGlyphView = styled.div`
  ${(props: {highlight?: boolean, exists?: boolean}) => {
    if (props.highlight)
      return css`background-color: green;`
    else if (props.exists)
      return css`background-color: #FFFFFF55;`
  }}
  :hover {
    background-color: #ccc;
  }
  margin-left: -1px;
`

const GlyphViewCharWrapper = styled.div`
  height: 20px;
  user-select: none;
  text-align: center;
`

const GlyphView = observer((props: {unicode?: number}) => {
  let editorState = useContext(EditorStateContext);
  let project = editorState.project;
  let char = String.fromCharCode(props.unicode);

  return (
    <StyledGlyphView
      onClick={() => editorState.setEditingUnicode(props.unicode)}
      highlight={editorState.editingUnicode == props.unicode}
      exists={project.glyphs.has(props.unicode)}
      title={toHex(props.unicode)}
    >
      <GlyphViewCharWrapper>
        <span>{char}</span>
      </GlyphViewCharWrapper>
      <GlyphWrapper>
        <GlyphRenderer
          glyphData={project.getGlyphDataWithComponent(props.unicode)}
          editorState={editorState}
          size={48}
        />
      </GlyphWrapper>
    </StyledGlyphView>
  )
})

const PageMenu = styled.div`
  display: block;
`


const PageIndicator = (props: {page: number, totalPages: number, setPage: (page: number) => void}) => {
  const items: Array<SelectionItem> = [];
  for (let i = 1; i <= props.totalPages; i++) {
    let si = i.toString();
    items.push({name: si, id: si});
  }

  return (
    <div style={{display: "inline"}}>
      <div style={{display: "inline-flex"}}>
        <Selection
          items={items}
          selected={props.page.toString()}
          onSelectChange={(v) => props.setPage(parseInt(v))}
        />
        {'/'}
        <span>{`${props.totalPages}`}</span>
      </div>
      {'    |    '}
      <Button compact={true} onClick={() => props.setPage(props.page-1)}><FaAngleLeft/></Button>
      <Button compact={true} onClick={() => props.setPage(props.page+1)}><FaAngleRight/></Button>
    </div>
  )
}

const GLYPHS_PER_PAGE = 64;

const GlyphViewer = ((props: {}) => {
  let [page, setPage_] = useState(1);
  let [glyphSetIdx, setGlyphSetIdx] = useState("0");
  let glyphSet = glyphSetList[parseInt(glyphSetIdx)];
  let len = glyphSet.unicodes.length;
  let totalPages = Math.ceil(len / GLYPHS_PER_PAGE);

  const setPage = (p: number) => {
    p = Math.min(Math.max(p, 1), totalPages);
    setPage_(p);
  }

  let views = [];
  let unicodes = glyphSet.getUnicodes((page-1)*GLYPHS_PER_PAGE, GLYPHS_PER_PAGE);
  for (let i = 0; i < unicodes.length; i++) {
    views.push(
      <GlyphView
        key={i}
        unicode={unicodes[i]}
      />
    )
  }

  let glyphSetSelectionItems: Array<SelectionItem> = [];
  for(let i = 0; i < glyphSetList.length; i++) {
    let s = glyphSetList[i];
    glyphSetSelectionItems.push({id: i.toString(), name: s.name});
  }


  console.log("render viewer");

  return (
    <GlyphViewerWrapper>
      <PageMenu>
        <Selection
          width={"100%"}
          items={glyphSetSelectionItems}
          selected={glyphSetIdx}
          onSelectChange={(i) => {
            setPage(1);
            setGlyphSetIdx(i);
          }}
        />
        <PageIndicator page={page} totalPages={totalPages} setPage={setPage}/>
      </PageMenu>
      <GlyphViewerGrid>
        {views}
      </GlyphViewerGrid>
    </GlyphViewerWrapper>
  );
})

export default GlyphViewer;
