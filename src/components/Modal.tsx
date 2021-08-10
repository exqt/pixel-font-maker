import { observer } from "mobx-react";
import React, { useContext } from "react";
import styled from "styled-components";
import { AppStateContext } from "../contexts";

const ModalBackground = styled.div `
  background-color: #00000077;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ModalContentWrapper = styled.div`
  background: #3b3b3b;
  border-radius: 8px;
  padding: 24px;
  min-height: 128px;
  min-width: 256px;
  -webkit-box-shadow: 0px 5px 14px 0px rgba(0,0,0,0.75);
  box-shadow: 0px 5px 14px 0px rgba(0,0,0,0.75);
`

interface ModalProps {
}

const Modal = observer((props: ModalProps) => {
  let appState = useContext(AppStateContext);

  return (
    appState.isModalOpen ?
      <ModalBackground onClick={() => appState.closeModal()}>
        <ModalContentWrapper onClick={(e) => e.stopPropagation()}>
          {appState.modalContent}
        </ModalContentWrapper>
      </ModalBackground>
    : <></>
  )
})

export default Modal;
