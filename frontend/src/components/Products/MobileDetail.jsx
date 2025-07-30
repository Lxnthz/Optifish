import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileDetail({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.div
            className="bg-white w-full rounded-t-lg p-4 shadow-lg max-h-screen overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{product.name}</h3>
            </div>

            {/* Product Image */}
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${product.photo}`}
              alt={product.name}
              className="w-full h-64 md:h-80 object-cover rounded-lg mb-4"
              crossOrigin="anonymous"
            />

            {/* Product Details */}
            <div className="space-y-2">
              <p className="text-xs text-gray-700 bg-cyan-100 w-fit px-2 py-1 rounded-lg">
                {product.category}
              </p>
              <p className="text-md text-gray-700 w-full border-b-1 border-gray-300 pb-2">
                Rp.{" "}
                {product.price.toLocaleString()}
              </p>
              <p className="text-sm text-yellow-500">
                {product.rating} / 5
              </p>
              <p className="text-sm text-black flex flex-col gap-y-1">
                <span className="font-bold ">Deskripsi Produk</span>
                <span className="font-medium">{product.description}</span>
              </p>
            </div>

            {/* Latest Reviews */}
            <div className="mt-6">
              <h4 className="text-lg font-bold mb-2">Review Terakhir</h4>
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-3">
                  {product.reviews.slice(0, 3).map((review, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 rounded-lg p-3">
                      <p className="text-sm font-bold text-gray-800">
                        {review.reviewer}
                      </p>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                      <p className="text-xs text-yellow-500">
                        Rating: {review.rating} / 5
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Belum ada review untuk produk ini.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 text-xs">
                Tutup
              </button>
              <button
                onClick={() => onAddToCart(product)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 text-xs">
                Tambahkan ke Keranjang
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
