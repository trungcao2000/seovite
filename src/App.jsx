import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import Sells from "./pages/Sells";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Support from "./pages/Support";
import Cart from "./pages/Cart";
function App() {
  return (
    // <MoMoPayment />
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="sells" element={<Sells />} />
        <Route path="orders" element={<Orders />} />
        <Route path="support" element={<Support />} />
        <Route path="cart" element={<Cart />} />
      </Route>
    </Routes>
  );
}

export default App;
