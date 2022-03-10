import React, { useEffect, useState } from "react";
import axios from "axios";
import "./treefile.css";

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
} from "@mui/material/";
import { margin } from "@mui/system";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CommentIcon from "@mui/icons-material/Comment";
import IconButton from "@mui/material/IconButton";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

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
  const [taskMapperEngine, setTaskMapperEngine] = useState([]);
  const [groupSingleJob, setGroupSingleJob] = useState([]);
  const [individualSingleJob, setIndividualSingleJob] = useState([]);

  const [taskName, setTaskName] = useState("");
  const [sourceDBName, setSourceDBName] = useState("");
  const [targetDBName, setTargetDBName] = useState("");

  const [sourceSchemaName, setSourceSchemaName] = useState("");
  const [targetSchemaName, setTargetSchemaName] = useState("");

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

  const [processConfiguration, setProcessConfiguaration] = useState({
    sourceConnection: "",
    sourceEncodedPassword: "",
    targetConnection: "",
    targetEncodedPassword: "",
    isStatus: false,
  });

  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
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
    setIsDrop(data["is_drop"]);
    setIsTruncate(data["is_truncate"]);
    setIsUpsert(data["is_upsert"]);
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
    setIsDrop(data["is_drop"]);
    setIsTruncate(data["is_truncate"]);
    setIsUpsert(data["is_upsert"]);
    setUpsetKey(data["upsert_key"]);
    setPrimaryKey(data["primary_key"]);
    setDeltaConfiguration(data["delta_configurations"]);

    setColumnMapping(data["column_mapping"]);

    setProcessConfiguaration(data["process_configurations"]);

    console.log(data);
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
                {taskMapperEngine["process_groups"] &&
                  taskMapperEngine["process_groups"]["landings"]?.map(
                    (item, idx) => {
                      // console.log(item);
                      return (
                        <TreeItem
                          onClick={() => loadGroupJob(idx)}
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
              {taskMapperEngine["process_individuals"] &&
                taskMapperEngine["process_individuals"].map((item, idx) => {
                  return (
                    <TreeItem
                      onClick={() => loadIndividualJob(idx)}
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
            <Box>
              <Typography variant="h4" py={1}>
                {" "}
                {taskName}
              </Typography>
            </Box>
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
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
              >
                <Box sx={{ ...style, width: 400 }}>
                  <h2 id="parent-modal-title">Text in a modal</h2>
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
                  Column Mapping
                  <Button onClick={handleOpen}>
                    <AddIcon />
                  </Button>
                </Typography>
              </Box>

              <List
                sx={{
                  width: "100%",
                  maxWidth: 200,
                  bgcolor: "background.paper",
                  position: "relative",
                  overflow: "auto",
                  maxHeight: 180,
                  padding: 1,
                  border: "1px solid #ddd",
                  "& ul": { padding: 0 },
                }}
              >
                {columnMapping.length ? (
                  columnMapping.map((column) => (
                    <ListItemText primary={` ${column.column_name}`} />
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {/* <Button
                size="small"
                variant="contained"
                sx={{ m: 1 }}
                // onClick={handleReset}
              >
                Cancel
              </Button> */}
              <Button size="small" variant="contained" sx={{ m: 1 }}>
                Update
              </Button>
            </Box>
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
                  label="Data Types"
                  {...a11yProps(0)}
                />
                <Tab
                  sx={{
                    borderColor: "divider",
                    border: "1px solid #ddd",
                  }}
                  label="Delta Configuration"
                  {...a11yProps(1)}
                />
                <Tab
                  sx={{
                    borderColor: "divider",
                    border: "1px solid #ddd",
                  }}
                  label="Process Configuration"
                  {...a11yProps(2)}
                />
              </Tabs>
              <TabPanel value={value} index={0}>
                Data Types
              </TabPanel>
              <TabPanel value={value} index={1}>
                Delta Configuration
              </TabPanel>
              <TabPanel value={value} index={2}>
                Process Configuration
              </TabPanel>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default TreeFile;
