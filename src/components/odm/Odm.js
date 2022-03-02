import React, { useEffect, useState } from "react";
import axios from "axios";
import "./odm.css";

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

import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

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

const styles = (theme) => ({
  select: {
    "&:before": {
      borderColor: "red",
    },
    "&:after": {
      borderColor: "green",
    },
  },
  icon: {
    fill: "red",
  },
});
function Odm() {
  const [sourcerDbList, setSourcerDbList] = useState([]);
  const [targetDbList, setTargetDbList] = useState([]);
  const [dbCollection, setDbCollection] = useState([]);

  const [dbName, setDbName] = useState("");
  const [dbPassword, setDbPassword] = useState("");
  const [dbData, setDbData] = useState([]);
  const [checkConnection, setcheckConnection] = useState(false);

  const [sourceDB, setSourceDB] = React.useState("");
  const [targetDB, setTargetDB] = React.useState("");

  const handleSourceChange = (event) => {
    const {
      target: { value },
    } = event;
    setSourceDB(value);
    setDbName(value);
    setcheckConnection(!checkConnection);

    console.log(dbName, "sds");
  };
  const handleTargetChange = (event) => {
    const {
      target: { value },
    } = event;
    setTargetDB(value);
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

  useEffect(() => {
    try {
      axios
        .get("/v1/list_db_schema", {
          params: {
            connection_name: "mysql_source",
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
            setSourcerDbList((prevState) => [
              ...prevState,
              { dbName: item, sourceEntitiesList: [] },
            ]);

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

  const checkDbConnection = async () => {
    try {
      await axios
        .get("/v1/db_connection_check", {
          params: {
            connection_name: dbName,
            inserted_db_password: dbPassword,
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          alert("response.data.status");
          console.log(response.data);
          setDbPassword("");
          setcheckConnection(!checkConnection);
        })
        .catch((error) => {
          console.log(error);
          setDbPassword("");
          alert("please check your credientials");
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
            connection_name: "mysql_source",
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
                      targetColumnList: [],
                    };
                  }),
                }
              : el
          );
          console.log(temp_element, "dsds");
          setSourcerDbList(temp_element);
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

  const SourceColumnList = async (tableName, dbName) => {
    try {
      axios
        .get("/v1/list_entity_column", {
          params: {
            connection_name: "mysql_source",
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
          let temp_state = [...sourcerDbList];
          let temp_element = temp_state.map((el) =>
            el.dbName === dbName
              ? {
                  ...el,
                  sourceEntitiesList: el.sourceEntitiesList.map((item) => {
                    if (item.tableName === tableName) {
                      return {
                        ...item,
                        sourceColumnList: response.data.entities_metadata,
                      };
                    } else {
                      return item;
                    }
                  }),
                }
              : el
          );
          console.log(temp_element, "dsds");
          setSourcerDbList(temp_element);
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
    try {
      axios
        .get("/v1/list_db_entities", {
          params: {
            connection_name: "mysql_source",
            inserted_db_password: "admin123",
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          // console.log(response.data.schema_entities);
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
  const TargetColumnList = async (tableName, dbName) => {
    try {
      axios
        .get("/v1/list_entity_column", {
          params: {
            connection_name: "mysql_source",
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
          let temp_state = [...targetDbList];
          let temp_element = temp_state.map((el) =>
            el.dbName === dbName
              ? {
                  ...el,
                  targetEntitiesList: el.targetEntitiesList.map((item) => {
                    if (item.tableName === tableName) {
                      return {
                        ...item,
                        targetEntitiesList: response.data.entities_metadata,
                      };
                    } else {
                      return item;
                    }
                  }),
                }
              : el
          );
          console.log(temp_element, "dsds");

          setTargetDbList(temp_element);
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

  return (
    <div className="odm__container">
      <div className="odm__source__table">
        <h1>Source DB selection</h1>
        {checkConnection ? (
          <div className="check__db__connection">
            <div className="db_connection_wrapper">
              <div>Name</div>
              <input
                type="text"
                value={dbName ? dbData[dbName].source_name : dbName}
                disabled
              />
            </div>
            <div className="db_connection_wrapper">
              <div>Password</div>
              <input
                type="text"
                placeholder="enter password"
                value={dbPassword}
                onChange={(e) => setDbPassword(e.target.value)}
              />
            </div>
            <div className="wrapper__btn">
              <button
                className="cancel__btn"
                onClick={() => setcheckConnection(!checkConnection)}
              >
                Cancel
              </button>
              <button className="submit__btn" onClick={checkDbConnection}>
                Submit
              </button>
            </div>
          </div>
        ) : null}
        <div className="source_db_select">
          <FormControl sx={{ m: "auto", width: "85%", color: "red" }}>
            <InputLabel id="demo-multiple-name-label">
              Select Source DB
            </InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              value={sourceDB}
              onChange={handleSourceChange}
              input={<OutlinedInput label="Name" />}
              MenuProps={MenuProps}
            >
              {dbCollection.map((db, idx) => (
                <MenuItem key={idx} value={db.name}>
                  {db.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          {sourcerDbList.map((db) => (
            <div>
              <div className="source__column">
                <div>
                  <TableRowsIcon style={{ color: "#5bad3a", height: "13px" }} />
                </div>
                <div
                  style={{ marginLeft: "10px" }}
                  onClick={() => listSourceEntites(db.dbName)}
                >
                  {db.dbName}
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
                            SourceColumnList(entity.tableName, db.dbName)
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
                              <div style={{ paddingLeft: "5px" }}>{column}</div>
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
        </div>
      </div>

      <div className="odm__target__table">
        <h1>Target DB selection</h1>
        <div className="target_db_select">
          <FormControl sx={{ m: "auto", width: "35%" }}>
            <InputLabel id="demo-multiple-name-label">
              Select Target DB
            </InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              value={targetDB}
              onChange={handleTargetChange}
              input={<OutlinedInput label="Name" />}
              MenuProps={MenuProps}
            >
              {dbCollection.map((db, idx) => (
                <MenuItem key={idx} value={db.name}>
                  {db.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          {targetDbList.map((db) => (
            <div>
              <div className="source__column">
                <div>
                  <TableRowsIcon style={{ color: "#5bad3a", height: "13px" }} />
                </div>
                <div
                  style={{ marginLeft: "10px" }}
                  onClick={() => listTargetEntites(db.dbName)}
                >
                  {db.dbName}
                </div>
              </div>

              <div>
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
                            TargetColumnList(entity.tableName, db.dbName)
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
                              <div style={{ paddingLeft: "5px" }}>{column}</div>
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
        </div>
      </div>
    </div>
  );
}

export default Odm;
