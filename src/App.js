import React from "react";
import Navbar from "./routes/navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DragableComponent from "./components/dragableComponnet/index";
import DragableLines from "./components/dragableLinesConnecter/DragableLines";
import TestConncection from "./components/test/TestConncection";
import DBlist from "./components/DBlist/DBlist";
import Odm from "./components/odm/Odm";
import OdmForm from "./components/odm/OdmForm";
import TreeFile from "./components/treeFile/TreeFile";
import ScreenDrag from "./components/ScreenDrag/ScreenDrag";
import JobTesting from "./components/JobTEsting/JobTesting";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<TestConncection />}></Route>
        <Route path="/list" element={<TreeFile />}></Route>
        <Route path="/mapping" element={<JobTesting />}></Route>
        <Route path="/dblist" element={<DBlist />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
