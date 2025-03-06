import { useState, useContext } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
  LinearProgress,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { addItem, updateItem, deleteItem } from "../api/firebaseService";
import { AppContext } from "../context/AppContext";
import { uploadFileToImgBB } from "../Upload";

const ProductsTable = () => {
  const { setProducts, filteredProducts, user } = useContext(AppContext);
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [deleteSnackbar, setDeleteSnackbar] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const categories = ["Điện tử", "Thời trang", "Gia dụng", "Sách", "Khác"];

  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 50,
    category: "",
    image: "",
    url: "",
    rating: 4.8,
    userId: user?.userId || "admin",
    reviews: 120,
    createdAt: new Date().toISOString(),
    status: "Chờ duyệt",
  });
  const searchMessage = filteredProducts.length
    ? `Có ${filteredProducts.length} sản phẩm.`
    : "Không có sản phẩm nào được tìm thấy.";
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setCurrentProduct({
      ...currentProduct,
      image: await uploadFileToImgBB(file),
    }); // Hiển thị ảnh tạm trước khi upload
  };

  const handleOpen = (product = null) => {
    setCurrentProduct(
      product || {
        name: "",
        description: "",
        price: 0,
        stock: 50,
        category: "",
        image: "",
        url: "",
        rating: 4.8,
        userId: user?.userId || "admin",
        reviews: 120,
        createdAt: new Date().toISOString(),
        status: "Chờ duyệt",
      }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSave = async () => {
    setLoading(true);
    try {
      if (currentProduct.productId) {
        await updateItem(currentProduct.productId, currentProduct, "products");
        setProducts((prev) =>
          prev.map((p) =>
            p.productId === currentProduct.productId ? currentProduct : p
          )
        );
        setSuccessSnackbar(true);
      } else {
        const newId = Date.now().toString();
        await addItem(
          newId,
          { ...currentProduct, productId: newId },
          "products"
        );
        setProducts((prev) => [
          ...prev,
          { ...currentProduct, productId: newId },
        ]);
        setSuccessSnackbar(true);
      }

      setOpen(false);
    } catch (error) {
      console.error("Lỗi thao tác sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await deleteItem(selectedId, "products");
      setProducts((prev) => prev.filter((p) => p.productId !== selectedId));
      setDeleteDialog(false);
      setDeleteSnackbar(true);
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpen()}
      >
        Thêm Sản Phẩm
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Phân loại</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.productId}>
                <TableCell>{product.productId}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price} VNĐ</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(product)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setSelectedId(product.productId);
                      setDeleteDialog(true);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {searchMessage && (
        <Typography sx={{ mt: 2, color: "gray" }}>{searchMessage}</Typography>
      )}
      {/* Modal Thêm/Sửa */}
      <Dialog open={open} onClose={!loading ? handleClose : undefined}>
        <DialogTitle>
          {currentProduct.id ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm"}
        </DialogTitle>
        <DialogContent>
          {loading && <LinearProgress sx={{ mb: 2 }} />}{" "}
          {/* Hiển thị tiến trình */}
          <TextField
            fullWidth
            label="Tên sản phẩm"
            margin="dense"
            value={currentProduct.name || ""}
            onChange={(e) =>
              setCurrentProduct({ ...currentProduct, name: e.target.value })
            }
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Mô tả"
            margin="dense"
            value={currentProduct.description || ""}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                description: e.target.value,
              })
            }
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Giá"
            margin="dense"
            type="number"
            value={currentProduct.price || ""}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                price: Number(e.target.value),
              })
            }
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Số lượng tồn kho"
            margin="dense"
            type="number"
            value={currentProduct.stock || ""}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                stock: Number(e.target.value),
              })
            }
            disabled={loading}
          />
          {/* Chọn phân loại sản phẩm */}
          <FormControl
            fullWidth
            margin="dense"
            sx={{ mt: 2, mb: 1 }}
            disabled={loading}
          >
            <Select
              value={currentProduct.category || ""}
              onChange={(e) =>
                setCurrentProduct({
                  ...currentProduct,
                  category: e.target.value,
                })
              }
              displayEmpty
            >
              <MenuItem disabled value="">
                Chọn phân loại sản phẩm
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Upload Ảnh */}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={loading}
          />
          {currentProduct.image && (
            <img
              src={currentProduct.image}
              alt="Ảnh sản phẩm"
              style={{ width: "100px", marginTop: 10 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={onSave} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog Xóa */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa sản phẩm?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>

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
          Lưu sản phẩm thành công!
        </Alert>
      </Snackbar>
      <Snackbar
        open={deleteSnackbar}
        autoHideDuration={3000}
        onClose={() => setDeleteSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setDeleteSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Xóa sản phẩm thành công!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductsTable;
