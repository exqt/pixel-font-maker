import React from 'react';
import styled from 'styled-components'

const Wrapper = styled.div`
  margin: 0px;
`

const StyledSelect = styled.select`
  background-color: #333;
  color: #EEE;
  outline: none;
  font-size: 16px;
  width: ${(props: {width?: string}) => props.width };
`

const StyledOption = styled.option`
  background-color: #333;
  color: #EEE;
`

export interface SelectionItem {
  id: string;
  name: string;
}

interface SelectionProps {
  label?: string;
  items: Array<SelectionItem>;
  selected: string;
  onSelectChange: (id: string) => void,
  width?: string
}

const Label = styled.span`
  margin-right: 4px;
`

const Selection = (props: SelectionProps) => {
  const options = props.items.map((item, i) => (
    <StyledOption value={item.id} key={item.id}>{item.name}</StyledOption>
  ))

  return (
    <Wrapper>
      {props.label ? <Label>{props.label}</Label> : null}
      <StyledSelect
        width={props.width}
        onChange={(e) => props.onSelectChange(e.target.value)}
        value={props.selected}
      >
        {options}
      </StyledSelect>
    </Wrapper>
  )
}

export default Selection;
