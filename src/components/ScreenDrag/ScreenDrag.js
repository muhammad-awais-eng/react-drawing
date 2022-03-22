import React, { useState, useEffect, useRef } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable from "react-draggable";

const boxStyle = {
  border: "grey solid 2px",
  borderRadius: "10px",
  padding: "5px",
};

const DraggableBox = ({ id }) => {
  const updateXarrow = useXarrow();
  return (
    <Draggable
      onDrag={(e) => {
        updateXarrow();
        console.log(e.target.id);
      }}
      onStop={updateXarrow}
    >
      <div id={id} style={boxStyle}>
        {id}
      </div>
    </Draggable>
  );
};

function ScreenDrag() {
  const [source, setSource] = useState([
    {
      id: 1,
      name: "Source Screen 1",
    },
    {
      id: 2,
      name: "Source Screen 2",
    },
    {
      id: 3,
      name: "Source Screen 3",
    },
    {
      id: 4,
      name: "Source Screen 4",
    },
  ]);

  const [destination, setDestination] = useState([
    {
      id: 1,
      name: "Target Screen 1",
    },
    {
      id: 2,
      name: "Target Screen 2",
    },
    {
      id: 3,
      name: "Target Screen 3",
    },
    {
      id: 4,
      name: "Target Screen 4",
    },
  ]);
  const box1Ref = useRef(null);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          width: "100%",
        }}
      >
        <Xwrapper
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
            display: "none",
          }}
        >
          <div style={{ backgroundColor: "red" }}>
            <DraggableBox id={"elem1"} />
          </div>
          <div>
            <DraggableBox id={"elem2"} />
          </div>

          <Xarrow
            start={"elem1"}
            end="elem2"
            headColor="red"
            arrowHeadProps={{ onClick: () => console.log("head clicked!") }}
            labels={<div onClick={() => console.log("djsh")}>dsd</div>}
          />
        </Xwrapper>
      </div>
    </div>
  );
}

export default ScreenDrag;
