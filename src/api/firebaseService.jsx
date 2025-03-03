// firebaseService.js
import { database } from "../firebase";
import { ref, set, get, update, remove, onValue } from "firebase/database";
import bcrypt from "bcryptjs";
// 📝 Đọc dữ liệu (Items)
export const readItems = (callback, name) => {
  const ItemsRef = ref(database, name);
  onValue(
    ItemsRef,
    (snapshot) => {
      if (typeof callback === "function") {
        callback(snapshot.exists() ? snapshot.val() : {});
      } else {
        console.error("Lỗi: callback không phải là một hàm!");
      }
    },
    { onlyOnce: true } // Chỉ đọc một lần, tránh lặp vô hạn
  );
};
export const getProductById = async (productId) => {
  try {
    const productRef = ref(database, `products/${productId}`);
    const snapshot = await get(productRef);

    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error("Lỗi lấy sản phẩm:", error.message);
    return null;
  }
};

// ➕ Thêm
export const addItem = async (id, Item, name) => {
  const itemRef = ref(database, `${name}/${id}`);
  const snapshot = await get(itemRef);

  if (snapshot.exists()) {
    throw new Error(`ID "${id}" đã tồn tại. Vui lòng chọn ID khác.`);
  }

  return set(itemRef, Item);
};
// ✏️ Sửa
export const updateItem = (id, updatedItem, name) => {
  return update(ref(database, `${name}/${id}`), updatedItem);
};

// 🗑️ Xóa
export const deleteItem = (id, name) => {
  return remove(ref(database, `${name}/${id}`));
};

// 🔹 1️⃣ Hàm Đăng ký
export const registerUser = async (phone, password, name, address) => {
  try {
    const userRef = ref(database, `users/${phone}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      throw new Error("Số điện thoại đã được đăng ký!");
    }

    // Mã hóa mật khẩu
    const hashedPassword = bcrypt.hashSync(password, 10);
    const userId = Date.now().toString();

    // Lưu vào Firebase
    await set(userRef, {
      userId,
      phone,
      name,
      address,
      image: "", // Mặc định là chuỗi rỗng, có thể cập nhật sau
      password: hashedPassword,
    });

    return { success: true, message: "Đăng ký thành công!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 2️⃣ Hàm Đăng nhập
export const loginUser = async (phone, password) => {
  try {
    const snapshot = await get(ref(database, `users/${phone}`));

    if (!snapshot.exists()) {
      throw new Error("Số điện thoại chưa đăng ký!");
    }

    const userData = snapshot.val();
    const isMatch = bcrypt.compareSync(password, userData.password);

    if (!isMatch) {
      throw new Error("Sai mật khẩu!");
    }

    return { success: true, user: userData };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 3️⃣ Hàm Cập nhật thông tin User
export const updateUser = async (phone, newData) => {
  try {
    const encodedPhone = btoa(phone);
    const snapshot = await get(ref(database, `users/${encodedPhone}`));

    if (!snapshot.exists()) {
      throw new Error("Người dùng không tồn tại!");
    }

    // Cập nhật thông tin
    await update(ref(database, `users/${encodedPhone}`), {
      name: newData.name || snapshot.val().name,
      address: newData.address || snapshot.val().address,
      phone: newData.phone || snapshot.val().phone,
      image: newData.image || snapshot.val().image,
    });

    return { success: true, message: "Cập nhật thành công!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
