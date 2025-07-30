import { Outlet, useLocation } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

export default function MainLayout() {
  const location = useLocation();

  // Check if the current route is "/login"
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Conditionally render NavigationBar */}
      {!isLoginPage && <NavigationBar /> && !isRegisterPage && <NavigationBar />}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      {/* Conditionally render Footer */}
      {!isLoginPage && <Footer /> && !isRegisterPage && <Footer />}
    </div>
  );
}
