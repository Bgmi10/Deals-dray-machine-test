import { Button } from '@mui/material';
import React, { useContext, useState } from 'react';
import { ToggleContext } from '../context/ToggleContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import { Menu, MenuItem } from '@mui/material';

export const Header = () => {
  const { isToggled, toggle } = useContext(ToggleContext);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  // State for the hamburger menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logout successful');
    navigate('/login'); 
    handleMenuClose(); // Close the menu after logout
  };

  return (
    <header className="bg-slate-900 p-4 shadow-md text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            src="https://static.ambitionbox.com/assets/v2/images/rs:fit:200:200:false:false/bG9jYWw6Ly8vbG9nb3Mvb3JpZ2luYWxzL2RlYWxzZHJheS1vbmxpbmUuanBn.webp"
            alt="logo"
            className="rounded-full h-12 w-12 object-cover"
          />
          <span className="text-2xl font-bold text-white">Deals Dray</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {token && (
            <nav className="flex space-x-6 text-lg">
              <Link to="/dashboard" className="hover:text-blue-300 transition duration-300">Home</Link>
              <Link to="/employee-list" className="hover:text-blue-300 transition duration-300">Employee List</Link>
            </nav>
          )}

          {!token ? (
            <Button onClick={toggle} variant="contained" color="primary" className="bg-blue-500 hover:bg-blue-600">
              {!isToggled ? 'Sign Up' : 'Log In'}
            </Button>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <PersonIcon className="text-blue-500" fontSize="large" />
                <span className="text-lg font-semibold">{user?.name}</span>
              </div>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition duration-300 ease-in-out">
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Hamburger Menu for Mobile Devices */}
        <div className="md:hidden flex items-center">
          <Button onClick={handleMenuOpen} className="text-white">
            <MenuIcon />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            className="bg-slate-900"
            PaperProps={{
              style: {
                maxHeight: '300px',
                width: '200px',
              },
            }}
          >
            {token && (
              <>
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/dashboard" className="text-slate-300 hover:text-blue-300 w-full">Home</Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/employee-list" className="text-slate-300 hover:text-blue-300 w-full">Employee List</Link>
                </MenuItem>
              </>
            )}
            {!token ? (
              <MenuItem onClick={toggle} className="text-slate-300 hover:text-blue-300">
                {!isToggled ? 'Sign Up' : 'Log In'}
              </MenuItem>
            ) : (
              <MenuItem onClick={handleLogout} className="text-slate-300 hover:text-red-500">Logout</MenuItem>
            )}
          </Menu>
        </div>
      </div>
    </header>
  );
};
