import React, { useState, useEffect } from 'react';
import './dblist.css';
import axios from 'axios';

function clickSrc() {
  alert('This DB is SRC');
}

function DBlist() {
  const [dbCollection, setDbCollection] = useState([]);
  const [dbName, setDbName] = useState('');
  const [dbPassword, setDbPassword] = useState('');
  const [dbData, setDbData] = useState([]);
  const [checkConnection, setcheckConnection] = useState(false);

  const dbSelect = name => {
    setDbName(name);
    setcheckConnection(!checkConnection);
  };

  const checkDbConnection = async () => {
    try {
      await axios
        .get('/v1/db_connection_check', {
          params: {
            connection_name: dbName,
            inserted_db_password: dbPassword,
          },
          headers: {
            'X-User-ID': 1,
            'X-Access-Token': '9GdJaJxa7O0B-mk0fxzYNw',
          },
        })
        .then(response => {
          alert(response.data.status);
          console.log(response.data);
          setDbPassword('');
          setcheckConnection(!checkConnection);
        })
        .catch(error => {
          console.log(error);
          setDbPassword('');
          alert('please check your credientials');
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    try {
      axios
        .get('/v1/list_db_connections', {
          headers: {
            'X-User-ID': 1,
            'X-Access-Token': '9GdJaJxa7O0B-mk0fxzYNw',
          },
        })
        .then(response => {
          setDbData(response.data.result_list);
          const data = Object.keys(response.data.result_list);
          data.map((item, index) => {
            setDbCollection(data => [...data, { id: index, name: item }]);
          });
        })
        .catch(error => {
          console.log(error);
          alert('please check your credientials');
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className='db_container'>
      <h1 className='dbhead'> Database Connection </h1>
      {checkConnection ? (
        <div className='check__db__connection'>
          <div className='db_connection_wrapper'>
            <div>Name</div>
            <input
              type='text'
              value={dbName ? dbData[dbName].source_name : dbName}
              disabled
            />
          </div>
          <div className='db_connection_wrapper'>
            <div>Password</div>
            <input
              type='text'
              placeholder='enter password'
              value={dbPassword}
              onChange={e => setDbPassword(e.target.value)}
            />
          </div>
          <div className='wrapper__btn'>
            <button
              className='cancel__btn'
              onClick={() => setcheckConnection(!checkConnection)}
            >
              Cancel
            </button>
            <button className='submit__btn' onClick={checkDbConnection}>
              Submit
            </button>
          </div>
        </div>
      ) : null}
      {dbCollection.map((item, index) => {
        return (
          <div className='db_table' key={index}>
            <button
              onClick={() => dbSelect(item.name)}
              className='db_table_button'
            >
              {item.name}
            </button>
            <button className='db_table_button_right'>Select Target</button>
            <button className='db_table_button_right'>Select Source</button>
          </div>
        );
      })}
    </div>
  );
}

export default DBlist;
