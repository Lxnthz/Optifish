import { motion } from "framer-motion";
import consult from "../../assets/photos/consult-bg.png";
import calculator from "../../assets/photos/calc-bg.png";
import health from "../../assets/elements/services/health.png";
import calc from "../../assets/elements/services/calculator.png";

export default function Services() {
  return (
    <div className="mx-5 md:mx-13 flex flex-col gap-y-5 lg:flex-row lg:justify-between lg:gap-x-5">
      {/* Service 1: Consultation */}
      <motion.div
        className="p-2 bg-center bg-no-repeat bg-cover rounded-xl lg:flex-1/2"
        style={{ backgroundImage: `url(${consult})` }}
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}>
        <div className="border-2 border-white rounded-xl min-h-full">
          <motion.div
            className="flex flex-col items-start justify-center p-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}>
            <motion.img
              src={health}
              alt="Health Consultation"
              className="w-10 h-10 mb-3 md:w-13 md:h-13 xl:w-16 xl:h-16"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.h2
              className="text-xl md:text-2xl font-bold bg-white rounded-xl py-1 px-3 text-[#04397B] mb-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}>
              Gratis!
            </motion.h2>
            <motion.p
              className="text-lg md:text-2xl text-white text-center mb-1 xl:text-3xl"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}>
              Konsultasi Ahli Budidaya
            </motion.p>
            <motion.div
              className="flex flex-col justify-between items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: .9 }}>
              <p className="text-white text-sm md:text-base font-[400] mb-5 xl:text-lg">
                Dapatkan saran dari ahli budidaya ikan kami untuk meningkatkan
                kesehatan dan produktivitas ikan Anda. Konsultasi gratis untuk
                semua pelanggan!
              </p>
              <motion.button
                className="bg-white text-[#04397B] py-2 px-5 md:px-10 font-[700] rounded-lg text-sm md:text-base xl:text-xl hover:bg-gray-200 hover:cursor-pointer"
                onClick={() => (window.location.href = "/tanya-ahli")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                Coba Sekarang
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Service 2: Calculator */}
      <motion.div
        className="p-2 bg-center bg-no-repeat bg-cover rounded-xl lg:flex-1/2"
        style={{ backgroundImage: `url(${calculator})` }}
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}>
        <div className="border-2 border-white rounded-xl min-h-full">
          <motion.div
            className="flex flex-col items-start justify-center p-5 min-h-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}>
            <motion.img
              src={calc}
              alt="Calculator"
              className="w-10 h-10 mb-3 md:w-13 md:h-13 xl:w-16 xl:h-16"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.h2
              className="text-xl md:text-2xl font-bold bg-white rounded-xl py-1 px-3 text-[#F7A446] mb-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}>
              Gratis!
            </motion.h2>
            <motion.p
              className="text-lg md:text-2xl text-white text-center mb-1 xl:text-3xl"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: .9 }}>
              Kalkulator Pakan Cerdas
            </motion.p>
            <motion.div
              className="flex flex-col justify-end items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}>
              <p className="text-white text-sm md:text-base font-[400] mb-5 xl:text-lg">
                Hitung kebutuhan pakan ikanmu secara akurat berdasarkan jenis
                ikan, bobot, dan jumlah tebar. Beli pakan sesuai kebutuhan
                budidaya tanpa pemborosan!
              </p>
              <motion.button
                className="bg-white text-[#F7A446] py-2 px-5 md:px-10 font-[700] rounded-lg text-sm md:text-base xl:text-xl hover:bg-gray-200 hover:cursor-pointer"
                onClick={() => (window.location.href = "/kalkulator")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                Coba Sekarang
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
