import React from "react";
import "./targerdragger.css";
import { Draggable } from "react-beautiful-dnd";

import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import NativeSelect from "@mui/material/NativeSelect";
import InputBase from "@mui/material/InputBase";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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

const TargetDragger = ({
  todo,
  todos,
  setTodos,
  id,
  name,
  index,
  upsertValue,
  upsertKey,
  setUpsertKey,
  primaryKey,
  setPrimaryKey,
  dataTypes,
}) => {
  const [datatypes, setDatatypes] = React.useState("");
  const handleChange = (event) => {
    setDatatypes(event.target.value);
    let temp_state = [...todos];
    let temp_element = temp_state.map((el) =>
      el.id === id
        ? {
            ...el,
            datatypes: event.target.value,
          }
        : el
    );
    setTodos(temp_element);
    console.log(temp_element, index);
  };

  const handleRuleChange = (event) => {
    let temp_state = [...todos];
    let temp_element = temp_state.map((el) =>
      el.id === id
        ? {
            ...el,
            rulesEngine: {
              rule: event.target.value,
            },
          }
        : el
    );
    setTodos(temp_element);
  };

  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`todos__single ${snapshot.isDragging ? "drag" : ""}`}
        >
          <div className="newtable__row">
            <div>{todo.name}</div>
            <div className="target__table">
              <FormControl sx={{ width: "100%" }} variant="standard">
                {/* <InputLabel htmlFor="demo-customized-select-native">Age</InputLabel> */}
                <NativeSelect
                  id="demo-customized-select-native"
                  value={datatypes}
                  onChange={handleChange}
                  input={<BootstrapInput />}
                >
                  <option aria-label="None" value="">
                    choose datatypes
                  </option>
                  {dataTypes.map((el, idx) => {
                    return (
                      <option key={idx} value={el}>
                        {el}
                      </option>
                    );
                  })}
                </NativeSelect>
              </FormControl>
            </div>

            <div className="delta__field">
              <span>Rules Engine </span>
              <div className="target__table">
                <FormControl sx={{ width: "100%" }} variant="standard">
                  <input
                    type="text"
                    value={todo.rulesEngine.rule}
                    onChange={handleRuleChange}
                    style={{ width: "100%", backgroundColor: "transparent" }}
                  />
                </FormControl>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TargetDragger;
