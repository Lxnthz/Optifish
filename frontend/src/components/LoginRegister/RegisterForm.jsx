import { Link } from "react-router-dom";
import { useState } from "react";
import OptifishLogo from "../../assets/elements/logo-optifish-white.png";
import { registerUser } from "../../services/authService";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      alert("Registration successful!");
      window.location.href = "/login"; // Redirect to login page
    } catch (err) {
      alert("Registration failed: " + err.response?.data?.error);
    }
  };

  return (
    <div className="h-screen w-full p-6">
      <div className="flex flex-col items-center justify-center h-full gap-y-3 w-full lg:px-13 xl:px-[25rem] bg-gradient-to-r from-[#0071FF] via-[#0071FF] to-[#004499] rounded-2xl">
        <a href="/">
          <img
            src={OptifishLogo}
            alt="Optifish Logo"
            className="w-30 mx-auto mb-2 md:w-40"
          />
        </a>
        <div className="flex flex-col items-center mb-4 gap-y-1">
          <h1 className="font-bold text-2xl md:text-4xl text-white">
            Daftar Sekarang!
          </h1>
          <p className="text-gray-200 font-[500] text-xs md:text-lg">
            Buat akun untuk mulai menggunakan Optifish
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center gap-y-3">
          {/* Full Name */}
          <div className="flex flex-col items-center w-full gap-y-1.5">
            <label
              htmlFor="full_name"
              className="text-sm text-white font-[400] md:text-md">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="border border-gray-300 p-2 py-3 rounded-xl w-full text-white focus:bg-white focus:text-black font-[500]"
            />
          </div>
          {/* Email */}
          <div className="flex flex-col items-center w-full gap-y-1.5">
            <label
              htmlFor="email"
              className="text-sm text-white font-[400] md:text-md">
              E-Mail
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 p-2 py-3 rounded-xl text-white w-full focus:bg-white focus:text-black font-[500]"
            />
          </div>
          {/* Password */}
          <div className="flex flex-col items-center w-full gap-y-1.5">
            <label
              htmlFor="password"
              className="text-sm text-white font-[400] md:text-md">
              Kata Sandi
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 p-2 py-3 rounded-xl text-white w-full focus:bg-white focus:text-black font-[500]"
            />
          </div>
          {/* Phone */}
          <div className="flex flex-col items-center w-full gap-y-1.5">
            <label
              htmlFor="phone"
              className="text-sm text-white font-[400] md:text-md">
              Telepon
            </label>
            <input
              type="text"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-300 p-2 py-3 rounded-xl text-white w-full focus:bg-white focus:text-black font-[500]"
            />
          </div>
          {/* Register Button */}
          <div className="w-full mt-5">
            <button
              type="submit"
              className="bg-white text-[#0071FF] font-[500] py-3 px-4 rounded-xl w-full hover:bg-[#005bb5] hover:text-white transition-colors duration-200 hover:cursor-pointer">
              Daftar
            </button>
          </div>
        </form>
        <p className="font-[400] text-gray-200 text-xs md:text-md">
          Atau daftar dengan
        </p>
        <button
          type="button"
          className="flex items-center justify-center w-full border border-gray-300 py-3 px-4 rounded-xl bg-white hover:bg-gray-100 hover:cursor-pointer transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5 mr-2">
            <path
              fill="#FFC107"
              d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C35.5 6.5 30.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.5-.3-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C35.5 6.5 30.1 4 24 4c-7.1 0-13.2 3.1-17.7 8.1z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c6.1 0 11.5-2 15.7-5.5l-7.2-5.9C30.1 34.9 27.2 36 24 36c-5.6 0-10.3-3.7-12-8.7l-7.1 5.5C6.8 39.1 14.7 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5h-1.9V20H24v8h11.3c-1.1 3-3.2 5.5-6.1 7.1l7.2 5.9C41.7 38.2 44 31.7 44 24c0-1.3-.1-2.5-.4-3.5z"
            />
          </svg>
          <span className="text-gray-700 font-[500]">Google</span>
        </button>
        <p className="mt-4 text-sm text-white font-[300]">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-white font-[500] hover:underline">
            Masuk disini
          </Link>
        </p>
      </div>
    </div>
  );
}
