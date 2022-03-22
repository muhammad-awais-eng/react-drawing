import React, { useEffect, useState } from "react";
import axios from "axios";
// import OdmForm from "../odm/OdmForm";
import "./JobTesting.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import LineTo from "react-lineto";
import Xarrow from "react-xarrows";
import { SteppedLineTo } from "react-lineto";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import NativeSelect from "@mui/material/NativeSelect";
import { useXarrow, Xwrapper } from "react-xarrows";
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

  const [isJobDone, setisJobDone] = useState(false);
  const [isGroupJobOpen, setIsGroupJobOpen] = useState(false);
  const [isIndividualJobOpen, setIsIndividualJobOpen] = useState(false);
  const [jobIndex, setJobIndex] = useState(0);
  const [jobType, setJobTypes] = useState("");

  const [jobToRun, setJobToRun] = useState("");

  const [addJobMode, setAddJobMode] = useState(true);
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
  const [jobList, setShowJobsList] = useState(false);

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
    setisJobDone(true);
    const body = {
      process_individuals: [
        {
          task_name: "customer _landing",
          source_database_name: "redshift",
          target_database_name: "mysql",
          source_schema_name: "edw",
          target_schema_name: "target_yoda",
          source_entity_name: "customers_test",
          query_expression: null,
          target_entity_name: "customers_test",
          drop_p: 1,
          truncate_p: 0,
          upsert_p: 0,
          upsert_key: null,
          primary_key: null,
          delta_configurations: {
            delta_flow: "one_time",
            delta_column: null,
            delta_type: "column",
            from_value: "",
            from_operator: ">=",
            to_value: "",
            to_operator: "<=",
            last_extracted_values: "",
            execution_start_timestamp: "",
            execution_end_timestamp: "",
          },
          column_mapping: [
            {
              source_column_name: "customer_id",
              target_column_name: "customer_id",
              data_type: "int(11)",
              rules_engine: {},
            },
            {
              source_column_name: "customer_name",
              target_column_name: "customer_name",
              data_type: "varchar(512)",
              rules_engine: {
                rule: "upper(trim(<column_name>))",
              },
            },
            {
              source_column_name: "customer_telephone",
              target_column_name: "customer_telephone",
              data_type: "varchar(512)",
              rules_engine: {},
            },
            {
              source_column_name: "area",
              target_column_name: "area",
              data_type: "varchar(512)",
              rules_engine: {},
            },
          ],
          process_configurations: {
            source_connection: "redshift",
            source_encoded_password: "kill3rCert",
            target_connection: "mysql_target",
            target_encoded_password: "admin123",
            is_status: 1,
          },
        },
      ],
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
          setisJobDone(false);
        })
        .catch((error) => {
          console.log("error");
        });
    } catch (e) {
      console.log(e);
    }
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
                      // console.log(item);
                      return (
                        <TreeItem
                          onClick={() => {
                            setAddJobMode(false);
                            loadGroupJob(idx);
                            setShowJobsList(false);
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
            <TreeItem
              nodeId="4"
              label="Mapping"
              onClick={() => {
                setShowJobsList(true);
                setJobList([]);
                const data = taskMapperEngine["process_individuals"];

                data.map((item, index) => {
                  setJobList((data) => [
                    ...data,
                    {
                      id: index,
                      taskName: item.task_name,
                    },
                  ]);
                });
              }}
            >
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
                        setAddJobMode(false);
                        loadIndividualJob(idx);
                        setShowJobsList(false);
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
        <div className="Jobs__list">
          {jobList ? (
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
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default TreeFile;
