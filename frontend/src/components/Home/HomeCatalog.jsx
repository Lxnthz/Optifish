import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeCatalog() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track selected product for modal
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Sort products by rating in descending order
  const highestRatedProducts = [...products].sort(
    (a, b) => b.rating - a.rating
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/all`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Gagal mengambil produk:", response.statusText);
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil produk:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = async (product) => {
    try {
      // Retrieve user data from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      if (!userId) {
        alert("User is not logged in. Please log in to add items to the cart.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId, // Use dynamic userId
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
    <motion.div className="mx-5 md:mx-13 flex flex-col">
      <motion.h1
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="text-lg w-full lg:text-2xl font-bold mb-4 text-left">
        Produk Unggulan Kami
      </motion.h1>

      {/* Product Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {highestRatedProducts.slice(0, 10).map((product, index) => {
          // Limit items based on screen size
          if (index >= 4 && window.innerWidth <= 425) return null; // sm: max 4 items
          if (index >= 6 && window.innerWidth > 425 && window.innerWidth <= 768)
            return null; // md: max 6 items
          if (
            index >= 8 &&
            window.innerWidth >= 1024 &&
            window.innerWidth < 1280
          )
            return null; // lg: max 8 items
          if (index >= 10 && window.innerWidth >= 1280) return null; // xl: max 10 items

          return (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-md p-2 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg relative">
              {/* Price on Top of Image */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-md shadow-md">
                Rp. {product.price.toLocaleString()}
              </motion.p>

              {/* Product Image */}
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${product.photo}`}
                alt={product.name}
                className="w-full h-20 md:h-30 lg:h-40 xl:h-50 object-cover rounded-md mb-2"
                crossOrigin="anonymous"
              />

              {/* Product Name */}
              <motion.h2
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-sm font-semibold text-gray-800 text-left w-full mb-1 truncate"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                {product.name}
              </motion.h2>

              {/* Product Rating */}
              <motion.p
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="text-[9px] text-yellow-500 flex items-start mb-2 w-full">
                {product.rating} / 5
              </motion.p>

              {/* View Details Button */}
              <button
                className="mt-auto bg-blue-500 text-white py-1 px-3 rounded-md text-xs hover:bg-blue-600 transition-colors"
                onClick={() => setSelectedProduct(product)}>
                Lihat Detail
              </button>
            </div>
          );
        })}
      </motion.div>

      {/* Modal for Product Details */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6" // padding for smaller screens
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.div
              className="w-full max-w-md bg-white rounded-xl shadow-xl p-4 sm:p-6 overflow-y-auto max-h-[90vh]" // mobile-first p-4, better max height
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-800">
                {selectedProduct.name}
              </h2>

              <img
                src={`${API_BASE_URL}${selectedProduct.photo}`}
                alt={selectedProduct.name}
                className="w-full h-48 sm:h-64 object-cover rounded-lg mb-3"
                crossOrigin="anonymous"
              />

              <p className="text-sm text-gray-700 mb-1">
                <span className="font-bold">Kategori:</span>{" "}
                {selectedProduct.category}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-bold">Harga:</span> Rp.{" "}
                {selectedProduct.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-700 mb-3">
                <span className="font-bold">Deskripsi:</span>{" "}
                {selectedProduct.description}
              </p>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 w-full sm:w-auto">
                  Tutup
                </button>
                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full sm:w-auto">
                  Tambahkan ke Keranjang
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
