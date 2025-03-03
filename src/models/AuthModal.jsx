import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { registerUser, loginUser } from "../api/firebaseService";

const AuthModal = ({ open, setOpen, setLoggedIn }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pass: "",
    address: "",
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
    setFormData({ name: "", phone: "", pass: "", address: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (tabIndex === 0) {
        // Đăng nhập
        const res = await loginUser(formData.phone, formData.pass);
        if (res.success) {
          alert("Đăng nhập thành công!");
          setLoggedIn(true);
          handleClose();
        } else {
          alert(res.message);
        }
      } else {
        // Đăng ký
        const res = await registerUser(
          formData.phone,
          formData.pass,
          formData.name,
          formData.address // Không cần truyền ảnh, ảnh mặc định là ""
        );
        alert(res.message);
        if (res.success) {
          setTabIndex(0); // Chuyển về tab đăng nhập sau khi đăng ký thành công
        }
      }
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Vui lòng đăng nhập trước khi mua hàng, chưa có tài khoản vui lòng đăng
          ký!
        </Typography>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Đăng nhập" />
          <Tab label="Đăng ký" />
        </Tabs>

        {tabIndex === 1 && (
          <TextField
            label="Họ tên"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />
        )}
        <TextField
          label="Số điện thoại"
          name="phone"
          fullWidth
          margin="normal"
          value={formData.phone}
          onChange={handleChange}
        />
        <TextField
          label="Mật khẩu"
          name="pass"
          type="password"
          fullWidth
          margin="normal"
          value={formData.pass}
          onChange={handleChange}
        />
        {tabIndex === 1 && (
          <TextField
            label="Địa chỉ"
            name="address"
            fullWidth
            margin="normal"
            value={formData.address}
            onChange={handleChange}
          />
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          {tabIndex === 0 ? "Đăng nhập" : "Đăng ký"}
        </Button>
      </Box>
    </Modal>
  );
};

export default AuthModal;
