import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import { AppStateContext, EditorStateContext } from '../contexts';
import Project from '../models/project';
import Button from '../components/common/Button';
import { FaGithub } from 'react-icons/fa';
import { applyHangulTemplateDKB, applyHangulTemplateZIK } from '../misc/hangulSyllablesTemplate';
import Selection from '../components/common/Selection';

const Container = styled.div`
  width: 840px;
  display: block;
  margin: 0 auto;
`

const StyledButtonText = styled.span`
  font-size: 20px;
`

const OpenButton = () => {
  let upload = useRef<HTMLInputElement>();
  let appState = useContext(AppStateContext);
  let editorState = useContext(EditorStateContext);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    let file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = () => {
      let parsed = JSON.parse(fileReader.result.toString());
      let proj = Project.loadJSON(parsed);
      console.log(proj);
      editorState.setProject(proj);
      appState.setPage("editor");
    }
    fileReader.readAsText(file);
    console.log(file);
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
  hangulTemplate: string
}

const NewProjectModal = () => {
  const appState = useContext(AppStateContext);
  const editorState = useContext(EditorStateContext);
  const [options, setOptions] = useState<NewProjectOptions>({ hangulTemplate: "none" });

  const createProject = () => {
    let project = new Project();

    project.addNotdefGlyph();

    if (options.hangulTemplate == "zik") {
      applyHangulTemplateZIK(project);
    }
    else if (options.hangulTemplate == "dkb") {
      applyHangulTemplateDKB(project);
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
          {id:"none", name: "None"},
          {id:"zik", name: "Zik (Simple)"},
          {id:"dkb", name: "DKB (Complex)"},
        ]}
        onSelectChange={(id) => setOptions({...options, hangulTemplate: id})}
        selected={options.hangulTemplate}
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
    </Container>
  );
}

export default MainPage;
