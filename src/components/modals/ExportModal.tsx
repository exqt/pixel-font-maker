import React, { useContext } from 'react';
import styled from 'styled-components'
import { observer } from 'mobx-react';
import Project from '../../models/project';
import Button from '../common/Button';

const Wrapper = styled.div`
`

const Divider = styled.div`
  width: 100%;
  border-top: 1px solid #CCC;
  margin: 8px 0px;
`

const ProjectSettingModal = observer((props: {project: Project}) => {
  let project = props.project;

  return (
    <Wrapper>
      <div>
        <Button onClick={() => project.export("ttf")}>TTF</Button> 
        <Button onClick={() => project.export("woff2")}>WOFF2</Button> 
        <Button onClick={() => project.export("bdf")}>BDF</Button> 
      </div>
    </Wrapper>
  )
})

export default ProjectSettingModal;

