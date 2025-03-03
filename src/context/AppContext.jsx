import React, { createContext, useState } from "react";

// Tạo Context
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
