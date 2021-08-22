import React, { useContext, useState } from 'react';
import styled from 'styled-components'
import { observer } from 'mobx-react';
import TextInput from './common/TextInput';
import Project from '../models/project';
import NumberInput from './common/NumberInput';
import Button from './common/Button';
import { toHex } from '../utils';
import Selection from './common/Selection';

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

interface ShiftActionState {
  dx: number
  dy: number
  start: number
  end: number
}

const ShiftAction = (props: {project: Project}) => {
  let [state, setState] = useState<ShiftActionState>({
    dx: 0,
    dy: 0,
    start: 33,
    end: 127,
  })

  const apply = () => {
    let project = props.project;
    for (let i = state.start; i <= state.end; i++) {
      let g = project.getGlyph(i);
      let gd = g.data.clone();
      gd.shift(state.dx, state.dy);
      g.setData(gd);
    }
  }

  return (
    <div>
      <NumberInput
        label={"dx"} minValue={-32} maxValue={32}
        value={state.dx}
        onChangeValue={(v) => setState({...state, dx: v})}
      />
      <NumberInput
        label={"dy"} minValue={-32} maxValue={32}
        value={state.dy}
        onChangeValue={(v) => setState({...state, dy: v})}
      />
      <NumberInput
        label={"Start"} minValue={0} maxValue={0xFFFFFF}
        value={state.start}
        onChangeValue={(v) => setState({...state, start: v})}
      />
      <NumberInput
        label={"End"} minValue={0} maxValue={0xFFFFFF}
        value={state.end}
        onChangeValue={(v) => setState({...state, end: v})}
      />
      <Button onClick={apply}> Shift </Button>
    </div>
  )
}

const ActionsModal = (props: {project: Project}) => {
  let [id, setId] = useState("copy");

  return (
    <Wrapper>
      <span>WARNING: BACKUP PROJECT RECOMMENDED</span>
      <Selection
        items={[
          {id: "copy", name: "Copy"},
          {id: "shift", name: "Shift"}
        ]}
        selected={id}
        onSelectChange={(i) => setId(i)}
      />
      { id == "copy" ? <CopyAction project={props.project}/> : null }
      { id == "shift" ? <ShiftAction project={props.project}/> : null }
    </Wrapper>
  )
}

export default ActionsModal;
