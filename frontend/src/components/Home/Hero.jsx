import { motion } from "framer-motion";
import hero from "../../assets/photos/hero-banner.png";
import logo from "../../assets/elements/logo-optifish-white.png";

export default function Hero() {
  return (
    <div
      className="min-h-screen flex flex-col px-5 md:px-13 items-center md:items-end justify-center bg-cover bg-left md:bg-left bg-no-repeat text-white"
      style={{ backgroundImage: `url(${hero})` }}>
      <motion.div
        className="flex flex-col text-center md:text-right"
        initial={{ opacity: 0, y: 0 }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, y: 0 }}>
        <div className="flex justify-center md:justify-end mb-4">
          <motion.img
          src={logo}
          alt="Optifish Logo"
          className="w-25 md:w-24 xl:w-28 mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        </div>
        <motion.h1
          className="text-xl md:text-3xl xl:text-5xl font-bold mb-4 flex flex-col items-center md:items-end"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          >
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0 }}>
            Platform Manajemen Pakan dan
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}>
            Kesehatan Nomor 1 di Indonesia!
          </motion.span>
        </motion.h1>
        <motion.p
          className="text-sm md:text-xl xl:text-2xl mb-6 font-[400]"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1 }}>
          Solusi Cerdas untuk Semua Kebutuhan Budidaya Ikan Anda
        </motion.p>
      </motion.div>
      <motion.div
        className="flex flex-col md:flex-row gap-y-3 md:gap-x-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}>
        <motion.button
          onClick={() => (window.location.href = "/produk")}
          className="font-[500] text-sm bg-white text-[#04397B] py-2 px-4 md:px-6 rounded-lg hover:cursor-pointer ring-white hover:ring-1 transition-all duration-50"
          whileHover={{ backgroundColor: "#04397B", color: "white" }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}>
          Mulai Belanja
        </motion.button>
        <motion.button
          onClick={() => (window.location.href = "/kalkulator")}
          className="font-[500] text-sm bg-white text-[#04397B] py-2 px-4 md:px-6 rounded-lg hover:cursor-pointer ring-white hover:ring-1 transition-all duration-50"
          whileHover={{ backgroundColor: "#04397B", color: "white" }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}>
          Hitung Kebutuhan Pakan
        </motion.button>
      </motion.div>
    </div>
  );
}
