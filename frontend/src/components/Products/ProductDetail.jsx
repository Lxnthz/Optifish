import React from "react";
import { FaCartPlus } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function ProductDetail({ product, onClose }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  if (!product) return null;

  const handleAddToCart = async (product) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId, // Replace with the actual logged-in user's ID
          productId: product.id,
          quantity: 1, // Default quantity to add
        }),
      });

      if (response.ok) {
        alert(`Produk "${product.name}" berhasil ditambahkan ke keranjang.`);
      } else {
        const errorData = await response.json();
        alert(`Gagal menambahkan produk ke keranjang: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Terjadi kesalahan saat menambahkan produk ke keranjang.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full">
      {/* Product Header */}
      <div className="flex flex-col gap-6">
        {/* Product Image */}
        <div className="w-full flex gap-x-2">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${product.photo}`}
            alt={product.name}
            className="w-1/2 h-64 object-cover rounded-lg shadow-md"
            crossOrigin="anonymous"
          />
          <div className="w-1/2 flex flex-col">
            <h2 className="text-xl xl:text-2xl font-bold text-gray-800 mb-4">
              {product.name}
            </h2>
            <p className="text-xs text-gray-600 mb-1">{product.category}</p>
            <p className="text-md font-bold text-blue-600 mb-1">
              Rp. {product.price.toLocaleString()}
            </p>
            <p className="text-sm text-yellow-500 mb-4">
              <span className="font-bold">Rating:</span> {product.rating} / 5
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-bold">Stok:</span> {product.quantity} pcs
            </p>
          </div>
        </div>

        {/* Product Details */}
        {/* Add to Cart Button */}
        <div className="flex flex-row gap-x-1 text-xs w-full">
          <button
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer "
            onClick={() => handleAddToCart(product)}>
            <FaCartPlus className="text-sm" />
            Keranjang
          </button>
          <button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
            Ajukan Group Buy
          </button>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-sm text-gray-700 flex flex-col w-full items-start gap-y-1">
          <span className="font-bold">Deskripsi Produk:</span>
          <span className="font-medium">{product.description}</span>
        </p>
      </div>

      {/* User Reviews */}
      <div className="mt-8 border-t border-gray-200 pt-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Ulasan Terakhir
        </h3>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-800 font-bold">
                  {review.user_name}
                </p>
                <p className="text-sm text-yellow-500">
                  Rating: {review.rating} / 5
                </p>
                <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Belum ada ulasan.</p>
        )}
      </div>

      {/* Close Button */}
      <div className="mt-6">
        <button
          onClick={onClose}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
          Close
        </button>
      </div>
    </motion.div>
  );
}
