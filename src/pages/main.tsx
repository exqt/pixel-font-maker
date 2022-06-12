import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import { AppStateContext, EditorStateContext } from '../contexts';
import Project from '../models/project';
import Button from '../components/common/Button';
import { FaGithub } from 'react-icons/fa';
import Selection from '../components/common/Selection';
import EditorState from '../models/editorState';
import AppState from '../models/appState';
import { HANGUL_TEMPLATES } from '../misc/hangulSyllablesTemplate';
import NumberInput from '../components/common/NumberInput';

const Container = styled.div`
  width: 840px;
  display: block;
  margin: 0 auto;
`

const StyledButtonText = styled.span`
  font-size: 20px;
`

const openProject = (file: File, editorState: EditorState, appState: AppState) => {
  let fileReader = new FileReader();
  fileReader.onload = () => {
    let parsed = JSON.parse(fileReader.result.toString());
    let proj = Project.loadJSON(parsed);
    console.log(proj);
    editorState.setProject(proj);
    appState.setPage("editor");
  }
  fileReader.readAsText(file);
}

const OpenButton = () => {
  let upload = useRef<HTMLInputElement>();
  let appState = useContext(AppStateContext);
  let editorState = useContext(EditorStateContext);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    let file = e.target.files[0];
    openProject(file, editorState, appState);
  }

  return (
    <>
      <input id="myInput"
        type="file"
        ref={(ref) => upload.current = ref}
        style={{ display: 'none' }}
        onChange={onChangeFile}
      />
      <Button onClick={()=>{upload.current.click()}}>
        <StyledButtonText>Open Project</StyledButtonText>
      </Button >
    </>
  )
}

const Link = styled.a`
  color: white;
  text-decoration: none;
  margin-right: 4px;
  &:hover {
    text-decoration: underline;
  }
`

const GitInfo = () => {
  let hash = COMMITHASH ? COMMITHASH : "0123456789";
  return (
    <div>
      <Link href={`https://github.com/exqt/pixel-font-maker`}>
        <FaGithub/>
      </Link>
      <Link href={`https://github.com/exqt/pixel-font-maker/commit/${hash}`}>
        {(hash).slice(0, 10)}
      </Link>
    </div>
  )
}

interface NewProjectOptions {
  hangulTemplate: string,
  hangulTemplateUnicodeStart: number
}

const NewProjectModal = () => {
  const appState = useContext(AppStateContext);
  const editorState = useContext(EditorStateContext);
  const [options, setOptions] = useState<NewProjectOptions>({ hangulTemplate: "none", hangulTemplateUnicodeStart: 0xE000 });

  const createProject = () => {
    let project = new Project();

    project.addNotdefGlyph();

    const hangulTemplate = HANGUL_TEMPLATES[options.hangulTemplate];
    if (hangulTemplate) {
      hangulTemplate.apply(project, options.hangulTemplateUnicodeStart);
    }

    editorState.setProject(project);
    appState.setPage("editor");
    appState.setModalContent();
  }

  return (
    <div>
      <Selection
        label="Hangul Template : "
        items={[
          {id:"NONE", name: "None"},
          {id:"ZIK", name: "Zik (4x2x2)"},
          {id:"DKB", name: "DKB (8x4x4)"},
          {id:"MINZKN", name: "minzkn (10x6x4)"},
          {id:"HANTERM", name: "Hanterm (10x{3,4}x4)"},
        ]}
        onSelectChange={(id) => setOptions({...options, hangulTemplate: id})}
        selected={options.hangulTemplate}
      />
      <NumberInput
        label={"Hangul Template Unicode Start"}
        value={options.hangulTemplateUnicodeStart}
        minValue={0xE000}
        maxValue={0xF000}
        onChangeValue={(s) => setOptions({...options, hangulTemplateUnicodeStart: s})}
      />
      <Button onClick={createProject}>CREATE</Button>
    </div>
  );
}

const Buttons = styled.div`
  margin-bottom: 12px;
  & > *:not(:first-child) {
    margin-left: 4px;
  }
`

const DropdownZoneWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`

const DropdownZone = () => {
  const appState = useContext(AppStateContext);
  const editorState = useContext(EditorStateContext);
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      let f = e.dataTransfer.files[0];
      openProject(f, editorState, appState);
    }
  }

  return (
    <DropdownZoneWrapper
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
    </DropdownZoneWrapper>
  )
}

const MainPage = () => {
  const appState = useContext(AppStateContext);

  return (
    <Container>
      <h1>Pixel Font Maker</h1>
      <Buttons>
        <Button onClick={() => appState.setModalContent(<NewProjectModal/>)}>
          <StyledButtonText>New Project</StyledButtonText>
        </Button>
        <OpenButton/>
      </Buttons>
      <GitInfo/>
      <DropdownZone/>
    </Container>
  );
}

export default MainPage;
