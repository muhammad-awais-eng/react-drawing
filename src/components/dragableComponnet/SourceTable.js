import React from "react";
import SingleElement from "./SingleElement";
import TargetTable from "./TargetTable";
import "./SourceTable.css";
import { Droppable } from "react-beautiful-dnd";

import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

const SourceTable = ({
  todos,
  setTodos,
  completedTodos,
  setCompletedTodos,
  sourcetable,
  targetTable,
}) => {
  // console.log("sds", todos, setTodos);

  return (
    <div>
      <div className="container__list">
        <Droppable droppableId="TodosList">
          {(provided, snapshot) => (
            <div
              className={`left__todos ${
                snapshot.isDraggingOver ? "dragactive" : ""
              }`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <span className="todos__heading">{sourcetable}</span>
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
              <span className="todos__heading">{targetTable} </span>
              <div style={{ display: "flex" }}>
                <div>
                  <FormControl component="fieldset" className="mw-120">
                    <FormGroup aria-label="position" row>
                      <FormControlLabel
                        value="Drop"
                        control={
                          <Checkbox
                            size="small"
                            value="checkedA"
                            onChange={() => console.log("checked")}
                          />
                        }
                        label="Drop"
                        labelPlacement="top"
                      />
                    </FormGroup>
                  </FormControl>
                </div>
                <div>
                  <FormControl component="fieldset" className="mw-120">
                    <FormGroup aria-label="position" row>
                      <FormControlLabel
                        value="Truncate"
                        control={
                          <Checkbox
                            size="small"
                            value="checkedA"
                            onChange={() => console.log("checked")}
                          />
                        }
                        label="Truncate"
                        labelPlacement="top"
                      />
                    </FormGroup>
                  </FormControl>
                </div>
                <div>
                  <FormControl component="fieldset" className="mw-120">
                    <FormGroup aria-label="position" row>
                      <FormControlLabel
                        value="Upsert"
                        control={
                          <Checkbox
                            size="small"
                            value="checkedA"
                            onChange={() => console.log("checked")}
                          />
                        }
                        label="Upsert"
                        labelPlacement="top"
                      />
                    </FormGroup>
                  </FormControl>
                </div>
                <div>
                  <FormControl component="fieldset" className="mw-120">
                    <FormGroup aria-label="position" row>
                      <FormControlLabel
                        value="Upsert key"
                        control={
                          <Checkbox
                            size="small"
                            value="checkedA"
                            onChange={() => console.log("checked")}
                          />
                        }
                        label="Upsert key"
                        labelPlacement="top"
                      />
                    </FormGroup>
                  </FormControl>
                </div>
              </div>

              {completedTodos?.map((todo, index) => (
                <TargetTable
                  index={index}
                  todos={completedTodos}
                  todo={todo}
                  id={todo.id}
                  key={todo.id}
                  setTodos={setCompletedTodos}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      <div className=" target__bottom_container">
        <div>Left</div>

        <div>Right</div>
      </div>
    </div>
  );
};

export default SourceTable;
