import OptifishLogo from "../../assets/elements/logo-optifish.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../../services/authService";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(formData);
      alert("Login successful!");
      localStorage.setItem("user", JSON.stringify(user)); // Ensure is_seller and is_consultant are stored
      window.location.href = "/"; // Redirect to home page
    } catch (err) {
      alert("Login failed: " + err.response?.data?.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-y-3 w-full px-5 py-2 lg:px-13 xl:px-[25rem]">
      <a href="/">
        <img
          src={OptifishLogo}
          alt="Optifish Logo"
          className="w-30 mx-auto mb-2 md:w-40"
        />
      </a>
      <div className="flex flex-col items-center mb-4 gap-y-1">
        <h1 className="font-bold text-2xl md:text-4xl">Selamat Datang!</h1>
        <p className="text-gray-500 text-xs md:text-lg">
          Masukkan data anda untuk masuk ke Optifish
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-y-3">
        <div className="flex flex-col items-center w-full gap-y-1.5">
          <label htmlFor="email" className="text-sm font-[500] md:text-md">
            E-Mail / Username / Nomor Telepon
          </label>
          <input
            type="text"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="border border-[#0071FF] p-2 rounded-xl w-full font-[500]"
          />
        </div>
        <div className="flex flex-col items-center w-full gap-y-1.5">
          <label htmlFor="password" className="text-sm font-[500] md:text-md">
            Kata Sandi
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="border border-[#0071FF] p-2 rounded-xl w-full"
          />
        </div>
        <div className="flex justify-between w-full text-sm text-gray-500">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-2 w-2 border-gray-300 rounded hover:cursor-pointer"
            />
            <span className="ml-1 font-[400]">Ingat Saya</span>
          </label>
          <a
            href="#"
            className="font-[400] text-blue-600 hover:text-blue-800 transition-colors hover:cursor-pointer">
            Lupa Kata Sandi?
          </a>
        </div>
        <div className="w-full">
          <button
            type="submit"
            className="bg-[#0071FF] text-white font-[500] py-2 px-4 rounded-xl w-full hover:bg-[#005bb5] transition-colors duration-200 hover:cursor-pointer">
            Masuk
          </button>
        </div>
      </form>
      <p className="font-[400] text-gray-500 text-xs md:text-md">
        Atau masuk dengan
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
      <p className="mt-4 text-sm text-gray-500">
        Tidak punya akun?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Daftar disini
        </Link>
      </p>
    </div>
  );
}
