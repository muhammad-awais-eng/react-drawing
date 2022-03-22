import React, { useEffect, useState } from "react";
import axios from "axios";
import OdmForm from "../odm/OdmForm";
import "./treefile.css";
import LineTo from "react-lineto";
import Xarrow from "react-xarrows";
import { SteppedLineTo } from "react-lineto";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import NativeSelect from "@mui/material/NativeSelect";
import { useXarrow, Xwrapper } from "react-xarrows";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  TextField,
  Box,
  MenuItem,
  Typography,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
  Modal,
  Checkbox,
  FormGroup,
  FormLabel,
  Select,
  FormControlLabel,
  AccordionSummary,
  Accordion,
  AccordionDetails,
  AlertTitle,
  Alert,
  Snackbar,
} from "@mui/material/";
import { margin } from "@mui/system";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function TreeFile() {
  const updateXarrow = useXarrow();
  const [isGroupJobOpen, setIsGroupJobOpen] = useState(false);
  const [isIndividualJobOpen, setIsIndividualJobOpen] = useState(false);
  const [jobIndex, setJobIndex] = useState(0);
  const [jobType, setJobTypes] = useState("");

  const [jobToRun, setJobToRun] = useState("");

  const [addJobMode, setAddJobMode] = useState(false);
  const [ShowDetails, setShowDetails] = useState(true);

  const [editJobDetail, setEditJobDetail] = useState(false);
  const [editColumDetail, setEditColumnDetail] = useState(false);
  const [editDeltaConfigurationDetail, setEditDeltaConfigurationDetail] =
    useState(false);

  const [taskMapperEngine, setTaskMapperEngine] = useState([]);
  const [groupSingleJob, setGroupSingleJob] = useState([]);
  const [individualSingleJob, setIndividualSingleJob] = useState([]);

  const [taskName, setTaskName] = useState("");
  const [sourceDBName, setSourceDBName] = useState("");
  const [targetDBName, setTargetDBName] = useState("");

  const [sourceSchemaName, setSourceSchemaName] = useState("");
  const [targetSchemaName, setTargetSchemaName] = useState("");

  const [dbData, setDbData] = useState();

  const [entiityName, setEntityName] = useState("");
  const [queryExpression, setQueryExpression] = useState("");
  const [isDrop, setIsDrop] = useState(false);
  const [isTruncate, setIsTruncate] = useState(false);
  const [isUpsert, setIsUpsert] = useState(false);
  const [upsertKey, setUpsetKey] = useState("");
  const [primaryKey, setPrimaryKey] = useState("");

  const [sourceConnectionUpdate, setsourceConnectionUpdate] = useState({
    connectionName: "",
    password: "",
  });
  const [targetConnectionUpdate, settargetConnectionUpdate] = useState({
    connectionName: "",
    password: "",
  });
  const [openSourceConnections, setOpenSourceConnections] = useState(false);
  const [openTargetConnections, setOpenTargetConnections] = useState(false);
  const [openSourceConnectionCheckModal, setopenSourceConnectionCheckModal] =
    useState(false);
  const [openTargeteConnectionCheckModal, setopenTargetConnectionCheckModal] =
    useState(false);

  const [deltaConfiguration, setDeltaConfiguration] = useState({
    delta_flow: "",
    delta_column: null,
    delta_type: "",
    from_value: "",
    from_operator: "",
    to_value: "",
    to_operator: "",
    last_extracted_values: "",
    execution_start_timestamp: "",
    execution_end_timestamp: "",
  });

  const [columnMapping, setColumnMapping] = useState([]);
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState("");
  const [columnRule, setColumnRule] = useState("");

  const [processConfiguration, setProcessConfiguaration] = useState({
    source_connection: "",
    source_encoded_password: "",
    target_connection: "",
    target_encoded_password: "",
    is_status: false,
  });

  const [SourceConnectionDetail, setSourceConnectionDetail] = useState({
    db_name: "",
    db_password: "",
    db_port: "",
    db_schema: "",
    db_user: "",
    ip_address: "",
    source_name: "",
    source_type: "",
  });

  const [TargetConnectionDetail, setTargetConnectionDetail] = useState({
    db_name: "",
    db_password: "",
    db_port: "",
    db_schema: "",
    db_user: "",
    ip_address: "",
    target_name: "",
    target_type: "",
  });

  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [datatypes, setdataTypes] = React.useState([]);
  const [dbCollection, setDbCollection] = useState([]);

  const [successToast, setSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);

  const [jobsList, setJobList] = useState([]);
  const [jobList, setShowJobsList] = useState(true);

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(jobsList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setJobList(items);

    console.log(items);
  }

  const getDataTypes = async (dbName) => {
    try {
      axios
        .get("v1/list_db_datatypes", {
          params: {
            database_name: targetDBName,
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

  const checkSourceConnection = async (connectionName, password) => {
    try {
      await axios
        .get("/v1/db_connection_check", {
          params: {
            connection_name: connectionName,
            inserted_db_password: password,
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.status === "successful") {
            setProcessConfiguaration({
              ...processConfiguration,
              source_connection: sourceConnectionUpdate["connectionName"],
              source_encoded_password: sourceConnectionUpdate["password"],
            });
            setopenSourceConnectionCheckModal(false);
            setSuccessToast(true);
          } else {
            setErrorToast(true);
          }
        })
        .catch((error) => {
          console.log("error");
        });
    } catch (e) {
      console.log(e);
    }
  };
  const checkTargetConnection = async (connectionName, password) => {
    try {
      await axios
        .get("/v1/db_connection_check", {
          params: {
            connection_name: connectionName,
            inserted_db_password: password,
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.status === "successful") {
            setProcessConfiguaration({
              ...processConfiguration,
              target_connection: targetConnectionUpdate["connectionName"],
              target_encoded_password: targetConnectionUpdate["password"],
            });
            setopenTargetConnectionCheckModal(false);
            setSuccessToast(true);
          } else {
            setErrorToast(true);
          }
        })
        .catch((error) => {
          console.log("error");
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    dbConnectionList();
  }, []);

  const dbConnectionList = async () => {
    setDbData([]);
    setDbCollection([]);
    try {
      await axios
        .get("/v1/list_db_connections", {
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          // setDbData(response.data.result_list);
          console.log(response.data.result_list);
          const data = Object.keys(response.data.result_list);
          data.map((item, index) => {
            setDbCollection((data) => [...data, { id: index, name: item }]);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const handleModalOpen = () => {
    console.log(
      "open",
      processConfiguration["source_connection"],
      processConfiguration["source_encoded_password"],
      sourceSchemaName,
      entiityName
    );
    try {
      axios
        .get("/v1/list_entity_column", {
          params: {
            connection_name: processConfiguration["source_connection"],
            inserted_db_password:
              processConfiguration["source_encoded_password"],
            schema_name: sourceSchemaName,
            entity_name: entiityName,
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log(response.data.entities_metadata, "entity column");
          const data = response.data.entities_metadata;

          //  data.map((item, index) => {
          //    console.log(item);
          //    setSourceColumn((data) => [
          //      ...data,
          //      {
          //        id: index,
          //        name: item,
          //        datatypes: "",
          //        rulesEngine: {
          //          rule: "",
          //        },
          //      },
          //    ]);
          //    setSourceColumnList((data) => [
          //      ...data,
          //      {
          //        id: index,
          //        name: item,
          //        datatypes: "",
          //        rulesEngine: {
          //          rule: "",
          //        },
          //      },
          //    ]);
          //  });

          //   setSourceColumn(response.data.entities_metadata);
        })
        .catch((error) => {
          console.log(error);
          // alert("please check your credientials");
          //   setSuccessMessage(true);
        });
    } catch (e) {
      console.log(e);
    }

    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    try {
      axios
        .get("/v1/list_task_mappings", {
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log(typeof response.data, response.data);
          setTaskMapperEngine(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }

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
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const loadGroupJob = (index) => {
    console.log(index);
    setJobIndex(index);
    setIsGroupJobOpen(true);
    setIsIndividualJobOpen(false);
    const data = taskMapperEngine["process_groups"]["landings"][index];
    setJobToRun(data);
    setTaskName(data["task_name"]);
    setSourceDBName(data["source_database_name"]);
    setTargetDBName(data["target_database_name"]);
    setSourceSchemaName(data["source_schema_name"]);
    setTargetSchemaName(data["target_schema_name"]);
    setEntityName(data["entity_name"]);
    setQueryExpression(data["query_expression"]);
    setIsDrop(data["drop_p"]);
    setIsTruncate(data["truncate_p"]);
    setIsUpsert(data["upsert_p"]);
    setUpsetKey(data["upsert_key"]);
    setPrimaryKey(data["primary_key"]);
    setDeltaConfiguration(data["delta_configurations"]);

    setColumnMapping(data["column_mapping"]);

    setProcessConfiguaration(data["process_configurations"]);
    setGroupSingleJob(data);
  };

  const loadIndividualJob = (index) => {
    console.log(index);
    setJobIndex(index);
    setIsGroupJobOpen(false);
    setIsIndividualJobOpen(true);
    const data = taskMapperEngine["process_individuals"][index];
    setJobToRun(data);
    setTaskName(data["task_name"]);
    setSourceDBName(data["source_database_name"]);
    setTargetDBName(data["target_database_name"]);
    setSourceSchemaName(data["source_schema_name"]);
    setTargetSchemaName(data["target_schema_name"]);
    setEntityName(data["entity_name"]);
    setQueryExpression(data["query_expression"]);
    setIsDrop(data["drop_p"]);
    setIsTruncate(data["truncate_p"]);
    setIsUpsert(data["upsert_p"]);
    setUpsetKey(data["upsert_key"]);
    setPrimaryKey(data["primary_key"]);
    setDeltaConfiguration(data["delta_configurations"]);

    setColumnMapping(data["column_mapping"]);

    setProcessConfiguaration(data["process_configurations"]);
  };

  const LoadProcessConnectionDetails = async (e) => {
    e.preventDefault();
    const sourceConnection = processConfiguration["source_connection"];
    const targetConnection = processConfiguration["target_connection"];

    const sourcedata = dbData[sourceConnection];
    const targetdata = dbData[targetConnection];

    setSourceConnectionDetail({
      db_name: sourcedata["db_name"],
      db_password: sourcedata["db_password"],
      db_port: sourcedata["db_port"],
      db_schema: sourcedata["db_schema"],
      db_user: sourcedata["db_user"],
      ip_address: sourcedata["ip_address"],
      source_name: sourcedata["source_name"],
      source_type: sourcedata["source_type"],
    });

    setTargetConnectionDetail({
      db_name: targetdata["db_name"],
      db_password: targetdata["db_password"],
      db_port: targetdata["db_port"],
      db_schema: targetdata["db_schema"],
      db_user: targetdata["db_user"],
      ip_address: targetdata["ip_address"],
      source_name: targetdata["source_name"],
      source_type: targetdata["source_type"],
    });
    console.log(sourceConnection, targetConnection);
  };

  const upDateJobDetails = async (e) => {
    let temp_state = taskMapperEngine;
    let temp_element;
    console.log(isGroupJobOpen);
    if (isGroupJobOpen) {
      temp_element = {
        ...temp_state["process_groups"]["landings"][jobIndex],
      };
      temp_element["primary_key"] = primaryKey;
      temp_element["upsert_key"] = upsertKey;
      temp_element["query_expression"] = queryExpression;

      temp_state["process_groups"]["landings"][jobIndex] = temp_element;
    } else {
      temp_element = { ...temp_state["process_individuals"][jobIndex] };

      temp_element["primary_key"] = primaryKey;
      temp_element["upsert_key"] = upsertKey;
      temp_element["query_expression"] = queryExpression;
      temp_state["process_individuals"][jobIndex] = temp_element;
    }

    console.log(temp_state);
    try {
      axios
        .post("/v1/tasks_mapper_engine", temp_state, {
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

  const updateDeltaConfiguration = async (e) => {
    let temp_state = taskMapperEngine;
    let temp_element;
    console.log(isGroupJobOpen);
    if (isGroupJobOpen) {
      temp_element = {
        ...temp_state["process_groups"]["landings"][jobIndex],
      };
      temp_element["delta_configurations"] = deltaConfiguration;
      temp_state["process_groups"]["landings"][jobIndex] = temp_element;
    } else {
      temp_element = { ...temp_state["process_individuals"][jobIndex] };
      temp_element["delta_configurations"] = deltaConfiguration;
      temp_state["process_individuals"][jobIndex] = temp_element;
    }

    console.log(temp_state);
    try {
      axios
        .post("/v1/tasks_mapper_engine", temp_state, {
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

  const handleUpdateProcessConfiguration = async (e) => {
    console.log(processConfiguration);
    let temp_state = taskMapperEngine;
    let temp_element;
    console.log(isGroupJobOpen);
    if (isGroupJobOpen) {
      temp_element = {
        ...temp_state["process_groups"]["landings"][jobIndex],
      };
      temp_element["process_configurations"] = processConfiguration;
      temp_state["process_groups"]["landings"][jobIndex] = temp_element;
    } else {
      temp_element = { ...temp_state["process_individuals"][jobIndex] };
      temp_element["process_configurations"] = processConfiguration;
      temp_state["process_individuals"][jobIndex] = temp_element;
    }

    console.log(temp_state);
    try {
      axios
        .post("/v1/tasks_mapper_engine", temp_state, {
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

  const runJob = async (e) => {
    const body = {
      process_individuals: [jobToRun],
    };
    console.log(body);
    try {
      await axios
        .post("/v1/task_execution_engine", body, {
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log("success post", response);
        })
        .catch((error) => {
          console.log("error");
        });
    } catch (e) {
      console.log(e);
    }
  };

  const RunGroupJob = async (e) => {
    e.preventDefault();
    console.log(taskMapperEngine["process_groups"]["landings"]);
    console.log(jobsList, "job list");
  };
  return (
    <div className="main__tree__container">
      <div className="left__container">
        {" "}
        <TreeView
          aria-label="multi-select"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          multiSelect
          sx={{ height: 516, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
        >
          <TreeItem nodeId="1" label="Folder">
            <TreeItem nodeId="2" label="Packages">
              <TreeItem
                nodeId="3"
                label="Landing"
                onClick={() => {
                  setJobList([]);
                  taskMapperEngine["process_groups"]["landings"]?.map(
                    (item, index) => {
                      setJobList((prev) => [
                        ...prev,
                        {
                          id: index,
                          taskName: item.task_name,
                        },
                      ]);
                    }
                  );

                  setShowJobsList(true);
                }}
              >
                <button
                  onClick={() => {
                    setJobTypes("group");
                    setAddJobMode(true);
                  }}
                >
                  Add new job
                </button>{" "}
                {taskMapperEngine["process_groups"] &&
                  taskMapperEngine["process_groups"]["landings"]?.map(
                    (item, idx) => {
                      return (
                        <TreeItem
                          onClick={() => {
                            setShowJobsList(false);
                            setAddJobMode(false);
                            loadGroupJob(idx);
                          }}
                          key={idx}
                          nodeId={(Math.random() * 1000)
                            .toString(36)
                            .substring(7)}
                          label={item.task_name}
                        />
                      );
                    }
                  )}
              </TreeItem>
            </TreeItem>
            <TreeItem nodeId="4" label="Mapping">
              <button
                onClick={() => {
                  setJobTypes("individual");
                  setAddJobMode(true);
                }}
              >
                Add new job
              </button>{" "}
              {taskMapperEngine["process_individuals"] &&
                taskMapperEngine["process_individuals"].map((item, idx) => {
                  return (
                    <TreeItem
                      onClick={() => {
                        setShowJobsList(false);
                        setAddJobMode(false);
                        loadIndividualJob(idx);
                      }}
                      key={idx}
                      nodeId={(Math.random() * 9000).toString(36).substring(7)}
                      label={item.task_name}
                    />
                  );
                })}
            </TreeItem>
          </TreeItem>
        </TreeView>
      </div>
      <div className="right__container">
        {addJobMode ? (
          <div>
            <OdmForm jobType={jobType} groupName="" />
          </div>
        ) : (
          <>
            {jobList ? (
              <div style={{ width: "100%" }}>
                <div style={{ marginLeft: "auto" }}>
                  <Button onClick={RunGroupJob}>Play</Button>
                </div>
                <div
                  style={{
                    width: "50%",
                    textAlign: "center",
                    justifyContent: "center",
                    margin: "auto",
                  }}
                >
                  <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="characters">
                      {(provided) => (
                        <ul
                          className="characters"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {jobsList.map(({ id, taskName }, index) => {
                            return (
                              <Draggable
                                key={id}
                                draggableId={id.toString()}
                                index={index}
                              >
                                {(provided) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div className="characters-thumb">
                                      {/* <img src={thumb} alt={`${taskName} Thumb`} /> */}
                                    </div>
                                    <p>{taskName}</p>
                                  </li>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            ) : (
              <div className="right__container__detail">
                <Box
                  width="100%"
                  component="form"
                  alignItems="center"
                  mx="auto"
                  sx={{
                    width: { xl: "100%", lg: 980, md: 650, sm: 550, xs: 420 },
                    px: 3,
                    borderRadius: 3,
                    height: "38vh",
                    overflowY: "auto",
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h4" py={0}>
                      {taskName}
                    </Typography>
                    <Button onClick={runJob} size="small" variant="contained">
                      Run Job
                    </Button>
                  </Box>
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <div style={{ width: "100%" }}>
                      <Box
                        width="100%"
                        component="form"
                        margin={2}
                        alignItems="center"
                        justifyContent={["center"]}
                        mx="auto"
                        sx={{
                          width: {
                            xl: "20%",
                            lg: 980,
                            md: 650,
                            sm: 550,
                            xs: 420,
                          },
                          m: 0,
                        }}
                      >
                        <Modal
                          open={open}
                          onClose={handleModalClose}
                          aria-labelledby="parent-modal-title"
                          aria-describedby="parent-modal-description"
                        >
                          <Box sx={{ ...style, width: 400 }}>
                            <h2 id="parent-modal-title">Add Column</h2>
                            <Box sx={{ p: 5 }}>
                              <TextField
                                sx={{
                                  width: "100%",
                                  m: 0,
                                }}
                                required
                                select
                                id="Column_Name"
                                label="Select Column"
                                // value={database}
                                // onChange={handleChange}
                                helperText="Please select Column"
                              >
                                {/* {sourceNameList.map((option, index) => {
                        return (
                          <MenuItem key={index} value={option.value}>
                            {option.label}
                          </MenuItem>
                        );
                      })} */}
                              </TextField>
                              <TextField
                                sx={{
                                  width: "100%",
                                  m: 0,
                                }}
                                required
                                select
                                id="data_type"
                                label="Select DataType"
                                // value={database}
                                // onChange={handleChange}
                                helperText="Please select DataType"
                              >
                                {/* {sourceNameList.map((option, index) => {
                        return (
                          <MenuItem key={index} value={option.value}>
                            {option.label}
                          </MenuItem>
                        );
                      })} */}
                              </TextField>

                              <TextField
                                sx={{
                                  width: "100%",
                                  my: 2,
                                }}
                                required
                                id="rule_engine"
                                label="Rule Engine"
                                autoComplete="false"
                              />
                            </Box>
                          </Box>
                        </Modal>
                        <Box>
                          <Typography variant="h6" m={0}>
                            Source Column
                            <IconButton onClick={handleModalOpen}>
                              <AddIcon />
                            </IconButton>
                          </Typography>
                        </Box>

                        <List
                          sx={{
                            width: "100%",
                            minWidth: 200,
                            bgcolor: "background.paper",
                            position: "relative",
                            overflow: "auto",
                            maxHeight: 180,
                            padding: 1,
                            zIndex: 999,
                            border: "1px solid #ddd",
                            "& ul": { padding: 0 },
                          }}
                        >
                          {columnMapping.length > 0 ? (
                            columnMapping.map((column) => (
                              <div
                                style={{ width: "100%" }}
                                id={column.source_column_name}
                                className={column.source_column_name}
                              >
                                <ListItemText
                                  onClick={() => {
                                    setColumnName(column.source_column_name);
                                    setColumnType(column.data_type);
                                    setColumnRule(
                                      Object.keys(column["rules_engine"])
                                        .length !== 0
                                        ? column["rules_engine"]["rule"]
                                        : ""
                                    );

                                    console.log(
                                      Object.keys(column["rules_engine"])
                                        .length !== 0
                                        ? column["rules_engine"]["rule"]
                                        : "no"
                                    );
                                    setShowDetails(!ShowDetails);
                                  }}
                                  sx={{
                                    cursor: "pointer",
                                  }}
                                  primary={` ${column.source_column_name}`}
                                />
                              </div>
                            ))
                          ) : (
                            <ListItemText
                              sx={{
                                minHeight: 180,
                              }}
                              primary={`No row found`}
                            />
                          )}
                        </List>
                      </Box>
                    </div>
                    <div style={{ width: "100%" }}>
                      <Box
                        width="100%"
                        component="form"
                        margin={2}
                        alignItems="center"
                        justifyContent={["center"]}
                        mx="auto"
                        sx={{
                          width: {
                            xl: "20%",
                            lg: 980,
                            md: 650,
                            sm: 550,
                            xs: 420,
                          },
                          m: 0,
                        }}
                      >
                        <Modal
                          open={open}
                          onClose={handleModalClose}
                          aria-labelledby="parent-modal-title"
                          aria-describedby="parent-modal-description"
                        >
                          <Box sx={{ ...style, width: 400 }}>
                            <h2 id="parent-modal-title">Add Column</h2>
                            <Box sx={{ p: 5 }}>
                              <TextField
                                sx={{
                                  width: "100%",
                                  m: 0,
                                }}
                                required
                                select
                                id="Column_Name"
                                label="Select Column"
                                // value={database}
                                // onChange={handleChange}
                                helperText="Please select Column"
                              >
                                {/* {sourceNameList.map((option, index) => {
                        return (
                          <MenuItem key={index} value={option.value}>
                            {option.label}
                          </MenuItem>
                        );
                      })} */}
                              </TextField>
                              <TextField
                                sx={{
                                  width: "100%",
                                  m: 0,
                                }}
                                required
                                select
                                id="data_type"
                                label="Select DataType"
                                // value={database}
                                // onChange={handleChange}
                                helperText="Please select DataType"
                              >
                                {/* {sourceNameList.map((option, index) => {
                        return (
                          <MenuItem key={index} value={option.value}>
                            {option.label}
                          </MenuItem>
                        );
                      })} */}
                              </TextField>

                              <TextField
                                sx={{
                                  width: "100%",
                                  my: 2,
                                }}
                                required
                                id="rule_engine"
                                label="Rule Engine"
                                autoComplete="false"
                              />
                            </Box>
                          </Box>
                        </Modal>
                        <Box>
                          <Typography variant="h6" m={0}>
                            Target Columns
                            <IconButton onClick={handleModalOpen}>
                              <AddIcon />
                            </IconButton>
                          </Typography>
                        </Box>

                        <List
                          sx={{
                            width: "100%",
                            minWidth: 200,
                            bgcolor: "background.paper",
                            position: "relative",
                            overflow: "auto",
                            maxHeight: 180,
                            padding: 1,
                            border: "1px solid #ddd",
                            zIndex: 999,
                            "& ul": { padding: 0 },
                          }}
                        >
                          {columnMapping.length > 0 ? (
                            columnMapping.map((column) => (
                              <>
                                <div
                                  id={column.target_column_name}
                                  className={column.target_column_name}
                                >
                                  <ListItemText
                                    onClick={() => {
                                      setColumnName(column.source_column_name);
                                      setColumnType(column.data_type);
                                      setColumnRule(
                                        Object.keys(column["rules_engine"])
                                          .length !== 0
                                          ? column["rules_engine"]["rule"]
                                          : ""
                                      );

                                      console.log(
                                        Object.keys(column["rules_engine"])
                                          .length !== 0
                                          ? column["rules_engine"]["rule"]
                                          : "no"
                                      );
                                      setShowDetails(!ShowDetails);
                                    }}
                                    sx={{
                                      cursor: "pointer",
                                    }}
                                    primary={` ${column.source_column_name}`}
                                  />
                                </div>
                              </>
                            ))
                          ) : (
                            <ListItemText
                              sx={{
                                minHeight: 180,
                              }}
                              primary={`No row found`}
                            />
                          )}
                        </List>
                      </Box>
                    </div>
                    <div>
                      {columnMapping?.map((column, index) => {
                        if (index < 5) {
                          return (
                            <Xarrow
                              start={column.source_column_name}
                              end={column.target_column_name}
                              showHead={false}
                              path={"smooth"}
                              tailSize={1}
                              strokeWidth={2}
                              animation={true}
                              dashed={true}
                              lineColor={"#bbb"}
                              headColor={"#bbb"}
                            />
                          );
                        }
                      })}
                    </div>
                  </div>
                </Box>
                {/*                                                                                          bottom  container */}
                <Box
                  width="100%"
                  component="form"
                  margin={5}
                  alignItems="center"
                  mx="auto"
                  sx={{
                    width: { xl: "100%", lg: 980, md: 650, sm: 550, xs: 420 },
                    m: 2,
                    boxShadow: 5,
                    height: "54vh",
                    overflowY: "auto",
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <Box
                    sx={{
                      flexGrow: 1,
                      bgcolor: "background.paper",
                      display: "flex",
                      height: "100%",
                      m: 0.2,
                    }}
                  >
                    <Tabs
                      orientation="vertical"
                      variant="scrollable"
                      value={value}
                      onChange={handleChange}
                      aria-label="Vertical tabs example"
                      sx={{
                        borderRight: 1,
                        borderColor: "divider",
                        maxWidth: "25%",
                        border: "1px solid #ddd",
                      }}
                    >
                      <Tab
                        sx={{
                          borderColor: "divider",
                          border: "1px solid #ddd",
                        }}
                        label="Details"
                        {...a11yProps(0)}
                      />
                      <Tab
                        sx={{
                          borderColor: "divider",
                          border: "1px solid #ddd",
                        }}
                        label="Data Types"
                        {...a11yProps(1)}
                      />
                      <Tab
                        onClick={() =>
                          getDataTypes(TargetConnectionDetail["db_name"])
                        }
                        sx={{
                          borderColor: "divider",
                          border: "1px solid #ddd",
                        }}
                        label="Delta Configuration"
                        {...a11yProps(2)}
                      />
                      <Tab
                        onClick={LoadProcessConnectionDetails}
                        sx={{
                          borderColor: "divider",
                          border: "1px solid #ddd",
                        }}
                        label="Process Configuration"
                        {...a11yProps(3)}
                      />
                    </Tabs>
                    <TabPanel
                      value={value}
                      index={0}
                      style={{
                        width: "100%",
                      }}
                    >
                      {ShowDetails ? (
                        <Box
                          sx={{
                            width: "100%",
                            boxsizing: "border-box",
                          }}
                        >
                          <Box
                            sx={{
                              width: "100%",
                              backgroundColor: "#F5F5F5",
                              px: 1,
                            }}
                          >
                            <FormControlLabel
                              control={<Checkbox />}
                              label="Is Drop"
                              labelPlacement="start"
                              checked={isDrop === 1 ? true : false}
                              value={isDrop}
                              onChange={(e) => setIsDrop(e.target.checked)}
                            />
                            <FormControlLabel
                              sx={{
                                px: 5,
                              }}
                              control={<Checkbox />}
                              label="Truncate"
                              labelPlacement="start"
                              checked={isTruncate === 1 ? true : false}
                              value={isTruncate}
                              onChange={(e) => setIsTruncate(e.target.checked)}
                            />
                            <FormControlLabel
                              control={<Checkbox />}
                              label="Is Upsrt"
                              labelPlacement="start"
                              checked={isUpsert === 1 ? true : false}
                              value={isUpsert}
                              onChange={(e) => setIsUpsert(e.target.checked)}
                            />
                          </Box>
                          <Box
                            sx={{
                              width: "100%",
                              alignItems: "center",
                              textAlign: "center",
                              my: 3,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              {!editJobDetail ? (
                                <Button
                                  onClick={() =>
                                    setEditJobDetail(!editJobDetail)
                                  }
                                  size="small"
                                  variant="contained"
                                  sx={{ m: 1 }}
                                >
                                  Edit
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => {
                                    upDateJobDetails();
                                    // setEditJobDetail(!editJobDetail);
                                  }}
                                  size="small"
                                  variant="contained"
                                  sx={{ m: 1 }}
                                >
                                  Save
                                </Button>
                              )}
                            </Box>
                            {!editJobDetail ? (
                              <Box>
                                <Box
                                  sx={{
                                    width: {
                                      xl: "35%",
                                      lg: "50%",
                                      md: "100%",
                                      sm: "100%",
                                      xs: "100%",
                                    },
                                    m: 2,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    border: "1px solid #E0E0E0",
                                    height: "50px",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      borderRight: "1px solid #E0E0E0",
                                      px: 1,
                                      py: 1.7,
                                      width: "35%",
                                      fontweight: "bold",
                                      borderRadius: "5px",
                                    }}
                                    py={0}
                                  >
                                    Primary Key
                                  </Typography>
                                  <Typography
                                    sx={{
                                      px: 2,
                                      alignItems: "center",
                                      alignSelf: "center",
                                      width: "48%",
                                    }}
                                    py={0}
                                  >
                                    {" "}
                                    {primaryKey}
                                  </Typography>
                                  <IconButton
                                    sx={{
                                      width: "10%",
                                    }}
                                    onClick={handleModalOpen}
                                  >
                                    <EditIcon sx={{ fontSize: 17 }} />
                                  </IconButton>
                                </Box>
                                <Box
                                  sx={{
                                    width: {
                                      xl: "35%",
                                      lg: "50%",
                                      md: "100%",
                                      sm: "100%",
                                      xs: "100%",
                                    },
                                    m: 2,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    border: "1px solid #E0E0E0",
                                    height: "50px",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      borderRight: "1px solid #E0E0E0",
                                      px: 1,
                                      py: 1.7,
                                      width: "35%",
                                      fontweight: "bold",
                                      borderRadius: "5px",
                                    }}
                                    py={0}
                                  >
                                    Upsert Key
                                  </Typography>
                                  <Typography
                                    sx={{
                                      px: 2,
                                      alignItems: "center",
                                      alignSelf: "center",
                                      width: "48%",
                                    }}
                                    py={0}
                                  >
                                    {" "}
                                    {upsertKey}
                                  </Typography>
                                  <IconButton
                                    sx={{
                                      width: "10%",
                                    }}
                                    onClick={handleModalOpen}
                                  >
                                    <EditIcon sx={{ fontSize: 17 }} />
                                  </IconButton>
                                </Box>
                                <Box
                                  sx={{
                                    width: {
                                      xl: "35%",
                                      lg: "50%",
                                      md: "100%",
                                      sm: "100%",
                                      xs: "100%",
                                    },
                                    m: 2,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    border: "1px solid #E0E0E0",
                                    height: "80px",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      borderRight: "1px solid #E0E0E0",
                                      px: 1,
                                      py: 1.7,
                                      width: "35%",
                                      fontweight: "bold",
                                      borderRadius: "5px",
                                    }}
                                    py={0}
                                  >
                                    Query Expression
                                  </Typography>
                                  <Typography
                                    sx={{
                                      px: 2,
                                      alignItems: "center",
                                      alignSelf: "center",
                                      width: "48%",
                                    }}
                                    py={0}
                                  >
                                    {" "}
                                    {queryExpression}
                                  </Typography>
                                  <IconButton
                                    sx={{
                                      width: "10%",
                                    }}
                                    onClick={handleModalOpen}
                                  >
                                    <EditIcon sx={{ fontSize: 17 }} />
                                  </IconButton>
                                </Box>
                              </Box>
                            ) : (
                              <Box>
                                <FormControl
                                  sx={{
                                    width: "51%",
                                    m: 1,
                                  }}
                                  variant="standard"
                                >
                                  <NativeSelect
                                    id="demo-customized-select-native"
                                    value={primaryKey}
                                    onChange={(event) =>
                                      setPrimaryKey(event.target.value)
                                    }
                                    input={<BootstrapInput />}
                                  >
                                    <option aria-label="None" value="">
                                      choose Primary Key
                                    </option>

                                    {columnMapping.map((el, idx) => {
                                      return (
                                        <option
                                          key={idx}
                                          value={el.source_column_name}
                                        >
                                          {el.source_column_name}
                                        </option>
                                      );
                                    })}
                                  </NativeSelect>
                                </FormControl>
                                <FormControl
                                  sx={{
                                    width: "51%",
                                    m: 1,
                                  }}
                                  variant="standard"
                                >
                                  <NativeSelect
                                    id="demo-customized-select-native"
                                    value={upsertKey}
                                    onChange={(event) =>
                                      setUpsetKey(event.target.value)
                                    }
                                    input={<BootstrapInput />}
                                  >
                                    <option aria-label="None" value="">
                                      choose UpsertKey
                                    </option>

                                    {columnMapping.map((el, idx) => {
                                      return (
                                        <option
                                          key={idx}
                                          value={el.target_column_name}
                                        >
                                          {el.target_column_name}
                                        </option>
                                      );
                                    })}
                                  </NativeSelect>
                                </FormControl>

                                <TextField
                                  sx={{
                                    width: "52%",
                                    m: 0,
                                  }}
                                  id="outlined-multiline-static"
                                  label="Query Expression"
                                  multiline
                                  rows={3}
                                  value={queryExpression}
                                  onChange={(event) =>
                                    setQueryExpression(event.target.value)
                                  }
                                />
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              width: "100%",
                              backgroundColor: "#F5F5F5",
                              px: 5,
                              py: 1,
                            }}
                          >
                            <h5>Column Details</h5>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            {editColumDetail ? (
                              <Button
                                onClick={() =>
                                  setEditColumnDetail(!editColumDetail)
                                }
                                size="small"
                                variant="contained"
                                sx={{ m: 1 }}
                              >
                                Edit
                              </Button>
                            ) : (
                              <Button
                                onClick={() =>
                                  setEditColumnDetail(!editColumDetail)
                                }
                                size="small"
                                variant="contained"
                                sx={{ m: 1 }}
                              >
                                Save
                              </Button>
                            )}
                          </Box>
                          {editColumDetail ? (
                            <Box>
                              <Box
                                sx={{
                                  width: {
                                    xl: "35%",
                                    lg: "50%",
                                    md: "100%",
                                    sm: "100%",
                                    xs: "100%",
                                  },
                                  mx: 5,
                                  my: 2,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  border: "1px solid #E0E0E0",
                                  height: "40px",
                                  borderRadius: "5px",
                                  alignItems: "center",
                                  alignself: "center",
                                  overflow: "hidden",
                                }}
                              >
                                <Typography
                                  sx={{
                                    borderRight: "1px solid #E0E0E0",
                                    px: 1,
                                    py: 1.7,
                                    width: "35%",
                                    fontweight: "bold",
                                    borderRadius: "5px",
                                  }}
                                  py={0}
                                >
                                  Column Name
                                </Typography>
                                <Typography
                                  sx={{
                                    px: 2,
                                    alignItems: "center",
                                    alignSelf: "center",
                                    width: "48%",
                                  }}
                                  py={0}
                                >
                                  {" "}
                                  {columnName}
                                </Typography>
                                <IconButton
                                  sx={{
                                    width: "10%",
                                  }}
                                  // onClick={handleModalOpen}
                                >
                                  <EditIcon sx={{ fontSize: 17 }} />
                                </IconButton>
                              </Box>
                              <Box
                                sx={{
                                  width: {
                                    xl: "35%",
                                    lg: "50%",
                                    md: "100%",
                                    sm: "100%",
                                    xs: "100%",
                                  },
                                  mx: 5,
                                  my: 2,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  border: "1px solid #E0E0E0",
                                  height: "40px",
                                  borderRadius: "5px",
                                  alignItems: "center",
                                  alignself: "center",
                                  overflow: "hidden",
                                }}
                              >
                                <Typography
                                  sx={{
                                    borderRight: "1px solid #E0E0E0",
                                    px: 1,
                                    py: 1.7,
                                    width: "35%",
                                    fontweight: "bold",
                                    borderRadius: "5px",
                                  }}
                                  py={0}
                                >
                                  Data Types
                                </Typography>
                                <Typography
                                  sx={{
                                    px: 2,
                                    alignItems: "center",
                                    alignSelf: "center",
                                    width: "48%",
                                  }}
                                  py={0}
                                >
                                  {" "}
                                  {columnType}
                                </Typography>
                                <IconButton
                                  sx={{
                                    width: "10%",
                                  }}
                                  // onClick={handleModalOpen}
                                >
                                  <EditIcon sx={{ fontSize: 17 }} />
                                </IconButton>
                              </Box>
                              <Box
                                sx={{
                                  width: {
                                    xl: "35%",
                                    lg: "50%",
                                    md: "100%",
                                    sm: "100%",
                                    xs: "100%",
                                  },
                                  mx: 5,
                                  my: 2,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  border: "1px solid #E0E0E0",
                                  height: "40px",
                                  borderRadius: "5px",
                                  alignItems: "center",
                                  alignself: "center",
                                  overflow: "hidden",
                                }}
                              >
                                <Typography
                                  sx={{
                                    borderRight: "1px solid #E0E0E0",
                                    px: 1,
                                    py: 1.7,
                                    width: "35%",
                                    fontweight: "bold",
                                    borderRadius: "5px",
                                  }}
                                  py={0}
                                >
                                  Rule Engine
                                </Typography>
                                <Typography
                                  sx={{
                                    px: 2,
                                    alignItems: "center",
                                    alignSelf: "center",
                                    width: "48%",
                                  }}
                                  py={0}
                                >
                                  {" "}
                                  {columnRule}
                                </Typography>
                                <IconButton
                                  sx={{
                                    width: "10%",
                                  }}
                                  // onClick={handleModalOpen}
                                >
                                  <EditIcon sx={{ fontSize: 17 }} />
                                </IconButton>
                              </Box>
                            </Box>
                          ) : (
                            <Box>
                              <Box
                                sx={{
                                  width: "100%",
                                  alignItems: "center",
                                  textAlign: "center",
                                  my: 3,
                                }}
                              >
                                <TextField
                                  sx={{
                                    width: "70%",
                                    m: 1,
                                  }}
                                  id="outlined-name"
                                  label="Column Name"
                                  value={columnName}
                                  // onChange={handleChange}
                                />

                                <TextField
                                  sx={{
                                    width: "70%",
                                    m: 1,
                                  }}
                                  id="outlined-name"
                                  label="Data Types"
                                  value={columnType}
                                  // onChange={handleChange}
                                />
                              </Box>

                              <Box
                                sx={{
                                  width: "100%",
                                  alignItems: "center",
                                  textAlign: "center",
                                }}
                              >
                                <TextField
                                  sx={{
                                    width: "70%",
                                    m: 0,
                                  }}
                                  id="outlined-multiline-static"
                                  label="Rule Engine"
                                  multiline
                                  rows={4}
                                  value={columnRule}
                                />
                              </Box>
                            </Box>
                          )}
                        </Box>
                      )}
                    </TabPanel>
                    <TabPanel
                      value={value}
                      index={1}
                      style={{
                        width: "100%",
                      }}
                    >
                      Data Types
                    </TabPanel>
                    <TabPanel
                      value={value}
                      index={2}
                      style={{
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          backgroundColor: "#F5F5F5",
                          px: 1,
                          py: 1.4,
                          alignSelf: "center",
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                        }}
                      >
                        <h3>Delta Configuration</h3>
                        {editDeltaConfigurationDetail ? (
                          <Button
                            onClick={() =>
                              setEditDeltaConfigurationDetail(
                                !editDeltaConfigurationDetail
                              )
                            }
                            size="small"
                            variant="contained"
                          >
                            Edit
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              updateDeltaConfiguration();
                              setEditDeltaConfigurationDetail(
                                !editDeltaConfigurationDetail
                              );
                            }}
                            size="small"
                            variant="contained"
                          >
                            Save
                          </Button>
                        )}
                      </Box>
                      {editDeltaConfigurationDetail ? (
                        <Box>
                          <Box
                            sx={{
                              width: "100%",
                              display: "flex",
                              // justifyContent: "space-evenly",
                            }}
                          >
                            <Box
                              sx={{
                                width: "25%",
                                m: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                alignSelf: "center",
                                alignItems: "center",
                                borderRadius: "5px",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  width: "35%",
                                  fontSize: 12,
                                  fontWeight: "bold",
                                  borderRadius: "5px",
                                }}
                                py={0}
                              >
                                Delta Flow
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  alignItems: "center",
                                  alignSelf: "center",
                                  width: "48%",
                                  fontSize: 13,
                                }}
                                py={0}
                              >
                                {" "}
                                {deltaConfiguration["delta_flow"]}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                width: "25%",
                                m: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                alignSelf: "center",
                                alignItems: "center",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  py: 1.7,
                                  width: "35%",
                                  fontSize: 12,
                                  fontWeight: "bold",
                                  borderRadius: "5px",
                                }}
                                py={0}
                              >
                                Delta Type
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  py: 1,
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {" "}
                                {deltaConfiguration["delta_type"]}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                width: "25%",
                                m: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                alignSelf: "center",
                                alignItems: "center",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  py: 1.7,
                                  width: "35%",
                                  fontSize: 12,
                                  fontWeight: "bold",
                                  borderRadius: "5px",
                                }}
                                py={0}
                              >
                                Delta Column
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  py: 1,
                                  width: "48%",
                                  fontSize: 13,
                                }}
                                py={0}
                              >
                                {" "}
                                {deltaConfiguration["delta_column"]}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                            }}
                          >
                            <Box
                              sx={{
                                width: "25%",
                                m: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                alignSelf: "center",
                                alignItems: "center",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  py: 1.7,
                                  width: "35%",
                                  fontSize: 12,
                                  fontWeight: "bold",
                                  borderRadius: "5px",
                                }}
                                py={0}
                              >
                                From Value
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  py: 1,
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {" "}
                                {deltaConfiguration["from_value"]}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                width: "25%",
                                m: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                alignSelf: "center",
                                alignItems: "center",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  py: 1.7,
                                  width: "35%",
                                  fontSize: 12,
                                  fontWeight: "bold",
                                  borderRadius: "5px",
                                }}
                                py={0}
                              >
                                From Operator
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  py: 1,
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {" "}
                                {deltaConfiguration["from_operator"]}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                            }}
                          >
                            <Box
                              sx={{
                                width: "25%",
                                m: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                alignSelf: "center",
                                alignItems: "center",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  py: 1.7,
                                  width: "35%",
                                  fontSize: 12,
                                  fontWeight: "bold",
                                }}
                                py={0}
                              >
                                To Value
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  py: 1,
                                  width: "48%",
                                  ontSize: 12,
                                }}
                                py={0}
                              >
                                {" "}
                                {deltaConfiguration["to_value"]}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                width: "25%",
                                m: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                alignSelf: "center",
                                alignItems: "center",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  py: 1.7,
                                  width: "35%",
                                  fontSize: 12,
                                  fontWeight: "bold",
                                  borderRadius: "5px",
                                }}
                                py={0}
                              >
                                To Operator
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  py: 1,
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {" "}
                                {deltaConfiguration["to_operator"]}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                            }}
                          >
                            <Box
                              sx={{
                                width: "25%",
                                m: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                alignSelf: "center",
                                alignItems: "center",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  py: 1,
                                  width: "35%",
                                  fontSize: 12,
                                  fontWeight: "bold",
                                  borderRadius: "5px",
                                }}
                                py={0}
                              >
                                Last Executed
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  py: 1,
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {" "}
                                {deltaConfiguration["last_extracted_values"]}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                width: "25%",
                                m: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                alignSelf: "center",
                                alignItems: "center",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  py: 1,
                                  width: "35%",
                                  fontSize: 12,
                                  fontWeight: "bold",
                                  borderRadius: "5px",
                                }}
                                py={0}
                              >
                                Execution Start Time
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  py: 1,
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {" "}
                                {
                                  deltaConfiguration[
                                    "execution_start_timestamp"
                                  ]
                                }
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                width: "25%",
                                m: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                alignSelf: "center",
                                alignItems: "center",
                                borderRadius: "5px",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  py: 1,
                                  width: "35%",
                                  fontSize: 12,
                                  fontWeight: "bold",
                                  borderRadius: "5px",
                                }}
                                py={0}
                              >
                                Execution End Time
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  py: 1,
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {" "}
                                {deltaConfiguration["execution_end_timestamp"]}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ) : (
                        <Box>
                          <Box>
                            <FormControl
                              sx={{
                                width: "28%",
                                m: 2,
                              }}
                              variant="standard"
                            >
                              <NativeSelect
                                id="demo-customized-select-native"
                                value={deltaConfiguration["delta_flow"]}
                                onChange={(e) =>
                                  setDeltaConfiguration({
                                    ...deltaConfiguration,
                                    delta_flow: e.target.value,
                                  })
                                }
                                input={<BootstrapInput />}
                              >
                                <option
                                  aria-label="None"
                                  value={deltaConfiguration["delta_flow"]}
                                >
                                  {deltaConfiguration["delta_flow"]}
                                </option>
                                <option aria-label="None" value="one_time">
                                  one Time
                                </option>
                                <option aria-label="None" value="incremental">
                                  Incremental
                                </option>
                              </NativeSelect>
                            </FormControl>

                            {/* <TextField
                          sx={{
                            width: "28%",
                            m: 2,
                          }}
                          required
                          id="Delta flow"
                          label="Delta flow"
                          autoComplete="false"
                          value={deltaConfiguration["delta_flow"]}
                          onChange={(e) =>
                            setDeltaConfiguration({
                              ...deltaConfiguration,
                              delta_flow: e.target.value,
                            })
                          }
                        /> */}

                            <FormControl
                              sx={{
                                width: "28%",
                                m: 2,
                              }}
                              variant="standard"
                            >
                              <NativeSelect
                                id="demo-customized-select-native"
                                value={deltaConfiguration["delta_type"]}
                                onChange={(e) =>
                                  setDeltaConfiguration({
                                    ...deltaConfiguration,
                                    delta_type: e.target.value,
                                  })
                                }
                                input={<BootstrapInput />}
                              >
                                <option
                                  aria-label="None"
                                  value={deltaConfiguration["delta_flow"]}
                                >
                                  {deltaConfiguration["delta_flow"]}
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
                            <TextField
                              sx={{
                                width: "28%",
                                m: 2,
                              }}
                              required
                              id="Delta Column"
                              label="Delta Column"
                              autoComplete="false"
                              value={deltaConfiguration["delta_column"]}
                              onChange={(e) =>
                                setDeltaConfiguration({
                                  ...deltaConfiguration,
                                  delta_column: e.target.value,
                                })
                              }
                            />
                          </Box>
                          <Box>
                            <TextField
                              sx={{
                                width: "28%",
                                m: 2,
                              }}
                              required
                              id="From Value"
                              label="From Value"
                              autoComplete="false"
                              value={deltaConfiguration["from_value"]}
                              onChange={(e) =>
                                setDeltaConfiguration({
                                  ...deltaConfiguration,
                                  from_value: e.target.value,
                                })
                              }
                            />
                            <FormControl
                              sx={{ width: "28%", padding: 2 }}
                              variant="standard"
                            >
                              <NativeSelect
                                id="demo-customized-select-native"
                                value={deltaConfiguration["from_operator"]}
                                onChange={(e) =>
                                  setDeltaConfiguration({
                                    ...deltaConfiguration,
                                    from_operator: e.target.value,
                                  })
                                }
                                input={<BootstrapInput />}
                              >
                                <option
                                  aria-label="None"
                                  value={deltaConfiguration["from_operator"]}
                                >
                                  {deltaConfiguration["from_operator"]}
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
                          </Box>
                          <Box>
                            <TextField
                              sx={{
                                width: "28%",
                                m: 2,
                              }}
                              required
                              id="To value"
                              label="To Value"
                              autoComplete="false"
                              value={deltaConfiguration["to_value"]}
                              onChange={(e) =>
                                setDeltaConfiguration({
                                  ...deltaConfiguration,
                                  to_value: e.target.value,
                                })
                              }
                            />
                            <FormControl
                              sx={{ width: "28%", padding: 2 }}
                              variant="standard"
                            >
                              <NativeSelect
                                id="demo-customized-select-native"
                                value={deltaConfiguration["to_operator"]}
                                onChange={(e) =>
                                  setDeltaConfiguration({
                                    ...deltaConfiguration,
                                    to_operator: e.target.value,
                                  })
                                }
                                input={<BootstrapInput />}
                              >
                                <option
                                  aria-label="None"
                                  value={deltaConfiguration["to_operator"]}
                                >
                                  {deltaConfiguration["to_operator"]}
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
                          </Box>
                          <Box>
                            <TextField
                              sx={{
                                width: "28%",
                                m: 2,
                              }}
                              required
                              id="Delta flow"
                              label="Last Executed Value"
                              autoComplete="false"
                              value={
                                deltaConfiguration["last_extracted_values"]
                              }
                              onChange={(e) =>
                                setDeltaConfiguration({
                                  ...deltaConfiguration,
                                  last_extracted_values: e.target.value,
                                })
                              }
                            />
                            <TextField
                              sx={{
                                width: "28%",
                                m: 2,
                              }}
                              required
                              id="Delta column"
                              label="Execution start Time"
                              autoComplete="false"
                              value={
                                deltaConfiguration["execution_start_timestamp"]
                              }
                              onChange={(e) =>
                                setDeltaConfiguration({
                                  ...deltaConfiguration,
                                  execution_start_timestamp: e.target.value,
                                })
                              }
                            />
                            <TextField
                              sx={{
                                width: "28%",
                                m: 2,
                              }}
                              required
                              id="Delta type"
                              label="Execution End Time"
                              autoComplete="false"
                              value={
                                deltaConfiguration["execution_end_timestamp"]
                              }
                              onChange={(e) =>
                                setDeltaConfiguration({
                                  ...deltaConfiguration,
                                  execution_end_timestamp: e.target.value,
                                })
                              }
                            />
                          </Box>
                        </Box>
                      )}
                    </TabPanel>
                    <TabPanel
                      value={value}
                      index={3}
                      style={{
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          backgroundColor: "#F5F5F5",
                          px: 1,
                          py: 1,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h5>Process Configuration</h5>
                        <Button
                          onClick={handleUpdateProcessConfiguration}
                          size="small"
                          variant="contained"
                        >
                          Save
                        </Button>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          px: 1,
                          py: 1,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            width: "48%",
                          }}
                        >
                          <div>
                            <Button
                              sx={{
                                display: "block",
                                mt: 1,
                                color: "#aaa",
                                ml: 1,
                              }}
                              onClick={() => setOpenSourceConnections(true)}
                            >
                              Change Source Connection
                            </Button>
                            <Modal
                              open={openSourceConnectionCheckModal}
                              onClose={() => {
                                setopenSourceConnectionCheckModal(false);
                              }}
                              aria-labelledby="modal-modal-title"
                              aria-describedby="modal-modal-description"
                            >
                              <Box sx={style}>
                                <Typography
                                  id="modal-modal-title"
                                  variant="h6"
                                  component="h2"
                                >
                                  Check Connection
                                </Typography>
                                <FormControl
                                  sx={{ m: 1, minWidth: 120, width: "100%" }}
                                >
                                  <TextField
                                    id="outlined-basic"
                                    label="Connection Name"
                                    variant="outlined"
                                    value={
                                      sourceConnectionUpdate["connectionName"]
                                    }
                                  />
                                </FormControl>

                                <FormControl
                                  sx={{ m: 1, minWidth: 120, width: "100%" }}
                                >
                                  <TextField
                                    id="outlined-basic"
                                    label="Connection Password"
                                    variant="outlined"
                                    value={sourceConnectionUpdate["password"]}
                                    onChange={(e) =>
                                      setsourceConnectionUpdate({
                                        ...sourceConnectionUpdate,
                                        password: e.target.value,
                                      })
                                    }
                                  />
                                </FormControl>
                                <FormControl
                                  sx={{ m: 1, minWidth: 120, width: "100%" }}
                                >
                                  <Button
                                    variant="outlined"
                                    onClick={() =>
                                      checkSourceConnection(
                                        sourceConnectionUpdate[
                                          "connectionName"
                                        ],
                                        sourceConnectionUpdate["password"]
                                      )
                                    }
                                  >
                                    Check Connection
                                  </Button>
                                </FormControl>
                              </Box>
                            </Modal>

                            <Snackbar
                              open={successToast}
                              autoHideDuration={3000}
                              onClose={(event, reason) => {
                                if (reason === "clickaway") {
                                  return;
                                }
                                setSuccessToast(false);
                              }}
                            >
                              <Alert
                                onClose={(event, reason) => {
                                  if (reason === "clickaway") {
                                    return;
                                  }
                                  setSuccessToast(false);
                                }}
                                severity="success"
                                sx={{ width: "100%" }}
                              >
                                Connection successful !
                              </Alert>
                            </Snackbar>
                            <Snackbar
                              open={errorToast}
                              autoHideDuration={3000}
                              onClose={(event, reason) => {
                                if (reason === "clickaway") {
                                  return;
                                }
                                setErrorToast(false);
                              }}
                            >
                              <Alert
                                onClose={(event, reason) => {
                                  if (reason === "clickaway") {
                                    return;
                                  }
                                  setErrorToast(false);
                                }}
                                severity="error"
                                sx={{ width: "100%" }}
                              >
                                Connection Error!
                              </Alert>
                            </Snackbar>

                            <FormControl
                              sx={{ m: 1, minWidth: 120, width: "80%" }}
                            >
                              <InputLabel id="demo-controlled-open-select-label">
                                Source Connection
                              </InputLabel>
                              <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                open={openSourceConnections}
                                onClose={() => setOpenSourceConnections(false)}
                                onOpen={() => setOpenSourceConnections(true)}
                                value={
                                  processConfiguration["source_connection"]
                                }
                                label="soure Connection"
                                onChange={(event) => {
                                  setopenSourceConnectionCheckModal(true);
                                  setsourceConnectionUpdate({
                                    ...sourceConnectionUpdate,
                                    connectionName: event.target.value,
                                  });
                                }}
                              >
                                {dbCollection.map((item, index) => {
                                  return (
                                    <MenuItem key={index} value={item.name}>
                                      {item.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </div>
                        </Box>

                        <Box
                          sx={{
                            width: "48%",
                          }}
                        >
                          <div>
                            <Button
                              sx={{
                                display: "block",
                                mt: 1,
                                color: "#aaa",
                                ml: 1,
                              }}
                              onClick={() => setOpenTargetConnections(true)}
                            >
                              Change Target Connection
                            </Button>
                            <Modal
                              open={openTargeteConnectionCheckModal}
                              onClose={() => {
                                setopenTargetConnectionCheckModal(false);
                              }}
                              aria-labelledby="modal-modal-title"
                              aria-describedby="modal-modal-description"
                            >
                              <Box sx={style}>
                                <Typography
                                  id="modal-modal-title"
                                  variant="h6"
                                  component="h2"
                                >
                                  Check Connection
                                </Typography>
                                <FormControl
                                  sx={{ m: 1, minWidth: 120, width: "100%" }}
                                >
                                  <TextField
                                    id="outlined-basic"
                                    label="Connection Name"
                                    variant="outlined"
                                    value={
                                      targetConnectionUpdate["connectionName"]
                                    }
                                  />
                                </FormControl>

                                <FormControl
                                  sx={{ m: 1, minWidth: 120, width: "100%" }}
                                >
                                  <TextField
                                    id="outlined-basic"
                                    label="Connection Password"
                                    variant="outlined"
                                    value={targetConnectionUpdate["password"]}
                                    onChange={(e) =>
                                      settargetConnectionUpdate({
                                        ...targetConnectionUpdate,
                                        password: e.target.value,
                                      })
                                    }
                                  />
                                </FormControl>
                                <FormControl
                                  sx={{ m: 1, minWidth: 120, width: "100%" }}
                                >
                                  <Button
                                    variant="outlined"
                                    onClick={() =>
                                      checkTargetConnection(
                                        targetConnectionUpdate[
                                          "connectionName"
                                        ],
                                        targetConnectionUpdate["password"]
                                      )
                                    }
                                  >
                                    Check Connection
                                  </Button>
                                </FormControl>
                              </Box>
                            </Modal>
                            <FormControl
                              sx={{ m: 1, minWidth: 120, width: "80%" }}
                            >
                              <InputLabel id="demo-controlled-open-select-label">
                                Target Connection
                              </InputLabel>
                              <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                open={openTargetConnections}
                                onClose={() => setOpenTargetConnections(false)}
                                onOpen={() => setOpenTargetConnections(true)}
                                value={
                                  processConfiguration["target_connection"]
                                }
                                label="Target connection"
                                onChange={(event) => {
                                  setopenTargetConnectionCheckModal(true);
                                  settargetConnectionUpdate({
                                    ...targetConnectionUpdate,
                                    connectionName: event.target.value,
                                  });
                                }}
                              >
                                {dbCollection.map((item, index) => {
                                  return (
                                    <MenuItem key={index} value={item.name}>
                                      {item.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </div>
                        </Box>
                      </Box>
                    </TabPanel>
                  </Box>
                </Box>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TreeFile;
