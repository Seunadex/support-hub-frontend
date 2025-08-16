import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { NavLink, useNavigate } from "react-router";


const Navbar = () => {
  let navigate = useNavigate();

  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className='flex justify-between items-center p-4 shadow-md'>
      <div>
        <span className='text-white'>Support Hub</span>
      </div>
      <div>
        {isAuthenticated ? (
          <button onClick={handleLogout} className='text-white'>Logout</button>
        ) : (
          <NavLink to="/login" className='text-white'>Login</NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
