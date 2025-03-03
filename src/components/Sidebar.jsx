import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
} from "@mui/material";
import {
  Home,
  ShoppingCart,
  Inventory,
  Menu,
  ChevronLeft,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ open, toggleDrawer }) => {
  const location = useLocation();
  const menuItems = [
    { text: "TRANG CHỦ", icon: <Home />, path: "/" },
    { text: "SẢN PHẨM", icon: <Inventory />, path: "/products" },
    { text: "ĐĂNG BÁN", icon: <ShoppingCart />, path: "/sells" },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? 240 : 60,
        transition: "width 0.3s",
        "& .MuiDrawer-paper": {
          width: open ? 240 : 60,
          transition: "width 0.3s",
          overflowX: "hidden",
          bgcolor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          p: 1,
        }}
      >
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeft /> : <Menu />}
        </IconButton>
      </Box>
      <Divider />

      <List>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path; // Kiểm tra mục đang chọn
          return (
            <ListItem
              button
              key={index}
              component={Link}
              to={item.path}
              sx={{
                bgcolor: isActive ? "primary.main" : "transparent",
                color: isActive ? "white" : "text.primary",
                borderRadius: 2,
                mx: 1,
                "&:hover": { bgcolor: "primary.light", color: "white" },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? "white" : "inherit" }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
