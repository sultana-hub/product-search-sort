import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Avatar
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
import { Link, NavLink } from 'react-router-dom';
import { usersImages } from '../api/axiosInstance';
import "./styleNav.css"
const Header = () => {
  const navigate = useNavigate()
  const name = window.sessionStorage.getItem("name")
  const image = window.sessionStorage.getItem('image')
  const isAuthenticated = window.sessionStorage.getItem("token")


  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleLogin = () => {
    navigate('/login')
    handleClose();
  }

  const handleRegister = () => {
    navigate('/register')
    handleClose();
  }

  const handleDashboard = () => {
    // navigate to dashboard
    handleClose();
  };

  const handleLogout = () => {
    sessionStorage.clear("token")
    handleClose();
  };

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" component="div">
            <NavLink to="/e-kart" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>E-Kart</NavLink>

          </Typography>
          <Button color="inherit"> <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>Home</NavLink> </Button>
          {isAuthenticated && (
            <>
              <Button color="inherit">
                <NavLink
                  to="/create"
                  className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}
                >
                  Add Product
                </NavLink>
              </Button>

              <Button color="inherit">
                <NavLink
                  to="/profile"
                  className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}
                >
                  Profile
                </NavLink>
              </Button>
            </>
          )}

          {
            !isAuthenticated && (
              <>
                <Button color="inherit"><NavLink to="/register" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>Register</NavLink></Button>
                <Button color="inherit"><NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>Login</NavLink></Button>
              </>
            )
          }

        </Box>

        {/* Right Section */}
        {
          isAuthenticated && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box display="flex" alignItems="center" onClick={handleMenuClick} sx={{ cursor: 'pointer' }}>
                  <Typography variant="body1" fontWeight="medium" marginRight={1}>
                   welcome, {name}
                  </Typography>
                  <Avatar alt="User Avatar" src={usersImages(image)} />
                  <IconButton size="small" color="inherit">
                    <ArrowDropDownIcon />
                  </IconButton>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={handleDashboard}><NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>Dashboard</NavLink></MenuItem>
                  <MenuItem onClick={handleLogout}><NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>Logout</NavLink></MenuItem>
                </Menu>



              </Box>
            </>
          )
        }

      </Toolbar>
    </AppBar>
  );
};

export default Header;


