import { useContext, useState } from "react";
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
import { AddShoppingCart } from "@mui/icons-material";
import AuthModal from "../models/AuthModal";
import UserInfoModal from "../models/UserInfoModal";
import { addItem } from "../api/firebaseService";
import { AppContext } from "../context/AppContext";

const ProductsGrid = () => {
  const { filteredProducts, loggedIn, setLoggedIn, user, setCart } =
    useContext(AppContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [buy, setBuy] = useState(false);
  const [cartIds, setCartIds] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const [openUserInfoModal, setOpenUserInfoModal] = useState(false);

  const toggleContent = () => {
    setShowFullContent((prev) => !prev);
  };

  // Mở modal thông tin sản phẩm
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleAddToCart = async (product) => {
    setOpenUserInfoModal(true);
    setSelectedProduct(product); // Đúng cú pháp set state
    setBuy(true);

    try {
      const newId = Date.now().toString();
      const cartProduct = {
        cartId: newId,
        productId: product.productId,
        stock: 1,
        totalPrice: product.price * 1,
        userId: user?.userId || "admin",
        createdAt: new Date().toISOString(),
        status: "Chờ duyệt",
      };

      await addItem(newId, cartProduct, "carts");
      setCart((prev) => [...prev, cartProduct]);
      setCartIds(newId);
      setSuccessSnackbar(true);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
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
                      handleAddToCart(product);
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

                {/* Modal thông tin user */}
                <UserInfoModal
                  open={openUserInfoModal}
                  handleClose={() => setOpenUserInfoModal(false)}
                  buy={buy}
                  cartId={cartIds}
                  productPrice={selectedProduct?.price}
                />
                {/* Modal đăng nhập */}
                <AuthModal
                  open={openAuthModal}
                  setOpen={setOpenAuthModal}
                  setLoggedIn={setLoggedIn}
                />
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
                {selectedProduct.description ? (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "block",
                        wordBreak: "break-word",
                        whiteSpace: "pre-line",
                        lineHeight: 1.5,
                      }}
                    >
                      {showFullContent
                        ? selectedProduct.description
                        : `${selectedProduct.description.slice(0, 150)}...`}
                    </Typography>

                    {selectedProduct.description.length > 150 && (
                      <Button
                        size="small"
                        onClick={toggleContent}
                        sx={{
                          mt: 1,
                          textTransform: "none",
                          fontSize: "0.875rem",
                          color: "primary.main",
                        }}
                      >
                        {showFullContent ? "Ẩn bớt" : "Xem thêm"}
                      </Button>
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Không có mô tả chi tiết
                  </Typography>
                )}
              </Typography>
            </DialogContent>
            <DialogActions></DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default ProductsGrid;
