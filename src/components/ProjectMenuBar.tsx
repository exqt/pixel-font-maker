import React, { useContext } from 'react';
import styled from 'styled-components'
import { AppStateContext, EditorStateContext } from '../contexts';
import { observer } from 'mobx-react';
import Button from './common/Button';
import { FaFileExport, FaSave, FaCog } from 'react-icons/fa';
import ProjectSettingModal from './modals/ProjectSettingModal';
import ActionsModal from './modals/ActionsModal';
import FontPreviewModal from './modals/FontPreviewModal';
import ExportModal from './modals/ExportModal';

const MenuBarWrapper = styled.div`
  border-bottom: 1px solid black;
  & > *:not(:first-child) {
    margin-left: 4px;
  }
  align-items: center;
`

const MenuBar = observer(() => {
  let editorState = useContext(EditorStateContext);
  let project = editorState.project;
  let appState = useContext(AppStateContext);

  const preview = async () => {
    let file = await project.toTrueTypeFile("ttf");
    let url = URL.createObjectURL(file);
    appState.setModalContent(<FontPreviewModal url={url}/>);
  }

  return (
    <MenuBarWrapper>
      <Button onClick={() => project.save()}>
        <FaSave/>
        <span>SAVE</span>
      </Button>
      <Button onClick={() => appState.setModalContent(<ExportModal project={project}/>)}>
        <FaFileExport/>
        <span>EXPORT</span>
      </Button>
      <Button onClick={() => appState.setModalContent(<ProjectSettingModal project={project}/>)}>
        <FaCog/>
        <span>SETTING</span>
      </Button>
      <Button onClick={() => appState.setModalContent(<ActionsModal project={project}/>)}>
        <span>ACTIONS</span>
      </Button>
      <Button onClick={preview}>
        <span>PREVIEW</span>
      </Button>
    </MenuBarWrapper>
  );
})

export default MenuBar;
