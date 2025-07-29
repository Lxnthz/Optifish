import { FaQuoteLeft } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Testimony() {
  const testimonies = [
    {
      message:
        "Harganya bersaing, pilihan pakannya juga lengkap. Saya jadi lebih hemat waktu dan biaya. Sangat cocok untuk peternak seperti saya.",
      name: "Budi Santoso",
      info: "Pembudidaya ikan lele",
    },
    {
      message:
        "Platform ini sangat mudah digunakan dan memberikan banyak insight untuk budidaya ikan.",
      name: "Siti Aminah",
      info: "Pembudidaya ikan nila",
    },
    {
      message:
        "Dengan Optifish, saya bisa menghemat biaya pakan hingga 20%. Sangat direkomendasikan!",
      name: "Ahmad Fauzi",
      info: "Pembudidaya ikan gurame",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // Track direction for smoother transitions

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1); // Always move forward
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonies.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [testimonies.length]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      position: "absolute", // Ensure the outgoing slide is positioned absolutely
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative", // Centered slide is positioned relatively
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      position: "absolute", // Ensure the incoming slide is positioned absolutely
    }),
  };

  return (
    <div className="mx-5 md:mx-13">
      <h1 className="text-lg md:text-2xl font-bold mb-4 text-left">
        Testimoni & Cerita Pembudidaya
      </h1>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {testimonies.map((testimony, index) => (
          <div
            key={index}
            className="p-4 flex flex-col rounded-lg inset-shadow-sm shadow-sm bg-white hover:shadow-xl transition-shadow duration-300 gap-y-10 justify-between min-h-[30rem]">
            <div className="flex flex-col items-start mb-5 gap-y-5 xl:gap-y-10">
              <FaQuoteLeft className="text-black text-3xl mb-2" />
              <p className="text-black font-[400] text-lg xl:text-xl mb-3">
                {testimony.message}
              </p>
            </div>
            <div className="flex items-center">
              <CgProfile className="text-black text-4xl" />
              <div className="flex flex-col ml-3">
                <h3 className="text-lg font-bold">{testimony.name}</h3>
                <p className="text-sm text-gray-500">{testimony.info}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden relative h-[15rem] overflow-hidden">
        <AnimatePresence custom={direction}>
          <motion.div
            key={currentIndex}
            className="absolute top-0 left-0 w-full h-full p-3 flex flex-col rounded-lg inset-shadow-sm shadow-sm bg-white gap-y-3 justify-between"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            transition={{ duration: 0.5, ease: "easeInOut" }}>
            <div className="flex flex-col items-start gap-y-3">
              <FaQuoteLeft className="text-black text-2xl mb-2" />
              <p className="text-black font-[400] text-sm">
                {testimonies[currentIndex].message}
              </p>
            </div>
            <div className="flex items-center">
              <CgProfile className="text-black text-3xl" />
              <div className="flex flex-col ml-3">
                <h3 className="text-base font-bold">
                  {testimonies[currentIndex].name}
                </h3>
                <p className="text-xs text-gray-500">
                  {testimonies[currentIndex].info}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
