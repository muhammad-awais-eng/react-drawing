/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import "./OdmForm.css";
import axios from "axios";
import "./odm.css";
import SourceTable from "../dragableComponnet/SourceTable";
import { DragDropContext } from "react-beautiful-dnd";

import StorageIcon from "@mui/icons-material/Storage";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import KeyIcon from "@mui/icons-material/Key";

import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";

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

function OdmForm() {
  const [formStepsNu, setformstepNu] = useState(0);
  const [progressActive, setprogressActive] = useState(0);
  const [progress, setprogress] = useState(0);

  const [sourcerDbList, setSourcerDbList] = useState([]);
  const [targetDbList, setTargetDbList] = useState([]);
  const [dbCollection, setDbCollection] = useState([]);

  const [dbData, setDbData] = useState([]);
  const [checkConnection, setcheckConnection] = useState(false);
  const [checkTarrgetConnection, setCheckTarrgetConnection] = useState(false);
  const [sourceDBName, setSourceDBName] = React.useState("");
  const [sourceDBpassword, setSourceDBPassword] = React.useState("");
  const [targetDBName, setTargetDBName] = React.useState("");
  const [targetDBpassword, setTargetDBpassword] = React.useState("");
  const [a, seta] = React.useState("");
  const [sourceSchema, setSourceSchema] = React.useState("");
  const [targetSchema, setTargetSchema] = React.useState("");
  const [sourceTable, setSourceTable] = React.useState("");
  const [targetTable, setTargetTable] = React.useState("");
  const [sourceColumn, setSourceColumn] = React.useState([]);
  const [targetColumn, setTargetColumn] = React.useState([]);

  const [sourceTableNames, setSourceTableName] = React.useState([]);
  const [targetTableNames, setTargetTableName] = React.useState([]);

  const handleSourceChange = (event) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    console.log(event.target.value);
    setSourceDBName(value);

    setcheckConnection(!checkConnection);
  };
  const handleTargetChange = (event) => {
    const {
      target: { value },
    } = event;
    setTargetDBName(value);
  };

  useEffect(() => {
    if (sourceDBName.length > 0) {
      SourceSchemaList(sourceDBName, sourceDBpassword);
    }
  }, []);

  useEffect(() => {
    try {
      axios
        .get("/v1/list_db_connections", {
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          setDbData(response.data.result_list);
          const data = Object.keys(response.data.result_list);
          data.map((item, index) => {
            setDbCollection((data) => [...data, { id: index, name: item }]);
          });
        })
        .catch((error) => {
          console.log(error);
          alert("please check your credientials");
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    try {
      axios
        .get("/v1/list_db_schema", {
          params: {
            connection_name: "final_test",
            inserted_db_password: "admin123",
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          setSourcerDbList([]);
          setTargetDbList([]);
          const data = response.data.schema_entities;
          data.map((item) => {
            // setSourcerDbList((prevState) => [
            //   ...prevState,
            //   { dbName: item, sourceEntitiesList: [] },
            // ]);

            setTargetDbList((prevState) => [
              ...prevState,
              { dbName: item, targetEntitiesList: [] },
            ]);
          });
        })
        .catch((error) => {
          console.log(error);
          alert("please check your credientials");
          //   setSuccessMessage(true);
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const checkSourceDbConnection = async () => {
    try {
      await axios
        .get("/v1/db_connection_check", {
          params: {
            connection_name: sourceDBName,
            inserted_db_password: sourceDBpassword,
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log(response.data);
          SourceSchemaList(sourceDBName, sourceDBpassword);
          setcheckConnection(!checkConnection);
        })
        .catch((error) => {
          console.log(error);

          alert("please check your credientials");
        });
    } catch (e) {
      console.log(e);
    }
  };

  const SourceSchemaList = async (sourceDBName, sourceDBpassword) => {
    try {
      axios
        .get("/v1/list_db_schema", {
          params: {
            connection_name: sourceDBName,
            inserted_db_password: sourceDBpassword,
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          setSourcerDbList([]);
          const data = response.data.schema_entities;
          data.map((item) => {
            setSourcerDbList((prevState) => [
              ...prevState,
              { dbName: item, sourceEntitiesList: [] },
            ]);
            //  setTargetDbList((prevState) => [
            //    ...prevState,
            //    { dbName: item, targetEntitiesList: [] },
            //  ]);
          });
        })
        .catch((error) => {
          console.log(error);
          alert("please check your credientials");
          //   setSuccessMessage(true);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const listSourceEntites = async (dbName) => {
    console.log(dbName);
    try {
      axios
        .get("/v1/list_db_entities", {
          params: {
            connection_name: sourceDBName,
            schema_name: dbName,
            inserted_db_password: "admin123",
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          const data = response.data.schema_entities;
          let temp_state = [...targetDbList];
          let temp_element = temp_state.map((el) =>
            el.dbName === dbName
              ? {
                  ...el,
                  sourceEntitiesList: data.map((item) => {
                    return {
                      tableName: item,
                      sourceColumnList: [],
                    };
                  }),
                }
              : el
          );
          console.log(temp_element, "dsds");
          setSourcerDbList(temp_element);
          setSourceTableName(response.data.schema_entities);
        })
        .catch((error) => {
          console.log(error);
          alert("please check your credientials");
          //   setSuccessMessage(true);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const SourceColumnList = async (tableName) => {
    console.log(tableName, sourceDBName);
    try {
      axios
        .get("/v1/list_entity_column", {
          params: {
            connection_name: sourceDBName,
            inserted_db_password: "admin123",
            entity_name: tableName,
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log(response.data.entities_metadata, "entity column");
          const data = response.data.entities_metadata;

          data.map((item, index) => {
            console.log(item);
            setSourceColumn((data) => [...data, { id: index, name: item }]);
          });

          //   setSourceColumn(response.data.entities_metadata);
        })
        .catch((error) => {
          console.log(error);
          alert("please check your credientials");
          //   setSuccessMessage(true);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const listTargetEntites = async (dbName) => {
    setTargetTable(dbName);
    try {
      axios
        .get("/v1/list_db_entities", {
          params: {
            connection_name: targetDBName,
            schema_name: dbName,
            inserted_db_password: "admin123",
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log(response.data.schema_entities);
          const data = response.data.schema_entities;
          let temp_state = [...targetDbList];
          let temp_element = temp_state.map((el) =>
            el.dbName === dbName
              ? {
                  ...el,
                  targetEntitiesList: data.map((item) => {
                    return {
                      tableName: item,
                      targetColumnList: [],
                    };
                  }),
                }
              : el
          );
          console.log(temp_element, "dsds");
          setTargetDbList(temp_element);
          setTargetTableName(response.data.schema_entities);
        })
        .catch((error) => {
          console.log(error);
          alert("please check your credientials");
          //   setSuccessMessage(true);
        });
    } catch (e) {
      console.log(e);
    }
  };
  const TargetColumnList = async (tableName) => {
    try {
      axios
        .get("/v1/list_entity_column", {
          params: {
            connection_name: "final_test",
            inserted_db_password: "admin123",
            entity_name: tableName,
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log(response.data.entities_metadata, "entity column");
          setTargetColumn([]);
        })
        .catch((error) => {
          console.log(error);
          alert("please check your credientials");
          //   setSuccessMessage(true);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const nextbtn = (e) => {
    e.preventDefault();
    setformstepNu((prev) => prev + 1);
  };
  const prevBtn = (e) => {
    e.preventDefault();
    setformstepNu((prev) => prev - 1);
  };

  useEffect(() => {
    const progressActive = document.getElementsByClassName(
      "progress-step-active"
    ).length;
    setprogressActive(progressActive);
    const progress = document.getElementsByClassName("progress-step").length;
    setprogress(progress);
  }, [nextbtn, prevBtn]);

  /////   dragable    part

  const onDragEnd = (result) => {
    const { destination, source } = result;

    // console.log(result);

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let add;
    let active = sourceColumn;
    let complete = targetColumn;
    // Source Logic
    if (source.droppableId === "TodosList") {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
      console.log("esle");
    }
    //Destination Logic
    if (destination.droppableId === "TodosList") {
      active.splice(destination.index - 1, 0, add);
      // console.log("des if");
    } else {
      complete.splice(destination.index, 0, add);

      // console.log("dest else");
    }

    // console.log(active, complete);
    setTargetColumn(complete);
    setSourceColumn(active);
  };

  return (
    <div>
      {/* **********************************   <-- check source connection -->  **************************************** */}
      {checkConnection ? (
        <div className="check__db__connection">
          <div className="db_connection_wrapper">
            <div>Name</div>
            <input type="text" value={sourceDBName} disabled />
          </div>
          <div className="db_connection_wrapper">
            <div>Password</div>
            <input
              type="password"
              placeholder="enter password"
              value={sourceDBpassword}
              onChange={(e) => setSourceDBPassword(e.target.value)}
            />
          </div>
          <div className="wrapper__btn">
            <button
              className="cancel__btn"
              onClick={() => setcheckConnection(!checkConnection)}
            >
              Cancel
            </button>
            <button className="submit__btn" onClick={checkSourceDbConnection}>
              Submit
            </button>
          </div>
        </div>
      ) : null}
      {/* **********************************   <-- check Target connection -->  **************************************** */}

      {checkTarrgetConnection ? (
        <div className="check__db__connection">
          <div className="db_connection_wrapper">
            <div>Name</div>
            <input type="text" value={targetDBName} disabled />
          </div>
          <div className="db_connection_wrapper">
            <div>Password</div>
            <input
              type="password"
              placeholder="enter password"
              value={targetDBpassword}
              onChange={(e) => setTargetDBpassword(e.target.value)}
            />
          </div>
          <div className="wrapper__btn">
            <button
              className="cancel__btn"
              onClick={() =>
                setCheckTarrgetConnection(!setCheckTarrgetConnection)
              }
            >
              Cancel
            </button>
            <button className="submit__btn" onClick={checkSourceDbConnection}>
              Submit
            </button>
          </div>
        </div>
      ) : null}

      <form className="form">
        <h1 className="text-center">ODM Process</h1>
        {/*******************************    <-- Progress bar --> ****************************************************************************/}
        <div className="progressbar">
          <div
            className="progress"
            id="progress"
            style={{
              width: ((progressActive - 1) / (progress - 1)) * 100 + "%",
            }}
          ></div>

          <div
            className="progress-step progress-step-active"
            data-title="DB Selections"
          ></div>
          <div
            className={
              "progress-step " +
              (formStepsNu >= 1 ? "progress-step-active" : "")
            }
            data-title="Schema Selection"
          ></div>
          <div
            className={
              "progress-step " +
              (formStepsNu >= 2 ? "progress-step-active" : "")
            }
            data-title="Table Selection"
          ></div>
          <div
            className={
              "progress-step " +
              (formStepsNu >= 3 ? "progress-step-active" : "")
            }
            data-title="Column Selection"
          ></div>
          <div
            className={
              "progress-step " +
              (formStepsNu >= 4 ? "progress-step-active" : "")
            }
            data-title="advanced"
          ></div>
          <div
            className={
              "progress-step " +
              (formStepsNu >= 5 ? "progress-step-active" : "")
            }
            data-title="Final"
          ></div>
        </div>

        {/* ****************************  <-- DB Selections -->  ******************************************************************/}
        <div
          className={
            "form-step " + (formStepsNu === 0 ? "form-step-active" : "")
          }
        >
          <div className="dbs__Selections">
            <div className="source_db_select">
              <FormControl sx={{ m: "auto", width: "100%" }} variant="standard">
                {/* <InputLabel htmlFor="demo-customized-select-native">Age</InputLabel> */}
                <NativeSelect
                  id="demo-customized-select-native"
                  value={sourceDBName}
                  onChange={handleSourceChange}
                  input={<BootstrapInput />}
                >
                  <option aria-label="None" value="">
                    Choose Source DB ....
                  </option>
                  {dbCollection.map((db, idx) => (
                    <option key={idx} value={db.name}>
                      {db.name}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            </div>
            <div className="target_db_select">
              <FormControl sx={{ m: "auto", width: "100%" }} variant="standard">
                {/* <InputLabel htmlFor="demo-customized-select-native">Age</InputLabel> */}
                <NativeSelect
                  id="demo-customized-select-native"
                  value={targetDBName}
                  onChange={handleTargetChange}
                  input={<BootstrapInput />}
                >
                  <option aria-label="None" value="">
                    Choose Target DB ....
                  </option>
                  {dbCollection.map((db, idx) => (
                    <option key={idx} value={db.name}>
                      {db.name}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            </div>
          </div>

          <div className="">
            {sourceDBName.length > 0 && targetDBName.length > 0 ? (
              <button
                className="foobtn btn-next width-50 ml-auto"
                onClick={nextbtn}
              >
                Next
              </button>
            ) : null}
          </div>
        </div>
        {/* ****************************  <-- schema selection -->  ************************************************************************/}

        <div
          className={
            "form-step " + (formStepsNu === 1 ? "form-step-active" : "")
          }
        >
          <div className="db_schema__selection">
            <div className="source__schema__container">
              <h1>{sourceDBName}</h1>
              <div className="source__schema__wrapper">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={sourceSchema}
                    onChange={(e) => {
                      setSourceSchema(e.target.value);
                      console.log(e.target.value);
                      listSourceEntites(e.target.value);
                    }}
                  >
                    {sourcerDbList.map((db) => (
                      <div>
                        <div className="source__column">
                          <div
                            style={{ marginLeft: "10px" }}
                            //   onClick={() => listSourceEntites(db.dbName)}
                          >
                            <FormControlLabel
                              value={db.dbName}
                              control={<Radio />}
                              label={db.dbName}
                            />
                          </div>
                        </div>

                        <div>
                          {db.sourceEntitiesList?.map((entity) => {
                            return (
                              <div>
                                <div className="source__table__list">
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                    onClick={() =>
                                      SourceColumnList(
                                        entity.tableName,
                                        db.dbName
                                      )
                                    }
                                  >
                                    <div>
                                      <ArrowRightIcon
                                        style={{
                                          color: "rgb(104, 75, 38)",
                                          height: "23px",
                                        }}
                                      />
                                    </div>
                                    <div> {entity.tableName}</div>
                                  </div>
                                </div>

                                <div className="source__column__list">
                                  {entity.sourceColumnList?.map((column) => {
                                    return (
                                      <div className="sourceColumn">
                                        <div>
                                          <DescriptionIcon
                                            style={{
                                              color: "rgb(104, 75, 38)",
                                              height: "18px",
                                            }}
                                          />
                                        </div>
                                        <div style={{ paddingLeft: "5px" }}>
                                          {column}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
            </div>

            <div className="target__schema__container">
              <h1>{targetDBName}</h1>
              <div className="target__schema__wrapper">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={targetSchema}
                    onChange={(e) => {
                      setTargetSchema(e.target.value);
                      console.log(e.target.value);
                      listTargetEntites(e.target.value);
                    }}
                  >
                    {targetDbList.map((db) => (
                      <div>
                        <div className="source__column">
                          <div
                            style={{ marginLeft: "10px" }}
                            // onClick={() => listTargetEntites(db.dbName)}
                          >
                            <FormControlLabel
                              value={db.dbName}
                              control={<Radio />}
                              label={db.dbName}
                            />
                          </div>
                        </div>

                        {/* <div>
                          {db.targetEntitiesList?.map((entity) => {
                            return (
                              <div>
                                <div className="target__table__list">
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                    onClick={() =>
                                      TargetColumnList(
                                        entity.tableName,
                                        db.dbName
                                      )
                                    }
                                  >
                                    <div>
                                      <ArrowRightIcon
                                        style={{
                                          color: "rgb(104, 75, 38)",
                                          height: "23px",
                                        }}
                                      />
                                    </div>
                                    <div> {entity.tableName}</div>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "space-around",
                                    }}
                                  >
                                    <div>
                                      <FormControl
                                        component="fieldset"
                                        className="mw-120"
                                      >
                                        <FormGroup aria-label="position" row>
                                          <FormControlLabel
                                            value="Drop"
                                            control={
                                              <Checkbox
                                                size="small"
                                                value="checkedA"
                                                onChange={() =>
                                                  console.log("checked")
                                                }
                                              />
                                            }
                                            label="Drop"
                                            labelPlacement="top"
                                          />
                                        </FormGroup>
                                      </FormControl>
                                    </div>
                                    <div>
                                      <FormControl
                                        component="fieldset"
                                        className="mw-120"
                                      >
                                        <FormGroup aria-label="position" row>
                                          <FormControlLabel
                                            value="Truncate"
                                            control={
                                              <Checkbox
                                                size="small"
                                                value="checkedA"
                                                onChange={() =>
                                                  console.log("checked")
                                                }
                                              />
                                            }
                                            label="Truncate"
                                            labelPlacement="top"
                                          />
                                        </FormGroup>
                                      </FormControl>
                                    </div>
                                    <div>
                                      <FormControl
                                        component="fieldset"
                                        className="mw-120"
                                      >
                                        <FormGroup aria-label="position" row>
                                          <FormControlLabel
                                            value="Upsert"
                                            control={
                                              <Checkbox
                                                size="small"
                                                value="checkedA"
                                                onChange={() =>
                                                  console.log("checked")
                                                }
                                              />
                                            }
                                            label="Upsert"
                                            labelPlacement="top"
                                          />
                                        </FormGroup>
                                      </FormControl>
                                    </div>
                                    <div>
                                      <FormControl
                                        component="fieldset"
                                        className="mw-120"
                                      >
                                        <FormGroup aria-label="position" row>
                                          <FormControlLabel
                                            value="Upsert key"
                                            control={
                                              <Checkbox
                                                size="small"
                                                value="checkedA"
                                                onChange={() =>
                                                  console.log("checked")
                                                }
                                              />
                                            }
                                            label="Upsert key"
                                            labelPlacement="top"
                                          />
                                        </FormGroup>
                                      </FormControl>
                                    </div>
                                  </div>
                                </div>

                                <div className="source__column__list">
                                  {entity.targetEntitiesList?.map((column) => {
                                    return (
                                      <div className="targetColumn">
                                        <div>
                                          <DescriptionIcon
                                            style={{
                                              color: "rgb(104, 75, 38)",
                                              height: "18px",
                                            }}
                                          />
                                        </div>
                                        <div style={{ paddingLeft: "5px" }}>
                                          {column}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div> */}
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </div>

          <div className="btns-group">
            <a href="#" className="foobtn btn-prev" onClick={prevBtn}>
              Previous
            </a>
            <a href="#" className="foobtn btn-next" onClick={nextbtn}>
              Next
            </a>
          </div>
        </div>
        {/* ***************************  <-- table Selection -->  *********************************************************************/}

        <div
          className={
            "form-step " + (formStepsNu === 2 ? "form-step-active" : "")
          }
        >
          <div className="db_schema__selection">
            <div className="source__schema__container">
              <h1>{sourceDBName}</h1>
              <div className="source__schema__wrapper">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={sourceTable}
                    onChange={(e) => {
                      setSourceTable(e.target.value);
                      console.log(e.target.value);
                      SourceColumnList(e.target.value);
                    }}
                  >
                    {sourceTableNames.map((db) => (
                      <div>
                        <div className="source__column">
                          <div
                            style={{ marginLeft: "10px" }}
                            //   onClick={() => listSourceEntites(db.dbName)}
                          >
                            <FormControlLabel
                              value={db}
                              control={<Radio />}
                              label={db}
                            />
                          </div>
                        </div>

                        {/* <div>
                          {db.sourceEntitiesList?.map((entity) => {
                            return (
                              <div>
                                <div className="source__table__list">
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                    onClick={() =>
                                      SourceColumnList(
                                        entity.tableName,
                                        db.dbName
                                      )
                                    }
                                  >
                                    <div>
                                      <ArrowRightIcon
                                        style={{
                                          color: "rgb(104, 75, 38)",
                                          height: "23px",
                                        }}
                                      />
                                    </div>
                                    <div> {entity.tableName}</div>
                                  </div>
                                </div>

                                <div className="source__column__list">
                                  {entity.sourceColumnList?.map((column) => {
                                    return (
                                      <div className="sourceColumn">
                                        <div>
                                          <DescriptionIcon
                                            style={{
                                              color: "rgb(104, 75, 38)",
                                              height: "18px",
                                            }}
                                          />
                                        </div>
                                        <div style={{ paddingLeft: "5px" }}>
                                          {column}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div> */}
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
            </div>

            <div className="target__schema__container">
              <h1>{targetDBName}</h1>
              <div className="target__schema__wrapper">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={targetTable}
                    onChange={(e) => {
                      setTargetTable(e.target.value);
                      console.log(e.target.value);
                      TargetColumnList(e.target.value);
                    }}
                  >
                    {targetTableNames.map((db) => (
                      <div>
                        <div className="source__column">
                          <div
                            style={{ marginLeft: "10px" }}
                            // onClick={() => listTargetEntites(db.dbName)}
                          >
                            <FormControlLabel
                              value={db}
                              control={<Radio />}
                              label={db}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </div>

          <div className="btns-group">
            <a href="#" className="foobtn btn-prev" onClick={prevBtn}>
              Previous
            </a>
            <a href="#" className="foobtn btn-next" onClick={nextbtn}>
              Next
            </a>
          </div>
        </div>
        {/* **************************  <-- Column Selection -->  ******************************************************************/}
        <div
          className={
            "form-step " + (formStepsNu === 3 ? "form-step-active" : "")
          }
        >
          <div>
            <DragDropContext onDragEnd={onDragEnd}>
              <div>
                <div>
                  <SourceTable
                    sourcetable={sourceTable}
                    targetTable={targetTable}
                    todos={sourceColumn}
                    setTodos={setSourceColumn}
                    completedTodos={targetColumn}
                    setCompletedTodos={setTargetColumn}
                  />
                </div>
              </div>
            </DragDropContext>
          </div>

          <div className="btns-group">
            <a href="#" className="foobtn btn-prev" onClick={prevBtn}>
              Previous
            </a>
            <a href="#" className="foobtn btn-next" onClick={nextbtn}>
              Next
            </a>
          </div>
        </div>
        {/* **********************************************************  <-- delta configuration -->  ********************************************************************/}

        <div
          className={
            "form-step " + (formStepsNu === 4 ? "form-step-active" : "")
          }
        >
          <div>
            <div className="delta__configuration">
              <h1>Delta Configuration </h1>
              <div className="delta__field">
                <span>Delta flow</span>
                <input type="text" placeholder="delta flow" />
              </div>
              <div className="delta__field">
                <span>Delta column</span>
                <input type="text" placeholder="Delta column" />
              </div>
              <div className="delta__field">
                <span>Delta Type</span>
                <input type="text" placeholder="Delta Type" />
              </div>
              <div className="delta__field">
                <span>From Value </span>
                <input type="text" placeholder="From Value" />
              </div>
              <div className="delta__field">
                <span>from operator</span>
                <input type="text" placeholder="from operator" />
              </div>
              <div className="delta__field">
                <span>To Value</span>
                <input type="text" placeholder="To Value" />
              </div>
              <div className="delta__field">
                <span>To Operator</span>
                <input type="text" placeholder="To Operator" />
              </div>
              <div className="delta__field">
                <span>Last Extracted</span>
                <input type="text" placeholder="Last Extracted" />
              </div>
              <div className="delta__field">
                <span>Executation Start Time</span>
                <input type="text" placeholder="Executation Start Time" />
              </div>

              <div className="delta__field">
                <span>Execuation End Time</span>
                <input type="text" placeholder="Execuation End Time" />
              </div>

              <div className="buttonArea">
                <span>
                  <button
                    // onClick={handleReset}
                    style={{ backgroundColor: "#ee1919", padding: "8px" }}
                  >
                    Reset
                  </button>
                </span>
                <button
                  type="submit"
                  // onClick={handleConnectionSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          <div className="btns-group">
            <a href="#" className="foobtn btn-prev" onClick={prevBtn}>
              Previous
            </a>
            <a href="#" className="foobtn btn-next" onClick={nextbtn}>
              Next
            </a>
          </div>
        </div>
        {/* **********************************************************  <-- Menu Item Presentaion -->  ******************************************************************/}

        <div
          className={
            "form-step " + (formStepsNu === 5 ? "form-step-active" : "")
          }
        >
          <div>sixth</div>

          <div className="btns-group">
            <a href="#" className="foobtn btn-prev" onClick={prevBtn}>
              Previous
            </a>
            <input type="submit" value="Submit" className="foobtn" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default OdmForm;
