import { useState, useEffect, useContext } from "react";
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
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Add, Edit, Delete } from "@mui/icons-material";
import {
  readItems,
  addItem,
  updateItem,
  deleteItem,
} from "../api/firebaseService";
import { AppContext } from "../context/AppContext";
import { uploadFileToImgBB } from "../Upload";

const ProductsTable = () => {
  const { setProducts, filteredProducts } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const theme = useTheme();
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
    userId: "",
    reviews: 120,
    createdAt: new Date().toISOString(),
    status: "Chờ duyệt",
  });

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setCurrentProduct({
      ...currentProduct,
      image: await uploadFileToImgBB(file),
    }); // Hiển thị ảnh tạm trước khi upload
  };

  useEffect(() => {
    readItems((data) => {
      setProducts(
        Object.entries(data || {}).map(([id, val]) => ({ id, ...val }))
      );
    }, "products");
  }, []);

  const handleOpen = (product = null) => {
    setCurrentProduct(
      product || {
        name: "",
        description: "",
        price: 0,
        stock: 50,
        category: "",
        image: currentProduct.image,
        url: "",
        rating: 4.8,
        userId: "",
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

  const handleSave = async () => {
    try {
      if (currentProduct.id) {
        await updateItem(currentProduct.id, currentProduct, "products");
        setProducts((prev) =>
          prev.map((p) => (p.id === currentProduct.id ? currentProduct : p))
        );
      } else {
        const newId = Date.now().toString();
        await addItem(newId, { ...currentProduct, id: newId }, "products");
        setProducts((prev) => [...prev, { ...currentProduct, id: newId }]);
      }

      setOpen(false);
    } catch (error) {
      console.error("Lỗi thao tác sản phẩm:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteItem(selectedId, "products");
      setProducts((prev) => prev.filter((p) => p.id !== selectedId));
      setDeleteDialog(false);
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
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
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
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
                      setSelectedId(product.id);
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
      {/* Modal Thêm/Sửa */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {currentProduct.id ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tên sản phẩm"
            margin="dense"
            value={currentProduct.name}
            onChange={(e) =>
              setCurrentProduct({ ...currentProduct, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Mô tả"
            margin="dense"
            value={currentProduct.description}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                description: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label="Giá"
            margin="dense"
            type="number"
            value={currentProduct.price}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                price: Number(e.target.value),
              })
            }
          />
          <TextField
            fullWidth
            label="Số lượng tồn kho"
            margin="dense"
            type="number"
            value={currentProduct.stock}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                stock: Number(e.target.value),
              })
            }
          />

          {/* Chọn phân loại sản phẩm */}
          <FormControl fullWidth margin="dense" sx={{ mt: 2, mb: 1 }}>
            <InputLabel
              variant="outlined"
              sx={{
                background: theme.palette.background.paper,
                px: 0.5,
                color: theme.palette.text.primary,
              }}
            >
              Phân loại
            </InputLabel>
            <Select
              value={currentProduct.category || ""}
              onChange={(e) =>
                setCurrentProduct({
                  ...currentProduct,
                  category: e.target.value,
                })
              }
              displayEmpty
              sx={{
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
                "&.Mui-focused": {
                  borderColor: theme.palette.primary.main,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 200,
                    overflowY: "auto",
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                  },
                },
              }}
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
          <input type="file" accept="image/*" onChange={handleUpload} />
          {currentProduct.image && (
            <img
              src={currentProduct.image}
              alt="Ảnh sản phẩm"
              style={{ width: "100px", marginTop: 10 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      ;{/* Dialog Xóa */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa sản phẩm?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductsTable;
