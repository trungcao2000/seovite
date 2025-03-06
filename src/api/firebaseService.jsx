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
    // Kiểm tra xem số điện thoại đã được đăng ký chưa
    const phoneRef = ref(database, `phoneToUserId/${phone}`);
    const phoneSnapshot = await get(phoneRef);

    if (phoneSnapshot.exists()) {
      throw new Error("Số điện thoại đã được đăng ký!");
    }

    // Mã hóa mật khẩu
    const hashedPassword = bcrypt.hashSync(password, 10);
    const userId = Date.now().toString(); // Tạo userId duy nhất

    // Lưu thông tin người dùng theo userId
    await set(ref(database, `users/${userId}`), {
      userId,
      phone,
      name,
      address,
      image: "", // Ảnh mặc định
      password: hashedPassword,
    });

    // Lưu ánh xạ phone -> userId
    await set(phoneRef, { userId });

    return { success: true, message: "Đăng ký thành công!", userId };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
// 🔹 2️⃣ Hàm Đăng nhập
export const loginUser = async (phone, password) => {
  try {
    // Lấy userId từ số điện thoại
    const phoneRef = ref(database, `phoneToUserId/${phone}`);
    const phoneSnapshot = await get(phoneRef);

    if (!phoneSnapshot.exists()) {
      throw new Error("Số điện thoại chưa đăng ký!");
    }

    const { userId } = phoneSnapshot.val();

    // Lấy thông tin người dùng bằng userId
    const userRef = ref(database, `users/${userId}`);
    const userSnapshot = await get(userRef);

    if (!userSnapshot.exists()) {
      throw new Error("Dữ liệu người dùng không tồn tại!");
    }

    const userData = userSnapshot.val();
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
export const updateUser = async (userId, newData) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      throw new Error("Người dùng không tồn tại!");
    }

    const oldData = snapshot.val();
    const updatedPhone = newData.phone || oldData.phone;

    // Nếu cập nhật số điện thoại, kiểm tra xem số mới đã tồn tại chưa
    if (updatedPhone !== oldData.phone) {
      const newPhoneRef = ref(database, `phoneToUserId/${updatedPhone}`);
      const phoneSnapshot = await get(newPhoneRef);

      if (phoneSnapshot.exists()) {
        throw new Error("Số điện thoại đã được sử dụng!");
      }

      // Cập nhật ánh xạ phoneToUserId
      await remove(ref(database, `phoneToUserId/${oldData.phone}`));
      await set(newPhoneRef, { userId });
    }

    // Cập nhật thông tin user
    await update(userRef, {
      name: newData.name || oldData.name,
      phone: updatedPhone,
      address: newData.address || oldData.address,
    });

    return { success: true, message: "Cập nhật thành công!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const getUser = async (phone, setUser) => {
  try {
    // Lấy userId từ phone
    const phoneRef = ref(database, `phoneToUserId/${phone}`);
    const phoneSnapshot = await get(phoneRef);

    if (!phoneSnapshot.exists()) {
      throw new Error("Số điện thoại chưa đăng ký!");
    }

    const { userId } = phoneSnapshot.val();

    // Lấy thông tin user từ userId
    const userRef = ref(database, `users/${userId}`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      setUser(userSnapshot.val());
    } else {
      throw new Error("Không tìm thấy thông tin người dùng!");
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin user:", error.message);
  }
};
