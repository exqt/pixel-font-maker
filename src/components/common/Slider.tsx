import React from 'react';
import styled from 'styled-components'

const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 4px 0px 4px;
`

const StyledSlider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 12px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background: #111;
    cursor: pointer;
}

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: #111;
    cursor: pointer;
  }
`

const Label = styled.span`
  margin-right: 4px;
`

interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void
}

const Slider = (props: SliderProps) => {
  return (
    <SliderWrapper>
      <Label>{props.label}</Label>
      <StyledSlider
        type="range"
        value={props.value}
        min={props.min}
        max={props.max}
        onChange={(e) => props.onChange(parseInt(e.target.value))}
      />
    </SliderWrapper>
  )
}

export default Slider;
