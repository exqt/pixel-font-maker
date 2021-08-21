import React, { useContext, useState } from 'react';
import styled from 'styled-components'
import { observer } from 'mobx-react';
import TextInput from './common/TextInput';
import Project from '../models/project';
import NumberInput from './common/NumberInput';
import Button from './common/Button';
import { toHex } from '../utils';

const Wrapper = styled.div`
  width: 400px;
`

const Divider = styled.div`
  width: 100%;
  border-top: 1px solid #CCC;
  margin: 8px 0px;
`

interface CopyActionState {
  start: number
  destination: number
  length: number
}

const CopyAction = (props: {project: Project}) => {
  let [state, setState] = useState<CopyActionState>({
    start: 0,
    destination: 0,
    length: 1,
  })

  let valid = false;
  if (
    Math.max(state.start, state.destination) >=
    Math.min(state.start + state.length, state.destination + state.length)
  ) valid = true;

  const apply = () => {
    let project = props.project;
    for (let i = 0; i < state.length; i++) {
      let sg = project.getGlyph(state.start + i);
      let tg = project.getGlyph(state.destination + i);
      tg.setData(sg.data.clone());
      project.setGlyph(state.destination + i, tg);
    }
  }

  return (
    <div>
      <h3>Bulk Copy</h3>
      <NumberInput
        label={"Start"} minValue={0} maxValue={0xFFFFFF}
        value={state.start}
        onChangeValue={(v) => setState({...state, start: v})}
      />
      <NumberInput
        label={"Destination"} minValue={0} maxValue={0xFFFFFF}
        value={state.destination}
        onChangeValue={(v) => setState({...state, destination: v})}
      />
      <NumberInput
        label={"Length"} minValue={0} maxValue={0xFFFFFF}
        value={state.length}
        onChangeValue={(v) => setState({...state, length: v})}
      />
      <p>
        {
          valid ?
            `copy [${state.start}, ${state.start + state.length - 1}] to [${state.destination}, ${state.destination + state.length - 1}]` :
            `invalid range`
        }
      </p>
      <Button onClick={apply}> Copy </Button>
    </div>
  )
}

const ActionsModal = (props: {project: Project}) => {
  return (
    <Wrapper>
      <span>WARNING: BACKUP PROJECT RECOMMENDED</span>
      <CopyAction project={props.project}/>
    </Wrapper>
  )
}

export default ActionsModal;
