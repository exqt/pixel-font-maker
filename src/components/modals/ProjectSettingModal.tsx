import React, { useContext } from 'react';
import styled from 'styled-components'
import { observer } from 'mobx-react';
import TextInput from '../common/TextInput';
import Project from '../../models/project';
import NumberInput from '../common/NumberInput';
import { EditorStateContext } from '../../contexts';

const Wrapper = styled.div`
  width: 300px;
`

const Divider = styled.div`
  width: 100%;
  border-top: 1px solid #CCC;
  margin: 8px 0px;
`

const MonospaceForm = observer(() => {
  let editorState = useContext(EditorStateContext);
  let project = editorState.project;

  return (
    <div>
      <NumberInput
        label="Fixed-Width"
        value={project.attr.fixedWidth}
        onChangeValue={(n) => project.setFixedWidth(n)}
        minValue={1}
        maxValue={32}
      />
    </div>
  )
})

const ProportionalForm = observer(() => {
  let editorState = useContext(EditorStateContext);
  let project = editorState.project;

  return (
    <div>
      <NumberInput
        label="Space Width"
        value={project.attr.spaceWidth}
        onChangeValue={(n) => project.setSpaceWidth(n)}
        minValue={0}
        maxValue={16}
      />
      <NumberInput
        label="Letter Spacing"
        value={project.attr.letterSpacing}
        onChangeValue={(n) => project.setLetterSpacing(n)}
        minValue={0}
        maxValue={16}
      />
    </div>
  )
})


const ProjectSettingModal = observer((props: {project: Project}) => {
  let project = props.project;

  return (
    <Wrapper>
      <TextInput
        label="Name"
        value={project.attr.name}
        onChange={(e) => project.setName(e.target.value)}
      />
      <TextInput
        label="Author"
        value={project.attr.author}
        onChange={(e) => project.setAuthor(e.target.value)}
      />
      <Divider/>
      <NumberInput
        label="Descent"
        value={project.attr.descent}
        onChangeValue={(n) => project.setDescent(n)}
        minValue={0}
        maxValue={16}
      />
      <NumberInput
        label="Ascent"
        value={project.attr.ascent}
        onChangeValue={(n) => project.setAscent(n)}
        minValue={1}
        maxValue={32}
      />
      <NumberInput
        label="Line Gap"
        value={project.attr.lineGap}
        onChangeValue={(n) => project.setLineGap(n)}
        minValue={0}
        maxValue={16}
      />
      <NumberInput
        label="Max Width"
        value={project.attr.maxWidth}
        onChangeValue={(n) => project.setMaxWidth(n)}
        minValue={4}
        maxValue={32}
      />
      <form>
        <input
          type="radio"
          value="monospace"
          name="Monospace"
          checked={project.attr.widthType == "monospace"}
          onChange={(e) => project.setWdidthType("monospace")}
        />Monospace
        <input
          type="radio"
          value="proportional"
          name="Proportional"
          checked={project.attr.widthType == "proportional"}
          onChange={(e) => project.setWdidthType("proportional")}
        />Proportional
        { project.attr.widthType == "monospace" ? <MonospaceForm/> : null }
        { project.attr.widthType == "proportional" ? <ProportionalForm/> : null }
      </form>
    </Wrapper>
  )
})

export default ProjectSettingModal;
