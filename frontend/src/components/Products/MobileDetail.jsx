import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";

export default function MobileDetail({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState(2);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("BCA");
  const [groupBuyId, setGroupBuyId] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const user = JSON.parse(localStorage.getItem("user"));

  const discounts = {
    2: 5,
    5: 7,
    10: 10,
  };

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

    if (product) {
      fetchReviews();
    }
  }, [product]);

  const handleStartGroupBuy = async () => {
    if (!user) {
      alert("You must be logged in to start a group buy.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/group-buys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          creatorId: user.id,
          maxUsers: selectedParticipants,
          discountPercentage: discounts[selectedParticipants],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGroupBuyId(data.groupBuyId); // Save the group buy ID
        alert("Group buy started successfully!");
        setIsModalOpen(false);
        setIsPaymentModalOpen(true); // Open payment modal
      } else {
        alert("Failed to start group buy.");
      }
    } catch (error) {
      console.error("Error starting group buy:", error);
      alert("An error occurred while starting the group buy.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePayment = async () => {
    const discountedPrice =
      product.price - (product.price * discounts[selectedParticipants]) / 100;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/group-buy/transaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            groupBuyId: groupBuyId,
            amount: discountedPrice,
            paymentMethod: selectedPaymentMethod,
          }),
        }
      );

      if (response.ok) {
        alert("Payment completed successfully!");
        setIsPaymentModalOpen(false);
      } else {
        alert("Failed to complete payment.");
      }
    } catch (error) {
      console.error("Error completing payment:", error);
      alert("An error occurred while completing the payment.");
    }
  };

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
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 text-xs">
                Tutup
              </button>
            </div>

            {/* Product Image */}
            <img
              src={`${API_BASE_URL}${product.photo}`}
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
                Rp. {product.price.toLocaleString()}
              </p>

              {/* Average Rating */}
              <div className="flex items-center gap-2">
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
                <p className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} / 5 ({reviews.length} reviews)
                </p>
              </div>

              <p className="text-sm text-black flex flex-col gap-y-1">
                <span className="font-bold">Deskripsi Produk</span>
                <span className="font-medium">{product.description}</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4 items-center">
              <div className="text-white py-2 px-4 text-xs flex w-full justify-center gap-x-2">
                <button
                  onClick={() => onAddToCart(product)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 text-xs flex gap-x-1">
                  <FaCartPlus className="text-sm" />
                  Keranjang
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                  disabled={loading}>
                  {loading ? "Starting Group Buy..." : "Ajukan Group Buy"}
                </button>
              </div>
            </div>

            {/* Latest Reviews */}
            <div className="mt-6">
              <h4 className="text-lg font-bold mb-2">Review Terakhir</h4>
              {reviews.length > 0 ? (
                <div className="space-y-3">
                  {reviews.slice(0, 3).map((review, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 rounded-lg p-3">
                      <p className="text-sm font-bold text-gray-800">
                        {review.reviewer_name}
                      </p>
                      <div className="flex items-center mb-2">
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
                      <p className="text-sm text-gray-600">{review.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
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

            {/* Modal for Selecting Participants */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4">
                    Select Participants
                  </h2>
                  <div className="space-y-4">
                    {[2, 5, 10].map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`participants-${option}`}
                          name="participants"
                          value={option}
                          checked={selectedParticipants === option}
                          onChange={() => setSelectedParticipants(option)}
                        />
                        <label htmlFor={`participants-${option}`}>
                          {option} Participants - {discounts[option]}% Discount
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
                      Cancel
                    </button>
                    <button
                      onClick={handleStartGroupBuy}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                      disabled={loading}>
                      {loading ? "Starting..." : "Start Group Buy"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Modal */}
            {isPaymentModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Discounted Price: Rp.{" "}
                    {(
                      product.price -
                      (product.price * discounts[selectedParticipants]) / 100
                    ).toLocaleString()}
                  </p>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Payment Method
                    </label>
                    <select
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="w-full border px-3 py-2 rounded-lg">
                      {["BCA", "BNI", "BRI", "Mandiri", "OVO", "GoPay"].map(
                        (method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      onClick={() => setIsPaymentModalOpen(false)}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
                      Cancel
                    </button>
                    <button
                      onClick={handleCompletePayment}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
