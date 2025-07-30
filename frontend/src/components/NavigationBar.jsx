import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/elements/logo-optifish.png";
import LogoWhite from "../assets/elements/logo-optifish-white.png";

export default function NavigationBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") {
      window.scrollTo(0, 1);
    } else {
      window.scrollTo(0, 0);
    }

    const handleScroll = () => {
      if (location.pathname !== "/" && window.scrollY === 0) {
        window.scrollTo(0, 1);
        return;
      }

      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setIsAuthenticated(!!storedUser);
  }, []);

  const handleAccountClick = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      navigate("/settings");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 font-bold">
        <div className="mx-13 my-5">
          <div
            className={`flex lg:bg-white items-center justify-between p-3 rounded-3xl lg:max-w-screen lg:mx-auto transition-all duration-200 ${
              isScrolled ? "lg:bg-white" : ""
            }`}>
            {/* Logo */}
            <Link to="/">
              <img
                className="hidden lg:block transition-all duration-200 w-27 xl:w-40"
                src={isScrolled ? Logo : Logo}
                alt="Optifish Logo"
              />
            </Link>

            {/* Desktop Navigation */}
            <div
              className={`hidden lg:flex text-[#04397B] items-start ml-4 w-full gap-x-3 transition-all duration-300 `}>
              <Link
                to="/"
                className={`py-2 px-3 flex items-center rounded-2xl transition-all duration-300 hover:bg-[#04397B] hover:text-white`}>
                Beranda
              </Link>
              <Link
                to="/produk"
                className={`py-2 px-3 flex items-center rounded-2xl transition-all duration-300 hover:bg-[#04397B] hover:text-white`}>
                Produk
              </Link>
              <Link
                to="/kalkulator"
                className={`py-2 px-3 flex items-center rounded-2xl transition-all duration-300 hover:bg-[#04397B] hover:text-white`}>
                Kalkulator
              </Link>
              <Link
                to="/tanya-ahli"
                className={`py-2 px-3 flex items-center rounded-2xl transition-all duration-300 hover:bg-[#04397B] hover:text-white`}>
                Tanya Ahli
              </Link>
              <Link
                to="/blog"
                className={`py-2 px-3 flex items-center rounded-2xl transition-all duration-300 hover:bg-[#04397B] hover:text-white`}>
                Blog
              </Link>
              <Link
                to="/group-buying-list"
                className={`py-2 px-3 flex items-center rounded-2xl transition-all duration-300 hover:bg-[#04397B] hover:text-white`}>
                Group Buying
              </Link>
            </div>

            {/* Desktop "Akun" and "Keranjang" */}
            <div
              className={`hidden lg:flex items-center gap-x-1 transition-all duration-50 text-[#04397B]`}>
              <button
                onClick={handleAccountClick}
                className={`py-2 px-3 flex items-center gap-x-2 rounded-2xl transition-all duration-300 hover:bg-[#04397B] hover:text-white`}>
                <FaUser /> Akun
              </button>
              <Link
                to="/keranjang"
                className={`py-2 px-3 flex items-center gap-x-2 rounded-2xl transition-all duration-300 hover:bg-[#04397B] hover:text-white`}>
                <FaShoppingCart /> Keranjang
              </Link>
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className={`py-2 px-3 flex items-center gap-x-2 rounded-2xl transition-all duration-300 hover:bg-[#04397B] hover:text-white`}>
                  <FaSignOutAlt /> Keluar
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Hamburger Menu Button */}
      <div className="fixed right-3 bottom-3 z-50 lg:hidden">
        <button
          onClick={toggleMenu}
          className="bg-blue-500 text-white text-2xl p-3 rounded-full shadow-lg focus:outline-none hover:bg-blue-600 transition-all duration-300">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-[#04397B] text-white z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}>
            <div className="flex justify-between items-center p-5">
              <h1 className="text-xl font-bold">Optifish</h1>
              <button
                onClick={toggleMenu}
                className="text-white text-2xl focus:outline-none">
                <FaTimes />
              </button>
            </div>
            <nav className="flex flex-col items-start mt-10 w-full px-5 space-y-4">
              <Link
                to="/"
                className="text-lg font-medium hover:underline"
                onClick={toggleMenu}>
                Beranda
              </Link>
              <Link
                to="/produk"
                className="text-lg font-medium hover:underline"
                onClick={toggleMenu}>
                Produk
              </Link>
              <Link
                to="/kalkulator"
                className="text-lg font-medium hover:underline"
                onClick={toggleMenu}>
                Kalkulator
              </Link>
              <Link
                to="/tanya-ahli"
                className="text-lg font-medium hover:underline"
                onClick={toggleMenu}>
                Tanya Ahli
              </Link>
              <Link
                to="/blog"
                className="text-lg font-medium hover:underline"
                onClick={toggleMenu}>
                Blog
              </Link>
              <Link
                to="/group-buying-list"
                className="text-lg font-medium hover:underline"
                onClick={toggleMenu}>
                Group Buying
              </Link>
              <button
                onClick={() => {
                  toggleMenu();
                  handleAccountClick();
                }}
                className="text-lg font-medium hover:underline text-left w-full">
                Akun
              </button>
              <Link
                to="/keranjang"
                className="text-lg font-medium hover:underline"
                onClick={toggleMenu}>
                Keranjang
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    toggleMenu();
                    handleLogout();
                  }}
                  className="text-lg font-medium hover:underline text-left w-full">
                  Keluar
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
