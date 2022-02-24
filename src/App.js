import React from "react";
import DragableComponent from "./components/dragableComponnet/index";
import DragableLines from "./components/dragableLinesConnecter/DragableLines";
import Navbar from "./components/navbar/Navbar";
// import TestConncection from "./components/test/TestConncection";

function App() {
  return (
    <div>
      <Navbar />
      <DragableLines />
      {/* <DragableComponent /> */}
      {/* <TestConncection /> */}
    </div>
  );
}

export default App;
