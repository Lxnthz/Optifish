import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout"; // New Admin Layout
import ProductPage from "./pages/ProductPage";
import Home from "./pages/Home";
import LoginForm from "./components/LoginRegister/LoginForm.jsx";
import RegisterForm from "./components/LoginRegister/RegisterForm.jsx";
import AdminLogin from "./admins/AdminLogin.jsx";
import AdminDashboard from "./admins/AdminDashboard.jsx"; // Admin Dashboard
import Calculator from "./pages/Calculator.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import StorePage from "./components/Settings/StorePage";
import Keranjang from "./pages/Keranjang.jsx";
import Blog from "./pages/Blog";
import BlogDetail from "./components/Blog/BlogDetail";
import WriteBlog from "./components/Blog/WriteBlog";
import GroupBuyPage from "./pages/GroupBuyPage";

function App() {
  const user = JSON.parse(localStorage.getItem("user")); // Assuming user data is stored in localStorage

  return (
    <Router>
      <Routes>
        {/* Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/kalkulator" element={<Calculator />} />
          <Route path="/produk" element={<ProductPage />} />
          <Route path="/keranjang" element={<Keranjang userId={user?.id} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/blog/write" element={<WriteBlog />} />
          <Route path="/group-buying-list" element={<GroupBuyPage />} />
        </Route>

        {/* Admin Layout */}
        <Route element={<AdminLayout />}>
          <Route path="/adm/login" element={<AdminLogin />} />
          <Route path="/adm/dashboard" element={<AdminDashboard />} />
          {/* Add more admin routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
