import { Box, Typography, Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Support = () => {
  const mapLink = "https://maps.app.goo.gl/ozWfrrkh4Rcn4cqn7";
  const handleOpenMap = () => {
    window.open(mapLink, "_blank"); // Mở link trong tab mới
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: { xs: "90%", sm: 400 }, // Chiều rộng linh hoạt
        textAlign: "center",
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
        mt: { xs: 1, sm: 2 }, // Giảm margin top trên mobile
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Liên hệ
      </Typography>

      <Typography variant="body2">
        📞 Phone:{" "}
        <a
          href="tel:0376256513"
          style={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
          }}
        >
          0376 256 513
        </a>
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<ChatIcon />}
        onClick={() => window.open("https://zalo.me/0376256513", "_blank")}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          fontSize: { xs: "14px", sm: "16px" }, // Font nhỏ hơn trên mobile
          mt: 1,
          width: "100%",
          maxWidth: { xs: "100%", sm: "80%" }, // Chiều rộng nút linh hoạt
        }}
      >
        Chat qua Zalo
      </Button>

      <Typography variant="body2" sx={{ mt: 1 }}>
        ✉️ Email:{" "}
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=trungthuoclao71@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
          }}
        >
          trungthuoclao71@gmail.com
        </a>
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<LocationOnIcon />}
        onClick={handleOpenMap}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          fontSize: { xs: "14px", sm: "16px" },
          mt: 1,
          width: "100%",
          maxWidth: { xs: "100%", sm: "80%" },
        }}
      >
        Mở Google Maps
      </Button>
    </Box>
  );
};

export default Support;
