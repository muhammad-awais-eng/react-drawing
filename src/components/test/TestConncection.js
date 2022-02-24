import React, { useState, useEffect } from "react";
import axios from "axios";

import "./Test.css";

const TestConncection = () => {
  const [connectionData, setConnectionData] = useState({
    source_type: "",
    source_name: "",
    ip_address: "",
    db_port: "",
    db_user: "",
    db_password: "",
    db_schema: "",
  });
  const [connectionName, setConnectionName] = useState("");

  const handleConnectionSubmit = (e) => {
    e.preventDefault();

    // const body = {
    //   source_credentials: connectionData,
    //   target_credentials: {},
    // };
    const body = connectionData;
    console.log(body);
    try {
      axios
        .post(`/v1/db_connection_creator/${connectionName}`, body, {
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
          alert(response.data.status);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          alert("please check your credientials");
        });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="container">
      <form className="form__container" onSubmit={handleConnectionSubmit}>
        <h1>Test Conncection</h1>
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
          <input
            type="text"
            placeholder="source name"
            value={connectionData.source_name}
            onChange={(e) => {
              setConnectionData({
                ...connectionData,
                source_name: e.target.value,
              });
            }}
          />
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
          <span></span>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default TestConncection;
