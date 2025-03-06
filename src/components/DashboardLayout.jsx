import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Switch,
  Avatar,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useState, useContext } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";
import { AppContext } from "../context/AppContext";
import AuthModal from "../models/AuthModal";
import UserInfoModal from "../models/UserInfoModal";
const DashboardLayout = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { loggedIn, setLoggedIn, searchTerm, setSearchTerm } =
    useContext(AppContext);
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [openUserInfoModal, setOpenUserInfoModal] = useState(false);

  const toggleDrawer = () => setOpen(!open);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    setLoggedIn(false);
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${open ? 240 : 60}px)`,
          ml: `${open ? 240 : 60}px`,
          transition: "width 0.3s",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Thanh tìm kiếm ở giữa */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              mx: 2,
              flexGrow: 1,
              maxWidth: 400,
              bgcolor: darkMode ? "background.paper" : "#fff",
              borderRadius: "5px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: darkMode ? "#90caf9" : "#1976d2",
                },
                "&:hover fieldset": {
                  borderColor: darkMode ? "#64b5f6" : "#1565c0",
                },
                "&.Mui-focused fieldset": {
                  borderColor: darkMode ? "#42a5f5" : "#0d47a1",
                },
              },
              input: {
                color: darkMode ? "#fff" : "#000",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ color: darkMode ? "#90caf9" : "#1976d2" }}
                  />
                </InputAdornment>
              ),
            }}
          />

          {/* Nhóm bên phải */}
          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
            {/* Toggle Dark Mode */}
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              color="default"
            />
            <IconButton color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* Avatar User */}
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <Avatar src="https://via.placeholder.com/40" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {loggedIn ? (
                <>
                  <MenuItem onClick={() => setOpenUserInfoModal(true)}>
                    Thông tin
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                </>
              ) : (
                <MenuItem onClick={() => setOpenAuthModal(true)}>
                  Đăng nhập
                </MenuItem>
              )}
              {/* Modal login */}
              <AuthModal
                open={openAuthModal}
                setOpen={setOpenAuthModal}
                setLoggedIn={setLoggedIn}
              />
              {/* Modal thông tin user */}
              <UserInfoModal
                open={openUserInfoModal}
                handleClose={() => setOpenUserInfoModal(false)}
              />
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Sidebar open={open} toggleDrawer={toggleDrawer} />

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
