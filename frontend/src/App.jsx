import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import LoginForm from "./components/LoginRegister/LoginForm.jsx";
import RegisterForm from "./components/LoginRegister/RegisterForm.jsx";
import Profile from "./pages/Profile.jsx";
import SellerPage from "./pages/SellerPage.jsx";
import ConsultantPage from "./pages/ConsultantPage.jsx";
import AdminLogin from "./admins/AdminLogin.jsx";
import Calculator from "./pages/Calculator.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/seller" element={<SellerPage />} />
          <Route path="/consultant" element={<ConsultantPage />} />
          <Route path="/kalkulator" element={<Calculator />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/adm/login" element={<AdminLogin />} />
        {/* Add more admin routes here */}
      </Routes>
    </Router>
  );
}

export default App;
