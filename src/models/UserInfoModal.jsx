import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { updateUser } from "../api/firebaseService";

const UserInfoModal = ({ open, handleClose, buy, cartId, productPrice }) => {
  const { user, setUser } = useContext(AppContext);
  const phone = "0939635666";
  const note = `${cartId}_${productPrice}`;
  const amount = productPrice;
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [status, setStatus] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (open && user) {
      setFormData({
        id: user.userId || "",
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setMessage("");
    }
  }, [open, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async () => {
    if (!formData.id) {
      setMessage("Lỗi: Không tìm thấy ID người dùng!");
      return;
    }

    setLoading(true);
    const result = await updateUser(formData.id, formData);
    setLoading(false);

    if (result.success) {
      setMessage("Dữ liệu đã được thay đổi");
      setSuccessSnackbar(true);
      setUser((prevUser) => ({
        ...prevUser,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      }));
    } else {
      setMessage(result.message);
    }
  };

  useEffect(() => {
    if (buy) {
      const generateQRCode = async () => {
        try {
          const url = `http://momofree.apimienphi.com/api/QRCode?phone=${phone}&amount=${amount}&note=${note}`;
          setQrCode(url);
          setStatus("🟡 Vui lòng quét QR để thanh toán...");
          setChecking(true);
        } catch (error) {
          setStatus("❌ Lỗi khi tạo mã QR");
        }
      };
      generateQRCode();
    }
  }, [buy, amount, note]);

  useEffect(() => {
    let interval;
    if (checking) {
      interval = setInterval(() => {
        checkTransaction();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [checking]);

  const checkTransaction = async () => {
    setLoading(true);
    const response = await axios.get(
      `https://momofree.apimienphi.com/api/Check?phone=${encodeURIComponent(
        phone
      )}&amount=${encodeURIComponent(amount)}`
    );

    if (response?.data?.success) {
      const {
        phone: resPhone,
        amount: resAmount,
        note: resNote,
      } = response.data;

      if (
        resPhone?.toString() === phone?.toString() &&
        Number(resAmount) === Number(amount) &&
        resNote?.trim() === note?.trim()
      ) {
        setStatus("✅ Đã thanh toán thành công!");
        setChecking(false);
      } else {
        setStatus("⚠️ Thông tin không khớp, kiểm tra lại...");
      }
    } else {
      setStatus("⏳ Đang chờ thanh toán...");
    }
    setLoading(false);
  };

  return (
    <>
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
          }}
        >
          <Typography variant="h6">Thông tin người dùng</Typography>
          <TextField
            label="Họ và Tên"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Số điện thoại"
            name="phone"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            label="Địa chỉ"
            name="address"
            fullWidth
            margin="normal"
            value={formData.address}
            onChange={handleChange}
          />
          {message && (
            <Typography
              color={message.includes("thành công") ? "green" : "red"}
              sx={{ mt: 1 }}
            >
              {message}
            </Typography>
          )}
          {buy && qrCode && (
            <div>
              <Typography variant="h6">Quét mã QR để thanh toán:</Typography>
              <img src={qrCode} alt="QR Code" style={{ width: "100%" }} />
              <Typography>
                {loading ? "🔄 Đang kiểm tra..." : status}
              </Typography>
            </div>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleUpdateUser}
          >
            Xác nhận
          </Button>
        </Box>
      </Modal>
      <Snackbar
        open={successSnackbar}
        autoHideDuration={3000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccessSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Chỉnh sửa thành công!
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserInfoModal;
