import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductGrid({ products, handleProductClick }) {
  const gridVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const productVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="flex flex-col lg:flex-row w-full"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={gridVariants}>
      {/* Product Grid */}
      <motion.div
        className="flex-1 grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 h-fit"
        variants={gridVariants}>
        <AnimatePresence>
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="bg-white shadow-md rounded-md p-2 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg relative lg:w-full xl:h-fit"
              variants={productVariants}
              initial="hidden"
              animate="visible"
              exit="hidden">
              {/* Price on Top of Image */}
              <p className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-md shadow-md">
                Rp. {product.price.toLocaleString()}
              </p>

              {/* Product Image */}
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${product.photo}`}
                alt={product.name}
                className="w-full h-20 md:h-40 object-cover rounded-md mb-2"
                crossOrigin="anonymous"
              />

              {/* Product Name */}
              <h2
                className="text-sm md:text-md font-semibold text-gray-800 text-left w-full mb-1 truncate"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                {product.name}
              </h2>

              {/* Product Owner */}
              <p className="text-[9px] text-gray-600 mb-1 w-full text-left"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                {product.owner_name}
              </p>

              {/* Product Rating */}
              <p className="text-[9px] text-yellow-500 flex items-start mb-2 w-full">
                {product.rating} / 5
              </p>

              {/* View Details Button */}
              <button
                onClick={() => handleProductClick(product)} // Call the function with the product
                className="mt-auto bg-blue-500 text-white py-1 px-3 rounded-md text-xs hover:bg-blue-600 transition-colors">
                Lihat Detail
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
