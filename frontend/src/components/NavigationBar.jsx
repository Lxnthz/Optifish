import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Logo from "../assets/elements/logo-optifish.png";
import LogoWhite from "../assets/elements/logo-optifish-white.png";

export default function NavigationBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHamburgerMenuScrolledToBottom, setIsHamburgerMenuScrolledToBottom] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const isHomepage = location.pathname === "/";
    const isDesktop = window.innerWidth > 768;

    // Scroll to initial position
    if (isDesktop) {
      if (!isHomepage) {
        window.scrollTo(0, 1); // non-home page
      } else {
        window.scrollTo(0, 0); // home page
      }
    }

    // Scroll lock on non-home pages
    const handleScroll = () => {
      if (!isHomepage && window.scrollY === 0 && isDesktop) {
        window.scrollTo(0, 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleHamburgerMenuScrollToBottom = () => {
      setIsHamburgerMenuScrolledToBottom(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleHamburgerMenuScrollToBottom);
    return () => {
      window.removeEventListener("scroll", handleHamburgerMenuScrollToBottom);
    };
  }, []);

  useEffect(() => {
    // Check if the user is logged in
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
    // Clear user data from localStorage
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login"); // Redirect to login page
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="fixed top-0 w-full z-50">
        <div className="mx-13 my-5">
          <div
            className={`flex items-center justify-between p-3 rounded-3xl lg:max-w-screen lg:mx-auto transition-all duration-200 ${
              isScrolled ? "lg:bg-white" : "bg-transparent"
            }`}>
            {/* Logo */}
            <Link to="/">
              <img
                className="hidden lg:block transition-all duration-200 w-27 xl:w-40"
                src={isScrolled ? Logo : LogoWhite}
                alt="Optifish Logo"
              />
            </Link>

            {/* Desktop Navigation */}
            <div
              className={`hidden lg:flex items-start ml-4 w-full gap-x-3 transition-all duration-300 ${
                isScrolled ? "text-[#04397B]" : "text-white"
              }`}>
              <Link
                to="/"
                className={`py-2 px-3 flex items-center rounded-2xl ${
                  isScrolled
                    ? "transition-all duration-300 hover:bg-[#04397B] hover:text-white"
                    : ""
                }`}>
                Beranda
              </Link>
              <Link
                to="/produk"
                className={`py-2 px-3 flex items-center rounded-2xl ${
                  isScrolled
                    ? "transition-all duration-300 hover:bg-[#04397B] hover:text-white"
                    : ""
                }`}>
                Produk
              </Link>
              <Link
                to="/kalkulator"
                className={`py-2 px-3 flex items-center rounded-2xl ${
                  isScrolled
                    ? "transition-all duration-300 hover:bg-[#04397B] hover:text-white"
                    : ""
                }`}>
                Kalkulator
              </Link>
              <Link
                to="/tanya-ahli"
                className={`py-2 px-3 flex items-center rounded-2xl ${
                  isScrolled
                    ? "transition-all duration-300 hover:bg-[#04397B] hover:text-white"
                    : ""
                }`}>
                Tanya Ahli
              </Link>
              <Link
                to="/blog"
                className={`py-2 px-3 flex items-center rounded-2xl ${
                  isScrolled
                    ? "transition-all duration-300 hover:bg-[#04397B] hover:text-white"
                    : ""
                }`}>
                Blog
              </Link>
            </div>

            {/* Desktop "Akun" and "Keranjang" */}
            <div
              className={`hidden lg:flex items-center gap-x-1 transition-all duration-50  ${
                isScrolled ? "text-[#04397B]" : "text-white"
              }`}>
              <button
                onClick={handleAccountClick}
                className={`py-2 px-3 flex items-center gap-x-2 rounded-2xl ${
                  isScrolled
                    ? "transition-all duration-100 hover:bg-[#04397B] hover:text-white"
                    : ""
                }`}>
                <FaUser /> Akun
              </button>
              <Link
                to="/keranjang"
                className={`py-2 px-3 flex items-center gap-x-2 rounded-2xl ${
                  isScrolled
                    ? "transition-all duration-300 hover:bg-[#04397B] hover:text-white"
                    : ""
                }`}>
                <FaShoppingCart /> Keranjang
              </Link>
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className={`py-2 px-3 flex items-center gap-x-2 rounded-2xl ${
                    isScrolled
                      ? "transition-all duration-100 hover:bg-[#04397B] hover:text-white"
                      : ""
                  }`}>
                  <FaSignOutAlt /> Keluar
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Hamburger Menu Button */}
      <div className={`fixed right-3 transform -translate-y-1/2 z-50 lg:hidden transition-all duration-300  ${isHamburgerMenuScrolledToBottom ? "bottom-2" : "bottom-1/2"}`}>
        <button
          onClick={toggleMenu}
          className="bg-white text-xl p-2 text-[#04397B] rounded-full shadow-lg focus:outline-none">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#04397B] text-white z-50">
          <div className="flex justify-between items-center p-5">
            <h1 className="text-xl font-bold">Optifish</h1>
            <button
              onClick={toggleMenu}
              className="text-white text-2xl focus:outline-none">
              <FaTimes />
            </button>
          </div>
          <nav className="flex flex-col items-start mt-10 w-full bg-red-500">
            <Link
              to="/"
              className="text-md font-medium hover:underline w-full pl-5 py-2"
              onClick={toggleMenu}>
              Beranda
            </Link>
            <Link
              to="/produk"
              className="text-md font-medium hover:underline w-full pl-5 py-2"
              onClick={toggleMenu}>
              Produk
            </Link>
            <Link
              to="/kalkulator"
              className="text-md font-medium hover:underline w-full pl-5 py-2"
              onClick={toggleMenu}>
              Kalkulator
            </Link>
            <Link
              to="/tanya-ahli"
              className="text-md font-medium hover:underline w-full pl-5 py-2"
              onClick={toggleMenu}>
              Tanya Ahli
            </Link>
            <Link
              to="/blog"
              className="text-md font-medium hover:underline w-full pl-5 py-2"
              onClick={toggleMenu}>
              Blog
            </Link>
            <button
              onClick={() => {
                toggleMenu();
                handleAccountClick();
              }}
              className="text-md font-medium hover:underline w-full pl-5 py-2 text-left">
              Akun
            </button>
            <Link
              to="/keranjang"
              className="text-md font-medium hover:underline w-full pl-5 py-2"
              onClick={toggleMenu}>
              Keranjang
            </Link>
            {isAuthenticated && (
              <button
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
                className="text-md font-medium hover:underline w-full pl-5 py-2 text-left">
                Keluar
              </button>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
