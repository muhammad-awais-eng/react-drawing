import React, { useState, useEffect } from "react";
import axios from "axios";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import "./Test.css";

import FormControl from "@mui/material/FormControl";
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

const TestConncection = () => {
  const [connectionData, setConnectionData] = useState({
    source_type: "",
    source_name: "",
    ip_address: "",
    db_port: "",
    db_user: "",
    db_password: "",
    db_schema: "",
    db_name: "",
  });
  const [connectionName, setConnectionName] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbCollection, setDbCollection] = useState(["mysql", "redshift"]);

  const handleReset = () => {
    setConnectionData({
      source_type: "",
      source_name: "",
      ip_address: "",
      db_port: "",
      db_user: "",
      db_password: "",
      db_schema: "",
      db_name: "",
    });
    setConnectionName("");
  };

  const handleConnectionSubmit = (e) => {
    e.preventDefault();
    const body = connectionData;
    console.log(body);
    try {
      axios
        .post(`/v1/db_connection/${connectionName}`, body, {
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          console.log(response.data);

          checkConnection();
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const checkConnection = () => {
    try {
      axios
        .get("/v1/db_connection_check", {
          params: {
            connection_name: connectionName,
            inserted_db_password: connectionData.db_password,
          },
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          if (response.data.status === "successful") {
            console.log("sdas");
            setSuccessMessage(true);
            setIsModalOpen(true);
          } else {
            setSuccessMessage(false);
            setIsModalOpen(true);
          }

          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          setSuccessMessage(false);
          setIsModalOpen(true);
        });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="container">
      {isModalOpen ? (
        successMessage ? (
          <div className="success__message">
            <div className="check__icon">
              <div>
                <DoneIcon className="starBorderOutlined" />
              </div>
            </div>
            <div className="header__message">
              <h1>Success </h1>
              <span>Connection SuccessFul </span>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSuccessMessage(false);
                }}
              >
                ok
              </button>
            </div>
          </div>
        ) : (
          <div className="success__message">
            <div className="header__message">
              <h1 style={{ color: "#b65454" }}>Failed </h1>
              <span>please check your crediential </span>
              <button
                style={{ backgroundColor: "#b65454", padding: "2px" }}
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                continue
              </button>
            </div>
          </div>
        )
      ) : null}

      <div className="form__container">
        <h1>Test Conncection</h1>
        <div className="field">
          <span>connection name</span>
          <input
            type="text"
            placeholder="Connection Name"
            value={connectionName}
            onChange={(e) => {
              setConnectionName(e.target.value);
            }}
          />
        </div>
        <div className="field">
          <span>source type</span>
          <input
            type="text"
            placeholder="source type"
            value={connectionData.source_type}
            onChange={(e) => {
              setConnectionData({
                ...connectionData,
                source_type: e.target.value,
              });
            }}
          />
        </div>
        <div className="field">
          <span>source name</span>
          <div className="select">
            <select
              name="select__field"
              className="select__field"
              value={connectionData.source_name}
              onChange={(e) =>
                setConnectionData({
                  ...connectionData,
                  source_name: e.target.value,
                })
              }
            >
              <option value="a">Choose option ...</option>
              <option value="mysql">My SQL</option>
              <option value="redshift">Redshift</option>
            </select>
          </div>
        </div>
        <div className="field">
          <span>ip address</span>
          <input
            type="text"
            placeholder="ip address"
            value={connectionData.ip_address}
            onChange={(e) => {
              setConnectionData({
                ...connectionData,
                ip_address: e.target.value,
              });
            }}
          />
        </div>
        <div className="field">
          <span>db port</span>
          <input
            type="number"
            placeholder="Db port"
            value={connectionData.db_port}
            onChange={(e) => {
              setConnectionData({ ...connectionData, db_port: e.target.value });
            }}
          />
        </div>
        <div className="field">
          <span>db user</span>
          <input
            type="text"
            placeholder="Db User"
            value={connectionData.db_user}
            onChange={(e) => {
              setConnectionData({ ...connectionData, db_user: e.target.value });
            }}
          />
        </div>
        <div className="field">
          <span>db password</span>
          <input
            type="text"
            placeholder="Db Password"
            value={connectionData.db_password}
            onChange={(e) => {
              setConnectionData({
                ...connectionData,
                db_password: e.target.value,
              });
            }}
          />
        </div>
        <div className="field">
          <span>db schema</span>
          <input
            type="text"
            placeholder="Db Schema"
            value={connectionData.db_schema}
            onChange={(e) => {
              setConnectionData({
                ...connectionData,
                db_schema: e.target.value,
              });
            }}
          />
        </div>
        <div className="field">
          <span>DB Name</span>

          <input
            type="text"
            disabled={connectionData.source_name !== "mysql" ? false : true}
            placeholder="DB Name"
            value={connectionData.db_name}
            onChange={(e) => {
              setConnectionData(
                connectionData.source_name !== "mysql"
                  ? { ...connectionData, db_name: e.target.value }
                  : null
              );
            }}
          />
        </div>

        <div className="buttonArea">
          <span>
            <button
              onClick={handleReset}
              style={{ backgroundColor: "#ee1919", padding: "8px" }}
            >
              Reset
            </button>
          </span>
          <button type="submit" onClick={handleConnectionSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestConncection;
