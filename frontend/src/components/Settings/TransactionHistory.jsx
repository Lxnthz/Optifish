import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TransactionHistory({ userId }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({
    productId: null,
    stars: 5,
    message: "",
  });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/transactions/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        } else {
          console.error("Failed to fetch transactions:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: reviewForm.productId,
          reviewerId: userId,
          reviewerName: JSON.parse(localStorage.getItem("user"))?.full_name,
          stars: reviewForm.stars,
          message: reviewForm.message,
        }),
      });

      if (response.ok) {
        alert("Review submitted successfully!");
        setReviewForm({ productId: null, stars: 5, message: "" });
        setIsReviewModalOpen(false);
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleStarClick = (stars) => {
    setReviewForm({ ...reviewForm, stars });
  };

  if (loading) {
    return (
      <p className="text-center py-6 text-gray-600">
        Loading transaction history...
      </p>
    );
  }

  if (transactions.length === 0) {
    return (
      <p className="text-center py-6 text-gray-600">No transactions found.</p>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Transaction History
      </h2>
      <div className="space-y-6">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-semibold text-gray-800">
                Transaction #{transaction.id}
              </h3>
              <p className="text-sm text-gray-500 mt-2 md:mt-0">
                {new Date(transaction.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Receiver Name</p>
                <p className="text-base text-gray-800">
                  {transaction.receiver_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="text-base text-gray-800">{transaction.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expedition</p>
                <p className="text-base text-gray-800">
                  {transaction.expedition} - Rp.{" "}
                  {Number(transaction.expedition_cost).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="text-base text-gray-800">
                  {transaction.payment_method}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-base text-blue-600 font-bold">
                  Rp. {Number(transaction.total_amount).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Loyalty Points Earned</p>
                <p className="text-base text-green-600 font-bold">
                  {transaction.loyalty_points} Points
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tag</p>
                <p className="text-base text-gray-800">{transaction.tag}</p>
              </div>
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-800 mb-2">
                Products
              </p>
              {transaction.products && transaction.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {transaction.products.map((product) => (
                    <div
                      key={product.id}
                      className="border rounded-lg p-3 flex flex-col justify-between">
                      <p className="text-base font-semibold text-gray-700">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Rp. {Number(product.price).toLocaleString()}
                      </p>
                      <button
                        onClick={() => {
                          setReviewForm({
                            ...reviewForm,
                            productId: product.id,
                          });
                          setIsReviewModalOpen(true);
                        }}
                        className="mt-2 bg-blue-500 text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-blue-600">
                        Write Review
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No products found for this transaction.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Write a Review
            </h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">
                  Stars:
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer text-2xl ${
                        star <= reviewForm.stars
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                      onClick={() => handleStarClick(star)}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">
                  Message:
                </label>
                <textarea
                  value={reviewForm.message}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, message: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2 text-gray-800"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
