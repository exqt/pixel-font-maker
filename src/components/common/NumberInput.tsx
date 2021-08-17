import React from "react";
import { StyledInput } from "./TextInput";

interface NumberInputProps {
  label?: string;
  value: number;
  placeholder?: string;
  minValue: number;
  maxValue: number;
  onChangeValue: (n: number) => void
}

const isValid = (n: number, min: number, max: number) => {
  return n && min <= n && n <= max;
}

const NumberInput = (props: NumberInputProps) => {
  return (
    <div>
      { props.label ?  <span>{`${props.label} : `}</span> : null }
      <StyledInput
        type="number"
        value={props.value}
        placeholder={props.placeholder}
        min={props.minValue}
        max={props.maxValue}
        onChange={(e) => {
          let n = parseInt(e.target.value);
          if (isValid(n, props.minValue, props.maxValue)) props.onChangeValue(n);
        }}
      />
    </div>
  )
}

export default NumberInput;
