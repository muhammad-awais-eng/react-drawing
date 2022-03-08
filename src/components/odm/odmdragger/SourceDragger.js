import React from "react";
import "./sourceDragger.css";
import { Draggable } from "react-beautiful-dnd";

const SourceDragger = ({ todo, todos, setTodo, id, name, index }) => {
  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`todos__single ${snapshot.isDragging ? "drag" : ""}`}
        >
          <div>{todo.id}</div>
          <div>{todo.name}</div>
        </div>
      )}
    </Draggable>
  );
};

export default SourceDragger;
