import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <div className='navbarWrapper'>
      <div className='navbar'>
        <div className='left_logo'>
          <div className='logo'>
            {' '}
            <Link to='/'>Demo</Link>
          </div>
        </div>
        <div className='rightOption'>
          <div className='nav__item'>
            <Link to='/'> Connection screen </Link>
          </div>
          <div className='nav__item'>
            <Link to='/dblist'> DB List</Link>
          </div>
          <div className='nav__item'>
            <Link to='/list'> Connection screen </Link>
          </div>
          <div className='nav__item'>
            <Link to='/mapping'> Mapping </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
