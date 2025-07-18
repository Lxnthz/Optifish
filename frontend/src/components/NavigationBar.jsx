import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import Logo from "../assets/elements/logo-optifish.png";
import LogoWhite from "../assets/elements/logo-optifish-white.png";

export default function NavigationBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = false //dummy value

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAccountClick = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      const user = JSON.parse(storedUser);
      if (user.role === "seller") {
        navigate("/seller");
      } else if (user.role === "consultant") {
        navigate("/consultant");
      } else {
        navigate("/profile");
      }
    }
  }

  return (
    <nav className="hidden lg:block fixed top-0 w-full z-50">
      <div className="mx-13 my-5">
        <div className={`flex items-center justify-between p-3 rounded-3xl lg:max-w-screen lg:mx-auto transition-all duration-200 ${isScrolled ? "bg-white" : "bg-transparent"}`}>
          <div className={`flex items-center gap-x-5 transition-all duration-300 ${isScrolled ? "text-[#04397B]" : "text-white"}`}>
            <Link to="/">
              <img className="transition-all duration-200 w-27 xl:w-32" src={isScrolled ? Logo : LogoWhite} alt="Optifish Logo" />
            </Link>
            <div className={`flex gap-x-1 transition-all duration-50 xl:text-lg ${isScrolled ? "text-[#04397B]" : "text-white"}`}>
              <Link to="/" className={`py-2 px-3 flex items-center rounded-2xl ${isScrolled ? "transition-all duration-300 hover:bg-[#04397B] hover:text-white" : ""}`}>Beranda</Link>
              <Link to="/produk" className={`py-2 px-3 flex items-center rounded-2xl ${isScrolled ? "transition-all duration-300 hover:bg-[#04397B] hover:text-white" : ""}`}>Produk</Link>
              <Link to="/kalkulator" className={`py-2 px-3 flex items-center rounded-2xl ${isScrolled ? "transition-all duration-300 hover:bg-[#04397B] hover:text-white" : ""}`}>Kalkulator</Link>
              <Link to="/tanya-ahli" className={`py-2 px-3 flex items-center rounded-2xl ${isScrolled ? "transition-all duration-300 hover:bg-[#04397B] hover:text-white" : ""}`}>Tanya Ahli</Link>
              <Link to="/blog" className={`py-2 px-3 flex items-center rounded-2xl ${isScrolled ? "transition-all duration-300 hover:bg-[#04397B] hover:text-white" : ""}`}>Blog</Link>
            </div>
          </div>
          <div className={`flex items-center gap-x-1 transition-all duration-50 xl:text-lg ${isScrolled ? "text-[#04397B]" : "text-white"}`}>
            <button onClick={handleAccountClick} className={`py-2 px-3 flex items-center gap-x-2 rounded-2xl ${ isScrolled ? "transition-all duration-100 hover:bg-[#04397B] hover:text-white" : ""}`}>
              <FaUser /> Akun
            </button>
            <Link to="/keranjang" className={`py-2 px-3 flex items-center gap-x-2 rounded-2xl ${isScrolled ? "transition-all duration-300 hover:bg-[#04397B] hover:text-white" : ""}`}>
              <FaShoppingCart /> Keranjang
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}