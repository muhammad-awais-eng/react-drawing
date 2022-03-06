import React, { useState, useEffect } from "react";
import "./dblist.css";
import axios from "axios";
import DoneIcon from "@mui/icons-material/Done";

function DBlist() {
  const [dbCollection, setDbCollection] = useState([]);
  const [dbName, setDbName] = useState("");
  const [dbPassword, setDbPassword] = useState("");
  const [dbData, setDbData] = useState([]);
  const [checkConnection, setcheckConnection] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dbSelect = (name) => {
    setDbName(name);
    setcheckConnection(!checkConnection);
  };

  const checkDbConnection = async () => {
    console.log("psd", dbPassword);
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
          console.log(response.data);
          if (response.data.status === "successful") {
            console.log("sdas");
            setSuccessMessage(true);
            setIsModalOpen(true);
          } else {
            setSuccessMessage(false);
            setIsModalOpen(true);
          }

          setDbPassword("");
          setcheckConnection(!checkConnection);
        })
        .catch((error) => {
          console.log("error");
          setSuccessMessage(false);
          setIsModalOpen(false);
          setDbPassword("");
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
  };

  const deletedbConnection = async (dbName) => {
    console.log("dbName", dbName);
    const data = JSON.stringify({
      connection_name: dbName,
    });

    try {
      await axios
        .delete(`/v1/db_connection/${dbName}`, {
          headers: {
            "X-User-ID": 1,
            "X-Access-Token": "9GdJaJxa7O0B-mk0fxzYNw",
          },
        })
        .then((response) => {
          dbConnectionList();
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="wrapper__container__list">
      <div className="db_container">
        <h1 className="dbhead"> Database Connection </h1>
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
                  }}
                >
                  ok
                </button>
              </div>
            </div>
          ) : (
            <div className="success__message">
              <div className="header__message">
                <h1 style={{ color: "#8d0101" }}>Failed </h1>
                <span style={{ fontSize: "12px" }}>
                  please check your crediential{" "}
                </span>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                >
                  ok
                </button>
              </div>
            </div>
          )
        ) : null}

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
                type="password"
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
        {dbCollection.map((item, index) => {
          return (
            <div className="db_table" key={index}>
              <button className="db_table_button">{item.name}</button>

              <button
                className="db_table_button_right"
                style={{ width: "auto" }}
                onClick={(e) => {
                  e.preventDefault();
                  deletedbConnection(item.name);
                }}
              >
                Delete Source
              </button>
              <button
                className="db_table_button_right "
                onClick={() => dbSelect(item.name)}
              >
                check Connection
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DBlist;
