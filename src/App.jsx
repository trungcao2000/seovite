import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import Sells from "./pages/Sells";
import Products from "./pages/Products";
function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="sells" element={<Sells />} />
      </Route>
    </Routes>
  );
}

export default App;
