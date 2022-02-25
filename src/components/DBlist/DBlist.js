import React from 'react';
import './dblist.css';

function clickMe() {
  alert('You Are Connected with DB');
}
function clickSrc() {
  alert('This DB is SRC');
}

function DBlist() {
  return (
    <div className='db_container'>
      <h1 className='dbhead'> DB List </h1>
      <div className='db_table'>
        <button onClick={clickMe} className='db_table_button'>
          Connect With DB 1
        </button>
        <button onClick={clickSrc} className='db_table_button_right'>
          Select Target
        </button>
        <button onClick={clickSrc} className='db_table_button_right'>
          Select Source
        </button>
      </div>
      <div className='db_table'>
        <button onClick={clickMe} className='db_table_button'>
          Connect With DB 2
        </button>
        <button onClick={clickSrc} className='db_table_button_right'>
          Select Target
        </button>
        <button onClick={clickSrc} className='db_table_button_right'>
          Select Source
        </button>
      </div>
      <div className='db_table'>
        <button onClick={clickMe} className='db_table_button'>
          Connect With DB 3
        </button>
        <button onClick={clickSrc} className='db_table_button_right'>
          Select Target
        </button>
        <button onClick={clickSrc} className='db_table_button_right'>
          Select Source
        </button>
      </div>
      <div className='db_table'>
        <button onClick={clickMe} className='db_table_button'>
          Connect With DB 4
        </button>
        <button onClick={clickSrc} className='db_table_button_right'>
          Select Target
        </button>
        <button onClick={clickSrc} className='db_table_button_right'>
          Select Source
        </button>
      </div>
      <div className='db_table'>
        <button onClick={clickMe} className='db_table_button'>
          Connect With DB 5
        </button>
        <button onClick={clickSrc} className='db_table_button_right'>
          Select Target
        </button>
        <button onClick={clickSrc} className='db_table_button_right'>
          Select Source
        </button>
      </div>
    </div>
  );
}

export default DBlist;
