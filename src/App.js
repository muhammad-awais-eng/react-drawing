import React from 'react';
import Navbar from './routes/navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DragableComponent from './components/dragableComponnet/index';
import DragableLines from './components/dragableLinesConnecter/DragableLines';
import TestConncection from './components/test/TestConncection';
import DBlist from './components/DBlist/DBlist';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<TestConncection />}></Route>
        <Route path='/list' element={<DragableComponent />}></Route>
        <Route path='/mapping' element={<DragableLines />}></Route>
        <Route path='/dblist' element={<DBlist />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
