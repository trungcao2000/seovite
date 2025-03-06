import React, { createContext, useState, useEffect } from "react";
import { readItems } from "../api/firebaseService";
// Tạo Context
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    readItems((data) => {
      setProducts(
        Object.entries(data || {}).map(([id, val]) => ({ id, ...val }))
      );
    }, "products");
  }, []);
  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toString().includes(searchTerm) // Tìm theo ID
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  useEffect(() => {
    readItems((data) => {
      setCart(
        Object.entries(data || {}).map(([cartId, val]) => ({ cartId, ...val }))
      );
    }, "carts");
  }, []);

  const userCartIds = cart
    .filter((product) => product.userId === user?.userId) // Lọc theo userId
    .map((product) => product.cartId); // Lấy danh sách cartId

  console.log(userCartIds); // Kiểm tra danh sách cartId của user hiện tại

  const filteredCarts = cart
    .filter(
      (product) =>
        product.userId === user?.userId && // Lọc theo userId
        product.cartId.toString().includes(searchTerm) // Tìm theo ID
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <AppContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        products,
        setProducts,
        user,
        setUser,
        cart,
        setCart,
        filteredProducts,
        searchTerm,
        setSearchTerm,
        filteredCarts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
