import { useEffect, useContext, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { AddShoppingCart, Visibility } from "@mui/icons-material";
import AuthModal from "../models/AuthModal";
import { readItems } from "../api/firebaseService";
import { AppContext } from "../context/AppContext";

const ProductsGrid = () => {
  const { filteredProducts, setProducts, loggedIn, setLoggedIn } =
    useContext(AppContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  useEffect(() => {
    readItems((data) => {
      setProducts(
        Object.entries(data || {}).map(([id, val]) => ({ id, ...val }))
      );
    }, "products");
  }, []);

  // Mở modal thông tin sản phẩm
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <Grid container spacing={2}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card
              sx={{
                maxWidth: 345,
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image || "https://via.placeholder.com/200"}
                alt={product.name}
                sx={{ cursor: "pointer" }}
                onClick={() => handleOpenModal(product)}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body1" color="text.secondary">
                  {product.price} VNĐ
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "space-between",
                  px: 2,
                  pb: 2,
                }}
              >
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    if (loggedIn) {
                      alert("Mua thành công");
                    } else {
                      setOpenAuthModal(true);
                    }
                  }}
                  startIcon={<AddShoppingCart />}
                  sx={{
                    transition: "0.2s",
                    "&:hover": { backgroundColor: "#1976d2" },
                  }}
                >
                  Mua ngay
                </Button>

                {/* Modal đăng nhập */}
                <AuthModal
                  open={openAuthModal}
                  setOpen={setOpenAuthModal}
                  setLoggedIn={setLoggedIn}
                />
                <Button
                  size="small"
                  color="secondary"
                  variant="outlined"
                  fullWidth
                  onClick={() => handleOpenModal(product)}
                  startIcon={<Visibility />}
                >
                  Chi tiết
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal thông tin sản phẩm */}
      <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        {selectedProduct && (
          <>
            <DialogTitle>{selectedProduct.name}</DialogTitle>
            <DialogContent dividers>
              <CardMedia
                component="img"
                height="250"
                image={
                  selectedProduct.image || "https://via.placeholder.com/250"
                }
                alt={selectedProduct.name}
                sx={{ borderRadius: 2 }}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Giá: {selectedProduct.price} VNĐ
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {selectedProduct.description || "Không có mô tả chi tiết"}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                size="small"
                color="primary"
                variant="contained"
                fullWidth
                onClick={() => handleAddToCart(product)}
                startIcon={<AddShoppingCart />}
                sx={{
                  transition: "0.2s",
                  "&:hover": { backgroundColor: "#1976d2" },
                }}
              >
                Giỏ hàng
              </Button>
              <Button onClick={handleCloseModal} color="error">
                Đóng
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default ProductsGrid;
