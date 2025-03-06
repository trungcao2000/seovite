import React, { useContext, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import {
  CheckCircleOutline,
  Cancel,
  Replay,
  Search,
} from "@mui/icons-material";
import { updateItem } from "../api/firebaseService";
import { AppContext } from "../context/AppContext";

// Danh sách trạng thái đơn hàng
const statuses = [
  "Tất cả",
  "Chờ duyệt",
  "Đang giao hàng",
  "Đã giao hàng",
  "Đã hủy",
];

const EmployeeOrderPage = () => {
  const { cart, setCart } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  // Hàm cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (cartItem, newStatus, successMsg) => {
    try {
      await updateItem(cartItem.cartId, { status: newStatus }, "carts");

      // Cập nhật lại trạng thái trong state
      setCart((prev) =>
        prev.map((item) =>
          item.cartId === cartItem.cartId
            ? { ...item, status: newStatus }
            : item
        )
      );
      alert(successMsg);
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      alert("Cập nhật thất bại.");
    }
  };

  // Lọc đơn hàng theo tìm kiếm & trạng thái
  const filteredProducts = cart.filter((item) => {
    const matchesSearch = item.cartId
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Tất cả" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold" }}
      >
        Quản lý đơn hàng
      </Typography>

      {/* 🔎 Tìm kiếm & Lọc */}
      <Box display="flex" justifyContent="center" gap={2} mb={3}>
        <TextField
          label="Tìm mã đơn hàng"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ endAdornment: <Search color="action" /> }}
          sx={{ width: "50%" }}
        />

        <FormControl size="small" sx={{ width: "30%" }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            sx={{
              borderRadius: "8px",
              backgroundColor: "#fff",
              "&:hover": { backgroundColor: "#f5f5f5" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1565c0",
              },
            }}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status} sx={{ fontWeight: "bold" }}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 📋 Bảng đơn hàng */}
      <TableContainer
        component={Paper}
        sx={{ boxShadow: 4, borderRadius: "16px" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Mã đơn hàng</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Trạng thái</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Hành động</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Không tìm thấy đơn hàng.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((item) => (
                <TableRow
                  key={item.cartId}
                  sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                >
                  <TableCell>{item.cartId}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={item.status}
                      color="primary"
                      sx={{ fontWeight: "bold", borderRadius: "16px" }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {/* Trạng thái: Chờ duyệt */}
                    {item.status === "Chờ duyệt" && (
                      <Box display="flex" gap={1} justifyContent="center">
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleOutline />}
                          onClick={() =>
                            updateOrderStatus(
                              item,
                              "Đang giao hàng",
                              `Đơn ${item.cartId} đã duyệt.`
                            )
                          }
                        >
                          Duyệt đơn
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<Cancel />}
                          onClick={() =>
                            updateOrderStatus(
                              item,
                              "Đã hủy",
                              `Đơn ${item.cartId} đã bị hủy.`
                            )
                          }
                        >
                          Hủy đơn
                        </Button>
                      </Box>
                    )}

                    {/* Trạng thái: Đang giao hàng */}
                    {item.status === "Đang giao hàng" && (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CheckCircleOutline />}
                        onClick={() =>
                          updateOrderStatus(
                            item,
                            "Đã giao hàng",
                            `Đơn ${item.cartId} giao thành công.`
                          )
                        }
                      >
                        Đã giao thành công
                      </Button>
                    )}

                    {/* Trạng thái: Đã hủy */}
                    {item.status === "Đã hủy" && (
                      <Button
                        variant="contained"
                        color="warning"
                        startIcon={<Replay />}
                        onClick={() =>
                          updateOrderStatus(
                            item,
                            "Chờ duyệt",
                            `Đơn ${item.cartId} đã khôi phục.`
                          )
                        }
                      >
                        Khôi phục
                      </Button>
                    )}

                    {/* Trạng thái: Đã giao hàng */}
                    {item.status === "Đã giao hàng" && (
                      <Chip
                        label="Hoàn tất"
                        color="success"
                        sx={{ fontWeight: "bold", borderRadius: "16px" }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EmployeeOrderPage;
