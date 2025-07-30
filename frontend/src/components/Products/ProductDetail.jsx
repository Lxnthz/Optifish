import React, { useEffect, useState } from "react";
import { FaStar, FaCartPlus } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ProductDetail({ product, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/reviews/${product.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setReviews(data);

          // Calculate average rating
          const totalStars = data.reduce(
            (sum, review) => sum + review.stars,
            0
          );
          const avgRating = data.length > 0 ? totalStars / data.length : 0;
          setAverageRating(avgRating);
        } else {
          console.error("Failed to fetch reviews.");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [product.id]);

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
      className="w-full bg-white rounded-lg shadow-lg p-6">
      {/* Product Header */}
      <div className="flex flex-col gap-6">
        {/* Product Image */}
        <div className="flex">
          <img
            src={`${API_BASE_URL}${product.photo}`}
            alt={product.name}
            className="w-full md:w-1/2 h-64 object-cover rounded-lg shadow-md"
            crossOrigin="anonymous"
          />
          <div className="ml-3 gap-y-1 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.category}</p>
            <p className="text-lg font-bold text-blue-600">
              Rp. {product.price.toLocaleString()}
            </p>
            <div className="flex items-start gap-1 flex-col">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`text-md ${
                      star <= Math.round(averageRating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600">
                {averageRating.toFixed(1)} / 5 ({reviews.length} reviews)
              </p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-4 w-full">
          {/* Product Rating */}

          <p className="text-sm text-gray-700">{product.description}</p>

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
      </div>

      {/* User Reviews */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Ulasan Pembeli</h3>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.slice(0, 3).map((review, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* Reviewer Info */}
                <div className="flex items-center justify-between mb-2 border-b-1 border-black/20 pb-1">
                  <p className="text-sm font-bold text-gray-800">
                    {review.reviewer_name}
                  </p>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-sm ${
                          star <= review.stars
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Message */}
                {/* Review Date */}
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700">{review.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-gray-500">
            <p className="text-sm">No reviews yet.</p>
            <p className="text-xs">Be the first to leave a review!</p>
          </div>
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
