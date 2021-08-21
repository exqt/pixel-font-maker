import React, { useContext } from 'react';
import styled from 'styled-components'
import { AppStateContext, EditorStateContext } from '../contexts';
import { observer } from 'mobx-react';
import Button from './common/Button';
import { FaFileExport, FaSave, FaCog } from 'react-icons/fa';
import ProjectSettingModal from './ProjectSettingModal';
import ActionsModal from './ActionsModal';

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

  return (
    <MenuBarWrapper>
      <Button onClick={() => project.save()}>
        <FaSave/>
        <span>SAVE</span>
      </Button>
      <Button onClick={() => project.export()}>
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
    </MenuBarWrapper>
  );
})

export default MenuBar;
