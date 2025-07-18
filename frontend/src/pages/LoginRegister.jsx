import { useState } from "react";
import LoginForm from "../components/LoginRegister/LoginForm.jsx";
import RegisterForm from "../components/LoginRegister/RegisterForm.jsx";
import OptifishLogo from "../assets/elements/logo-optifish.png";

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Register

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full px-5 md:px-10">
      {/* Logo */}

      {/* Forms */}
      <div className="w-full flex items-center justify-center">
        {isLogin ? (
          <LoginForm toggleForm={() => setIsLogin(false)} />
        ) : (
          <RegisterForm toggleForm={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}
