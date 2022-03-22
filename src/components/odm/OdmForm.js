/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import "./OdmForm.css";
import axios from "axios";
import "./odm.css";
import OdmDrager from "./odmdragger/OdmDrager";
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
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import NativeSelect from "@mui/material/NativeSelect";
import InputBase from "@mui/material/InputBase";
import InputAdornment from "@mui/material/InputAdornment";
import { Button } from "@mui/material";

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

function OdmForm(props) {
  const [formStepsNu, setformstepNu] = useState(0);
  const [progressActive, setprogressActive] = useState(0);
  const [progress, setprogress] = useState(0);

  const [jobsList, setJobsList] = useState([]);

  const [sourcerDbList, setSourcerDbList] = useState([]);
  const [targetDbList, setTargetDbList] = useState([]);
  const [dbCollection, setDbCollection] = useState([]);

  const [sourceSchemaList, setSourceSchemaList] = useState([]);
  const [targetSchemaList, setTargetSchemaList] = useState([]);

  const [dbData, setDbData] = useState([]);
  const [checkSourceConnection, setCheckSourceConnection] = useState(false);
  const [checkTarrgetConnection, setCheckTarrgetConnection] = useState(false);

  const [sourceConnectionName, setSourceConnectionName] = React.useState("");
  const [sourceDBpassword, setSourceDBPassword] = React.useState("");

  const [sourceDBName, setSourceDBName] = React.useState("");
  const [targetDBName, setTargetDBName] = React.useState("");

  const [targetConnectionName, setTargetConnectionName] = React.useState("");
  const [targetDBpassword, setTargetDBpassword] = React.useState("");

  const [sourceSchema, setSourceSchema] = React.useState("");
  const [targetSchema, setTargetSchema] = React.useState("");

  const [sourceTable, setSourceTable] = React.useState("");
  const [targetTable, setTargetTable] = React.useState("");
  const [queryExpression, setQueryExpression] = React.useState(null);
  const [taskActive, setTaskActive] = React.useState(false);

  const [sourceColumn, setSourceColumn] = React.useState([]);
  const [targetColumn, setTargetColumn] = React.useState([]);
  const [autoMappingColumn, setAutoMappingColumn] = useState(false);

  const [sourceColumnList, setSourceColumnList] = useState([]);

  const [sourceTableNames, setSourceTableName] = React.useState([]);
  const [targetTableNames, setTargetTableName] = React.useState([]);

  const [datatypes, setdataTypes] = React.useState([]);
  const [columnRules, setColumnRules] = React.useState([]);

  const [isdrop, setIsDrop] = React.useState(false);
  const [isTruncate, setIsTruncate] = React.useState(false);
  const [isUpsert, setIsUpsert] = React.useState(false);
  const [upsertKey, setUpsertKey] = React.useState(null);
  const [primaryKey, setPrimaryKey] = React.useState(null);

  const [deltaFlow, setDeltaFlow] = React.useState("");
  const [delataColumn, setdelataColumn] = React.useState("");
  const [deltaType, setDeltaType] = React.useState("");
  const [fromValue, setFromValue] = React.useState("");
  const [fromOperator, setFromOperator] = React.useState("");
  const [toValue, setToValues] = React.useState("");
  const [toOperator, setToOperator] = React.useState("");
  const [lastExtractedValues, setLastExtractedValues] = React.useState("");
  const [executionStartTimestamp, setExecutionStartTimestamp] =
    React.useState("");
  const [executionEndTimestamp, setExecutionEndTimestamp] = React.useState("");

  const [taskName, setTaskName] = React.useState("");

  const getAllJobs = async () => {
    try {
      axios
        .get("/v1/list_task_mappings", {
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          setJobsList(response.data);
        })
        .catch((error) => {
          console.log(error);
          alert("please check your credientials");
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllJobs();
    console.log(props.jobType);
  }, []);

  const handleSourceChange = (event) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    console.log(event.target.value);
    setSourceConnectionName(value);

    setCheckSourceConnection(!checkSourceConnection);
  };
  const handleTargetChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(event.target.value);
    setTargetConnectionName(value);
    setCheckTarrgetConnection(!checkTarrgetConnection);
  };
  const getDataTypes = async (dbName) => {
    try {
      axios
        .get("v1/list_db_datatypes", {
          params: {
            database_name: dbName,
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log(response.data.entities_datatypes);
          setdataTypes(response.data.entities_datatypes);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  };
  const getColumnRules = async (dbName) => {
    try {
      axios
        .get("v1/column_rules", {
          params: {
            database_name: dbName,
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log(response.data.entities_datatypes);
          setColumnRules(response.data.column_rules);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  };

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

  const checkSourceDbConnection = async () => {
    try {
      await axios
        .get("/v1/db_connection_check", {
          params: {
            connection_name: sourceConnectionName,
            inserted_db_password: sourceDBpassword,
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log(response.data);
          SourceSchemaList(sourceConnectionName, sourceDBpassword);
          setCheckSourceConnection(!checkSourceConnection);
        })
        .catch((error) => {
          console.log(error);

          // alert("please check your credientials");
        });
    } catch (e) {
      console.log(e);
    }
  };

  const SourceSchemaList = async (sourceConnectionName, sourceDBpassword) => {
    const dbName = dbData[sourceConnectionName].source_name;
    setSourceDBName(dbName);
    try {
      axios
        .get("/v1/list_db_schema", {
          params: {
            connection_name: sourceConnectionName,
            inserted_db_password: sourceDBpassword,
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          setSourceSchemaList([]);
          const data = response.data.schema_entities;
          data.map((item) => {
            setSourceSchemaList((prevState) => [
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

  const checkTargetDbConnection = async () => {
    try {
      await axios
        .get("/v1/db_connection_check", {
          params: {
            connection_name: targetConnectionName,
            inserted_db_password: targetDBpassword,
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log(response.data);
          TargetSchemaList(targetConnectionName, targetDBpassword);
          setCheckTarrgetConnection(!checkTargetDbConnection);
        })
        .catch((error) => {
          console.log(error);

          // alert("please check your credientials");
        });
    } catch (e) {
      console.log(e);
    }
  };

  const TargetSchemaList = async (targetDbName, targetDBpassword) => {
    const dbName = dbData[targetDbName].source_name;
    setTargetDBName(dbName);
    getDataTypes(dbName);
    getColumnRules(dbName);

    try {
      axios
        .get("/v1/list_db_schema", {
          params: {
            connection_name: targetDbName,
            inserted_db_password: targetDBpassword,
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log(response.data);
          setTargetSchemaList([]);
          const data = response.data.schema_entities;
          data.map((item) => {
            setTargetSchemaList((prevState) => [
              ...prevState,
              { dbName: item, sourceEntitiesList: [] },
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
  };

  const listSourceEntites = async (dbName) => {
    try {
      axios
        .get("/v1/list_db_entities", {
          params: {
            connection_name: sourceConnectionName,
            schema_name: dbName,
            inserted_db_password: sourceDBpassword,
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
    console.log(tableName, sourceConnectionName);
    try {
      axios
        .get("/v1/list_entity_column", {
          params: {
            connection_name: sourceConnectionName,
            inserted_db_password: sourceDBpassword,
            schema_name: sourceSchema,
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

            setSourceColumn((data) => [
              ...data,
              {
                id: index,
                sourceColumnName: item,
                targetColumnName: item,
                n: "",
                n1: "",
                datatypes: "",
                rulesEngine: {
                  rule: "",
                },
              },
            ]);
            setSourceColumnList((data) => [
              ...data,
              {
                id: index,
                name: item,
                datatypes: "",
                rulesEngine: {
                  rule: "",
                },
              },
            ]);
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
            connection_name: targetConnectionName,
            schema_name: dbName,
            inserted_db_password: targetDBpassword,
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
                  targetEntitiesList: data.map((item) => {
                    return {
                      tableName: item,
                      targetColumnList: [],
                    };
                  }),
                }
              : el
          );

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
            connection_name: targetConnectionName,
            inserted_db_password: targetDBpassword,
            schema_name: targetSchema,
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

  const handleJob = (e) => {
    e.preventDefault();

    const jobs = jobsList;
    const groupJob = jobs["process_groups"];
    const individual = jobs["process_individuals"];

    if (props.jobType === "group") {
      groupJob["landings"].push({
        task_name: taskName,
        source_database_name: sourceDBName,
        target_database_name: targetDBName,
        source_schema_name: sourceSchema,
        target_schema_name: targetSchema,
        source_entity_name: sourceTable,
        target_entity_name: targetTable,
        query_expression: queryExpression,
        drop_p: isdrop ? 1 : 0,
        truncate_p: isTruncate ? 1 : 0,
        upsert_p: isUpsert ? 1 : 0,
        upsert_key: upsertKey,
        primary_key: primaryKey,
        delta_configurations: {
          delta_flow: deltaFlow,
          delta_column: delataColumn,
          delta_type: deltaType,
          from_value: fromValue,
          from_operator: fromOperator,
          to_value: toValue,
          to_operator: toOperator,
          last_extracted_values: lastExtractedValues,
          execution_start_timestamp: executionStartTimestamp,
          execution_end_timestamp: executionEndTimestamp,
        },
        column_mapping: targetColumn?.map((item, idx) => {
          const datatype = item.datatypes
            .replace("<n>", item.n)
            .replace("<n1>", item.n1);
          return {
            source_column_name: item.sourceColumnName,
            target_column_name: item.targetColumnName,
            data_type: datatype,
            rules_engine: item.rulesEngine["rule"].replace(
              "<n>",
              item.sourceColumnName
            ),
          };
        }),

        process_configurations: {
          source_connection: sourceConnectionName,
          source_encoded_password: sourceDBpassword,
          target_connection: targetConnectionName,
          target_encoded_password: targetDBpassword,
          is_status: taskActive ? 1 : 0,
        },
      });
    } else {
      individual.push({
        task_name: taskName,
        source_database_name: sourceDBName,
        target_database_name: targetDBName,
        source_schema_name: sourceSchema,
        target_schema_name: targetSchema,
        source_entity_name: sourceTable,
        target_entity_name: targetTable,
        query_expression: queryExpression,
        drop_p: isdrop ? 1 : 0,
        truncate_p: isTruncate ? 1 : 0,
        upsert_p: isUpsert ? 1 : 0,
        upsert_key: upsertKey,
        primary_key: primaryKey,
        delta_configurations: {
          delta_flow: deltaFlow,
          delta_column: delataColumn,
          delta_type: deltaType,
          from_value: fromValue,
          from_operator: fromOperator,
          to_value: toValue,
          to_operator: toOperator,
          last_extracted_values: lastExtractedValues,
          execution_start_timestamp: executionStartTimestamp,
          execution_end_timestamp: executionEndTimestamp,
        },
        column_mapping: targetColumn?.map((item, idx) => {
          const datatype = item.datatypes
            .replace("<n>", item.n)
            .replace("<n1>", item.n1);
          return {
            source_column_name: item.sourceColumnName,
            target_column_name: item.targetColumnName,
            data_type: datatype,
            rules_engine: item.rulesEngine["rule"].replace(
              "<n>",
              item.sourceColumnName
            ),
          };
        }),

        process_configurations: {
          source_connection: sourceConnectionName,
          source_encoded_password: sourceDBpassword,
          target_connection: targetConnectionName,
          target_encoded_password: targetDBpassword,
          is_status: taskActive ? 1 : 0,
        },
      });
    }
    console.log(groupJob, "group", individual, "individual", jobs);

    const body = {
      process_groups: groupJob,
      process_individuals: individual,
    };
    console.log(body);
    try {
      axios
        .post("/v1/tasks_mapper_engine", body, {
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log("success post", response.data);
        })
        .catch((error) => {
          console.log("error");
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      {/* <Line x0={0} y0={0} x1={330} y1={330} /> */}
      {/* **********************************   <-- check source connection -->  **************************************** */}
      {checkSourceConnection ? (
        <div className="check__db__connection">
          <div className="db_connection_wrapper">
            <div>Name</div>
            <input type="text" value={sourceConnectionName} disabled />
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
              onClick={() => setCheckSourceConnection(!checkSourceConnection)}
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
            <input type="text" value={targetConnectionName} disabled />
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
            <button className="submit__btn" onClick={checkTargetDbConnection}>
              Submit
            </button>
          </div>
        </div>
      ) : null}

      <form className="form" onSubmit={handleJob}>
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
            data-title="Delta Configuration"
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
                  value={sourceConnectionName}
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
                  value={targetConnectionName}
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
            {sourceConnectionName.length > 0 &&
            targetConnectionName.length > 0 ? (
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
              <h1>{sourceConnectionName}</h1>
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
                    {sourceSchemaList.map((db) => (
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
              <h1>{targetConnectionName}</h1>
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
                    {targetSchemaList.map((db) => (
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
              <h1>{sourceConnectionName}</h1>
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
              <h1>{targetConnectionName}</h1>
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
          <Button
            onClick={() => {
              setAutoMappingColumn(true);
              setTargetColumn(sourceColumn);
            }}
          >
            Auto Mapping
          </Button>
          <div>
            <DragDropContext onDragEnd={onDragEnd}>
              <div>
                <div>
                  <OdmDrager
                    sourcetable={sourceTable}
                    targetTable={targetTable}
                    todos={sourceColumn}
                    setTodos={setSourceColumn}
                    completedTodos={targetColumn}
                    setCompletedTodos={setTargetColumn}
                    dropValue={isdrop}
                    setDropValue={setIsDrop}
                    truncateValue={isTruncate}
                    setTruncateValue={setIsTruncate}
                    upsertValue={isUpsert}
                    setupsertValue={setIsUpsert}
                    upsertKey={upsertKey}
                    setUpsertKey={setUpsertKey}
                    primaryKey={primaryKey}
                    setPrimaryKey={setPrimaryKey}
                    dataTypes={datatypes}
                    columnRules={columnRules}
                    sourceColumnList={sourceColumnList}
                    autoMapping={autoMappingColumn}
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
        {/* **************************  <-- delta configuration -->  ********************************************************************/}

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
                <div className="target__table">
                  <FormControl sx={{ width: "100%" }} variant="standard">
                    <NativeSelect
                      id="demo-customized-select-native"
                      value={deltaFlow}
                      onChange={(e) => setDeltaFlow(e.target.value)}
                      input={<BootstrapInput />}
                    >
                      <option aria-label="None" value="">
                        choose type
                      </option>
                      <option aria-label="None" value="one_time">
                        one Time
                      </option>
                      <option aria-label="None" value="incremental">
                        Incremental
                      </option>
                    </NativeSelect>
                  </FormControl>
                </div>
              </div>
              <div className="delta__field">
                <span>Delta column</span>
                <div className="target__table">
                  <FormControl sx={{ width: "100%" }} variant="standard">
                    {/* <InputLabel htmlFor="demo-customized-select-native">Age</InputLabel> */}
                    <NativeSelect
                      id="demo-customized-select-native"
                      value={delataColumn}
                      onChange={(e) => setdelataColumn(e.target.value)}
                      input={<BootstrapInput />}
                    >
                      <option aria-label="None" value="">
                        choose option
                      </option>
                      {sourceColumnList.map((column) => {
                        return (
                          <option aria-label="None" value={column.name}>
                            {column.name}
                          </option>
                        );
                      })}
                    </NativeSelect>
                  </FormControl>
                </div>
              </div>
              <div className="delta__field">
                <span>Delta Type</span>
                <div className="target__table">
                  <FormControl sx={{ width: "100%" }} variant="standard">
                    <NativeSelect
                      id="demo-customized-select-native"
                      value={deltaType}
                      onChange={(e) => setDeltaType(e.target.value)}
                      input={<BootstrapInput />}
                    >
                      <option aria-label="None" value="">
                        choose datatypes
                      </option>
                      {datatypes.map((column) => {
                        return (
                          <option aria-label="None" value={column}>
                            {column}
                          </option>
                        );
                      })}
                    </NativeSelect>
                  </FormControl>
                </div>
              </div>
              <div className="delta__field">
                <span>From Value </span>
                <div className="target__table">
                  <FormControl sx={{ width: "100%" }} variant="standard">
                    <OutlinedInput
                      value={fromValue}
                      onChange={(e) => setFromValue(e.target.value)}
                      style={{ width: "100%", backgroundColor: "transparent" }}
                      placeholder="Please enter text"
                    />
                  </FormControl>
                </div>
              </div>
              <div className="delta__field">
                <span>from operator</span>
                <div className="target__table">
                  <FormControl sx={{ width: "100%" }} variant="standard">
                    {/* <InputLabel htmlFor="demo-customized-select-native">Age</InputLabel> */}
                    <NativeSelect
                      id="demo-customized-select-native"
                      value={fromOperator}
                      onChange={(e) => setFromOperator(e.target.value)}
                      input={<BootstrapInput />}
                    >
                      <option aria-label="None" value="">
                        choose operater
                      </option>
                      <option aria-label="None" value=">">
                        greater than
                      </option>
                      <option aria-label="None" value=">=">
                        greater than equal
                      </option>
                      <option aria-label="None" value="<">
                        less than
                      </option>
                      <option aria-label="None" value="<=">
                        less than equal
                      </option>
                    </NativeSelect>
                  </FormControl>
                </div>
              </div>
              <div className="delta__field">
                <span>To Value </span>
                <div className="target__table">
                  <FormControl sx={{ width: "100%" }} variant="standard">
                    <OutlinedInput
                      value={toValue}
                      onChange={(e) => setToValues(e.target.value)}
                      style={{ width: "100%", backgroundColor: "transparent" }}
                      placeholder="Please enter text"
                    />
                  </FormControl>
                </div>
              </div>
              <div className="delta__field">
                <span>To operator</span>
                <div className="target__table">
                  <FormControl sx={{ width: "100%" }} variant="standard">
                    {/* <InputLabel htmlFor="demo-customized-select-native">Age</InputLabel> */}
                    <NativeSelect
                      id="demo-customized-select-native"
                      value={toOperator}
                      onChange={(e) => setToOperator(e.target.value)}
                      input={<BootstrapInput />}
                    >
                      <option aria-label="None" value="">
                        choose operater
                      </option>
                      <option aria-label="None" value=">">
                        greater than
                      </option>
                      <option aria-label="None" value=">=">
                        greater than equal
                      </option>
                      <option aria-label="None" value="<">
                        less than
                      </option>
                      <option aria-label="None" value="<=">
                        less than equal
                      </option>
                    </NativeSelect>
                  </FormControl>
                </div>
              </div>
              <div className="delta__field">
                <span>Last Executed Values </span>

                <div className="target__table">
                  <FormControl sx={{ width: "100%" }} variant="standard">
                    <OutlinedInput
                      value={lastExtractedValues}
                      onChange={(e) => setLastExtractedValues(e.target.value)}
                      placeholder="Please enter text"
                    />
                  </FormControl>
                </div>
              </div>
              <div className="delta__field">
                <span>Execution Start </span>
                <div className="target__table">
                  <FormControl sx={{ width: "100%" }} variant="standard">
                    <OutlinedInput
                      value={executionStartTimestamp}
                      onChange={(e) =>
                        setExecutionStartTimestamp(e.target.value)
                      }
                      style={{ width: "100%", backgroundColor: "transparent" }}
                      placeholder="Please enter text"
                    />
                  </FormControl>
                </div>
              </div>
              <div className="delta__field">
                <span>Execution End </span>
                <div className="target__table">
                  <FormControl sx={{ width: "100%" }} variant="standard">
                    <OutlinedInput
                      value={executionEndTimestamp}
                      onChange={(e) => setExecutionEndTimestamp(e.target.value)}
                      style={{ width: "100%", backgroundColor: "transparent" }}
                      placeholder="Please enter text"
                    />
                  </FormControl>
                </div>
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
        {/* *************************  <-- Task Information -->  ******************************************************************/}

        <div
          className={
            "form-step " + (formStepsNu === 5 ? "form-step-active" : "")
          }
        >
          <div className="delta__field">
            <span>Task Name </span>
            <div className="target__table">
              <FormControl sx={{ width: "100%" }} variant="standard">
                <OutlinedInput
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  style={{ width: "100%", backgroundColor: "transparent" }}
                  placeholder="Please enter text"
                />
              </FormControl>
            </div>
          </div>
          <div className="delta__field">
            <span>Query Expression</span>
            <div className="target__table">
              <FormControl sx={{ width: "100%" }} variant="standard">
                <OutlinedInput
                  value={queryExpression}
                  onChange={(e) => setQueryExpression(e.target.value)}
                  style={{ width: "100%", backgroundColor: "transparent" }}
                  placeholder="Please enter text"
                />
              </FormControl>
            </div>
          </div>

          <div className="delta__field">
            <span>Status </span>
            <div className="target__table">
              <div>
                <FormControl component="fieldset" className="mw-120">
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      value="Drop"
                      control={
                        <Checkbox
                          size="small"
                          // value={dropValue}
                          // onChange={(e) => {
                          //   setDropValue(e.target.checked);
                          //   console.log(e.target.checked);
                          // }}
                        />
                      }
                      label="Drop"
                      labelPlacement="top"
                    />
                  </FormGroup>
                </FormControl>
              </div>
            </div>
          </div>

          {/* <div>
            <button onClick={handleJob}>submit job</button>
          </div> */}

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
