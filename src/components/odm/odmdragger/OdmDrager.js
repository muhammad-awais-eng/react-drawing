import React from "react";
import "./odmDragger.css";
import { Droppable } from "react-beautiful-dnd";

import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import SourceDragger from "./SourceDragger";
import TargetDragger from "./TargetDragger";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

const OdmDrager = ({
  todos,
  setTodos,
  completedTodos,
  setCompletedTodos,
  sourcetable,
  targetTable,
  dropValue,
  setDropValue,
  truncateValue,
  setTruncateValue,
  upsertValue,
  setupsertValue,
  upsertKey,
  setUpsertKey,
  primaryKey,
  setPrimaryKey,
  dataTypes,
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
                <SourceDragger
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
              className={`todos ${
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
                            value={dropValue}
                            onChange={(e) => {
                              setDropValue(e.target.checked);
                              console.log(e.target.checked);
                            }}
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
                            value={truncateValue}
                            onChange={(e) => {
                              setTruncateValue(e.target.checked);
                              console.log(e.target.checked);
                            }}
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
                            value={upsertValue}
                            onChange={(e) => {
                              setupsertValue(e.target.checked);
                              console.log(e.target.checked);
                            }}
                          />
                        }
                        label="Upsert"
                        labelPlacement="top"
                      />
                    </FormGroup>
                  </FormControl>
                </div>
                {upsertValue ? (
                  <div className="">
                    <span>Upsert Key</span>
                    <div>
                      <FormControl sx={{ width: "100%" }} variant="standard">
                        <NativeSelect
                          id="demo-customized-select-native"
                          value={upsertKey}
                          onChange={(event) => {
                            console.log(event.target.value);
                            setUpsertKey(event.target.value);
                          }}
                          input={<BootstrapInput />}
                        >
                          <option aria-label="None" value="">
                            choose datatypes
                          </option>
                          {completedTodos?.map((todo, index) => {
                            return (
                              <option key={index} value={todo.name}>
                                {todo.name}
                              </option>
                            );
                          })}
                        </NativeSelect>
                      </FormControl>
                    </div>
                  </div>
                ) : null}
                <div className="">
                  <span>Primary Key</span>
                  <div>
                    <FormControl sx={{ width: "100%" }} variant="standard">
                      <NativeSelect
                        id="demo-customized-select-native"
                        value={primaryKey}
                        onChange={(event) => {
                          console.log(event.target.value);
                          setPrimaryKey(event.target.value);
                        }}
                        input={<BootstrapInput />}
                      >
                        <option aria-label="None" value="">
                          choose datatypes
                        </option>
                        {completedTodos?.map((todo, index) => {
                          return (
                            <option key={index} value={todo.name}>
                              {todo.name}
                            </option>
                          );
                        })}
                      </NativeSelect>
                    </FormControl>
                  </div>
                </div>
              </div>

              {completedTodos?.map((todo, index) => (
                <TargetDragger
                  index={index}
                  todos={completedTodos}
                  todo={todo}
                  key={todo.id}
                  id={todo.id}
                  setTodos={setCompletedTodos}
                  upsertValue={upsertValue}
                  upsertKey={upsertKey}
                  setUpsertKey={setUpsertKey}
                  primaryKey={primaryKey}
                  setPrimaryKey={setPrimaryKey}
                  dataTypes={dataTypes}
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

export default OdmDrager;
