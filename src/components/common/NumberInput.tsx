import React, { useContext } from "react";
import TextInput from "./TextInput";

interface NumberInputProps {
  label?: string;
  value: number;
  minValue: number;
  maxValue: number;
  onChangeValue: (n: number) => void
}

const handleNumber = (n: number, min: number, max: number) => {
  if (!n) return min;
  return Math.min(Math.max(n, min), max);
}

// can't handle negative number
// minValue is not working
const NumberInput = (props: NumberInputProps) => {
  return (
    <TextInput
      label={props.label}
      value={props.value.toString()}
      onChange={(e) => {
        let n = parseInt(e.target.value) || 0;
        props.onChangeValue(handleNumber(n, props.minValue, props.maxValue));
      }}
      onBlur={() => {
        let n = handleNumber(props.value, props.minValue, props.maxValue);
        props.onChangeValue(n);
      }}
    />
  )
}

export default NumberInput;
