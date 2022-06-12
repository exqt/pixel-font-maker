import { observer } from 'mobx-react';
import React, { ChangeEventHandler, useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import Selection, { SelectionItem } from './common/Selection';
import GlyphRenderer from './GlyphRenderer';
import { toHex } from '../utils';
import { EditorStateContext } from '../contexts';
import GLYPH_SET_LIST from '../misc/glyphSetList';
import Button from './common/Button';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import GlyphSet, { HangulComponentGlyphSet } from '../models/glyphSet';

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
      return css`background-color: #40bd40;`
    else if (props.exists)
      return css`background-color: #FFFFFF55;`
  }}
  margin-left: -1px;
  margin-top: -1px;
`

const GlyphViewCharWrapper = styled.div`
  height: 20px;
  user-select: none;
  text-align: center;
`

const GlyphView = observer((props: {unicode?: number, hideChar?: boolean}) => {
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
      {
        !props.hideChar ?
        <GlyphViewCharWrapper><span>{char}</span></GlyphViewCharWrapper> : 
        <div style={{height: '1px'}}></div>
      }
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

const HangulCompnentsViewer = observer((props: {gs: HangulComponentGlyphSet}) => {
  let choseongsViews = 
    props.gs.components.choseongs.map((v, idx) => {
      return (
        <div key={idx} style={{display: 'flex'}}>
          { v.map((u) => <GlyphView key={u} unicode={u} hideChar={true}/>) }
        </div>
      )
    }) 

  let jungseongViews = 
    props.gs.components.jungseongs.map((v, idx) => {
      return (
        <div key={idx} style={{display: 'flex'}}>
          { v.map((u) => <GlyphView key={u} unicode={u} hideChar={true}/>) }
        </div>
      )
    }) 

  let jongseongViews = 
    props.gs.components.jongseongs.map((v, idx) => {
      return (
        <div key={idx} style={{display: 'flex'}}>
          { v.map((u) => <GlyphView key={u} unicode={u} hideChar={true}/>) }
        </div>
      )
    }) 

  return (
    <div>
      <div>
        {choseongsViews}
      </div>
      <div>
        {jungseongViews}
      </div>
      <div>
        {
        }
        {jongseongViews}
      </div>
    </div>
  )
})

const GlyphViewer = observer(() => {
  let editorState = useContext(EditorStateContext);
  let glyphSetList = GLYPH_SET_LIST.slice();
  if (editorState.selectedComponentGlyphSet.length > 0) {
    glyphSetList = glyphSetList.concat(editorState.selectedComponentGlyphSet);
  }

  if (editorState.hangulComponentGlyphSet.length > 0) {
    glyphSetList.splice(5, 0, editorState.hangulComponentGlyphSet);
  }

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
  for (const [i, gs] of glyphSetList.entries()) {
    glyphSetSelectionItems.push({id: i.toString(), name: gs.name});
  }

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
        { glyphSet.name != "Hangul Components" ? 
            <PageIndicator page={page} totalPages={totalPages} setPage={setPage}/> : null 
        }
      </PageMenu>
      { glyphSet.name != "Hangul Components" ? 
        <GlyphViewerGrid> {views} </GlyphViewerGrid> : 
        <HangulCompnentsViewer gs={glyphSet as HangulComponentGlyphSet} />
      }
    </GlyphViewerWrapper>
  );
})

export default GlyphViewer;
