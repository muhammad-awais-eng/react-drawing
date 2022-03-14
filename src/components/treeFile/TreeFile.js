import React, { useEffect, useState } from "react";
import axios from "axios";
import OdmForm from "../odm/OdmForm";
import "./treefile.css";
import LineTo from "react-lineto";
import { SteppedLineTo } from "react-lineto";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";

import {
  TextField,
  Box,
  Typography,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
  MenuItem,
  Modal,
  Checkbox,
  FormGroup,
  FormLabel,
  FormControlLabel,
  AccordionSummary,
  Accordion,
  AccordionDetails,
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
import { ClassNames } from "@emotion/react";

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

  const [deltaConfiguration, setDeltaConfiguration] = useState({
    deltaFlow: "",
    deltaColumn: null,
    deltaType: "",
    fromValue: "",
    fromOperator: "",
    toOperator: "",
    lastExtractedValue: "",
    executionStartTime: "",
    executionEndTime: "",
  });

  const [columnMapping, setColumnMapping] = useState([]);
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState("");
  const [columnRule, setColumnRule] = useState("");

  const [processConfiguration, setProcessConfiguaration] = useState({
    sourceConnection: "",
    sourceEncodedPassword: "",
    targetConnection: "",
    targetEncodedPassword: "",
    isStatus: false,
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
    const data = taskMapperEngine["process_groups"]["landings"][index];
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
    // console.log(data);
  };

  const loadIndividualJob = (index) => {
    console.log(index);
    const data = taskMapperEngine["process_individuals"][index];
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

    console.log(data);
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
              <TreeItem nodeId="3" label="Landing">
                <button onClick={() => setAddJobMode(true)}>Add new job</button>{" "}
                {taskMapperEngine["process_groups"] &&
                  taskMapperEngine["process_groups"]["landings"]?.map(
                    (item, idx) => {
                      // console.log(item);
                      return (
                        <TreeItem
                          onClick={() => {
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
              <button onClick={() => setAddJobMode(true)}>Add new job</button>{" "}
              {taskMapperEngine["process_individuals"] &&
                taskMapperEngine["process_individuals"].map((item, idx) => {
                  return (
                    <TreeItem
                      onClick={() => {
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
            <OdmForm jobType="individual" groupName="" />
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
                  {" "}
                  {taskName}
                </Typography>
                <Button size="small" variant="contained">
                  Update
                </Button>
              </Box>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div style={{ width: "100%" }}>
                  <Box
                    width="100%"
                    component="form"
                    margin={2}
                    alignItems="center"
                    justifyContent={["center"]}
                    mx="auto"
                    sx={{
                      width: { xl: "20%", lg: 980, md: 650, sm: 550, xs: 420 },
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
                      {columnMapping.length ? (
                        columnMapping.map((column) => (
                          <div
                            style={{ width: "100%" }}
                            className={column.source_column_name}
                          >
                            <ListItemText
                              className={column.source_column_name}
                              onClick={() => {
                                setColumnName(column.source_column_name);
                                setColumnType(column.data_type);
                                setColumnRule(
                                  Object.keys(column["rules_engine"]).length !==
                                    0
                                    ? column["rules_engine"]["rule"]
                                    : ""
                                );

                                console.log(
                                  Object.keys(column["rules_engine"]).length !==
                                    0
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
                      width: { xl: "20%", lg: 980, md: 650, sm: 550, xs: 420 },
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
                      {columnMapping.length ? (
                        columnMapping.map((column) => (
                          <div className={column.target_column_name}>
                            <ListItemText
                              onClick={() => {
                                setColumnName(column.source_column_name);
                                setColumnType(column.data_type);
                                setColumnRule(
                                  Object.keys(column["rules_engine"]).length !==
                                    0
                                    ? column["rules_engine"]["rule"]
                                    : ""
                                );

                                console.log(
                                  Object.keys(column["rules_engine"]).length !==
                                    0
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

                {columnMapping.length
                  ? columnMapping.map((column) => (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        {/* <SteppedLineTo
                          borderColor="red"
                          borderStyle="dashed"
                          borderWidth="4px"
                          from={column.source_column_name}
                          to={column.target_column_name}
                          orientation="v"
                        /> */}
                        <LineTo
                          borderColor="#bbb"
                          borderStyle="dashed"
                          borderWidth="2px"
                          from={column.source_column_name}
                          to={column.target_column_name}
                        />
                      </div>
                    ))
                  : null}
              </div>
            </Box>
            {/* bottom  container */}
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
                          {editJobDetail ? (
                            <Button
                              onClick={() => setEditJobDetail(!editJobDetail)}
                              size="small"
                              variant="contained"
                              sx={{ m: 1 }}
                            >
                              Edit
                            </Button>
                          ) : (
                            <Button
                              onClick={() => setEditJobDetail(!editJobDetail)}
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
                            <TextField
                              sx={{
                                width: "51%",
                                m: 1,
                              }}
                              id="outlined-name"
                              label="Primary Key"
                              value={primaryKey}
                              // onChange={handleChange}
                            />
                            <TextField
                              sx={{
                                width: "51%",
                                m: 1,
                              }}
                              id="outlined-name"
                              label="Upsert Key"
                              value={upsertKey}
                              // onChange={handleChange}
                            />
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
                    <Button size="small" variant="contained">
                      Save
                    </Button>
                  </Box>
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
                          {deltaConfiguration["execution_start_timestamp"]}
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
                        <IconButton
                          sx={{
                            width: "10%",
                          }}
                          onClick={handleModalOpen}
                        >
                          <EditIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                      </Box>

                      {/* <TextField
                    sx={{
                      width: "28%",
                      m: 2,
                    }}
                    required
                    id="Delta flow"
                    label="Last Executed Value"
                    autoComplete="false"
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
                    // type={"number"}
                  /> */}
                      {/* <TextField
                    sx={{
                      width: "28%",
                      m: 2,
                    }}
                    required
                    id="Delta type"
                    label="Execution End Time"
                    autoComplete="false"
                    // type={"number"}
                  /> */}
                    </Box>
                  </Box>
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
                    <Button size="small" variant="contained">
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
                      {" "}
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>Source Connenction</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box>
                            <Box
                              sx={{
                                width: "100%",
                                my: 0,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  alignSelf: "center",
                                  width: "35%",
                                  fontWeight: "bold",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                DB Name
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  alignItems: "center",
                                  alignSelf: "center",
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {SourceConnectionDetail["db_name"]}
                              </Typography>
                              <IconButton
                                sx={{
                                  width: "10%",
                                  fontSize: 8,
                                }}
                                // onClick={handleModalOpen}
                              >
                                <EditIcon sx={{ fontSize: 17 }} />
                              </IconButton>
                            </Box>

                            {/* <TextField
                            sx={{
                              width: "100%",
                              my: 2,
                              height: "30px",
                            }}
                            required
                            id="DB Name"
                            label="DB Name"
                            autoComplete="false"
                          /> */}
                            <Box
                              sx={{
                                width: "100%",
                                my: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  alignSelf: "center",
                                  width: "35%",
                                  fontWeight: "bold",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                DB Schema
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  alignItems: "center",
                                  alignSelf: "center",
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {SourceConnectionDetail["db_schema"]}
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

                            {/* <TextField
                            sx={{
                              width: "100%",
                              m: 0,
                              height: "30px",
                              my: 2,
                            }}
                            required
                            id="DB schema"
                            label="DB Schema"
                            autoComplete="false"
                          /> */}
                            <Box
                              sx={{
                                width: "100%",
                                my: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  alignSelf: "center",
                                  width: "35%",
                                  fontWeight: "bold",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                DB User
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  alignItems: "center",
                                  alignSelf: "center",
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {SourceConnectionDetail["db_user"]}
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

                            {/* <TextField
                            sx={{
                              width: "100%",
                              m: 0,
                              height: "30px",
                              my: 2,
                            }}
                            required
                            id="DB user"
                            label="DB User"
                            autoComplete="false"
                          /> */}
                            <Box
                              sx={{
                                width: "100%",
                                my: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  alignSelf: "center",
                                  width: "35%",
                                  fontWeight: "bold",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                DB Port
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  alignItems: "center",
                                  alignSelf: "center",
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {SourceConnectionDetail["db_port"]}
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

                            {/* <TextField
                            sx={{
                              width: "100%",
                              m: 0,
                              height: "30px",
                              my: 2,
                            }}
                            required
                            id="DB Port"
                            label="DB Port"
                            autoComplete="false"
                          /> */}
                            <Box
                              sx={{
                                width: "100%",
                                my: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  alignSelf: "center",
                                  width: "35%",
                                  fontWeight: "bold",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                DB ip Address
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  alignItems: "center",
                                  alignSelf: "center",
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {SourceConnectionDetail["db_ip_address"]}
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

                            {/* <TextField
                            sx={{
                              width: "100%",
                              m: 0,
                              height: "30px",
                              my: 2,
                            }}
                            required
                            id="DB ip"
                            label="DB ipAddress"
                            autoComplete="false"
                          /> */}
                            <Box
                              sx={{
                                width: "100%",
                                my: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  alignSelf: "center",
                                  width: "35%",
                                  fontWeight: "bold",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                Source Name
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  alignItems: "center",
                                  alignSelf: "center",
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {SourceConnectionDetail["source_name"]}
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

                            {/* <TextField
                            sx={{
                              width: "100%",
                              m: 0,
                              height: "30px",
                              my: 2,
                            }}
                            required
                            id="source Name"
                            label="source Name"
                            autoComplete="false"
                          /> */}
                            <Box
                              sx={{
                                width: "100%",
                                my: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  alignSelf: "center",
                                  width: "35%",
                                  fontWeight: "bold",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                source Type
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  alignItems: "center",
                                  alignSelf: "center",
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {SourceConnectionDetail["source_type"]}
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

                            {/* <TextField
                            sx={{
                              width: "100%",
                              m: 0,
                              height: "30px",
                              my: 2,
                            }}
                            required
                            id="source type"
                            label="source Type"
                            autoComplete="false"
                          /> */}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                    <Box
                      sx={{
                        width: "48%",
                      }}
                    >
                      {" "}
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel2a-content"
                          id="panel2a-header"
                        >
                          <Typography>Target Connection</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box>
                            <Box
                              sx={{
                                width: "100%",
                                my: 0,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  alignSelf: "center",
                                  width: "35%",
                                  fontWeight: "bold",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                DB Name
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  alignItems: "center",
                                  alignSelf: "center",
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {TargetConnectionDetail["db_name"]}
                              </Typography>
                              <IconButton
                                sx={{
                                  width: "10%",
                                  fontSize: 8,
                                }}
                                // onClick={handleModalOpen}
                              >
                                <EditIcon sx={{ fontSize: 17 }} />
                              </IconButton>
                            </Box>

                            {/* <TextField
                            sx={{
                              width: "100%",
                              my: 2,
                              height: "30px",
                            }}
                            required
                            id="DB Name"
                            label="DB Name"
                            autoComplete="false"
                          /> */}
                            <Box
                              sx={{
                                width: "100%",
                                my: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  alignSelf: "center",
                                  width: "35%",
                                  fontWeight: "bold",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                DB Schema
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  alignItems: "center",
                                  alignSelf: "center",
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {TargetConnectionDetail["db_schema"]}
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

                            {/* <TextField
                            sx={{
                              width: "100%",
                              m: 0,
                              height: "30px",
                              my: 2,
                            }}
                            required
                            id="DB schema"
                            label="DB Schema"
                            autoComplete="false"
                          /> */}
                            <Box
                              sx={{
                                width: "100%",
                                my: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  alignSelf: "center",
                                  width: "35%",
                                  fontWeight: "bold",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                DB User
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  alignItems: "center",
                                  alignSelf: "center",
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {TargetConnectionDetail["db_user"]}
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

                            {/* <TextField
                            sx={{
                              width: "100%",
                              m: 0,
                              height: "30px",
                              my: 2,
                            }}
                            required
                            id="DB user"
                            label="DB User"
                            autoComplete="false"
                          /> */}
                            <Box
                              sx={{
                                width: "100%",
                                my: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  alignSelf: "center",
                                  width: "35%",
                                  fontWeight: "bold",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                DB Port
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  alignItems: "center",
                                  alignSelf: "center",
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {TargetConnectionDetail["db_port"]}
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

                            {/* <TextField
                            sx={{
                              width: "100%",
                              m: 0,
                              height: "30px",
                              my: 2,
                            }}
                            required
                            id="DB Port"
                            label="DB Port"
                            autoComplete="false"
                          /> */}
                            <Box
                              sx={{
                                width: "100%",
                                my: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  alignSelf: "center",
                                  width: "35%",
                                  fontWeight: "bold",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                DB ip Address
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  alignItems: "center",
                                  alignSelf: "center",
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {TargetConnectionDetail["db_ip_address"]}
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

                            {/* <TextField
                            sx={{
                              width: "100%",
                              m: 0,
                              height: "30px",
                              my: 2,
                            }}
                            required
                            id="DB ip"
                            label="DB ipAddress"
                            autoComplete="false"
                          /> */}
                            <Box
                              sx={{
                                width: "100%",
                                my: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  alignSelf: "center",
                                  width: "35%",
                                  fontWeight: "bold",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                Source Name
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  alignItems: "center",
                                  alignSelf: "center",
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {TargetConnectionDetail["source_name"]}
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

                            {/* <TextField
                            sx={{
                              width: "100%",
                              m: 0,
                              height: "30px",
                              my: 2,
                            }}
                            required
                            id="source Name"
                            label="source Name"
                            autoComplete="false"
                          /> */}
                            <Box
                              sx={{
                                width: "100%",
                                my: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #E0E0E0",
                                height: "40px",
                                overflow: "hidden",
                              }}
                            >
                              <Typography
                                sx={{
                                  borderRight: "1px solid #E0E0E0",
                                  px: 1,
                                  alignSelf: "center",
                                  width: "35%",
                                  fontWeight: "bold",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                source Type
                              </Typography>
                              <Typography
                                sx={{
                                  px: 2,
                                  alignItems: "center",
                                  alignSelf: "center",
                                  width: "48%",
                                  fontSize: 12,
                                }}
                                py={0}
                              >
                                {TargetConnectionDetail["source_type"]}
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

                            {/* <TextField
                            sx={{
                              width: "100%",
                              m: 0,
                              height: "30px",
                              my: 2,
                            }}
                            required
                            id="source type"
                            label="source Type"
                            autoComplete="false"
                          /> */}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  </Box>
                </TabPanel>
              </Box>
            </Box>
          </div>
        )}
      </div>
    </div>
  );
}

export default TreeFile;
