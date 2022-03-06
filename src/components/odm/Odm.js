import React, { useEffect, useState } from "react";
import axios from "axios";
import "./odm.css";
import OdmForm from "./OdmForm";

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

function Odm() {
  const [sourcerDbList, setSourcerDbList] = useState([]);
  const [targetDbList, setTargetDbList] = useState([]);
  const [dbCollection, setDbCollection] = useState([]);

  const [dbName, setDbName] = useState("");
  const [dbPassword, setDbPassword] = useState("");
  const [dbData, setDbData] = useState([]);
  const [checkConnection, setcheckConnection] = useState(false);
  const [checkTarrgetConnection, setCheckTarrgetConnection] = useState(false);
  const [sourceDBName, setSourceDBName] = React.useState("");
  const [sourceDBpassword, setSourceDBPassword] = React.useState("");
  const [targetDBName, setTargetDBName] = React.useState("");
  const [targetDBpassword, setTargetDBpassword] = React.useState("");

  const [age, setAge] = React.useState("");
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleSourceChange = (event) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    console.log(event.target.value);
    setSourceDBName(value);
    setDbName(value);
    setcheckConnection(!checkConnection);
  };
  const handleTargetChange = (event) => {
    const {
      target: { value },
    } = event;
    setTargetDBName(value);
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

  const checkDbConnection = async () => {
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
          setDbPassword("");
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
            setSourceDBPassword("");
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
            connection_name: "final_test",
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

  return <OdmForm />;
}

export default Odm;

// <div className="odm__container">
//   <div className="odm__source__table">
//     <h1>Source DB selection</h1>
//     {checkConnection ? (
//       <div className="check__db__connection">
//         <div className="db_connection_wrapper">
//           <div>Name</div>
//           <input type="text" value={sourceDBName} disabled />
//         </div>
//         <div className="db_connection_wrapper">
//           <div>Password</div>
//           <input
//             type="password"
//             placeholder="enter password"
//             value={sourceDBpassword}
//             onChange={(e) => setSourceDBPassword(e.target.value)}
//           />
//         </div>
//         <div className="wrapper__btn">
//           <button
//             className="cancel__btn"
//             onClick={() => setcheckConnection(!checkConnection)}
//           >
//             Cancel
//           </button>
//           <button className="submit__btn" onClick={checkDbConnection}>
//             Submit
//           </button>
//         </div>
//       </div>
//     ) : null}

//     <div className="source_db_select">
//       <FormControl sx={{ m: "auto", width: "85%" }} variant="standard">
//         {/* <InputLabel htmlFor="demo-customized-select-native">Age</InputLabel> */}
//         <NativeSelect
//           id="demo-customized-select-native"
//           value={sourceDBName}
//           onChange={handleSourceChange}
//           input={<BootstrapInput />}
//         >
//           <option aria-label="None" value="">
//             Choose Source DB ....
//           </option>
//           {dbCollection.map((db, idx) => (
//             <option key={idx} value={db.name}>
//               {db.name}
//             </option>
//           ))}
//         </NativeSelect>
//       </FormControl>
//     </div>

//     <div>
//       {sourcerDbList.map((db) => (
//         <div>
//           <div className="source__column">
//             <div>
//               <TableRowsIcon style={{ color: "#5bad3a", height: "13px" }} />
//             </div>
//             <div
//               style={{ marginLeft: "10px" }}
//               onClick={() => listSourceEntites(db.dbName)}
//             >
//               {db.dbName}
//             </div>
//           </div>

//           <div>
//             {db.sourceEntitiesList?.map((entity) => {
//               return (
//                 <div>
//                   <div className="source__table__list">
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                       onClick={() =>
//                         SourceColumnList(entity.tableName, db.dbName)
//                       }
//                     >
//                       <div>
//                         <ArrowRightIcon
//                           style={{
//                             color: "rgb(104, 75, 38)",
//                             height: "23px",
//                           }}
//                         />
//                       </div>
//                       <div> {entity.tableName}</div>
//                     </div>
//                   </div>

//                   <div className="source__column__list">
//                     {entity.sourceColumnList?.map((column) => {
//                       return (
//                         <div className="sourceColumn">
//                           <div>
//                             <DescriptionIcon
//                               style={{
//                                 color: "rgb(104, 75, 38)",
//                                 height: "18px",
//                               }}
//                             />
//                           </div>
//                           <div style={{ paddingLeft: "5px" }}>{column}</div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>

//   <div className="odm__target__table">
//     <h1>Target DB selection</h1>

//     {checkTarrgetConnection ? (
//       <div className="check__db__connection">
//         <div className="db_connection_wrapper">
//           <div>Name</div>
//           <input type="text" value={targetDBName} disabled />
//         </div>
//         <div className="db_connection_wrapper">
//           <div>Password</div>
//           <input
//             type="password"
//             placeholder="enter password"
//             value={targetDBpassword}
//             onChange={(e) => setTargetDBpassword(e.target.value)}
//           />
//         </div>
//         <div className="wrapper__btn">
//           <button
//             className="cancel__btn"
//             onClick={() =>
//               setCheckTarrgetConnection(!setCheckTarrgetConnection)
//             }
//           >
//             Cancel
//           </button>
//           <button className="submit__btn" onClick={checkDbConnection}>
//             Submit
//           </button>
//         </div>
//       </div>
//     ) : null}

//     <div className="target_db_select">
//       <FormControl sx={{ m: "auto", width: "35%" }} variant="standard">
//         {/* <InputLabel htmlFor="demo-customized-select-native">Age</InputLabel> */}
//         <NativeSelect
//           id="demo-customized-select-native"
//           value={targetDBName}
//           onChange={handleTargetChange}
//           input={<BootstrapInput />}
//         >
//           <option aria-label="None" value="">
//             Choose Target DB ....
//           </option>
//           {dbCollection.map((db, idx) => (
//             <option key={idx} value={db.name}>
//               {db.name}
//             </option>
//           ))}
//         </NativeSelect>
//       </FormControl>
//     </div>

//     <div>
//       {targetDbList.map((db) => (
//         <div>
//           <div className="source__column">
//             <div>
//               <TableRowsIcon style={{ color: "#5bad3a", height: "13px" }} />
//             </div>
//             <div
//               style={{ marginLeft: "10px" }}
//               onClick={() => listTargetEntites(db.dbName)}
//             >
//               {db.dbName}
//             </div>
//           </div>

//           <div>
//             {db.targetEntitiesList?.map((entity) => {
//               return (
//                 <div>
//                   <div className="target__table__list">
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                       onClick={() =>
//                         TargetColumnList(entity.tableName, db.dbName)
//                       }
//                     >
//                       <div>
//                         <ArrowRightIcon
//                           style={{
//                             color: "rgb(104, 75, 38)",
//                             height: "23px",
//                           }}
//                         />
//                       </div>
//                       <div> {entity.tableName}</div>
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         justifyContent: "space-around",
//                       }}
//                     >
//                       <div>
//                         <FormControl component="fieldset" className="mw-120">
//                           <FormGroup aria-label="position" row>
//                             <FormControlLabel
//                               value="Drop"
//                               control={
//                                 <Checkbox
//                                   size="small"
//                                   value="checkedA"
//                                   onChange={() => console.log("checked")}
//                                 />
//                               }
//                               label="Drop"
//                               labelPlacement="top"
//                             />
//                           </FormGroup>
//                         </FormControl>
//                       </div>
//                       <div>
//                         <FormControl component="fieldset" className="mw-120">
//                           <FormGroup aria-label="position" row>
//                             <FormControlLabel
//                               value="Truncate"
//                               control={
//                                 <Checkbox
//                                   size="small"
//                                   value="checkedA"
//                                   onChange={() => console.log("checked")}
//                                 />
//                               }
//                               label="Truncate"
//                               labelPlacement="top"
//                             />
//                           </FormGroup>
//                         </FormControl>
//                       </div>
//                       <div>
//                         <FormControl component="fieldset" className="mw-120">
//                           <FormGroup aria-label="position" row>
//                             <FormControlLabel
//                               value="Upsert"
//                               control={
//                                 <Checkbox
//                                   size="small"
//                                   value="checkedA"
//                                   onChange={() => console.log("checked")}
//                                 />
//                               }
//                               label="Upsert"
//                               labelPlacement="top"
//                             />
//                           </FormGroup>
//                         </FormControl>
//                       </div>
//                       <div>
//                         <FormControl component="fieldset" className="mw-120">
//                           <FormGroup aria-label="position" row>
//                             <FormControlLabel
//                               value="Upsert key"
//                               control={
//                                 <Checkbox
//                                   size="small"
//                                   value="checkedA"
//                                   onChange={() => console.log("checked")}
//                                 />
//                               }
//                               label="Upsert key"
//                               labelPlacement="top"
//                             />
//                           </FormGroup>
//                         </FormControl>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="source__column__list">
//                     {entity.targetEntitiesList?.map((column) => {
//                       return (
//                         <div className="targetColumn">
//                           <div>
//                             <DescriptionIcon
//                               style={{
//                                 color: "rgb(104, 75, 38)",
//                                 height: "18px",
//                               }}
//                             />
//                           </div>
//                           <div style={{ paddingLeft: "5px" }}>{column}</div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// </div>;
