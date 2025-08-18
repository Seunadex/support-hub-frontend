import React, { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
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
          <button onClick={handleLogout} className='text-gray-600 border border-gray-300 rounded-md px-4 py-1 hover:cursor-pointer'>Logout</button>
        ) : (
          <NavLink to="/login" className='text-white hover:cursor-pointer'>Login</NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
