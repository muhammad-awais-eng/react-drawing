import React from "react";
import SingleElement from "./SingleElement";
import "./style.css";
import { Droppable } from "react-beautiful-dnd";

const SourceTable = ({
  todos,
  setTodos,
  completedTodos,
  setCompletedTodos,
}) => {
  console.log("sds", todos, setTodos);

  return (
    <div className="container">
      <Droppable droppableId="TodosList">
        {(provided, snapshot) => (
          <div
            className={`todos ${snapshot.isDraggingOver ? "dragactive" : ""}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <span className="todos__heading">Source schema list</span>
            {todos?.map((todo, index) => (
              <SingleElement
                index={index}
                todos={todos}
                todo={todo}
                key={todo.id}
                setTodos={setTodos}
                id={todo.id}
                name={todo.name}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <Droppable droppableId="TodosRemove">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`todos  ${
              snapshot.isDraggingOver ? "dragcomplete" : "remove"
            }`}
          >
            <span className="todos__heading">Destination  </span>
            {completedTodos?.map((todo, index) => (
              <SingleElement
                index={index}
                todos={completedTodos}
                todo={todo}
                key={todo.id}
                setTodos={setCompletedTodos}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default SourceTable;
