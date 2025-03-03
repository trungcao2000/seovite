export const uploadFileToImgBB = async (file) => {
  if (!file) return;

  const API_KEY = "1101242cd11f5b2c50cacc731852c95c"; // Thay bằng API Key của bạn
  const fileExt = file.name.split(".").pop(); // Lấy phần mở rộng file
  const newFileName = `${Date.now()}.${fileExt}`; // Tạo ID dựa trên timestamp

  const formData = new FormData();
  formData.append("image", file);
  formData.append("name", newFileName); // Đặt tên file theo timestamp

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.success) {
      const imageUrl = data.data.url;
      return imageUrl;
    } else {
      console.error("Lỗi upload:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi tải ảnh lên ImgBB:", error);
    return null;
  }
};
