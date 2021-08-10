import React, { useState, Component, useContext } from 'react';
import MainPage from './pages/main';
import EditorPage from './pages/editor';
import { AppStateContext } from './contexts'
import { observer } from 'mobx-react-lite';
import Modal from './components/Modal';

const PageSwitch = observer(() => {
  const appState = useContext(AppStateContext)
  return (
    {
      'main': <MainPage/>,
      'editor': <EditorPage/>,
    }[appState.page]
  )
})

const App = () => {
  return (
    <>
      <PageSwitch/>
      <Modal/>
    </>
  );
}

export default App;
