import React, { useState, Component, useContext, useEffect } from 'react';
import styled from 'styled-components'
import { FaCaretLeft } from 'react-icons/fa'

const StyledBackButton = styled.div`
  position: absolute;
  left: 0px;
  top: 4px;
  width: 32px;
  height: 32px;
  background-color: #ffffff11;
  border-radius: 0px 8px 8px 0px;
  transition: 0.1s linear;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  :hover {
    background-color: #ffffff3e;
  }
`

const BackButton = (props: {onClick: React.MouseEventHandler<HTMLDivElement>}) => {
  return (
    <StyledBackButton onClick={props.onClick}>
      <FaCaretLeft/>
    </StyledBackButton>
  )
}

export default BackButton;
