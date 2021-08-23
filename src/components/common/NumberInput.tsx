import React, { useEffect, useState } from "react";
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
  return (typeof n === 'number') && min <= n && n <= max;
}

const NumberInput = (props: NumberInputProps) => {
  let [temp, setTemp] = useState(props.value.toString());
  let [org, setOrg] = useState("");

  return (
    <div>
      { props.label ? <span>{`${props.label} : `}</span> : null }
      <StyledInput
        type="number"
        value={temp}
        placeholder={props.placeholder}
        invalid={!isValid(parseInt(temp), props.minValue, props.maxValue)}
        onFocus={(e) => {
          setOrg(temp);
          setTemp(props.value.toString());
        }}
        onChange={(e) => {
          setTemp(e.target.value);
        }}
        onBlur={(e) => {
          let n = parseInt(temp);
          if (isValid(n, props.minValue, props.maxValue)) {
            props.onChangeValue(n);
          }
          else {
            let o = parseInt(org);
            props.onChangeValue(o);
            setTemp(org);
          }
        }}
      />
    </div>
  )
}

export default NumberInput;
