import React from "react";
import styled from "styled-components";

export const StyledInput = styled.input`
  background-color: #222;
  color: #EEE;
  outline: none;
  border: 1px solid #555;
  font-size: 16px;
  width: 128px;
`

const Wrapper = styled.div`
  margin: 4px;
`

interface TextInputProps {
  label?: string
  value: string
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TextInput = (props: TextInputProps) => {
  return (
    <Wrapper>
      { props.label ?  <span>{`${props.label} : `}</span> : null }
      <StyledInput
        type="text"
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
      />
    </Wrapper>
  )
}

export default TextInput;
