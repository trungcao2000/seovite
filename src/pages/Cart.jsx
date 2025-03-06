import { useContext, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { Add, Remove, Edit } from "@mui/icons-material";
import { updateItem, deleteItem } from "../api/firebaseService";
import { AppContext } from "../context/AppContext";

const ProductsGrid = () => {
  const { filteredCarts, setCart } = useContext(AppContext);
  const [editStock, setEditStock] = useState({});

  // Cập nhật số lượng lên Firebase
  const handleUpdateStock = async (cartId) => {
    // Tìm sản phẩm trong cart để giữ nguyên dữ liệu cũ
    const existingProduct = cart.find((p) => p.cartId === cartId);
    if (!existingProduct) return; // Nếu không tìm thấy sản phẩm thì thoát

    // Lấy số lượng mới từ editStock nếu có, ngược lại dùng stock cũ
    const newStock = editStock[cartId] ?? existingProduct.stock;

    try {
      // Gửi dữ liệu lên Firebase (chỉ cập nhật stock)
      await updateItem(cartId, { stock: newStock }, "carts");

      // Cập nhật giỏ hàng trong state nhưng giữ nguyên dữ liệu cũ
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.cartId === cartId
            ? { ...existingProduct, stock: newStock }
            : item
        )
      );

      // Xóa giá trị chỉnh sửa tạm
      setEditStock((prev) => {
        const updatedStock = { ...prev };
        delete updatedStock[cartId];
        return updatedStock;
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
    }
  };

  // Xóa sản phẩm
  const handleDelete = async (cartId) => {
    try {
      await deleteItem(cartId, "carts");

      // Cập nhật lại danh sách giỏ hàng
      setCart((prev) => prev.filter((item) => item.cartId !== cartId));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Mã đơn hàng</b>
            </TableCell>
            <TableCell>
              <b>Số lượng</b>
            </TableCell>
            <TableCell>
              <b>Hành động</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCarts.map((product) => (
            <TableRow key={product.cartId}>
              <TableCell>{product.cartId}</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={editStock[product.cartId] ?? product.stock}
                  onChange={(e) => {
                    let newValue = parseInt(e.target.value) || 1;
                    newValue = Math.max(1, newValue); // Đảm bảo giá trị tối thiểu là 1

                    setEditStock((prev) => ({
                      ...prev,
                      [product.cartId]: newValue,
                    }));
                  }}
                  onBlur={() => handleUpdateStock(product.cartId)} // Cập nhật khi mất focus
                  size="small"
                  sx={{ width: 80, mx: 1 }}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdateStock(product.cartId)}
                  startIcon={<Edit />}
                >
                  Sửa
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(product.cartId)}
                  sx={{ ml: 1 }}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductsGrid;
